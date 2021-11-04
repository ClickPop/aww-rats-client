export const getScaledSize = (width: number, height: number, scale: number) => {
  const ratio = height / width;
  const scaledWidth = Math.min(window.innerWidth / scale, 2000);
  const scaledHeight = scaledWidth * ratio;
  return [scaledWidth, scaledHeight];
};
