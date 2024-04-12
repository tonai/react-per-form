import type {
  IFormElement,
  IFormValidator,
  IMessages,
  IRegisterParams,
  ITransformers,
  IValidator,
  IValidatorObject,
} from '../types';

import { isValidator, isValidatorObject } from './validator';

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

export function isFormElement(
  input: Element | EventTarget | RadioNodeList,
): input is IFormElement {
  return (
    input instanceof HTMLInputElement ||
    input instanceof HTMLSelectElement ||
    input instanceof HTMLTextAreaElement ||
    input instanceof RadioNodeList
  );
}

const disallowedInputTypes = ['submit', 'reset'];
export function getFormInputs(form: HTMLFormElement): IFormElement[] {
  return [...form.elements].filter(
    (input) =>
      isFormElement(input) &&
      input.name &&
      !disallowedInputTypes.includes(input.type),
  ) as IFormElement[];
}

export function getValidatorMap(
  fieldValidators: Set<IRegisterParams>,
  formValidators?: Record<string, IValidator | IValidatorObject>,
  messages?: IMessages,
): Map<string, Set<IFormValidator>> {
  const validatorMap = new Map<string, Set<IFormValidator>>();

  // Field validators
  for (const params of fieldValidators.values()) {
    const { validators, ...validatorParams } = params;
    for (const name of params.names) {
      insertInMapSet(validatorMap, name, validatorParams);
    }

    if (!validators) {
      continue;
    } else if (isValidator(validators)) {
      for (const name of params.names) {
        insertInMapSet(validatorMap, name, {
          ...validatorParams,
          validator: validators,
        });
      }
    } else if (isValidatorObject(validators)) {
      const { names: validatorNames, validator } = validators;
      for (const name of validatorNames) {
        insertInMapSet(validatorMap, name, {
          ...validatorParams,
          names: validatorNames,
          validator,
        });
      }
    } else {
      for (const [id, value] of Object.entries(validators)) {
        if (isValidator(value)) {
          insertInMapSet(validatorMap, id, {
            ...validatorParams,
            id,
            names: [id],
            validator: value,
          });
        } else {
          const { names: validatorNames, validator } = value;
          for (const name of validatorNames) {
            insertInMapSet(validatorMap, name, {
              ...validatorParams,
              id,
              names: validatorNames,
              validator,
            });
          }
        }
      }
    }
  }

  // Form validators
  if (formValidators) {
    for (const [id, value] of Object.entries(formValidators)) {
      if (isValidator(value)) {
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

export function isEvent(event: unknown): event is Event {
  return Boolean(
    typeof event === 'object' && event !== null && 'target' in event,
  );
}

export function isCheckbox(target: EventTarget): target is HTMLInputElement {
  return Boolean('type' in target && target.type === 'checkbox');
}

export function isFileInput(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): input is HTMLInputElement {
  return input.type === 'file';
}

export function isSelect(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): input is HTMLSelectElement {
  return input.tagName === 'SELECT';
}

const tagNames = ['INPUT', 'SELECT', 'TEXTAREA'];
export function isField(
  target: EventTarget,
): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return Boolean(
    'tagName' in target && tagNames.includes(target.tagName as string),
  );
}

export function getName(event: unknown): string | null {
  if (isEvent(event) && event.target && isField(event.target)) {
    return event.target.name;
  }
  return null;
}

export function getInputValue(
  value: unknown,
  input?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): unknown {
  if (input && 'multiple' in input && input.multiple) {
    if (input.type === 'email') {
      return String(value)
        .split(',')
        .map((v) => v.trim());
    } else if (isFileInput(input) && input.files) {
      return [...input.files];
    } else if (isSelect(input)) {
      return [...input.options]
        .filter((option) => option.selected)
        .map((option) => option.value);
    }
  } else if (input && isFileInput(input) && input.files) {
    return input.files[0];
  }
  return value;
}

export function getValue<V>(
  event: unknown,
  transformer?: (value: unknown) => unknown,
): V {
  let val: unknown = event;
  if (isEvent(event) && event.target) {
    if (isCheckbox(event.target)) {
      val = event.target.checked;
    } else if (isField(event.target)) {
      val = getInputValue(event.target.value, event.target);
    }
  }
  if (transformer) {
    return transformer(val) as V;
  }
  return val as V;
}

export function shouldChange(
  fields: Set<IRegisterParams>,
  name: string | null,
  onChangeOptOut?: string[] | string,
): boolean {
  if (!name || onChangeOptOut === 'all' || onChangeOptOut === name) {
    return false;
  }
  if (onChangeOptOut instanceof Array && onChangeOptOut.includes(name)) {
    return false;
  }
  return ![...fields].some(
    ({ onChangeOptOut }) =>
      onChangeOptOut === name ||
      (onChangeOptOut instanceof Array && onChangeOptOut.includes(name)),
  );
}

export function getTransformers(
  fields: Set<IRegisterParams>,
  transformers?: ITransformers,
): ITransformers | undefined {
  return [...fields].reduce((acc, { transformers }) => {
    return { ...acc, ...transformers };
  }, transformers);
}

export function getDefaultValues(
  fields: Set<IRegisterParams>,
  defaultValues: Record<string, unknown>,
): Record<string, unknown> {
  return [...fields].reduce((acc, { defaultValues }) => {
    return { ...acc, ...defaultValues };
  }, defaultValues);
}
