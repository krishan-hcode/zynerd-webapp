import { classNames } from '@/utils/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IExploreFilterSelectProps {
  label: string;
  selectedValue: string;
  options: string[];
  allLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export default function ExploreFilterSelect({
  label,
  selectedValue,
  options,
  allLabel,
  isOpen,
  onToggle,
  onClose,
  onSelect,
}: IExploreFilterSelectProps) {
  const inputTextClass = 'text-xs text-customGray-90';
  const optionTextClass = 'text-xs';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={classNames(
          'w-full h-11 px-4 rounded-xl bg-white border text-left font-inter shadow-sm transition-colors flex items-center justify-between gap-2',
          inputTextClass,
          selectedValue
            ? 'border-primary-blue'
            : 'border-customGray-10 hover:border-customGray-20',
        )}>
        <span className="truncate">{selectedValue || label}</span>
        <ChevronDownIcon className="h-4 w-4 text-customGray-50 flex-shrink-0" />
      </button>
      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={onClose}
            aria-label={`Close ${label} dropdown`}
          />
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-customGray-10 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onSelect('');
                onClose();
              }}
              className={classNames(
                'w-full px-4 py-2.5 text-left font-inter text-customGray-50 hover:bg-primary-blue/5 first:rounded-t-xl',
                optionTextClass,
              )}>
              {allLabel}
            </button>
            {options.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
                className={classNames(
                  'w-full px-4 py-2.5 text-left font-inter last:rounded-b-xl',
                  optionTextClass,
                  selectedValue === option
                    ? 'text-primary-blue bg-primary-blue/10'
                    : 'text-primary-dark hover:bg-primary-blue/5',
                )}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
