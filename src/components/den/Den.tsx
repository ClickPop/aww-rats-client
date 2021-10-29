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
  IPFSGateways,
} from '~/config/env';
import { CanvasOpts, useCanvas } from '~/hooks/useCanvas';
import { Metadata } from '~/types';
import { getScaledSize } from '~/utils/getScaledSize';
import DeleteIcon from '~/assets/svg/delete-icon.svg';

const NUM_FRAMES = 4;
const NUM_POSTERS = 1;

const bgWidth = 2600;
const bgHeight = 1400;

const [scaledWidth, scaledHeight] = getScaledSize(bgWidth, bgHeight, 1.1);
const horizontalRatio = scaledWidth / bgWidth;
const verticalRatio = scaledHeight / bgHeight;

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
  };
};

type FrameObject = { url: string; fabricObject: null | fabric.Image };

const getIPFSGateway = () =>
  IPFSGateways[Math.floor(Math.random() * IPFSGateways.length)];

const defaultDenState = `{
  "objects":[], 
  "sizing": 
  {
    "scaledWidth": ${scaledWidth},
    "scaledHeight": ${scaledHeight},
  }
}`;

const storedState: DenStorageState = JSON.parse(
  localStorage.getItem('den-state') ?? defaultDenState,
);

const objectScale = {
  x: storedState.sizing.scaledWidth / scaledWidth,
  y: storedState.sizing.scaledHeight / scaledHeight,
};

const Den = () => {
  const [frames, setFrames] = useState<FrameObject[]>([
    ...new Array(NUM_FRAMES).fill(null).map((_, i) => ({
      url: `${DEN_FRAME_PREFIX}${(i + 1).toString().padStart(2, '0')}.png`,
      fabricObject: null,
    })),
    ...new Array(NUM_POSTERS).fill(null).map((_, i) => ({
      url: `${DEN_POSTER_PREFIX}${(i + 1).toString().padStart(2, '0')}.png`,
      fabricObject: null,
    })),
  ]);
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const denState = useRef<DenStorageState>({
    ...storedState,
    sizing: {
      scaledHeight,
      scaledWidth,
    },
  });
  const [tokens, setTokens] = useState<Metadata[]>([]);
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
    return true;
  };

  const canvasOpts = useMemo(() => {
    const opts: CanvasOpts = {
      canvasType: 'Canvas',
      element: 'den-canvas',
      canvasOptions: {
        width: scaledWidth,
        height: scaledHeight,
        preserveObjectStacking: true,
      },
      onMount: (canv) => {
        canv.setBackgroundImage(DEN_BACKGROUND, canv.renderAll.bind(canv), {
          scaleX: horizontalRatio,
          scaleY: verticalRatio,
        });
      },
    };
    return opts;
  }, []);
  const { canvas } = useCanvas(canvasOpts) as { canvas: fabric.Canvas };

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
    frames.forEach((frame) => {
      if (!frame.fabricObject) {
        fabric.Image.fromURL(frame.url, (img) => {
          img.selectable = true;
          img.hasControls = true;
          img.evented = true;
          img.scale(150 / (img.height ?? 150));
          setFrames([
            ...frames.map((f) =>
              f.url === frame.url ? { ...f, fabricObject: img } : f,
            ),
          ]);
        });
      }
    });
  }, [frames]);

  useEffect(() => {
    const getTokens = async () => {
      if (signerAddr) {
        const res = await fetch(
          `/api/get-tokens/${signerAddr}?chain=polygon`,
        ).then((r) => r.json());
        setTokens(() => {
          const dupeTokens: string[] = [];
          return res.data
            .map((token: Metadata) => ({
              ...token,
              image: token.image.replace('ipfs://', getIPFSGateway()),
            }))
            .filter((t: Metadata) => {
              if (dupeTokens.includes(t.image)) {
                return false;
              }
              dupeTokens.push(t.image);
              return true;
            });
        });
      }
    };
    getTokens();
  }, [signerAddr]);

  const addToCanvas = useCallback(
    (image: DenStorageObject, frameURL?: string) => {
      const getFrame = () => frames[Math.floor(Math.random() * frames.length)];
      if (canvas) {
        fabric.Image.fromURL(image.image, (img) => {
          let frame: FrameObject | null =
            frames.find((f) => f.url === frameURL) ?? null;
          while (!frame?.fabricObject) {
            frame = getFrame();
          }
          frame.fabricObject.originX = 'center';
          frame.fabricObject.originY = 'center';
          img.scale(140 / (img.height ?? 140));
          img.originX = 'center';
          img.originY = 'center';
          const group = new fabric.Group([img, frame.fabricObject], {
            left: 50,
            top: 50,
          });
          group.name = denState.current.objects.length.toString();
          group.setControlsVisibility({
            ml: false,
            mr: false,
            mb: false,
            mt: false,
          });
          for (const key in image.fabricOpts) {
            switch (key) {
              case 'left':
              case 'scaleX':
                group[key as keyof fabric.Group] =
                  ((image.fabricOpts[
                    key as keyof DenStorageObject['fabricOpts']
                  ] ?? 1) as number) / objectScale.x;
                break;
              case 'top':
              case 'scaleY':
                group[key as keyof fabric.Group] =
                  ((image.fabricOpts[
                    key as keyof DenStorageObject['fabricOpts']
                  ] ?? 1) as number) / objectScale.y;
                break;
              default:
                group[key as keyof fabric.Group] =
                  image.fabricOpts[key as keyof DenStorageObject['fabricOpts']];
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

          if (!canvas.getObjects().some((o) => o.name === group.name)) {
            canvas.add(group);
            canvas.setActiveObject(group);
            canvas.renderAll();
            const { top, left, scaleX, scaleY, width, height, angle, name } =
              group;
            const newDenItem = {
              image: image.image,
              frame: frame.url,
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
            localStorage.setItem('den-state', JSON.stringify(denState.current));
            console.log(group);
          }
        });
      }
    },
    [canvas, frames],
  );

  useEffect(() => {
    if (
      canvas &&
      frames.every((f) => f.fabricObject) &&
      !!denState.current.objects.length
    ) {
      for (const denObject of denState.current.objects) {
        addToCanvas(denObject, denObject.frame);
      }
    }
  }, [addToCanvas, canvas, frames]);

  return (
    <div className='h-full'>
      <div
        className='mx-auto mb-8'
        style={{ width: scaledWidth, height: scaledHeight }}>
        <canvas id='den-canvas' />
      </div>
      {canvas && (
        <button
          className='download py-2 px-3 w-80 block mt-4 mx-auto text-white rounded-md duration-300 bg-purple-700 hover:bg-purple-800'
          onClick={() => {
            const link = document.createElement('a');
            link.download = 'den.png';
            link.href = canvas.toDataURL();
            link.click();
          }}>
          Download it!
        </button>
      )}
      <div className='flex space-x-4 w-fit mx-auto mb-8'>
        {tokens.map((token, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            key={token.image + i}
            src={`/api/image/proxy-image?imageURL=${encodeURI(token.image)}`}
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
        ))}
      </div>
      <div className='flex space-x-4 w-fit mx-auto'>
        <>
          {frames.map((frame) => (
            <div
              className={`${frame.url === selectedFrame && 'bg-gray-300'}`}
              key={frame.url}>
              <Image
                src={frame.url}
                width={150}
                height={150}
                objectFit='contain'
                alt=''
                onClick={() =>
                  setSelectedFrame(frame.url === selectedFrame ? '' : frame.url)
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
