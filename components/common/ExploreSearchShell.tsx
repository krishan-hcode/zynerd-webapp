import { classNames } from '@/utils/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface ExploreSearchShellProps {
  sectionLabel: string;
  sectionIcon?: ReactNode;
  searchQuery: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];
  onClearFilters: () => void;
  filtersContent: ReactNode;
}

export default function ExploreSearchShell({
  sectionLabel,
  sectionIcon,
  searchQuery,
  searchPlaceholder,
  onSearchChange,
  activeFilters,
  onClearFilters,
  filtersContent,
}: ExploreSearchShellProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      <div className="relative  max-w-6xl mx-auto rounded-2xl border border-primary-dark bg-gradient-to-br from-primary-dark via-primary-dark/90 to-primary-dark/95 shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-dark/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-primary-dark/15 blur-2xl" />
        {sectionIcon && (
          <div
            className="pointer-events-none absolute  z-0 text-white/15   right-8 top-0"
            aria-hidden="true">
            <div className="drop-shadow-[0_0_24px_rgba(255,255,255,0.16)] [&_svg]:h-28 [&_svg]:w-28  sm:[&_svg]:h-48 sm:[&_svg]:w-48">
              {sectionIcon}
            </div>
          </div>
        )}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {sectionIcon && (
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white [&_svg]:h-4 [&_svg]:w-4"
                  aria-hidden="true">
                  {sectionIcon}
                </span>
              )}
              <p className="font-inter text-sm font-semibold text-white uppercase tracking-[0.08em]">
                {sectionLabel}
              </p>
            </div>
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className={classNames(
                  'text-xs font-inter px-3 py-1.5 rounded-lg border transition-colors',
                  'text-white border-white/20 bg-white/10 hover:bg-white/15',
                )}>
                Clear all
              </button>
            )}
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-customGray-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-2/3 h-11 pl-10 pr-4 rounded-xl bg-white border border-customGray-10 text-primary-dark font-inter text-sm placeholder:text-customGray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue shadow-sm transition-colors"
            />
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeFilters.map(filter => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-blue/10 text-white text-xs font-inter px-2.5 py-1">
                  {filter}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3">{filtersContent}</div>
        </div>
      </div>
    </section>
  );
}
