/**
 * I stole basically ALL this code from:
 *  https://stackoverflow.com/questions/28056636/animated-gif-on-fabric-js-canvas
 *
 * I only vaguely understand how it works, but it seems to work. I might come back through and adjust it if need be. This one is for you Nuwtox.
 */
import { parseGIF, decompressFrames } from 'gifuct-js';
export async function gifToSprites(
  gif: string | File,
  maxWidth?: number,
  maxHeight?: number,
) {
  const arrayBuffer = await getGifArrayBuffer(gif);
  const frames = decompressFrames(parseGIF(arrayBuffer), true);
  if (!frames[0]) {
    throw new Error('No frames found in gif');
  }
  const totalFrames = frames.length;

  // get the frames dimensions and delay
  let width = frames[0].dims.width;
  let height = frames[0].dims.height;

  // set the scale ratio if any
  maxWidth = maxWidth || width;
  maxHeight = maxHeight || height;
  const scale = Math.min(maxWidth / width, maxHeight / height);
  width = width * scale;
  height = height * scale;

  const dataCanvas = document.createElement('canvas');
  const dataCtx = dataCanvas.getContext('2d')!;
  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = width;
  frameCanvas.height = height;
  const frameCtx = frameCanvas.getContext('2d')!;

  // 4096 is the max canvas width in IE
  const framesPerSprite = Math.floor(4096 / width);
  const totalSprites = Math.ceil(totalFrames / framesPerSprite);

  const sprites: Array<HTMLCanvasElement> = [];
  for (let spriteIndex = 0; spriteIndex < totalSprites; spriteIndex++) {
    const framesOffset = framesPerSprite * spriteIndex;
    const remainingFrames = totalFrames - framesOffset;
    const currentSpriteTotalFrames = Math.min(framesPerSprite, remainingFrames);

    const spriteCanvas = document.createElement('canvas');
    const spriteCtx = spriteCanvas.getContext('2d')!;
    spriteCanvas.width = width * currentSpriteTotalFrames;
    spriteCanvas.height = height;

    frames
      .slice(framesOffset, framesOffset + currentSpriteTotalFrames)
      .forEach((frame, i) => {
        const frameImageData = dataCtx.createImageData(
          frame.dims.width,
          frame.dims.height,
        );
        frameImageData.data.set(frame.patch);
        dataCanvas.width = frame.dims.width;
        dataCanvas.height = frame.dims.height;
        dataCtx.putImageData(frameImageData, 0, 0);

        // Draw a frame from the imageData
        if (frame.disposalType === 2) frameCtx.clearRect(0, 0, width, height);
        frameCtx.drawImage(
          dataCanvas,
          frame.dims.left * scale,
          frame.dims.top * scale,
          frame.dims.width * scale,
          frame.dims.height * scale,
        );

        // Add the frame to the sprite sheet
        spriteCtx.drawImage(frameCanvas, width * i, 0);
      });

    sprites.push(spriteCanvas);
    spriteCanvas.remove();
  }

  // Clean the dom, dispose of the unused canvass
  dataCanvas.remove();
  frameCanvas.remove();

  return {
    framesPerSprite,
    sprites,
    frames,
    frameWidth: width,
    frameHeight: height,
    totalFrames,
  };
}
async function getGifArrayBuffer(gif: string | File): Promise<ArrayBuffer> {
  if (typeof gif === 'string') {
    return fetch(gif).then((resp) => resp.arrayBuffer());
  } else {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(gif);
    });
  }
}

const [PLAY, PAUSE, STOP] = [0, 1, 2];

export async function fabricGif(
  gif: string | File,
  maxWidth?: number,
  maxHeight?: number,
): Promise<{ image: fabric.Image }> {
  const {
    framesPerSprite,
    sprites,
    frames,
    frameWidth,
    frameHeight,
    totalFrames,
  } = await gifToSprites(gif, maxWidth, maxHeight);

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = frameWidth;
  frameCanvas.height = frameHeight;
  const frameCtx = frameCanvas.getContext('2d')!;

  frameCtx.drawImage(sprites[0]!, 0, 0, frameWidth, frameHeight);

  return new Promise((resolve) => {
    window.fabric.Image.fromURL(frameCanvas.toDataURL(), (image) => {
      const firstFrame = frames[0]!;
      let framesIndex = 0;
      let start = performance.now();
      let status: number;
      let accumulatedDelay = firstFrame.delay;

      image.width = frameWidth;
      image.height = frameHeight;
      image._render = function (ctx) {
        if (status === PAUSE || (status === STOP && framesIndex === 0)) return;
        const now = performance.now();
        const delta = now - start;
        if (delta > accumulatedDelay) {
          accumulatedDelay += frames[framesIndex]!.delay;
          framesIndex++;
        }
        if (framesIndex === totalFrames || status === STOP) {
          framesIndex = 0;
          start = now;
          accumulatedDelay = firstFrame.delay;
        }

        const spriteIndex = Math.floor(framesIndex / framesPerSprite);
        ctx.drawImage(
          sprites[spriteIndex]!,
          frameWidth * (framesIndex % framesPerSprite),
          0,
          frameWidth,
          frameHeight,
          -frameWidth / 2,
          -frameHeight / 2,
          frameWidth,
          frameHeight,
        );
      };

      const methods = {
        play: () => {
          status = PLAY;
          image.dirty = true;
        },
        pause: () => {
          status = PAUSE;
          image.dirty = false;
        },
        stop: () => {
          status = STOP;
          image.dirty = false;
        },
        getStatus: () => ['Playing', 'Paused', 'Stopped'][status],
      };

      methods.play();

      resolve({
        ...methods,
        image,
      });
    });
  });
}
