export function preloadImage(src: string) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      res(img);
    };
    img.onerror = rej;
    img.src = src;
  });
}
