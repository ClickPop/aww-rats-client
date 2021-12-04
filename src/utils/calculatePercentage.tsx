export const calculatePercentage = (n: number, d: number): number => {
  let perc: number = 0;
  if (n >= 0 && d > 0) {
    if (n > d || n === d) {
      perc = 1;
    } else {
      perc = n / d;
    }
  }

  perc = perc >= 0 && perc < 1 ? Math.round(perc * 10000) / 100 : 100;

  return perc;
};
