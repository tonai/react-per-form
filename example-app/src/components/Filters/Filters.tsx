import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IFormMode } from 'react-form-validation';
import './Filters.css';

interface IFiltersProps {
  mode: IFormMode;
  setMode: Dispatch<SetStateAction<IFormMode>>;
  setUseNativeValidation: Dispatch<SetStateAction<boolean>>;
  useNativeValidation: boolean;
}

export default function Filters(props: IFiltersProps) {
  const { mode, setMode, setUseNativeValidation, useNativeValidation } = props;

  function handleMode(event: ChangeEvent<HTMLSelectElement>) {
    setMode(event.target.value as IFormMode);
  }

  function handleUseNativeValidation(event: ChangeEvent<HTMLInputElement>) {
    setUseNativeValidation(event.target.checked);
  }

  return (
    <div className="filters">
      <label>
        Mode:&nbsp;
        <select data-testid="mode" onChange={handleMode} value={mode}>
          <option value="none">none</option>
          <option value="fix">fix</option>
          <option value="blur">blur</option>
          <option value="change">change</option>
          <option value="check">check</option>
          {/* <option value="force">force</option> */}
        </select>
      </label>
      <label>
        Use native validation:&nbsp;
        <input
          checked={useNativeValidation}
          data-testid="useNativeValidation"
          onChange={handleUseNativeValidation}
          type="checkbox"
        />
      </label>
    </div>
  );
}
