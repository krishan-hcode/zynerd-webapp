import { classNames } from '@/utils/utils';

interface ToggleButtonGroupProps<T> {
  label: string;
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  getKey?: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
}

export default function ToggleButtonGroup<T>({
  label,
  options,
  value,
  onChange,
  getKey = (x: T) => String(x),
  renderOption = (x: T) => String(x),
}: ToggleButtonGroupProps<T>) {
  const toggle = (option: T) => {
    const key = getKey(option);
    const isSelected = value.some(v => getKey(v) === key);
    const next = isSelected
      ? value.filter(v => getKey(v) !== key)
      : [...value, option].sort((a, b) => {
        const idxA = options.findIndex(o => getKey(o) === getKey(a));
        const idxB = options.findIndex(o => getKey(o) === getKey(b));
        return idxA - idxB;
      });
    onChange(next);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-primary-blue font-inter mb-2">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {options.map(option => {
          const key = getKey(option);
          const isSelected = value.some(v => getKey(v) === key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(option)}
              className={classNames(
                'w-10 h-10 rounded-lg border text-xs font-inter font-medium transition-colors',
                isSelected
                  ? 'border-primary-blue bg-primary-blue text-white'
                  : 'border-customGray-10 hover:bg-customGray-5',
              )}
            >
              {renderOption(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
