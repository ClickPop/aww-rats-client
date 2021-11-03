import React, { useContext, useEffect, useState, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Select, { SingleValue } from 'react-select';

import { Metadata } from '~/types';
import {
  LAYER_ORDER,
  LAYER_HAS_BASE,
  RAT_CLOSET_PLACEHOLDER,
  CLOSET_PIECES,
  RAT_PIECES_PREFIX,
  RAT_PIECES_THUMBNAIL_PREFIX,
  TOTAL_CLOSET_PIECES,
} from '~/config/env';
import { EthersContext } from '~/components/context/EthersContext';
import { fabric } from 'fabric';
import { Connect } from '~/components/shared/Connect';
import { Link } from '~/components/shared/Link';
import { Canvas, StaticCanvas } from 'fabric/fabric-impl';
import { Image } from '~/components/shared/Image';
import { CheeseLoader } from '~/components/shared/CheeseLoader';
import { useRouter } from 'next/router';
interface SimplifiedMetadata {
  label: string;
  value: string;
  properties: Map<string, string>;
}

const Closet = () => {
  const router = useRouter();
  const { signer, contract, signerAddr } = useContext(EthersContext);
  const [signerTokens, setSignerTokens] = useState<BigNumber[] | null>(null);
  const [rats, setRats] = useState<Array<SimplifiedMetadata | null> | null>(
    null,
  );
  const [currentRat, setCurrentRat] = useState<SimplifiedMetadata | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [canvas, setCanvas] = useState<StaticCanvas | null>(null);
  const [hideBackground, setHideBackground] = useState(false);
  const [loading, setLoading] = useState({
    tokens: false,
    metadata: false,
    mirror: false,
    pieces: false,
  });
  const [loadedTokens, setLoadedTokens] = useState<string[]>([]);
  const [tokenProgress, setTokenProgress] = useState<number>(0);
  useEffect(() => {
    const c = new fabric.StaticCanvas('closet-canvas', {
      width: 2048,
      height: 2048,
      preserveObjectStacking: true,
    });
    const canv = document.getElementById('closet-canvas');
    if (canv) {
      canv.style.transformOrigin = '0 0';
      canv.style.transform = 'scale(0.1565)';
    }
    fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
      c.add(img);
    });
    setCanvas(c);
  }, []);

  // Get all the tokens for an address
  useEffect(() => {
    (async () => {
      if (contract && signerAddr) {
        try {
          setLoading((l) => ({ ...l, tokens: true }));
          let tokens = await contract.getTokensByOwner(signerAddr);
          setSignerTokens(tokens);
        } catch (err) {
          console.error(err);
        }
        setLoading((l) => ({ ...l, tokens: false }));
      }
    })();
  }, [signer, contract, signerAddr]);

  // Get the metadata for those tokens and store them in state
  useEffect(() => {
    (async () => {
      // Get token URI from contract then fetch token metadata from IFPS
      if (Array.isArray(signerTokens)) {
        setLoading((l) => ({ ...l, metadata: true }));
        const tempMetas = [];
        for (const token of signerTokens) {
          const uri = await contract?.tokenURI(token);
          if (!uri?.includes('ipfs')) break;
          const hash = uri?.split('//')[1];
          if (hash) {
            const meta: Metadata = await fetch(
              `https://gateway.pinata.cloud/ipfs/${hash}`,
            ).then((res) => res.json());

            if (meta) {
              tempMetas.push(meta);
            }
          }
        }

        // Set state with slightly simplified metadata
        setRats(
          tempMetas.map((rat) => ({
            label: rat.name,
            value: rat.image.replace(
              'ipfs://',
              'https://gateway.pinata.cloud/ipfs/',
            ),
            // We use a Map here to retain the correct order for layering assets
            properties: new Map(
              LAYER_ORDER.map((layer) => {
                const attribute = rat.attributes.find(
                  (attr) =>
                    attr.trait_type &&
                    attr.trait_type.toLowerCase() === layer.toLowerCase(),
                );
                let val = LAYER_HAS_BASE.includes(layer) ? 'base' : 'none';
                if (attribute && typeof attribute.value === 'string') {
                  val = attribute.value.replace(/\s|\%20/gi, '-').toLowerCase();
                }
                return [layer, val];
              }),
            ),
          })),
        );
        setLoading((l) => ({ ...l, metadata: false }));
      }
    })();
  }, [contract, signerTokens]);

  const handleChangeRat = useCallback(
    async (rat: SingleValue<SimplifiedMetadata | null>) => {
      setLoading((l) => ({ ...l, mirror: true }));
      setCurrentRat(rat);
      if (canvas) {
        canvas.clear();
        if (rat) {
          const layers: [string, string][] = [];
          rat.properties.forEach((val, key) => {
            if (val !== 'none') {
              layers.push([key, val]);
            }
          });
          for (const [key, val] of layers) {
            if (key !== 'background' || !hideBackground) {
              const img = await new Promise<fabric.Image>((resolve) => {
                fabric.Image.fromURL(
                  val.startsWith('data:')
                    ? val
                    : `${RAT_PIECES_PREFIX}${key}-${val
                        .toLowerCase()
                        .replace(/ /g, '-')}.png`,
                  resolve,
                );
              });
              let aspect = img.width && img.height ? img.width / img.height : 1;

              if (aspect >= 1) {
                //@ts-ignore
                img.scaleToHeight(canvas.height);
              } else {
                //@ts-ignore
                img.scaleToWidth(canvas.width);
              }
              canvas.add(img);
              canvas.centerObject(img);
            }
          }
        } else {
          fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
            canvas.add(img);
          });
        }
      }
      setTimeout(() => setLoading((l) => ({ ...l, mirror: false })), 300);
      canvas?.renderAll();
    },
    [canvas, hideBackground],
  );

  const calculatePercentage = (n: number, d: number): number => {
    let perc: number = 0;
    console.log(n, d);
    if (n >= 0 && d > 0) {
      if (n > d || n === d) {
        perc = 1;
      } else {
        perc = n / d;
      }
    }

    perc = perc >= 0 && perc < 1 ? Math.round(perc * 10000) / 100 : 100;

    return perc;
  };

  const getBase64Image = (file: Blob): Promise<any | Error> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (!currentRat) {
      setLoadedTokens([]);
    }
    handleChangeRat(currentRat);
  }, [hideBackground, currentRat, handleChangeRat]);

  const tryOnClothes = (pieceType: string, piece: string) => {
    if (currentRat) {
      if (
        piece === '##REMOVE##' ||
        currentRat.properties.get(pieceType) === piece
      ) {
        if (!(piece === '##REMOVE##' && !oldClothes.get(pieceType))) {
          currentRat.properties.set(
            pieceType,
            oldClothes.get(pieceType) ?? 'none',
          );
          handleChangeRat(currentRat);
        }
      } else {
        if (piece.startsWith('data:')) {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
        } else if (
          !CLOSET_PIECES[pieceType as keyof typeof CLOSET_PIECES]?.includes(
            currentRat.properties.get(pieceType) ?? '',
          )
        ) {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
          console.log(oldClothes);
        }
        currentRat.properties.set(pieceType, piece);
        console.log(currentRat);
        handleChangeRat(currentRat);
      }
    }
  };

  useEffect(() => {
    let load = true;
    if (loadedTokens.length >= TOTAL_CLOSET_PIECES) {
      load = false;
    }
    setLoading((l) => ({ ...l, pieces: load }));

    setTokenProgress(
      calculatePercentage(loadedTokens.length, TOTAL_CLOSET_PIECES),
    );
  }, [loadedTokens]);

  return (
    <div className='max-w-7xl mx-auto pt-20 pb-4'>
      <div className='text-white text-center mb-4'>
        <p>
          Welcome to the Aww, Rats closet. We&apos;re constantly adding new
          things to make your little critter look extra attRATctive.
        </p>
        <p>
          Don&apos;t have a rat?{' '}
          <Link href='/' className='underline'>
            mint one now
          </Link>
        </p>
      </div>
      <div className='flex flex-col md:flex-row md:h-screen'>
        <div className='container max-w-sm mx-auto my-2 p-4'>
          <div className='mx-auto'>{router.route !== '/' && <Connect />}</div>

          {loading.tokens && <CheeseLoader className='w-10 mx-auto' />}
          {!loading.tokens && rats && (
            <Select
              className='select-search mx-auto w-80 mb-4'
              options={rats}
              placeholder='Select your rat'
              onChange={handleChangeRat}
              isClearable
              isSearchable
            />
          )}

          <div
            className='
                  mirror
                  rounded-xl
                  overflow-hidden
                  mx-auto
                  w-80
                  h-80
                  relative
                '>
            <canvas id='closet-canvas' className='w-full h-full' />
            {loading.mirror && (
              <div className='bg-black h-full w-full left-0 top-0 right-0 bottom-0 absolute'>
                <CheeseLoader className='left-12 right-12 top-6 bottom-12 absolute' />
              </div>
            )}
          </div>

          {currentRat && (
            <div className='my-2 mx-auto text-center'>
              <input
                type='checkbox'
                id='background'
                checked={hideBackground}
                onChange={(e) => {
                  if (e.target.type === 'checkbox') {
                    setHideBackground(e.target.checked);
                  }
                }}
              />
              <label htmlFor='background' className='text-white ml-2'>
                Remove Background
              </label>

              <input
                type='file'
                id='upload-background'
                className='hidden'
                onChange={async (e) => {
                  if (
                    e.target.files instanceof FileList &&
                    e.target.files.length > 0
                  ) {
                    const file = e.target.files[0];
                    const data = await getBase64Image(file);
                    tryOnClothes('background', data);
                    setHideBackground(false);
                  }
                }}
              />
              <div>
                <label
                  htmlFor='upload-background'
                  className='py-2 px-3 mt-4 mx-auto w-60 inline-block rounded-l-md duration-300 bg-tan hover:bg-light'>
                  Upload a Background
                </label>
                <button
                  type='button'
                  className='py-2 px-3 mt-4 mx-auto w-20 inline-block rounded-r-md duration-300 bg-gray-200 hover:bg-gray-300'
                  onClick={() => {
                    tryOnClothes('background', '##REMOVE##');
                  }}>
                  🗑
                </button>
              </div>
            </div>
          )}

          {currentRat && canvas && (
            <button
              className='download py-2 px-3 w-80 block mt-4 mx-auto text-white rounded-md duration-300 bg-purple-700 hover:bg-purple-800'
              onClick={(e) => {
                const link = document.createElement('a');
                link.download = `${currentRat.label}.png`;
                link.href = canvas.toDataURL();
                link.click();
              }}>
              Download it!
            </button>
          )}
        </div>

        <div className='container mx-auto flex justify-center p-4 md:max-h-2/3 md:overflow-y-auto'>
          {currentRat && loading.pieces && (
            <div className='w-full mx-auto mt-40 h-3/4 items-center text-center'>
              <CheeseLoader className='w-20 h-20' />

              <div className='mx-auto h-3 relative rounded-full overflow-hidden w-80'>
                <div className='w-full h-full bg-gray-200 absolute'></div>
                <div
                  className='h-full bg-purple-700 absolute transition-width duration-300'
                  style={{ width: `${tokenProgress}%` }}></div>
              </div>
            </div>
          )}
          {currentRat ? (
            <div
              className={`flex flex-col w-full ${
                loading.pieces
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-1 pointer-events-auto'
              }`}>
              {Object.entries(CLOSET_PIECES).map(([pieceType, pieces]) => (
                <div key={pieceType}>
                  <h3 className='mt-4 mb-1 text-white bold capitalize text-xl'>
                    {pieceType}
                  </h3>

                  <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {pieces.map((piece) => (
                      <div
                        key={piece}
                        className='aspect-w-1 aspect-h-1 rounded-md border-slate border-4'>
                        <Image
                          loading='eager'
                          src={`${RAT_PIECES_THUMBNAIL_PREFIX}${pieceType}-${piece}.png`}
                          alt=''
                          layout='fill'
                          className='w-full h-full'
                          onClick={() => tryOnClothes(pieceType, piece)}
                          onLoad={(e) => {
                            // I'm ignoring here because I know this property exists, but TS disagrees...
                            // @ts-ignore
                            const src = e.target.src as string;

                            if (src.includes('/_next/image')) {
                              // @ts-ignore
                              setLoadedTokens([...loadedTokens, e.target.src]);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-white'>Please select a rat</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Closet;
