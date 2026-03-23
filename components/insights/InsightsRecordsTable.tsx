import type { DisplayedFieldKey, DisplayedFields } from '@/insights/insightsFilter.types';
import { COLUMN_HEADERS, COLUMN_ORDER } from '@/insights/insightsFilter.types';
import type { RankView } from '@/insights/InsightsToolbar';
import type { SortByOption } from '@/insights/SortByModal';
import type { SortDirection } from '@/insights/insightsSortUtils';
import type { ICounselling } from '@/types/counsellings.types';
import type { IInsightRecord } from '@/types/insights.types';
import type { ReactNode } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { classNames } from '@/utils/utils';

const PAGE_SIZE = 20;

function getCellValue(record: IInsightRecord, key: DisplayedFieldKey): ReactNode {
  switch (key) {
    case 'round':
      return record.round;
    case 'stateRank':
      return record.stateRank ?? '—';
    case 'aiRank':
      return record.aiRank ?? '—';
    case 'state':
      return record.state;
    case 'institute':
      return (
        <span className="text-primary-blue hover:underline">{record.institute}</span>
      );
    case 'course':
      return record.course;
    case 'quota':
      return record.quota;
    case 'category':
      return record.category;
    case 'fee':
      return record.fee;
    case 'beds':
      return record.beds;
    case 'bondYears':
      return record.bondYears;
    case 'bondPenalty':
      return record.bondPenalty;
    case 'stipendYear1':
      return record.stipendYear1;
    default:
      return null;
  }
}

interface InsightsRecordsTableProps {
  selectedCounselling: ICounselling | null;
  records: IInsightRecord[];
  displayedFields?: DisplayedFields;
  sessionYear?: string;
  rankView?: RankView;
  sortBy?: SortByOption;
  sortDirection?: SortDirection;
  onColumnHeaderClick?: (columnKey: string) => void;
}

export default function InsightsRecordsTable({
  selectedCounselling,
  records,
  displayedFields,
  sessionYear,
  rankView = 'stateRank',
  sortBy = 'default',
  sortDirection = 'asc',
  onColumnHeaderClick,
}: InsightsRecordsTableProps) {
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
    ? COLUMN_ORDER.filter(key => displayedFields[key] !== false)
    : COLUMN_ORDER
  ).filter(key => {
    if (key === 'stateRank') return rankView === 'stateRank';
    if (key === 'aiRank') return rankView === 'aiRank';
    return true;
  });

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, records.length);
  const paginatedRecords = records.slice(startIndex, endIndex);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto max-h-[50vh] overflow-y-auto rounded-lg border border-customGray-10 shadow-sm">
        <table className="w-full min-w-[900px] text-left font-inter text-sm">
          <thead className="sticky top-0 bg-customGray-5 border-b border-customGray-10">
            <tr>
              {visibleColumns.map((key: DisplayedFieldKey) => {
                const isSorted = sortBy === key;
                return (
                  <th
                    key={key}
                    className={classNames(
                      'px-3 py-2 font-semibold text-primary-dark whitespace-nowrap',
                      onColumnHeaderClick ? 'cursor-pointer select-none hover:bg-customGray-10 transition-colors' : '',
                    )}
                    onClick={() => { if (typeof key === 'string') onColumnHeaderClick?.(key); }}
                    scope="col"
                  >
                    <span className="inline-flex items-center gap-1">
                      {COLUMN_HEADERS[key]}
                      {isSorted && (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                        )
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map(record => (
              <tr
                key={record.id}
                className="border-b border-customGray-10 hover:bg-customGray-5 transition-colors cursor-pointer"
              >
                {visibleColumns.map(key => (
                  <td
                    key={key}
                    className="px-3 py-2 text-primary-dark whitespace-nowrap"
                  >
                    {getCellValue(record, key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xxs text-customGray-50 font-inter">
          Showing {startIndex + 1}–{endIndex} of {records.length} records in {sessionYear} session
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className={classNames(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
              currentPage <= 1
                ? 'cursor-not-allowed border-customGray-10 bg-customGray-5 text-customGray-40'
                : 'border-customGray-10 shadow-sm bg-white text-primary-dark hover:bg-customGray-5',
            )}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <span className="px-2 py-1.5 text-xs text-customGray-50 font-inter">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className={classNames(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
              currentPage >= totalPages
                ? 'cursor-not-allowed border-customGray-10 bg-customGray-5 text-customGray-40'
                : 'border-customGray-10 shadow-sm bg-white text-primary-dark hover:bg-customGray-5',
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
