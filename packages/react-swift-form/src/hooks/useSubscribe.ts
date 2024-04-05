import type { ISubscriber } from '../types';

import { useContext, useEffect } from 'react';

import { formContext } from '../contexts';

export function useSubscribe(
  callback: ISubscriber,
  names?: string[] | string,
): void {
  const { subscribe } = useContext(formContext);

  useEffect(() => {
    return subscribe(callback, names);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);
}
