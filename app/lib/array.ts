export function clone<A>(xs: A[]) {
  return [...xs];
}

export function shuffle<A>(xs: A[]) {
  const ys = clone(xs);
  let currentIndex = ys.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [ys[currentIndex], ys[randomIndex]] = [ys[randomIndex], ys[currentIndex]];
  }

  return ys;
}

export function repeat<A>(xs: A[]) {
  return [...xs, ...xs];
}

export const splitEvery =
  (amount: number) =>
  <A>(xs: A[]) => {
    const ys = [] as A[][];

    let currentRow = [];
    for (const x of xs) {
      currentRow.push(x);

      if (currentRow.length === amount) {
        ys.push(currentRow);
        currentRow = [];
      }
    }

    const finalLength = currentRow.length;
    if (finalLength > 0 && finalLength < amount) {
      ys.push(currentRow);
    }

    return ys;
  };

export function replace<A>(x: A) {
  return function (i: number) {
    return function (xs: A[]) {
      const ys = clone(xs);
      ys.splice(i, 1, x);
      return ys;
    };
  };
}

export function concat<A>(ys: A[]) {
  return function (xs: A[]) {
    return xs.concat(ys);
  };
}
