export function average(xs: number[]) {
  let sum = 0;
  for (const x of xs) {
    sum += x;
  }
  return sum / xs.length;
}
