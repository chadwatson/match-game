export function clone<A>(xs: Set<A>) {
  return new Set([...xs]);
}

export function add<A>(x: A) {
  return function (xs: Set<A>) {
    const ys = clone(xs);
    ys.add(x);
    return ys;
  };
}

export function remove<A>(x: A) {
  return function (xs: Set<A>) {
    const ys = clone(xs);
    ys.delete(x);
    return ys;
  };
}

export function join<A>(ys: Set<A>) {
  return function (xs: Set<A>) {
    return new Set([...xs, ...ys]);
  };
}
