export function delay<T>(value?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value as T), 1000);
  });
}
