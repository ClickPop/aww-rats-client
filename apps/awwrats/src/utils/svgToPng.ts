export const svgToPng = (svgDataURI: string): Promise<string> =>
  new Promise((resolve) => {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let img: HTMLImageElement;
    let bounds: number = 2048;

    img = new Image();
    img.src = svgDataURI;
    img.width = bounds;
    img.height = bounds;
    img.onload = () => {
      canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, img.width, img.height, 0, 0, bounds, bounds);

      img = new Image();
      img.src = canvas.toDataURL('image/png');
      img.onload = () => {
        canvas = document.createElement('canvas');
        canvas.width = bounds;
        canvas.height = bounds;
        ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
    };
  });
