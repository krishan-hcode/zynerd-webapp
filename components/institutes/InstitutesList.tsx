import type { IInstitute, IInstitutesListProps } from '@/types/institutes.types';
import ExploreTablePagination from '@/common/table/ExploreTablePagination';
import ExploreTableShell from '@/common/table/ExploreTableShell';
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
import { useEffect, useRef } from 'react';
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

  const ListRow = ({ institute }: { institute: IInstitute }) => (
    <button
      type="button"
      onClick={() => router.push(`/explore/institutes/${institute.slug}`)}
      className="grid w-full grid-cols-12 gap-3 items-center px-4 py-3 border-b border-customGray-10 last:border-b-0 hover:bg-customGray-3/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-blue/60">
      <div className="col-span-12 md:col-span-3 min-w-0">
        <p className="text-sm font-inter font-semibold text-primary-dark truncate">{institute.name}</p>
        <p className="text-xs text-customGray-50 mt-0.5 truncate">{institute.university}</p>
      </div>
      <div className="col-span-6 md:col-span-3 flex items-center gap-1.5 text-customGray-60">
        <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-inter truncate">
          {institute.city}, {institute.state}
        </span>
      </div>
      <div className="col-span-6 md:col-span-2 flex items-center gap-1.5 text-customGray-60">
        <BuildingOffice2Icon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-inter truncate">{institute.instituteType}</span>
      </div>
      <div className="col-span-6 md:col-span-2 flex items-center gap-1.5 text-customGray-60">
        <ShieldCheckIcon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-inter truncate">{institute.authority}</span>
      </div>
      <div className="col-span-6 md:col-span-1 flex items-center gap-1.5 text-customGray-60">
        <BuildingOfficeIcon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-inter truncate">{institute.beds}</span>
      </div>
      <div className="col-span-6 md:col-span-1 flex items-center gap-1.5 text-customGray-60">
        <HomeModernIcon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-inter truncate">{institute.localDistinction}</span>
      </div>
    </button>
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
            <ExploreTableShell minWidthClassName="min-w-[980px]">
              <div className="grid grid-cols-12 gap-3 items-center px-4 py-2.5 bg-customGray-3/60 border-b border-customGray-10">
                <p className="col-span-3 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Institute
                </p>
                <p className="col-span-3 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Location
                </p>
                <p className="col-span-2 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Type
                </p>
                <p className="col-span-2 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Authority
                </p>
                <p className="col-span-1 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Beds
                </p>
                <p className="col-span-1 text-xxs font-interMedium uppercase tracking-[0.08em] text-primary-dark">
                  Local
                </p>
              </div>
              {institutes.map(institute => (
                <ListRow key={institute.id} institute={institute} />
              ))}
            </ExploreTableShell>
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
