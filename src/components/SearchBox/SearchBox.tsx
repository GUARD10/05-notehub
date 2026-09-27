import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="search"
      aria-label="Search notes"
      placeholder="Search notes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
