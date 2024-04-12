import { useEffect, useState } from 'react';

export function useData(): string {
  const [data, setData] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setData('Asynchronous value'), 1000);
    return () => clearTimeout(timer);
  });

  return data;
}
