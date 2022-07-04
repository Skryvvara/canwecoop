import { ChangeEvent, FunctionComponent } from 'react';

interface Props {
  name: string;
  id?: string;
  checked: boolean;
  fn: (() => void) | ((event: ChangeEvent<HTMLInputElement>) => void);
  label?: string;
}

export const Checkbox: FunctionComponent<Props> = ({
  name,
  id,
  checked,
  fn,
  label,
}) => {
  return (
    <label htmlFor={id}>
      <input
        type="checkbox"
        checked={checked}
        name={name}
        id={id ?? name}
        onChange={fn}
      />
      {label ?? name}
    </label>
  );
};
