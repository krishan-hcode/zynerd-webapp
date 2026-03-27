import type { DisplayedFieldKey, DisplayedFields } from '@/insights/insightsFilter.types';
import { COLUMN_HEADERS, getDynamicCrLabel } from '@/insights/insightsFilter.types';
import type { SortByOption } from '@/insights/SortByModal';
import type { SortDirection } from '@/insights/insightsSortUtils';
import type { ICounselling } from '@/types/counsellings.types';
import type { IInsightRecord } from '@/types/insights.types';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import type { ReactNode } from 'react';
import type { RankView } from '@/insights/InsightsToolbar';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HeartIcon as HeartIconOutline,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { classNames } from '@/utils/utils';

const PAGE_SIZE = 20;

function RemarksHoverHint({
  children,
  tooltipText,
}: {
  children: ReactNode;
  tooltipText?: string;
}) {
  return (
    <span className="group relative  items-center">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-0 z-50 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-primary-blue/20 bg-white px-3 py-2 text-xxs font-interMedium text-primary-blue shadow-sm group-hover:block"
      >
        {tooltipText ?? 'Click to check out additional remarks under Factors and Details'}
      </span>
    </span>
  );
}

function getCellValue(
  record: IInsightRecord,
  key: DisplayedFieldKey,
  rankView: RankView,
): ReactNode {
  if (/^cr_\d{4}_\d+$/.test(key)) {
    const valueKey =
      rankView === 'stateRank'
        ? (key.replace(/^cr_/, 'crState_') as keyof IInsightRecord)
        : (key as keyof IInsightRecord);
    const value = record[valueKey];
    if (Array.isArray(value)) {
      if (value.length === 0) return '—';
      return <span className="text-primary-blue text-xs hover:underline">{value[value.length - 1]}({value.length})</span>;
    }
    return value ? <span className="text-primary-blue text-xs hover:underline">{value}</span> : '-'
  }

  switch (key) {
    case 'round':
      return record.round;
    case 'stateRank':
      return record.stateRank ?? '—';
    case 'aiRank':
      return record.aiRank ?? '—';
    case 'seats':
      return record.seats ?? '—';
    case 'state':
      return record.state;
    case 'institute':
      return (
        <RemarksHoverHint tooltipText={record.instituteDisplayName}>
          <span className="text-primary-blue hover:underline">
            {record.institute ?? record.instituteDisplayName}
          </span>
        </RemarksHoverHint>
      );
    case 'course':
      return (
        <RemarksHoverHint tooltipText={record.courseDisplayName}>
          <span>{record.course ?? record.courseDisplayName}</span>
        </RemarksHoverHint>
      );
    case 'quota':
      return record.quota;
    case 'category':
      return record.category;
    case 'fee':
      if (!record.fee) return '—';
      // Dataset may still contain an old trailing `*`; we re-derive it from remark presence.
      // `feeRemarks` is the source of truth for showing `*` now.
      {
        const feeValue = String(record.fee).replace(/\*+$/g, '');
        if (!record.feeRemarks) return feeValue;
        return (
          <RemarksHoverHint>
            <span>
              {feeValue}
              *
            </span>
          </RemarksHoverHint>
        );
      }
    case 'beds':
      return record.beds;
    case 'bondYears':
      return record.bondYears;
    case 'bondPenalty':
      if (!record.bondPenalty || record.bondPenalty === '—') return '—';
      {
        const bondPenaltyValue = String(record.bondPenalty).replace(/\*+$/g, '');
        if (!record.bondPenaltyRemarks) return bondPenaltyValue;
        return (
          <RemarksHoverHint>
            <span>
              {bondPenaltyValue}
              *
            </span>
          </RemarksHoverHint>
        );
      }
    case 'stipendYear1':
      if (!record.stipendYear1 || record.stipendYear1 === '—') return '—';
      {
        const stipendValue = String(record.stipendYear1).replace(/\*+$/g, '');
        if (!record.stipendYear1Remarks) return stipendValue;
        return (
          <RemarksHoverHint>
            <span>
              {stipendValue}
              *
            </span>
          </RemarksHoverHint>
        );
      }
    default:
      return null;
  }
}

interface InsightsRecordsTableProps {
  selectedCounselling: ICounselling | null;
  records: IInsightRecord[];
  displayedFields?: DisplayedFields;
  allowedFieldKeys?: DisplayedFieldKey[];
  sessionYear?: string;
  rankView?: RankView;
  sortBy?: SortByOption;
  sortDirection?: SortDirection;
  onColumnHeaderClick?: (columnKey: string) => void;
  onCellClick?: (record: IInsightRecord, fieldKey: DisplayedFieldKey) => void;
  isChoiceListSelected?: (recordId: string) => boolean;
  getChoiceListCount?: (recordId: string) => number;
  showChoiceListCountBadge?: boolean;
  onChoiceListClick?: (record: IInsightRecord) => void;
}

