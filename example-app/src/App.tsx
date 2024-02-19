import { ChangeEvent, useState } from 'react';
import { IFormMode } from 'react-form-validation';
// import HookForm from './components/HookForm/HookForm';
import NativeForm from './components/NativeForm/NativeForm';
import './App.css';

function App() {
  const [mode, setMode] = useState<IFormMode>('none');
  const [useNativeValidation, setUseNativeValidation] = useState(true);

  function handleMode(event: ChangeEvent<HTMLSelectElement>) {
    setMode(event.target.value as IFormMode);
  }

  function handleUseNativeValidation(event: ChangeEvent<HTMLInputElement>) {
    setUseNativeValidation(event.target.checked);
  }

  return (
    <div className="app">
      <div className="app__filters">
        <label>
          Mode:&nbsp;
          <select onChange={handleMode} value={mode}>
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
            onChange={handleUseNativeValidation}
            type="checkbox"
          />
        </label>
      </div>
      {/* <HookForm
        mode={mode}
        onSubmit={() => console.log('Submit!')}
        useNativeValidation={useNativeValidation}
      /> */}
      <NativeForm
        mode={mode}
        onSubmit={() => console.log('Submit!')}
        useNativeValidation={useNativeValidation}
      />
    </div>
  );
}

export default App;
