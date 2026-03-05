import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {useState} from 'react';
import type {IVideoSearchFilterProps} from '@/types/videos.types';
import {classNames} from '@/utils/utils';
const VideoSearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedCounselling,
  onCounsellingChange,
  selectedLanguage,
  onLanguageChange,
  tags,
  selectedTag,
  onTagSelect,
  counsellingOptions,
  languageOptions,
}: IVideoSearchFilterProps) => {
  const [showCounsellingDropdown, setShowCounsellingDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const years = ['2025', '2024'];
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-customGray-50" />
        <input
          type="text"
          placeholder="Search Video"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-customGray-5 border border-customGray-10 text-primary-dark font-inter text-sm placeholder:text-customGray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
        />
      </div>
      {/* Year Filters */}
      <div className="flex gap-2 flex-wrap">
        {years.map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={classNames(
              'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-inter text-xs sm:text-sm font-medium transition-colors',
              selectedYear === year
                ? 'bg-primary-blue text-white'
                : 'bg-customGray-10 text-primary-dark hover:bg-customGray-15',
            )}>
            {year}
          </button>
        ))}
      </div>
      {/* Dropdown Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Counselling Dropdown */}
        <div className="relative w-full sm:w-auto sm:min-w-[180px]">
          <button
            onClick={() => {
              setShowCounsellingDropdown(!showCounsellingDropdown);
              setShowLanguageDropdown(false);
            }}
            className={classNames(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white font-inter text-sm w-full sm:min-w-[180px] justify-between transition-colors',
              selectedCounselling
                ? 'border border-primary-blue text-primary-dark'
                : 'border border-customGray-10 text-primary-dark hover:border-customGray-20',
            )}>
            <span className="truncate">
              {selectedCounselling || 'Select Counselling'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-customGray-50 flex-shrink-0" />
          </button>
          {showCounsellingDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCounsellingDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-customGray-10 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {counsellingOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      onCounsellingChange(option);
                      setShowCounsellingDropdown(false);
                    }}
                    className={classNames(
                      'w-full px-4 py-2.5 text-left text-sm font-inter first:rounded-t-xl last:rounded-b-xl',
                      selectedCounselling === option
                        ? 'text-primary-blue bg-primary-blue/10'
                        : 'text-primary-dark hover:bg-primary-blue/5',
                    )}>
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Language Dropdown */}
        <div className="relative w-full sm:w-auto sm:min-w-[160px]">
          <button
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown);
              setShowCounsellingDropdown(false);
            }}
            className={classNames(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white font-inter text-sm w-full sm:min-w-[160px] justify-between transition-colors',
              selectedLanguage && selectedLanguage !== 'All languages'
                ? 'border border-primary-blue text-primary-dark'
                : 'border border-customGray-10 text-primary-dark hover:border-customGray-20',
            )}>
            <span className="truncate">{selectedLanguage || 'All languages'}</span>
            <ChevronDownIcon className="h-4 w-4 text-customGray-50 flex-shrink-0" />
          </button>
          {showLanguageDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowLanguageDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-customGray-10 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {languageOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      onLanguageChange(option);
                      setShowLanguageDropdown(false);
                    }}
                    className={classNames(
                      'w-full px-4 py-2.5 text-left text-sm font-inter first:rounded-t-xl last:rounded-b-xl',
                      selectedLanguage === option
                        ? 'text-primary-blue bg-primary-blue/10'
                        : 'text-primary-dark hover:bg-primary-blue/5',
                    )}>
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Tags - Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-2 min-w-max">
          <button
            onClick={() => onTagSelect(null)}
            className={classNames(
              'flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-inter text-xs sm:text-sm font-medium transition-colors',
              !selectedTag
                ? 'bg-primary-blue text-white'
                : 'bg-customGray-10 text-primary-dark hover:bg-customGray-15',
            )}>
            #
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
              className={classNames(
                'flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-inter text-xs sm:text-sm font-medium transition-colors',
                selectedTag === tag
                  ? 'bg-primary-blue text-white'
                  : 'bg-customGray-10 text-primary-dark hover:bg-customGray-15',
              )}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default VideoSearchFilter;
