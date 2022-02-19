/* eslint-disable @next/next/no-img-element */
import { fabric } from 'fabric';
import React, { useContext, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { ClosetContext } from '~/components/context/ClosetContext';
import { CheeseLoader } from '~/components/shared/CheeseLoader';
import { Connect } from '~/components/shared/Connect';
import { Image } from '~/components/shared/Image';
import { RAT_CLOSET_PLACEHOLDER, REMOVABLE_CLOSET_PIECES } from '~/config/env';
import { useCanvas } from '~/hooks/useCanvas';
import { CanvasOpts } from '~/types';

export const ClosetMirror = () => {
  const {
    currentRat,
    loading,
    rats,
    tryOnClothes,
    handleChangeRat,
    setHidePiece,
    hidePiece,
    getBase64Image,
    setCanvas,
  } = useContext(ClosetContext);
  const canvasOpts = useMemo(() => {
    const opts: CanvasOpts = {
      canvasType: 'StaticCanvas',
      element: 'closet-canvas',
      canvasOptions: {
        width: 2048,
        height: 2048,
        preserveObjectStacking: true,
      },
      scaledSize: {
        width: 320,
        height: 320,
      },
      onMount: (canv) => {
        fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
          canv.add(img);
        });
      },
    };
    return opts;
  }, []);

  const { canvas } = useCanvas(canvasOpts);

  useEffect(() => {
    setCanvas(canvas);
  }, [canvas, setCanvas]);

  return (
    <>
      <Connect />
      {loading.tokens && <CheeseLoader className='w-10 mx-auto' />}
      {!loading.tokens && rats && (
        <Select
          className='select-search mx-auto w-80 my-4'
          options={rats}
          placeholder='Select your rat'
          onChange={handleChangeRat}
          getOptionLabel={(opt) => opt?.name ?? opt?.id ?? ''}
          formatOptionLabel={(opt) => (
            <span className='inline-flex'>
              <Image
                layout='fixed'
                width={24}
                height={24}
                src={`https://storage.googleapis.com/aww-rats/rats/cached-images/${opt?.id}.png`}
                alt='rat thumbnail'
                className='mr-4'
              />
              {opt?.name}
            </span>
          )}
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
        {loading.mirror && currentRat && (
          <div className='bg-black h-full w-full left-0 top-0 right-0 bottom-0 absolute'>
            <CheeseLoader className='left-12 right-12 top-6 bottom-12 absolute' />
          </div>
        )}
      </div>

      {currentRat && (
        <div className='my-2 mx-auto text-center'>
          <div className='flex flex-col text-left px-4'>
            <p className='font-bold text-white'>Include</p>
            {REMOVABLE_CLOSET_PIECES.map((p) => (
              <div key={p} className='checkboxmoji'>
                <input
                  type='checkbox'
                  id={p}
                  className='hidden'
                  checked={hidePiece[p] ?? false}
                  onChange={(e) => {
                    if (e.target.type === 'checkbox') {
                      const newState = { ...hidePiece, [p]: !hidePiece[p] };
                      setHidePiece(newState);
                    }
                  }}
                />
                <label
                  htmlFor={p}
                  className='bg-white duration-200 cursor-pointer block px-1 mb-1 rounded'>
                  {p}
                </label>
              </div>
            ))}
          </div>

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
                setHidePiece((c) => ({
                  ...c,
                  background: false,
                }));
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
    </>
  );
};
