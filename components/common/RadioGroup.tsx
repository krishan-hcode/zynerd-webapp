import { classNames } from '@/utils/utils';

export interface RadioOption<T extends string = string> {
  value: T;
  label?: string;
}

interface RadioGroupProps<T extends string> {
  label: string;
  options: RadioOption<T>[] | T[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
}

export default function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  name = 'radio-group',
}: RadioGroupProps<T>) {
  const normalizedOptions: RadioOption<T>[] = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  );

  return (
    <div>
      <label className="block text-xs font-medium text-primary-blue font-inter mb-2">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {normalizedOptions.map(({ value: optValue, label: optLabel }) => (
          <label
            key={optValue}
            className={classNames(
              'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-inter',
              value === optValue
                ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                : 'border-customGray-10 hover:bg-customGray-5',
            )}
          >
            <input
              type="radio"
              name={name}
              value={optValue}
              checked={value === optValue}
              onChange={() => onChange(optValue)}
              className="sr-only text-xs"
            />
            {optLabel ?? optValue}
          </label>
        ))}
      </div>
    </div>
  );
}
