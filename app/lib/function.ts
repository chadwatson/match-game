export function always<A>(x: A) {
  return () => x;
}
