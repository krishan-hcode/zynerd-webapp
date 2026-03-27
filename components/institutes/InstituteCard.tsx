import type { IInstitute, IInstitutesViewMode } from '@/types/institutes.types';
import { classNames } from '@/utils/utils';
import {
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface IInstituteCardProps {
  institute: IInstitute;
  viewMode: IInstitutesViewMode;
}

const InstituteCard = ({ institute, viewMode }: IInstituteCardProps) => {
  const router = useRouter();

  const openInstituteDetails = () => {
    router.push(`/explore/institutes/${institute.slug}`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openInstituteDetails}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openInstituteDetails();
        }
      }}
      className={classNames(
        'rounded-2xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/50 shadow-sm p-4 sm:p-4.5 hover:border-primary-blue/30 hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/60',
        viewMode === 'grid' ? ' hover:shadow-primary-blue/5 shadow-sm' : '',
      )}>
      <div className={classNames('min-w-0', viewMode === 'list' ? 'mt-2.5' : '')}>
        <div className='flex items-center gap-2'>
          <span
            className={classNames(
              'rounded-xl text-primary-blue border border-primary-blue/10',
              viewMode === 'list' ? 'p-1.5' : 'p-2',
            )}>
            <BuildingOfficeIcon
              className={classNames('h-5 w-5', viewMode === 'list' ? 'h-4 w-4' : 'h-5 w-5')}
            />
          </span>

          <h3 className="font-inter text-xs sm:text-base font-semibold text-primary-dark leading-snug line-clamp-2">
            {institute.name}
          </h3>
        </div>
        <p className="text-xxs sm:text-xs text-customGray-50 mt-1.5 line-clamp-2 leading-relaxed">
          {institute.university}
        </p>
      </div>
      <div
        className={classNames(
          'mt-3.5 flex items-center gap-2 text-customGray-50',
          viewMode === 'grid' ? 'pb-3.5 border-b border-customGray-10' : 'pb-3 border-b border-customGray-10',
        )}>
        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
        <p className="text-xxs sm:text-xs font-inter">
          {institute.city}, {institute.state}
        </p>
      </div>
      <div
        className={classNames(
          'mt-3',
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-2'
            : 'flex flex-wrap items-center gap-2',
        )}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-customGray-5 text-primary-dark text-xxs font-inter">
          <BuildingOffice2Icon className="h-3.5 w-3.5" />
          {institute.instituteType}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-customGray-5 text-primary-dark text-xxs font-inter">
          <ShieldCheckIcon className="h-3.5 w-3.5" />
          {institute.authority}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-customGray-5 text-primary-dark text-xxs font-inter">
          <BuildingOfficeIcon className="h-3.5 w-3.5" />
          Beds: {institute.beds}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-customGray-5 text-primary-dark text-xxs font-inter">
          <HomeModernIcon className="h-3.5 w-3.5" />
          {institute.localDistinction}
        </span>
      </div>
      {viewMode === 'list' && <div className="mt-1" />}
    </article>
  );
};

export default InstituteCard;
