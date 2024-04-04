import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IFormMode, IFormRevalidateMode } from 'react-swift-form';
import './Filters.css';

interface IFiltersProps {
  mode: IFormMode;
  revalidateMode: IFormRevalidateMode;
  setMode: Dispatch<SetStateAction<IFormMode>>;
  setRevalidateMode: Dispatch<SetStateAction<IFormRevalidateMode>>;
  setUseNativeValidation: Dispatch<SetStateAction<boolean>>;
  useNativeValidation: boolean;
}

export default function Filters(props: IFiltersProps) {
  const {
    mode,
    revalidateMode,
    setMode,
    setRevalidateMode,
    setUseNativeValidation,
    useNativeValidation,
  } = props;

  function handleMode(event: ChangeEvent<HTMLSelectElement>) {
    setMode(event.target.value as IFormMode);
  }

  function handleRevalidateMode(event: ChangeEvent<HTMLSelectElement>) {
    setRevalidateMode(event.target.value as IFormRevalidateMode);
  }

  function handleUseNativeValidation(event: ChangeEvent<HTMLInputElement>) {
    setUseNativeValidation(event.target.checked);
  }

  return (
    <div className="filters">
      <label>
        Mode:&nbsp;
        <select data-testid="mode" onChange={handleMode} value={mode}>
          <option value="submit">submit</option>
          <option value="blur">blur</option>
          <option value="change">change</option>
          <option value="all">all</option>
        </select>
      </label>
      <label>
        Revalidate Mode:&nbsp;
        <select
          data-testid="revalidate-mode"
          onChange={handleRevalidateMode}
          value={revalidateMode}
        >
          <option value="submit">submit</option>
          <option value="blur">blur</option>
          <option value="change">change</option>
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
