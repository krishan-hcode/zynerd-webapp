import {AcademicCapIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import type {ICounsellingListProps} from '@/types/counsellings.types';
const CounsellingList = ({counsellings, totalCount}: ICounsellingListProps) => {
  const router = useRouter();
  if (counsellings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-customGray-50 font-inter">
        <AcademicCapIcon className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">No counsellings found</p>
      </div>
    );
  }
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
      {/* Result count */}
      <p className="text-xs sm:text-sm font-inter text-customGray-50 mb-6 text-center">
        {totalCount} Counsellings found
      </p>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 sm:gap-6">
        {counsellings.map(item => (
          <button
            key={item.id}
            onClick={() => router.push(`/explore/counsellings/${item.slug}`)}
            className="flex items-start gap-3 p-4 text-left bg-white border border-customGray-10 rounded-xl hover:border-primary-blue hover:shadow-md transition-all group">
            {/* Icon */}
            <span className="flex-shrink-0 mt-0.5 p-2 bg-customGray-5 rounded-lg group-hover:bg-primary-blue/10 transition-colors">
              <AcademicCapIcon className="w-5 h-5 text-customGray-50 group-hover:text-primary-blue transition-colors" />
            </span>
            {/* Text */}
            <div className="min-w-0">
              <p className="text-sm font-inter font-semibold text-primary-dark leading-snug line-clamp-2 group-hover:text-primary-blue transition-colors">
                {item.name}
              </p>
              <p className="text-xs font-inter text-customGray-50 mt-1 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default CounsellingList;
