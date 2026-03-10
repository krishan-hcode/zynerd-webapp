interface CheckboxOption {
  key: string;
  label: string;
}

interface CheckboxGroupProps<T extends Record<string, boolean>> {
  label: string;
  options: CheckboxOption[];
  value: T;
  onChange: (next: T) => void;
}

export default function CheckboxGroup<T extends Record<string, boolean>>({
  label,
  options,
  value,
  onChange,
}: CheckboxGroupProps<T>) {
  return (
    <div>
      <label className="block text-xs font-medium text-primary-dark font-inter mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map(({ key, label: optionLabel }) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer text-sm font-inter"
          >
            <input
              type="checkbox"
              checked={Boolean(value[key])}
              onChange={e =>
                onChange({ ...value, [key]: e.target.checked } as T)
              }
              className="rounded border-customGray-10"
            />
            {optionLabel}
          </label>
        ))}
      </div>
    </div>
  );
}
