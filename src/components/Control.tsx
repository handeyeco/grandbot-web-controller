import { CCControl } from "../type";

type Props = {
  control: CCControl;
  onChange: (value: number) => void;
};

export default function Control(props: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(e.target.value);
    props.onChange(newValue);
  }

  return (
    <label>
      {props.control.name}
      <input
        type="range"
        min="0"
        max="127"
        step="1"
        value={props.control.value || 0}
        onChange={handleChange}
      />
    </label>
  );
}
