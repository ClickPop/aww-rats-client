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
} from '~/config/env';
import { EthersContext } from '~/components/context/EthersContext';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { Image } from '~/components/shared/Image';
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
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [hideBackground, setHideBackground] = useState(false);
  const [loading, setLoading] = useState<
    null | 'TOKENS' | 'METADATA' | 'MIRROR'
  >(null);

  useEffect(() => {
    const c = new fabric.Canvas('closet-canvas', {
      width: 20 * 16,
      height: 20 * 16,
      preserveObjectStacking: true,
    });
    fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
      img.scaleToHeight(c?.height ?? 0);
      img.scaleToWidth(c?.width ?? 0);
      c.add(img);
    });
    setCanvas(c);
  }, []);

  // Get all the tokens for an address
  useEffect(() => {
    (async () => {
      if (contract && signerAddr) {
        try {
          setLoading('TOKENS');
          let tokens = await contract.getTokensByOwner(signerAddr);
          setSignerTokens(tokens);
        } catch (err) {
          console.error(err);
        }
        setLoading(null);
      }
    })();
  }, [signer, contract, signerAddr]);

  // Get the metadata for those tokens and store them in state
  useEffect(() => {
    (async () => {
      // Get token URI from contract then fetch token metadata from IFPS
      if (Array.isArray(signerTokens)) {
        setLoading('METADATA');
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
        setLoading(null);
      }
    })();
  }, [contract, signerTokens]);

  const handleChangeRat = useCallback(
    async (rat: SingleValue<SimplifiedMetadata | null>) => {
      setLoading('MIRROR');
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
              img.scaleToHeight(canvas?.height ?? 0);
              img.scaleToWidth(canvas?.width ?? 0);
              canvas.add(img);
            }
          }
          canvas.renderAll();
        } else {
          fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
            img.scaleToHeight(canvas?.height ?? 0);
            img.scaleToWidth(canvas?.width ?? 0);
            canvas.add(img);
          });
        }
      }
    },
    [canvas, hideBackground],
  );

  useEffect(() => {
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
        const old = new Map(oldClothes);
        old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
        setOldClothes(old);
        currentRat.properties.set(pieceType, piece);
        handleChangeRat(currentRat);
      }
    }
  };

  return (
    <>
      <div className='flex mt-4 mb-6 relative z-40'>
        {rats && (
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
              '>
            <canvas id='closet-canvas' className='w-full h-full' />
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

        <div className='w-60 h-80 overflow-auto'>
          <div className='flex flex-col'>
            {Object.entries(CLOSET_PIECES).map(([pieceType, pieces]) => (
              <div key={pieceType} className='flex flex-col h-full'>
                {pieces.map((piece) => (
                  <Image
                    key={piece}
                    src={`${RAT_PIECES_PREFIX}${pieceType}-${piece}.png`}
                    alt=''
                    layout='fill'
                    className='w-60 h-60'
                    onClick={() => tryOnClothes(pieceType, piece)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
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
