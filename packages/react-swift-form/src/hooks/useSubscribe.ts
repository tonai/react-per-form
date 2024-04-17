import type { IStateSubscriber } from '../types';

import { useContext, useEffect } from 'react';

import { formContext } from '../contexts';

export function useSubscribe(callback: IStateSubscriber): void {
  const { subscribe } = useContext(formContext);

  useEffect(() => {
    return subscribe(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);
}
