import type { IInstitute, IInstitutesViewMode } from '@/types/institutes.types';
import { classNames } from '@/utils/utils';
import {
  BuildingOfficeIcon,
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
        'group relative overflow-hidden rounded-xl border border-primary-blue/20',
        'bg-gradient-to-t from-white  to-primary-blue/1',
        'shadow-sm  hover:shadow-md hover:shadow-primary-blue/[0.08]',
        'transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/60',
        'p-4 sm:p-5 sm:p-4.5',
      )}>



      <div className="relative z-10">
        <div className={classNames('min-w-0', viewMode === 'list' ? 'mt-2.5' : '')}>
          <div className="flex items-center gap-2">
            <span
              className={classNames(
                'flex-shrink-0 rounded-lg bg-primary-blue/5 text-white shadow-sm shadow-primary-blue/25 ',
                viewMode === 'list' ? 'p-1.5' : 'p-2',
              )}>
              <BuildingOffice2Icon
                className={classNames('text-primary-blue', viewMode === 'list' ? 'h-4 w-4' : 'h-4 w-4')}
              />
            </span>

            <h3 className="font-inter text-xs sm:text-base font-semibold text-customGray-80 leading-snug line-clamp-2">
              {institute.name}
            </h3>
          </div>
          <p className="text-xxs sm:text-xs text-customGray-60 mt-1.5 line-clamp-2 leading-relaxed">
            {institute.university}
          </p>
        </div>

        <div
          className={classNames(
            viewMode === 'grid' ? 'pb-3.5 border-b border-primary-blue/10' : 'pb-3 border-b border-primary-blue/10',
          )}>

        </div>

        <div
          className={classNames(
            'mt-3',
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-2'
              : 'flex flex-wrap items-center gap-2',
          )}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-primary-blue/5 bg-primary-blue/3  shadow-sm shadow-primary-blue/25 text-primary-dark text-xxs font-inter">
            <BuildingOffice2Icon className="h-4 w-4 text-customGray-50" />
            {institute.instituteType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-primary-blue/5 bg-primary-blue/3  shadow-sm shadow-primary-blue/25 text-primary-dark text-xxs font-inter">
            <ShieldCheckIcon className="h-4 w-4 text-customGray-50" />
            {institute.authority}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-primary-blue/5 bg-primary-blue/3  shadow-sm shadow-primary-blue/25 text-primary-dark text-xxs font-inter">
            <BuildingOfficeIcon className="h-4 w-4 text-customGray-50" />
            Beds: {institute.beds}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-primary-blue/5 bg-primary-blue/3  shadow-sm shadow-primary-blue/25 text-primary-dark text-xxs font-inter">
            <HomeModernIcon className="h-4 w-4 text-customGray-50" />
            {institute.localDistinction}
          </span>
        </div>
        {viewMode === 'list' && <div className="mt-1" />}
      </div>
    </article>
  );
};

export default InstituteCard;
