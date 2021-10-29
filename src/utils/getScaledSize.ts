export const getScaledSize = (width: number, height: number, scale: number) => {
  const ratio = height / width;
  const scaledWidth = window.innerWidth / scale;
  const scaledHeight = scaledWidth * ratio;
  return [scaledWidth, scaledHeight];
};
