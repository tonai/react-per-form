import type { IFormValues } from '../types';

import { useContext, useEffect, useState } from 'react';

import { formContext } from '../contexts';

export function useWatch<V extends IFormValues>(names?: string[] | string): V {
  const [values, setValues] = useState<V>({} as V);
  const context = useContext(formContext);
  const { watch } = context;

  useEffect(() => {
    return watch<V>(setValues, names);
  }, [names, watch]);

  return values;
}
