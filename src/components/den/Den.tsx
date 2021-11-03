import { fabric } from 'fabric';
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { EthersContext } from '~/components/context/EthersContext';
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
import { CanvasOpts, useCanvas } from '~/hooks/useCanvas';
import { ParsedMoralisTokenMeta } from '~/types';
import { getScaledSize } from '~/utils/getScaledSize';
import DeleteIcon from '~/assets/svg/delete-icon.svg';
import { v4 as uuidv4 } from 'uuid';

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

  const [tokens, setTokens] = useState<ParsedMoralisTokenMeta[]>([]);
  const { signerAddr } = useContext(EthersContext);
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
      if (signerAddr) {
        const res = await fetch(
          `/api/get-tokens/${signerAddr}?chain=polygon&limit=40`,
        ).then((r) => r.json());
        setTokens(res.data);
      }
    };
    getTokens();
  }, [signerAddr]);

  const addToCanvas = useCallback(
    (image: DenStorageObject, frameURL?: string) => {
      const getFrame = () => frames[Math.floor(Math.random() * frames.length)];
      if (canvas) {
        fabric.Image.fromURL(image.image, (img) => {
          const frameUrl = frameURL ?? getFrame();
          fabric.Image.fromURL(frameURL ?? getFrame(), (frame) => {
            frame.scale(150 / (frame.height ?? 150));
            frame.originX = 'center';
            frame.originY = 'center';
            let padX = 0;
            let padY = 0;
            switch (frameURL) {
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
                frame: frameUrl,
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
    <div className='h-full pt-24'>
      {canvas && (
        <button
          className='download py-2 px-3 w-80 block mt-4 mx-auto text-white rounded-md duration-300 bg-purple-700 hover:bg-purple-800'
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
          Download it!
        </button>
      )}
      <div
        className='mx-auto mb-8'
        style={{
          width: denState.current.sizing.scaledWidth,
          height: denState.current.sizing.scaledHeight,
        }}>
        <canvas id='den-canvas' />
        <canvas hidden id='download-canvas' />
      </div>

      <div className='flex space-x-4 w-fit mx-auto mb-8'>
        {numObjects < 10 && (
          <select
            onChange={(e) =>
              addToCanvas(
                {
                  image: e.currentTarget.value,
                  frame: '',
                  fabricOpts: {},
                },
                selectedFrame,
              )
            }>
            <option>Please select a token</option>
            {tokens.map((token, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <option
                key={token.metadata.image + i}
                value={`/api/image/proxy-image?imageURL=${encodeURI(
                  token.metadata.image,
                )}`}>
                {token.name}: {token.metadata.name ?? token.token_id}
              </option>
            ))}
          </select>
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
      </div>
      <button onClick={() => console.log(canvas?.getObjects())}>
        Get State
      </button>
      <div className='flex space-x-4 w-fit mx-auto'>
        <>
          {frames.map((frame) => (
            <div
              className={`${frame === selectedFrame && 'bg-gray-300'}`}
              key={frame}>
              <Image
                src={frame}
                width={150}
                height={150}
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
    </div>
  );
};

export default Den;
