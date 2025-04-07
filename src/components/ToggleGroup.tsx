import "./ToggleGroup.css";

interface ToggleGroupProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; ariaLabel?: string }[];
  name: string;
  title?: string;
}

export default function ToggleGroup<T>({ value, onChange, options, name, title }: ToggleGroupProps<T>) {
  return (
    <div className="toggle-group-container">
      {title && <div className="toggle-group-title">{title}</div>}
      <div className="toggle-group">
        {options.map((option) => (
          <label key={String(option.value)} className="toggle-button">
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => {
                onChange(option.value);
              }}
              aria-label={option.ariaLabel ?? option.label}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 