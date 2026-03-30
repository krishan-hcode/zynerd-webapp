import type { IInstitute, IInstitutesListProps } from '@/types/institutes.types';
import ExploreDataTable, {
  type ExploreDataTableColumn,
} from '@/common/table/ExploreDataTable';
import ExploreTablePagination from '@/common/table/ExploreTablePagination';
import { classNames } from '@/utils/utils';
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  ListBulletIcon,
  MapPinIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import InstituteCard from './InstituteCard';
import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

const InstitutesList = ({
  institutes,
  totalCount,
  viewMode,
  onViewModeChange,
  hasMore,
  onLoadMore,
  currentPage,
  pageSize,
  onPageChange,
}: IInstitutesListProps) => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (viewMode !== 'grid' || !hasMore || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [viewMode, hasMore, onLoadMore]);

  const instituteColumns = useMemo<ExploreDataTableColumn<IInstitute>[]>(
    () => [
      {
        id: 'institute',
        header: 'Institute',
        thClassName: 'min-w-[12rem] w-[15%]',
        cell: row => (
          <div className="min-w-0">
            <p className="text-sm font-inter font-semibold text-primary-dark truncate">{row.name}</p>
            <p className="text-xs text-customGray-50 mt-0.5 truncate">{row.university}</p>
          </div>
        ),
      },
      {
        id: 'location',
        header: 'Location',
        thClassName: 'w-[10%]',
        cell: row => (
          <div className="flex items-center gap-1.5 text-customGray-60">
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-inter truncate">
              {row.city}, {row.state}
            </span>
          </div>
        ),
      },
      {
        id: 'type',
        header: 'Type',
        thClassName: 'w-[10%]',
        cell: row => (
          <div className="flex items-center gap-1.5 text-customGray-60">
            <BuildingOffice2Icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-inter truncate">{row.instituteType}</span>
          </div>
        ),
      },
      {
        id: 'authority',
        header: 'Authority',
        thClassName: 'w-[10%]',
        cell: row => (
          <div className="flex items-center gap-1.5 text-customGray-60">
            <ShieldCheckIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-inter truncate">{row.authority}</span>
          </div>
        ),
      },
      {
        id: 'beds',
        header: 'Beds',
        thClassName: 'w-[7%]',
        cell: row => (
          <div className="flex items-center gap-1.5 text-customGray-60">
            <BuildingOfficeIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-inter truncate">{row.beds}</span>
          </div>
        ),
      },
      {
        id: 'local',
        header: 'Local',
        thClassName: 'w-[7%]',
        cell: row => (
          <div className="flex items-center gap-1.5 text-customGray-60">
            <HomeModernIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-inter truncate">{row.localDistinction}</span>
          </div>
        ),
      },
    ],
    [],
  );

  if (institutes.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BuildingOffice2Icon className="h-12 w-12 mx-auto text-customGray-50/70" />
        <p className="mt-3 font-inter text-sm text-customGray-50">
          No institutes found for selected filters.
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
              {totalCount} institutes found
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {institutes.map(institute => (
                <InstituteCard key={institute.id} institute={institute} viewMode={viewMode} />
              ))}
            </div>
            {hasMore && <div ref={loadMoreRef} className="h-8" aria-hidden />}
          </>
        ) : (
          <>
            <ExploreDataTable<IInstitute>
              data={institutes}
              columns={instituteColumns}
              getRowKey={row => String(row.id)}
              minWidthClassName="min-w-[980px]"
              tableClassName="table-fixed"
              headerVariant="exploreMuted"
              onRowClick={row => void router.push(`/explore/institutes/${row.slug}`)}
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

export default InstitutesList;
