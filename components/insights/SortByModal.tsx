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
      containerAdditionalClasses="max-w-md max-h-[75vh] !p-0 sm:!p-0 m-0 rounded-2xl"
    >
      <div className="shrink-0 border-b border-customGray-10 bg-gradient-to-r from-white to-customGray-3/40 px-5 py-4">
        <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
          Table Configuration
        </p>
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          Sort by
        </h2>
      </div>
      <div className="mx-5 mt-4" style={{ scrollbarGutter: 'stable' }}>
        <div
          className={classNames(
            'mb-5 rounded-2xl border border-customGray-10 bg-customGray-3/40 p-2',
            sortOptions.length > 5
              ? 'grid grid-cols-2 gap-2'
              : 'space-y-2',
          )}
        >
          {sortOptions.map(option => (
            <label
              key={option.value}
              className={classNames(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all',
                pendingOption === option.value
                  ? 'border-primary-blue/40 bg-primary-blue/5 shadow-sm'
                  : 'border-customGray-10 bg-white hover:border-primary-blue/20 hover:bg-customGray-3',
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
                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 shadow-sm',
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
        <div className="sticky bottom-0 left-0 right-0 z-10 mt-4 border-t border-customGray-10 bg-white px-5 py-4">
          <button
            type="button"
            disabled={!isPremiumPurchased}
            onClick={handleApply}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
