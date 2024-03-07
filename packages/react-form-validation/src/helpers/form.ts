import type {
  IFormValidator,
  ISetValidatorParams,
  IValidator,
  IValidityMessages,
} from '../types';

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

export function getValidatorMap(
  fieldValidators: Set<ISetValidatorParams>,
  formValidators?:
    | IFormValidator[]
    | Record<string, IFormValidator | IValidator>,
  messages?: IValidityMessages,
): Map<string, Set<ISetValidatorParams>> {
  const validatorMap = new Map<string, Set<ISetValidatorParams>>();

  // Field validators
  for (const params of fieldValidators.values()) {
    for (const name of params.names) {
      insertInMapSet(validatorMap, name, params);
    }
  }

  // Form validators
  if (formValidators) {
    for (const [id, value] of Object.entries(formValidators)) {
      if (typeof value === 'function') {
        insertInMapSet(validatorMap, id, {
          id,
          messages,
          names: [id],
          validator: value,
        });
      } else {
        const { names: validatorNames, validator } = value;
        for (const name of validatorNames) {
          insertInMapSet(validatorMap, name, {
            id,
            messages,
            names: validatorNames,
            validator,
          });
        }
      }
    }
  }

  return validatorMap;
}
