import type { ISubscriber } from '../types';

import { useContext, useEffect } from 'react';

import { formContext } from '../contexts';

export function useSubscribe(callback: ISubscriber): void {
  const context = useContext(formContext);
  const { subscribe } = context;
  useEffect(() => {
    return subscribe(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);
}
