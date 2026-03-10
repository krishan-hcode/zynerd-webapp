export interface NumberRangeInputProps {
  label: string;
  minValue: number | '';
  maxValue: number | '';
  onMinChange: (value: number | '') => void;
  onMaxChange: (value: number | '') => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  min?: number;
}

export default function NumberRangeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = '0',
  maxPlaceholder = '10000',
  min = 0,
}: NumberRangeInputProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onMinChange(raw === '' ? '' : Number(raw));
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onMaxChange(raw === '' ? '' : Number(raw));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-primary-dark font-inter mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          value={minValue === '' ? '' : minValue}
          onChange={handleMinChange}
          placeholder={minPlaceholder}
          className="w-full px-3 py-2 rounded-lg border border-customGray-10 text-sm font-inter"
        />
        <span className="text-customGray-50">-</span>
        <input
          type="number"
          min={min}
          value={maxValue === '' ? '' : maxValue}
          onChange={handleMaxChange}
          placeholder={maxPlaceholder}
          className="w-full px-3 py-2 rounded-lg border border-customGray-10 text-sm font-inter"
        />
      </div>
    </div>
  );
}
