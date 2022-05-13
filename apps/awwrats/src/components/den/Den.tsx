import { fabric } from 'fabric';
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
import { Image } from '~/components/shared/Image';
import {
  DEN_BACKGROUND,
  DEN_FRAME_PREFIX,
  DEN_POSTER_PREFIX,
  NUM_FRAMES,
  NUM_POSTERS,
  denBgWidth,
  denBgHeight,
} from '~/config/env';
import { useCanvas } from '~/hooks/useCanvas';
import { ParsedMoralisTokenMeta, CanvasOpts } from '~/types';
import { getScaledSize } from '~/utils/getScaledSize';
import DeleteIcon from '~/assets/svg/delete-icon.svg';
import { v4 as uuidv4 } from 'uuid';
import { svgToPng } from '~/utils/svgToPng';
import Select from 'react-select';
import { useSignerAddress } from 'common/hooks/useSignerAddress';

type SelectOption = {
  value: string;
  label: string;
};

type DenStorageObject = {
  image: string;
  frame: string;
  fabricOpts: Pick<
    fabric.Image,
    'top' | 'left' | 'scaleX' | 'scaleY' | 'width' | 'height' | 'angle' | 'name'
  >;
};

type DenStorageState = {
  objects: DenStorageObject[];
  sizing: {
    scaledWidth: number;
    scaledHeight: number;
    horizontalRatio: number;
    verticalRatio: number;
    scaleX: number;
    scaleY: number;
  };
};

