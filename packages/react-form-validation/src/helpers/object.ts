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
): boolean {
  const allKeys = Array.from(new Set(Object.keys(a).concat(Object.keys(b))));
  for (const key of allKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
