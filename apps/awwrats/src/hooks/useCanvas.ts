import { fabric } from 'fabric';
import { useState, useEffect } from 'react';
import { CanvasOpts, CombinedCanvasNullable } from '~/types';

export const useCanvas = ({
  canvasType,
  element,
  canvasOptions,
  scaledSize,
  onMount,
}: CanvasOpts) => {
  const [canvas, setCanvas] = useState<CombinedCanvasNullable>(null);

  useEffect(() => {
    let c: CombinedCanvasNullable = null;
    switch (canvasType) {
      case 'Canvas':
        c = new fabric.Canvas(element, canvasOptions);
        break;
      case 'StaticCanvas':
        c = new fabric.StaticCanvas(element, canvasOptions);
      default:
        break;
    }
    if (c) {
      if (scaledSize && element) {
        const canv =
          typeof element === 'string'
            ? document.getElementById(element)
            : element;
        if (canv) {
          canv.style.transformOrigin = '0 0';
          canv.style.transform = `scaleY(${
            scaledSize?.height && canvasOptions?.height
              ? scaledSize.height / canvasOptions.height
              : 1
          }) scaleX(${
            scaledSize?.width && canvasOptions?.width
              ? scaledSize.width / canvasOptions.width
              : 1
          })`;
        }
      }
      if (onMount) {
        onMount(c);
      }
      setCanvas(c);
    }
  }, [canvasOptions, canvasType, element, onMount, scaledSize]);

  return { canvas };
};
