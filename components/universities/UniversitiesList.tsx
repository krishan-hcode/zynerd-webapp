import type {IUniversitiesListProps} from '@/types/universities.types';
import {classNames} from '@/utils/utils';
import {
  BuildingLibraryIcon,
  ChevronRightIcon,
  ListBulletIcon,
  MapPinIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {useEffect, useRef} from 'react';

const UniversitiesList = ({
  universities,
  totalCount,
  viewMode,
  onViewModeChange,
  hasMore,
  onLoadMore,
  currentPage,
  pageSize,
  onPageChange,
}: IUniversitiesListProps) => {
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

  if (universities.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BuildingLibraryIcon className="h-12 w-12 mx-auto text-customGray-50/70" />
        <p className="mt-3 font-inter text-sm text-customGray-50">
          No universities found for selected filters.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 mt-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 rounded-2xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/40 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-inter font-semibold text-primary-dark">
              {totalCount} universities found
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
              {universities.map(university => (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => router.push(`/explore/universities/${university.slug}`)}
                  className="rounded-2xl border border-customGray-10 bg-white p-4 text-left hover:border-primary-blue/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <BuildingLibraryIcon className="h-5 w-5 text-customGray-50 flex-shrink-0" />
                    <span className="inline-flex px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                      {university.universityType}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-inter font-semibold text-primary-dark line-clamp-2">
                    {university.name}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-customGray-60">
                    <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs font-inter">{university.state}</span>
                  </div>
                  <p className="mt-2 text-xs font-inter text-customGray-50">
                    {university.instituteCount} affiliated institutes
                  </p>
                </button>
              ))}
            </div>
            {hasMore && <div ref={loadMoreRef} className="h-8" aria-hidden />}
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-customGray-10 bg-white overflow-hidden">
              {universities.map(university => (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => router.push(`/explore/universities/${university.slug}`)}
                  className="w-full grid grid-cols-12 gap-3 items-center px-4 py-3 text-left border-b border-customGray-10 last:border-b-0 hover:bg-customGray-3/40 transition-colors">
                  <div className="col-span-12 md:col-span-6 min-w-0 flex items-start gap-2.5">
                    <BuildingLibraryIcon className="h-4 w-4 mt-0.5 text-customGray-50 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-inter font-semibold text-primary-dark truncate">
                        {university.name}
                      </p>
                      <p className="text-xs text-customGray-50 mt-0.5">
                        {university.instituteCount} affiliated institutes
                      </p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 flex items-center gap-1.5 text-customGray-60">
                    <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs font-inter truncate">{university.state}</span>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <span className="inline-flex px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                      {university.universityType}
                    </span>
                  </div>
                  <div className="hidden md:flex md:col-span-1 justify-end">
                    <ChevronRightIcon className="h-4 w-4 text-customGray-50" />
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-customGray-10 bg-white text-primary-dark disabled:opacity-50">
                Prev
              </button>
              <span className="text-xs font-inter text-customGray-60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-customGray-10 bg-white text-primary-dark disabled:opacity-50">
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UniversitiesList;
