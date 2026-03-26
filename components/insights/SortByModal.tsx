import Modal from '@/common/Modal';
import { COLUMN_HEADERS, getDynamicCrLabel } from '@/insights/insightsFilter.types';
import type { DisplayedFieldKey } from '@/insights/insightsFilter.types';
import { classNames } from '@/utils/utils';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export type SortByOption = 'default' | DisplayedFieldKey;

interface SortByModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: SortByOption;
  allowedFieldKeys: DisplayedFieldKey[];
  onApply: (option: SortByOption) => void;
}

export default function SortByModal({
  isOpen,
  onClose,
  selectedOption,
  allowedFieldKeys,
  onApply,
}: SortByModalProps) {
  const sortOptions: { value: SortByOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    ...allowedFieldKeys.map(key => ({
      value: key as SortByOption,
      label:
        key in COLUMN_HEADERS
          ? COLUMN_HEADERS[key as keyof typeof COLUMN_HEADERS]
          : getDynamicCrLabel(key),
    })),
  ];
  const [pendingOption, setPendingOption] = useState<SortByOption>(selectedOption);
  const { isPremiumPurchased } = usePremiumStatus();
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
      containerAdditionalClasses="max-w-sm max-h-[70vh] !p-0 sm:!p-0 m-0"
    >
      <div className="shrink-0 p-4">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          Sort by
        </h2>
      </div>
      <div className="mx-4" style={{ scrollbarGutter: 'stable' }}>
        <div
          className={classNames(
            'mb-5',
            sortOptions.length > 5
              ? 'grid grid-cols-2 gap-2'
              : 'space-y-2',
          )}
        >
          {sortOptions.map(option => (
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
        <div className="sticky bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-customGray-10">
          <button
            type="button"
            disabled={!isPremiumPurchased}
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-blue text-white font-inter text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >

            {!isPremiumPurchased && (
              <LockClosedIcon className="h-4 w-4" aria-hidden />
            )}
            Apply
          </button>
        </div>

      </div>

    </Modal>
  );
}
