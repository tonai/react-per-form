import type { ReactElement } from 'react';

export default function Required(): ReactElement {
  return (
    <b style={{ color: 'red', cursor: 'help' }} title="Required">
      *
    </b>
  );
}
