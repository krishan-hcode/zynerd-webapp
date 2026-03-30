import ExploreDataTable, {
  type ExploreDataTableColumn,
} from '@/common/table/ExploreDataTable';
import ExploreTablePagination from '@/common/table/ExploreTablePagination';
import type {ICounselling, ICounsellingListProps} from '@/types/counsellings.types';
import {classNames} from '@/utils/utils';
import {
  AcademicCapIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useRef} from 'react';

const CounsellingList = ({
  counsellings,
  totalCount,
  viewMode,
  onViewModeChange,
  hasMore,
  onLoadMore,
  currentPage,
  pageSize,
  onPageChange,
}: ICounsellingListProps) => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      {rootMargin: '200px'},
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [viewMode, hasMore, onLoadMore]);

  const counsellingColumns = useMemo<ExploreDataTableColumn<ICounselling>[]>(
    () => [
      {
        id: 'counselling',
        header: 'Counselling',
        thClassName: 'min-w-[12rem] w-[32%]',
        cell: row => (
          <p className="text-sm font-inter font-semibold text-primary-dark line-clamp-2">
            {row.name}
          </p>
        ),
      },
      {
        id: 'details',
        header: 'Details',
        thClassName: 'w-[68%]',
        cell: row => (
          <p className="text-xs font-inter text-customGray-60 line-clamp-3 leading-relaxed">
            {row.subtitle}
          </p>
        ),
      },
    ],
    [],
  );

  if (counsellings.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AcademicCapIcon className="h-12 w-12 mx-auto text-customGray-50/70" />
        <p className="mt-3 font-inter text-sm text-customGray-50">
          No counsellings found for selected filters.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 mt-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 rounded-2xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/40 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm sm:text-base text-primary-dark font-inter font-semibold">
              {totalCount} counsellings found
            </p>
            <div className="inline-flex items-center rounded-xl border border-customGray-10 bg-white p-1">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={classNames(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-inter transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-blue text-white'
                    : 'text-primary-dark hover:bg-customGray-5',
                )}>
                <Squares2X2Icon className="h-4 w-4" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={classNames(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-inter transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-blue text-white'
                    : 'text-primary-dark hover:bg-customGray-5',
                )}>
                <ListBulletIcon className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {counsellings.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push(`/explore/counsellings/${item.slug}`)}
                  className="rounded-2xl border border-customGray-10 bg-white p-4 text-left hover:border-primary-blue/30 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <AcademicCapIcon className="h-5 w-5 text-customGray-50 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-inter font-semibold text-primary-dark line-clamp-2">
                        {item.name}
                      </p>
                      <p className="mt-2 text-xs font-inter text-customGray-60 line-clamp-3 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {hasMore && <div ref={loadMoreRef} className="h-8" aria-hidden />}
          </>
        ) : (
          <>
            <ExploreDataTable<ICounselling>
              data={counsellings}
              columns={counsellingColumns}
              getRowKey={row => String(row.id)}
              minWidthClassName="min-w-[640px]"
              tableClassName="table-fixed"
              headerVariant="exploreMuted"
              onRowClick={row => void router.push(`/explore/counsellings/${row.slug}`)}
            />
            <ExploreTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default CounsellingList;
