export function insertInMapSet<T>(
  map: Map<string, Set<T>>,
  name: string,
  x: T,
): void {
  if (!map.has(name)) {
    map.set(name, new Set([x]));
  } else {
    const set = map.get(name);
    set?.add(x);
  }
}

const disallowedInputTypes = ['submit', 'reset'];
export function getFormInputs(form: HTMLFormElement): HTMLInputElement[] {
  return [...form.elements].filter(
    (input) =>
      input instanceof HTMLInputElement &&
      input.getAttribute('name') &&
      !disallowedInputTypes.includes(input.type),
  ) as HTMLInputElement[];
}
