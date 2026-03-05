import {classNames} from '@/utils/utils';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {useState} from 'react';
import type {ICounsellingSearchProps} from '@/types/counsellings.types';
const CounsellingSearch = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedState,
  onStateChange,
  typeOptions,
  stateOptions,
}: ICounsellingSearchProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-customGray-50" />
        <input
          type="text"
          placeholder="Search counsellings"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-customGray-10 text-primary-dark font-inter text-sm placeholder:text-customGray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue shadow-sm"
        />
      </div>
      {/* Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {/* Counselling Type */}
        <div className="relative flex-1 group">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowStateDropdown(false);
            }}
            className={classNames(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white font-inter text-sm w-full justify-between transition-colors shadow-sm',
              selectedType
                ? 'border border-primary-blue text-primary-dark'
                : 'border border-customGray-10 text-primary-dark hover:border-customGray-20',
            )}>
            <span className="truncate">
              {selectedType || 'Counselling Type'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-customGray-50 flex-shrink-0" />
          </button>
          {showTypeDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowTypeDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-customGray-10 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
                <button
                  onClick={() => {
                    onTypeChange('');
                    setShowTypeDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-inter text-customGray-50 hover:bg-primary-blue/5 first:rounded-t-xl">
                  All Types
                </button>
                {typeOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onTypeChange(opt);
                      setShowTypeDropdown(false);
                    }}
                    className={classNames(
                      'w-full px-4 py-2.5 text-left text-sm font-inter last:rounded-b-xl',
                      selectedType === opt
                        ? 'text-primary-blue bg-primary-blue/10'
                        : 'text-primary-dark hover:bg-primary-blue/5',
                    )}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {/* State / Authority */}
        <div className="relative flex-1 group">
          <button
            onClick={() => {
              setShowStateDropdown(!showStateDropdown);
              setShowTypeDropdown(false);
            }}
            className={classNames(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white font-inter text-sm w-full justify-between transition-colors shadow-sm',
              selectedState
                ? 'border border-primary-blue text-primary-dark'
                : 'border border-customGray-10 text-primary-dark hover:border-customGray-20',
            )}>
            <span className="truncate">
              {selectedState || 'State / Authority'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-customGray-50 flex-shrink-0" />
          </button>
          {showStateDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStateDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-customGray-10 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
                <button
                  onClick={() => {
                    onStateChange('');
                    setShowStateDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-inter text-customGray-50 hover:bg-primary-blue/5 first:rounded-t-xl">
                  All States
                </button>
                {stateOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onStateChange(opt);
                      setShowStateDropdown(false);
                    }}
                    className={classNames(
                      'w-full px-4 py-2.5 text-left text-sm font-inter last:rounded-b-xl',
                      selectedState === opt
                        ? 'text-primary-blue bg-primary-blue/10'
                        : 'text-primary-dark hover:bg-primary-blue/5',
                    )}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CounsellingSearch;