const Den = () => {
  const [frames] = useState([
    ...new Array(NUM_FRAMES)
      .fill(null)
      .map(
        (_, i) =>
          `${DEN_FRAME_PREFIX}${(i + 1).toString().padStart(2, '0')}.png`,
      ),
    ...new Array(NUM_POSTERS)
      .fill(null)
      .map(
        (_, i) =>
          `${DEN_POSTER_PREFIX}${(i + 1).toString().padStart(2, '0')}.png`,
      ),
  ]);
  const [selectedFrame, setSelectedFrame] = useState<string>('');

  const denState = useRef<DenStorageState>(
    (() => {
      const [scaledWidth, scaledHeight] = getScaledSize(
        denBgWidth,
        denBgHeight,
        1.1,
      );

      const horizontalRatio = scaledWidth / denBgWidth;
      const verticalRatio = scaledHeight / denBgHeight;

      const defaultDenState = JSON.stringify({
        objects: [],
        sizing: {
          scaledWidth: scaledWidth,
          scaledHeight: scaledHeight,
        },
      });

      const storedState: DenStorageState = JSON.parse(
        localStorage.getItem('den-state') ?? defaultDenState,
      );

      return {
        ...storedState,
        sizing: {
          scaledWidth,
          scaledHeight,
          horizontalRatio,
          verticalRatio,
          scaleX: storedState.sizing.scaledWidth / scaledWidth,
          scaleY: storedState.sizing.scaledHeight / scaledHeight,
        },
      };
    })(),
  );

  const [numObjects, setNumObjects] = useState(
    denState.current.objects.length ?? 0,
  );

  const [url, setURL] = useState('');

  const [tokens, setTokens] = useState<ParsedMoralisTokenMeta[]>([]);
  const [tokensOptions, setTokensOptions] = useState<SelectOption[]>([]);
  const [tokensStatus, setTokensStatus] = useState<string>('idle');
  const signerAddr = useSignerAddress();
  const deleteIcon = useRef(
    (() => {
      const img = document.createElement('img');
      img.src = DeleteIcon.src;
      return img;
    })(),
  );
  const listenerSet = useRef(false);

  const renderDeleteButton: fabric.Control['render'] = (
    ctx,
    left,
    top,
    _,
    fabricObject,
  ) => {
    const width = fabricObject.controls.deleteControl.sizeX ?? 0;
    const height = fabricObject.controls.deleteControl.sizeY ?? 0;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle ?? 0));
    if (deleteIcon.current) {
      ctx.drawImage(deleteIcon.current, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  };

  const deleteGroup: fabric.Control['actionHandler'] = (_, transformData) => {
    const { target } = transformData;
    const { canvas: canv } = target;
    canv?.remove(target);
    canv?.requestRenderAll();
    denState.current.objects = denState.current.objects.filter(
      (o) => o.fabricOpts.name !== target.name,
    );
    localStorage.setItem('den-state', JSON.stringify(denState.current));
    setNumObjects(denState.current.objects.length ?? 0);
    return true;
  };

  const canvasOpts = useMemo(() => {
    const opts: CanvasOpts = {
      canvasType: 'Canvas',
      element: 'den-canvas',
      canvasOptions: {
        width: denState.current.sizing.scaledWidth,
        height: denState.current.sizing.scaledHeight,
        preserveObjectStacking: true,
      },
      onMount: (canv) => {
        canv.setBackgroundImage(DEN_BACKGROUND, canv.renderAll.bind(canv), {
          scaleX: denState.current.sizing.horizontalRatio,
          scaleY: denState.current.sizing.verticalRatio,
        });
      },
    };
    return opts;
  }, []);
  const downloadCanvasOpts = useMemo(() => {
    const opts: CanvasOpts = {
      canvasType: 'StaticCanvas',
      element: 'download-canvas',
      canvasOptions: {
        width: denBgWidth,
        height: denBgHeight,
        preserveObjectStacking: true,
      },
    };
    return opts;
  }, []);
  const { canvas } = useCanvas(canvasOpts) as { canvas: fabric.Canvas };
  const { canvas: downloadCanvas } = useCanvas(downloadCanvasOpts) as {
    canvas: fabric.StaticCanvas;
  };

  useEffect(() => {
    if (canvas && !listenerSet.current) {
      canvas.on('object:modified', (e) => {
        denState.current.objects = denState.current.objects.map((o) => {
          if (o.fabricOpts.name === e.target?.name && e.target) {
            const { top, left, scaleX, scaleY, width, height, angle, name } =
              e.target;
            const newDenItem = {
              ...o,
              fabricOpts: {
                top,
                left,
                scaleX,
                scaleY,
                width,
                height,
                angle,
                name,
              },
            };
            return newDenItem;
          }
          return o;
        });
        localStorage.setItem('den-state', JSON.stringify(denState.current));
      });
      listenerSet.current = true;
    }
  }, [canvas]);

  useEffect(() => {
    const getTokens = async () => {
      setTokensStatus('loading');
      if (signerAddr) {
        const resPolygon = await fetch(
          `/api/get-tokens/${signerAddr}?chain=polygon`,
        ).then((r) => r.json());
        const resEthereum = await fetch(
          `/api/get-tokens/${signerAddr}?chain=eth`,
        ).then((r) => r.json());
        const tempTokens = [...resPolygon.data, ...resEthereum.data];
        if (Array.isArray(tempTokens) && tempTokens.length) {
          let options = tempTokens.map((token) => ({
            value: token.metadata.image.startsWith('data:image')
              ? token.metadata.image
              : `/api/image/proxy-image?imageURL=${encodeURI(
                  token.metadata.image,
                ).replace(/\//g, '%2F')}`,
            label: `${token.name === 'AwwRat' ? 'Aww, Rats' : token.name}: ${
              token.metadata.name ?? token.token_id
            }`,
          }));
          setTokensOptions(options);
        }
        setTokens([...resPolygon.data, ...resEthereum.data]);
        setTokensStatus('loaded');
      }
    };

    if (tokensStatus === 'idle') {
      getTokens();
    }
  }, [signerAddr, tokensStatus]);

  const clearCanvas = useCallback(() => {
    canvas.remove(...canvas.getObjects());
    denState.current.objects = [];
    canvas?.requestRenderAll();
    localStorage.setItem('den-state', JSON.stringify(denState.current));
    setNumObjects(denState.current.objects.length ?? 0);
  }, [canvas]);

  const addToCanvas = useCallback(
    async (image: DenStorageObject, frameURL?: string) => {
      const getFrame = () => frames[Math.floor(Math.random() * frames.length)];
      if (canvas) {
        let tempImage: string | Buffer = image.image;
        if (tempImage.startsWith('data:image/svg')) {
          tempImage = await svgToPng(tempImage);
        } else {
          let testRes = await fetch(tempImage);
          let testResText = await testRes.text();
          if (testResText.match(/<svg/i)) {
            tempImage = `data:image/svg+xml;base64,${window.btoa(testResText)}`;
          }
        }

        fabric.Image.fromURL(tempImage, (img) => {
          const frameSrc = frameURL || getFrame();
          fabric.Image.fromURL(frameSrc, (frame) => {
            frame.scale(150 / (frame.height ?? 150));
            frame.originX = 'center';
            frame.originY = 'center';
            let padX = 0;
            let padY = 0;
            switch (frameSrc) {
              case `${DEN_FRAME_PREFIX}01.png`:
              case `${DEN_FRAME_PREFIX}02.png`:
                padX = 11.5;
                padY = 11.5;
                break;
              case `${DEN_FRAME_PREFIX}03.png`:
                padX = 7;
                padY = 7;
                break;
              case `${DEN_FRAME_PREFIX}04.png`:
                padX = 18.5;
                padY = 18.5;
                break;
              case `${DEN_POSTER_PREFIX}01.png`:
                padX = 2.5;
                padY = 2.5;
                break;
              default:
                padX = 0;
                padY = 0;
            }

            img.scale((150 - padX * 2) / ((img.height ?? 150) - padY * 2));
            img.originX = 'center';
            img.originY = 'center';

            const group = new fabric.Group([img, frame], {
              left: 50,
              top: 50,
            });
            group.setControlsVisibility({
              ml: false,
              mr: false,
              mb: false,
              mt: false,
            });
            group.name = uuidv4();

            for (const key in image.fabricOpts) {
              switch (key) {
                case 'left':
                case 'scaleX':
                  group[key as keyof fabric.Group] =
                    ((image.fabricOpts[
                      key as keyof DenStorageObject['fabricOpts']
                    ] ?? 1) as number) / denState.current.sizing.scaleX;
                  break;
                case 'top':
                case 'scaleY':
                  group[key as keyof fabric.Group] =
                    ((image.fabricOpts[
                      key as keyof DenStorageObject['fabricOpts']
                    ] ?? 1) as number) / denState.current.sizing.scaleY;
                  break;
                default:
                  group[key as keyof fabric.Group] =
                    image.fabricOpts[
                      key as keyof DenStorageObject['fabricOpts']
                    ];
                  break;
              }
            }

            group.controls.deleteControl = new fabric.Control({
              x: 0.5,
              y: -0.5,
              offsetX: 16,
              offsetY: -16,
              sizeX: 32,
              sizeY: 32,
              touchSizeX: 32,
              touchSizeY: 32,
              actionHandler: deleteGroup,
              render: renderDeleteButton,
              cursorStyle: 'pointer',
            });

            if (
              canvas.getObjects().length < 10 &&
              !canvas.getObjects().some((o) => o.name === group.name)
            ) {
              canvas.add(group);
              canvas.setActiveObject(group);
              canvas.renderAll();
              const { top, left, scaleX, scaleY, width, height, angle, name } =
                group;
              const newDenItem = {
                image: image.image,
                frame: frameSrc,
                fabricOpts: {
                  top,
                  left,
                  scaleX,
                  scaleY,
                  width,
                  height,
                  angle,
                  name,
                },
              };
              denState.current.objects = [
                ...denState.current.objects.filter(
                  (o) => o.fabricOpts.name !== group.name,
                ),
                newDenItem,
              ];
              setNumObjects(denState.current.objects.length ?? 0);
              localStorage.setItem(
                'den-state',
                JSON.stringify(denState.current),
              );
            }
          });
        });
      }
    },
    [canvas, frames],
  );

  useEffect(() => {
    if (canvas && !!denState.current.objects.length) {
      for (const denObject of denState.current.objects) {
        addToCanvas(denObject, denObject.frame);
      }
    }
  }, [addToCanvas, canvas, frames]);

  return (
    <div className='pt-24 pb-24'>
      <div
        className='mx-auto'
        style={{
          width: denState.current.sizing.scaledWidth,
          height: denState.current.sizing.scaledHeight,
        }}>
        <canvas id='den-canvas' />
        <canvas hidden id='download-canvas' />
      </div>

      <div className='flex justify-center items-center fixed z-50 bottom-0 w-full bg-opacity-10 bg-white py-1'>
        {numObjects < 10 ? (
          <form
            className='flex items-center'
            onSubmit={(e) => {
              e.preventDefault();
              addToCanvas(
                {
                  image: url.startsWith('data:image')
                    ? url
                    : `/api/image/proxy-image?imageURL=${encodeURI(url)}`,
                  frame: '',
                  fabricOpts: {},
                },
                selectedFrame,
              );
              setURL('');
            }}>
            <div className='mx-2'>
              {tokensStatus === 'loaded' && tokensOptions.length > 0 ? (
                <Select
                  options={tokensOptions}
                  menuPlacement='top'
                  className='p-2 border-0 rounded-sm w-60'
                  onChange={(option) => {
                    if (!option) return false;
                    return addToCanvas(
                      {
                        image: option.value,
                        frame: '',
                        fabricOpts: {},
                      },
                      selectedFrame,
                    );
                  }}></Select>
              ) : (
                <span className='text-purple-800 italic font-bold'>
                  Loading tokens...
                </span>
              )}
            </div>
            <p className='text-white'>Or</p>.
            <div className='mx-2'>
              <input
                type='url'
                placeholder='URL to external image'
                value={url}
                onChange={(e) => setURL(e.currentTarget.value)}
                className='p-2 border-0 rounded-l-sm'
              />
              <button
                type='submit'
                disabled={!url}
                className='py-2 px-3 text-white rounded-r-sm duration-300 bg-purple-700 hover:bg-purple-800'>
                + image
              </button>
            </div>
          </form>
        ) : (
          <p className='text-white'>
            You have reached the max token number. Please delete one or more
            tokens to add more.
          </p>
        )}
        {/* {tokens.map((token, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            key={token.metadata.image + i}
            src={`/api/image/proxy-image?imageURL=${encodeURI(
              token.metadata.image,
            )}`}
            width={150}
            height={150}
            alt=''
            onClick={(e) =>
              addToCanvas(
                {
                  image: e.currentTarget.src,
                  frame: '',
                  fabricOpts: {},
                },
                selectedFrame,
              )
            }
          />
        ))} */}

        <div className='flex space-x-2  mt-1 mx-2 w-fit'>
          <>
            {frames.map((frame) => (
              <div
                className={`${frame === selectedFrame && 'bg-gray-300'}`}
                key={frame}>
                <Image
                  src={frame}
                  width={40}
                  height={40}
                  objectFit='contain'
                  alt=''
                  onClick={() =>
                    setSelectedFrame(frame === selectedFrame ? '' : frame)
                  }
                />
              </div>
            ))}
          </>
        </div>

        {canvas && (
          <>
            <button
              className='download py-2 px-3 m-2 text-white rounded-sm duration-300 bg-purple-700 hover:bg-purple-800'
              onClick={async () => {
                downloadCanvas.setBackgroundImage(DEN_BACKGROUND, () => {});
                const link = document.createElement('a');
                const scaledWidth =
                  denBgWidth / denState.current.sizing.scaledWidth;
                const scaledHeight =
                  denBgHeight / denState.current.sizing.scaledHeight;
                for (const o of canvas.getObjects()) {
                  const url = o.toDataURL({});
                  const image = await new Promise<fabric.Image>((res) => {
                    fabric.Image.fromURL(url, (img) => {
                      img.left = o.left;
                      img.top = o.top;
                      res(img);
                    });
                  });
                  image.scaleX = (image.scaleX ?? 0) * scaledWidth;
                  image.scaleY = (image.scaleY ?? 0) * scaledHeight;
                  image.left = (image.left ?? 0) * scaledWidth;
                  image.top = (image.top ?? 0) * scaledHeight;
                  downloadCanvas.add(image);
                }
                downloadCanvas.renderAll();
                link.download = 'den.png';
                link.href = downloadCanvas.toDataURL();
                link.click();
                downloadCanvas.clear();
              }}>
              Download
            </button>
            <button
              className='py-2 px-3 m-2 rounded-sm duration-300 bg-tan hover:bg-light border-l border-0 border-slate'
              onClick={async () => {
                clearCanvas();
              }}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Den;
