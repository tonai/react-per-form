import { type FormEvent, useId } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo() {
  const id = useId();
  const safeId = id.replace(/:/g, '\\:');
  const css = `#${safeId} input:valid {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.8);
  border-radius: 2px;
}
#${safeId} input:invalid {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.8);
  border-radius: 2px;
}`;

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation: false,
  });

  return (
    <form {...formProps} id={id}>
      <style>{css}</style>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
