import SortByModal, { type SortByOption } from '@/insights/SortByModal';
import type { DisplayedFieldKey, InsightsPageType } from '@/insights/insightsFilter.types';
import { classNames } from '@/utils/utils';
import {
  BarsArrowDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export type RankView = 'stateRank' | 'aiRank';

interface InsightsToolbarProps {
  rankView: RankView;
  onRankViewChange: (view: RankView) => void;
  showRankToggle?: boolean;
  pageTitle: InsightsPageType;
  sortBy: SortByOption;
  allowedFieldKeys: DisplayedFieldKey[];
  onSortChange: (option: SortByOption) => void;
  onOpenFiltersModal?: () => void;
  onOpenChoiceListModal?: () => void;
  choiceListModeLabel?: string;
}

export default function InsightsToolbar({
  rankView,
  onRankViewChange,
  showRankToggle = false,
  sortBy,
  allowedFieldKeys,
  onSortChange,
  pageTitle,
  onOpenFiltersModal,
  onOpenChoiceListModal,
  choiceListModeLabel = 'Ask every time',
}: InsightsToolbarProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  return (
    <>
      <div className="space-y-3">
        {showRankToggle && (
          <div className="rounded-2xl border border-customGray-10 bg-white p-3">
            <p className="mb-2 text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
              Rank Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onRankViewChange('stateRank')}
                className={classNames(
                  'rounded-xl px-3 py-2 text-xs font-inter font-medium transition-colors',
                  rankView === 'stateRank'
                    ? 'bg-primary-blue text-white'
                    : 'border border-customGray-10 bg-white text-primary-dark hover:bg-customGray-5',
                )}
              >
                State Rank
              </button>
              <button
                type="button"
                onClick={() => onRankViewChange('aiRank')}
                className={classNames(
                  'rounded-xl px-3 py-2 text-xs font-inter font-medium transition-colors whitespace-nowrap',
                  rankView === 'aiRank'
                    ? 'bg-primary-blue text-white'
                    : 'border border-customGray-10 bg-white text-primary-dark hover:bg-customGray-5',
                )}
              >
                All India Rank
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpenChoiceListModal?.()}
          className={classNames(
            'inline-flex w-full items-center gap-2 rounded-2xl border border-customGray-10 bg-white px-3 py-3 text-left text-xs font-inter text-primary-dark transition-colors',
            choiceListModeLabel != 'Ask every time'
              ? 'border-secondary-lightRed/25 bg-secondary-lightRed/5'
              : 'hover:border-primary-blue/20 hover:bg-customGray-3',
          )}
        >
          <div className="rounded-full bg-secondary-lightRed/15 p-1.5">
            <HeartIcon className="h-3.5 w-3.5 flex-shrink-0 text-secondary-lightRed" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[9px] text-customGray-50 font-inter whitespace-nowrap">
              <span className="font-medium text-customGray-60">Choice List Mode</span>
            </p>
            <p className="text-xs text-customGray-50 font-inter whitespace-nowrap">
              <span className="font-medium text-primary-dark">{choiceListModeLabel}</span>
            </p>
          </div>
        </button>
        <div className="rounded-2xl border border-customGray-10 bg-white p-3">
          <p className="mb-2 text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
            Sort and Filter
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsSortModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-customGray-10 bg-white px-3 py-2.5 text-xs font-inter text-primary-dark transition-colors hover:border-primary-blue/30 hover:bg-primary-blue/5"
            >
              <BarsArrowDownIcon className="h-4 w-4 flex-shrink-0" />
              Sort
            </button>
            <button
              type="button"
              onClick={() => onOpenFiltersModal?.()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-customGray-10 bg-white px-3 py-2.5 text-xs font-inter text-primary-dark transition-colors hover:border-primary-blue/30 hover:bg-primary-blue/5"
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
        allowedFieldKeys={allowedFieldKeys}
        onApply={option => onSortChange(option)}
      />
    </>
  );
}
