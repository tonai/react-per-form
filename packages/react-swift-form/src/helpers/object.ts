export function getProperty<T>(object: object, path: string): T | undefined {
  const parts = path.split('.');
  const { length } = parts;
  let index = 0;
  let result: unknown = object;
  while (typeof result === 'object' && result != null && index < length) {
    result = result[parts[index++] as keyof typeof result];
  }
  return index && index === length ? (result as T) : undefined;
}

export function areObjectEquals(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  deep = false,
): boolean {
  const allKeys = Array.from(new Set(Object.keys(a).concat(Object.keys(b))));
  return !allKeys.some((key) => {
    if (typeof a[key] !== typeof b[key]) {
      return true;
    }
    if (!deep || a[key] === null || typeof a[key] !== 'object') {
      return a[key] !== b[key];
    }
    return !areObjectEquals(
      a[key] as Record<string, unknown>,
      b[key] as Record<string, unknown>,
      deep,
    );
  });
}

export function filterObject<T>(
  object: Record<string, T>,
  callback: (param: [string, T]) => boolean,
): Record<string, T> {
  return Object.fromEntries(Object.entries(object).filter(callback));
}
