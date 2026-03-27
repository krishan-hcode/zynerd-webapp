import ExploreFilterSelect from '@/common/ExploreFilterSelect';
import ExploreSearchShell from '@/common/ExploreSearchShell';
import type {IUniversitiesSearchProps} from '@/types/universities.types';
import {BuildingLibraryIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

const UniversitiesSearch = ({
  searchQuery,
  onSearchChange,
  selectedUniversityType,
  onUniversityTypeChange,
  selectedState,
  onStateChange,
  universityTypeOptions,
  stateOptions,
  onClearFilters,
}: IUniversitiesSearchProps) => {
  const [openFilter, setOpenFilter] = useState<'type' | 'state' | null>(null);
  const activeFilters = [selectedUniversityType, selectedState].filter(Boolean);

  return (
    <ExploreSearchShell
      sectionLabel="Universities"
      sectionIcon={<BuildingLibraryIcon className="h-4 w-4" />}
      searchQuery={searchQuery}
      searchPlaceholder="Search universities"
      onSearchChange={onSearchChange}
      activeFilters={activeFilters}
      onClearFilters={onClearFilters}
      filtersContent={
        <div className="grid grid-cols-2 sm:grid-cols-2 max-w-2xl  gap-3">
          <ExploreFilterSelect
            label="University Type"
            selectedValue={selectedUniversityType}
            options={universityTypeOptions}
            allLabel="All University Types"
            isOpen={openFilter === 'type'}
            onToggle={() => setOpenFilter(current => (current === 'type' ? null : 'type'))}
            onClose={() => setOpenFilter(null)}
            onSelect={onUniversityTypeChange}
          />
          <ExploreFilterSelect
            label="State"
            selectedValue={selectedState}
            options={stateOptions}
            allLabel="All States"
            isOpen={openFilter === 'state'}
            onToggle={() => setOpenFilter(current => (current === 'state' ? null : 'state'))}
            onClose={() => setOpenFilter(null)}
            onSelect={onStateChange}
          />
        </div>
      }
    />
  );
};

export default UniversitiesSearch;
