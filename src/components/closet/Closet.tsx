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
  TOTAL_CLOSET_PIECES,
} from '~/config/env';
import { EthersContext } from '~/components/context/EthersContext';
import { fabric } from 'fabric';
import { Canvas, StaticCanvas } from 'fabric/fabric-impl';
import { Image } from '~/components/shared/Image';
import { CheeseLoader } from '~/components/shared/CheeseLoader';
interface SimplifiedMetadata {
  label: string;
  value: string;
  properties: Map<string, string>;
}

const Closet = () => {
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
  useEffect(() => {
    const c = new fabric.StaticCanvas('closet-canvas', {
      width: 20 * 16,
      height: 20 * 16,
      preserveObjectStacking: true,
    });
    fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
      img.scaleToHeight(c.getHeight());
      img.scaleToWidth(c.getWidth());
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
                  `${RAT_PIECES_PREFIX}${key}-${val
                    .toLowerCase()
                    .replace(/ /g, '-')}.png`,
                  resolve,
                );
              });
              img.scaleToHeight(canvas.getHeight());
              img.scaleToWidth(canvas.getWidth());
              canvas.add(img);
            }
          }
        } else {
          fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
            img.scaleToHeight(canvas.getHeight());
            img.scaleToWidth(canvas.getWidth());
            canvas.add(img);
          });
        }
      }
      setTimeout(() => setLoading((l) => ({ ...l, mirror: false })), 300);
      canvas?.renderAll();
    },
    [canvas, hideBackground],
  );

  useEffect(() => {
    if (!currentRat) {
      setLoadedTokens([]);
    }
    handleChangeRat(currentRat);
  }, [hideBackground, currentRat, handleChangeRat]);

  const tryOnClothes = (pieceType: string, piece: string) => {
    if (currentRat) {
      if (currentRat.properties.get(pieceType) === piece) {
        currentRat.properties.set(
          pieceType,
          oldClothes.get(pieceType) ?? 'none',
        );
        handleChangeRat(currentRat);
      } else {
        if (
          !CLOSET_PIECES[pieceType as keyof typeof CLOSET_PIECES]?.includes(
            currentRat.properties.get(pieceType) ?? '',
          )
        ) {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
        }
        currentRat.properties.set(pieceType, piece);
        handleChangeRat(currentRat);
      }
    }
  };

  useEffect(() => {
    let load = true;
    console.log(loadedTokens.length, TOTAL_CLOSET_PIECES, CLOSET_PIECES);
    if (loadedTokens.length === TOTAL_CLOSET_PIECES) {
      load = false;
      console.log(load);
    }
    console.log(load);
    setLoading((l) => ({ ...l, pieces: load }));
  }, [loadedTokens]);

  return (
    <>
      <div className='flex mt-4 mb-6 relative z-40'>
        {loading.tokens && <CheeseLoader className='w-10 mx-auto' />}
        {!loading.tokens && rats && (
          <Select
            className='select-search mx-auto'
            options={rats}
            placeholder='Select your rat'
            onChange={handleChangeRat}
            isClearable
            isSearchable
          />
        )}
      </div>

      <div className='container mx-auto flex justify-center p-4'>
        <div>
          <div
            className='
                border-solid border-8 border-gray-400
                mirror
                rounded-xl
                overflow-hidden
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

          <div className='mt-2 text-center'>
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
            <label htmlFor='background' className='text-white'>
              Remove Background
            </label>
          </div>
        </div>
      </div>

      <div className='container mx-auto flex justify-center pt-2 pb-4 px-4'>
        {currentRat && loading.pieces && (
          <CheeseLoader className='absolute left-1/2 w-80 h-80 -translate-x-1/2' />
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

                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
                  {pieces.map((piece) => (
                    <div
                      key={piece}
                      className='aspect-w-1 aspect-h-1 rounded-md border-slate border-4'>
                      <Image
                        src={`${RAT_PIECES_PREFIX}${pieceType}-${piece}.png`}
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

      <div className='container mx-auto flex justify-center p-4'>
        <div className='w-100 mx-auto'>
          {currentRat && canvas && (
            <button
              className='download py-2 px-3 text-white rounded-md duration-300 bg-purple-700 hover:bg-purple-800'
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
      </div>
    </>
  );
};

export default Closet;
