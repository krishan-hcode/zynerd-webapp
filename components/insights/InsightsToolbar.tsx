import SortByModal, { type SortByOption } from '@/insights/SortByModal';
import { classNames } from '@/utils/utils';
import {
  BarsArrowDownIcon,
  FunnelIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export type RankView = 'stateRank' | 'aiRank';

interface InsightsToolbarProps {
  rankView: RankView;
  onRankViewChange: (view: RankView) => void;
  sortBy: SortByOption;
  onSortChange: (option: SortByOption) => void;
  onOpenFiltersModal?: () => void;
}

export default function InsightsToolbar({
  rankView,
  onRankViewChange,
  sortBy,
  onSortChange,
  onOpenFiltersModal,
}: InsightsToolbarProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-nowrap justify-between items-end gap-2 mb-4 mt-10 overflow-x-auto min-w-0">
        <div>
          <p className="text-xs text-customGray-50 font-inter whitespace-nowrap flex-shrink-0">
            Click on the record for detailed information and factors.
          </p>
          <p className="text-xs text-customGray-50 font-inter whitespace-nowrap flex-shrink-0">
            (*) Indicates additional remarks in Details &amp; Factors.
          </p>
        </div>
        <div className='flex flex-col gap-2 items-end'>
          <select
            className="px-2 py-3 rounded-lg border border-customGray-10 shadow-sm text-primary-dark font-inter text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/20 flex-shrink-0"
            defaultValue=""
            aria-label="Select filter"
          >
            <option value="">Select filter</option>
          </select>
          <div className="flex flex-shrink-0 items-center gap-3 ml-1">


            <div className="flex rounded-lg border border-customGray-10 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => onRankViewChange('stateRank')}
                className={classNames(
                  'px-3 py-3 text-xs font-inter font-medium transition-colors whitespace-nowrap',
                  rankView === 'stateRank'
                    ? 'bg-primary-blue text-white'
                    : 'bg-white text-primary-dark hover:bg-customGray-5',
                )}
              >
                State Rank
              </button>
              <button
                type="button"
                onClick={() => onRankViewChange('aiRank')}
                className={classNames(
                  'px-3 py-3 text-xs font-inter font-medium transition-colors whitespace-nowrap',
                  rankView === 'aiRank'
                    ? 'bg-primary-blue text-white'
                    : 'bg-white text-primary-dark hover:bg-customGray-5',
                )}
              >
                All India Rank
              </button>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-customGray-10 shadow-sm text-primary-dark font-inter text-xs hover:bg-customGray-5 transition-colors whitespace-nowrap"
            >
              <HeartIcon className="h-3 w-3 flex-shrink-0" />
              <div className='flex flex-col items-start'>
                <p className='text-[10px] text-customGray-50 font-inter whitespace-nowrap'>
                  <span className='text-primary-dark font-medium'>Choice List</span>
                </p>
                <p className='text-xs text-customGray-50 font-inter whitespace-nowrap'>
                  <span className='text-primary-dark font-medium'>Ask every time</span>
                </p>
              </div>

            </button>

            <button
              type="button"
              onClick={() => setIsSortModalOpen(true)}
              className="inline-flex items-center gap-2 px-2 py-3 rounded-lg border border-customGray-10 shadow-sm text-primary-dark font-inter text-xs hover:bg-customGray-5 transition-colors whitespace-nowrap"
            >
              <BarsArrowDownIcon className="h-4 w-4 flex-shrink-0" />
              Sort
            </button>
            <button
              type="button"
              onClick={() => onOpenFiltersModal?.()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-customGray-10 shadow-sm text-primary-dark font-inter text-xs hover:bg-customGray-5 transition-colors whitespace-nowrap"
            >
              <FunnelIcon className="h-4 w-4 flex-shrink-0" />
              Filter
            </button>
          </div>
        </div>
      </div>
      <SortByModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedOption={sortBy}
        onApply={option => onSortChange(option)}
      />
    </>
  );
}
