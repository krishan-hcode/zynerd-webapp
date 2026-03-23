import Modal from '@/common/Modal';
import { COLUMN_HEADERS, COLUMN_ORDER } from '@/insights/insightsFilter.types';
import type { DisplayedFieldKey } from '@/insights/insightsFilter.types';
import { classNames } from '@/utils/utils';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export type SortByOption = 'default' | DisplayedFieldKey;

const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  ...COLUMN_ORDER.map(key => ({ value: key as SortByOption, label: COLUMN_HEADERS[key] })),
];

interface SortByModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: SortByOption;
  onApply: (option: SortByOption) => void;
}

export default function SortByModal({
  isOpen,
  onClose,
  selectedOption,
  onApply,
}: SortByModalProps) {
  const [pendingOption, setPendingOption] = useState<SortByOption>(selectedOption);

  useEffect(() => {
    if (isOpen) {
      setPendingOption(selectedOption);
    }
  }, [isOpen, selectedOption]);

  const handleApply = () => {
    onApply(pendingOption);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon
      containerAdditionalClasses="max-w-sm"
    >
      <div className="pr-8">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          Sort by
        </h2>
      </div>
      <div
        className={classNames(
          'mt-4 max-h-[50vh] overflow-y-auto',
          SORT_OPTIONS.length > 5
            ? 'grid grid-cols-2 gap-2'
            : 'space-y-2',
        )}
      >
        {SORT_OPTIONS.map(option => (
          <label
            key={option.value}
            className={classNames(
              'flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors shadow-sm',
              pendingOption === option.value
                ? 'border-primary-blue bg-primary-blue/5'
                : 'border-customGray-10 hover:bg-customGray-5',
            )}
          >
            <input
              type="radio"
              name="sortBy"
              value={option.value}
              checked={pendingOption === option.value}
              onChange={() => setPendingOption(option.value)}
              className="sr-only"
              aria-label={option.label}
            />
            <span
              className={classNames(
                'h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center shadow-lg',
                pendingOption === option.value
                  ? 'border-primary-blue bg-primary-blue'
                  : 'border-customGray-50 bg-white',
              )}
            >
              {pendingOption === option.value && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
            <span className="text-xs font-inter text-primary-dark">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-blue text-white font-inter text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <LockClosedIcon className="h-4 w-4" aria-hidden />
          Apply
        </button>
      </div>
    </Modal>
  );
}