export default function InsightsRecordsTable({
  selectedCounselling,
  records,
  displayedFields,
  allowedFieldKeys = [],
  sessionYear,
  rankView = 'stateRank',
  sortBy = 'default',
  sortDirection = 'asc',
  onColumnHeaderClick,
  onCellClick,
  isChoiceListSelected,
  getChoiceListCount,
  showChoiceListCountBadge = false,
  onChoiceListClick,
}: InsightsRecordsTableProps) {
  const { isPremiumPurchased } = usePremiumStatus();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  if (!selectedCounselling) {
    return (
      <div className="py-12 text-center text-customGray-50 font-inter text-sm">
        Select a counselling to view records.
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="py-12 text-center text-customGray-50 font-inter text-sm">
        No records found for this counselling.
      </div>
    );
  }

  const visibleColumns = (displayedFields
    ? allowedFieldKeys.filter(key => displayedFields[key] !== false)
    : allowedFieldKeys).filter(key => {
      if (key === 'stateRank') return rankView === 'stateRank';
      if (key === 'aiRank') return rankView === 'aiRank';
      return true;
    });

  const recordsToShow = isPremiumPurchased ? records : records.slice(0, 3);
  const totalPages = Math.ceil(recordsToShow.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, recordsToShow.length);
  const paginatedRecords = recordsToShow.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-customGray-10 bg-white shadow-sm">

        <div className="max-h-[60vh] overflow-x-auto overflow-y-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left font-inter text-sm">
            <thead className="sticky top-0 z-30 border-b border-primary-blue/20 bg-gradient-to-r from-primary-blue to-[#355da8]">
              <tr>
                {visibleColumns.map((key: DisplayedFieldKey) => {
                  const isSorted = sortBy === key;
                  return (
                    <th
                      key={key}
                      className={classNames(
                        'px-4 py-3 text-xs font-semibold text-white whitespace-nowrap',
                        onColumnHeaderClick ? 'cursor-pointer select-none  transition-colors' : '',
                      )}
                      onClick={() => { if (typeof key === 'string') onColumnHeaderClick?.(key); }}
                      scope="col"
                    >
                      <div className='flex flex-row items-center justify-between'>
                        <span className="inline-flex items-center gap-1">
                          {key in COLUMN_HEADERS
                            ? COLUMN_HEADERS[key as keyof typeof COLUMN_HEADERS]
                            : getDynamicCrLabel(key)}

                        </span>
                        {isSorted && (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="h-3 w-3 text-white" aria-hidden />
                          ) : (
                            <ChevronDownIcon className="h-3 w-3 text-white" aria-hidden />
                          )
                        )}
                      </div>
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-center text-xs font-semibold text-white whitespace-nowrap" scope="col">
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map(record => (
                <tr
                  key={record.id}
                  className="cursor-pointer border-b border-customGray-10/80 transition-colors hover:bg-primary-blue/5"
                >
                  {visibleColumns.map(key => (
                    <td
                      key={key}
                      className="cursor-pointer whitespace-nowrap px-4 py-2.5 text-xs text-primary-dark"
                      onClick={() => onCellClick?.(record, key)}
                    >
                      {getCellValue(record, key, rankView)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    {(() => {
                      const count = getChoiceListCount?.(record.id) ?? 0;
                      const isSelected = isChoiceListSelected?.(record.id) ?? false;
                      const shouldShowBadge = showChoiceListCountBadge && count > 1;
                      return (
                        <button
                          type="button"
                          onClick={event => {
                            event.stopPropagation();
                            onChoiceListClick?.(record);
                          }}
                          className="relative inline-flex items-center justify-center rounded-full transition-transform hover:scale-105"
                          aria-label="Add to choice list"
                        >
                          {isSelected ? (
                            <HeartIconSolid className="h-7 w-7 text-secondary-lightRed" />
                          ) : (
                            <HeartIconOutline className="h-7 w-7 text-secondary-lightRed/40" />
                          )}
                          {shouldShowBadge ? (
                            <span className="absolute bottom-[2px] right-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-secondary-lightRed p-1 text-[8px] font-semibold text-white shadow-sm">
                              {count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-customGray-10 bg-customGray-3/30 px-4 py-3">
        <p className="text-xxs font-inter text-customGray-60">
          Showing {startIndex + 1}–{endIndex} of {recordsToShow.length} records in {sessionYear} session
        </p>        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
              currentPage <= 1
                ? 'cursor-not-allowed border-customGray-10 bg-customGray-5 text-customGray-40'
                : 'border-customGray-10 bg-white text-primary-dark shadow-sm hover:border-primary-blue/30 hover:bg-primary-blue/5',
            )}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <span className="rounded-md bg-white px-2.5 py-1.5 text-xs text-customGray-60 font-inter border border-customGray-10">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
              currentPage >= totalPages
                ? 'cursor-not-allowed border-customGray-10 bg-customGray-5 text-customGray-40'
                : 'border-customGray-10 bg-white text-primary-dark shadow-sm hover:border-primary-blue/30 hover:bg-primary-blue/5',
            )}
            aria-label="Next page"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
