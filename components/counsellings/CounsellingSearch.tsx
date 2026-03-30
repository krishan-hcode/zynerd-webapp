import ExploreFilterSelect from '@/common/ExploreFilterSelect';
import ExploreSearchShell from '@/common/ExploreSearchShell';
import type {ICounsellingSearchProps} from '@/types/counsellings.types';
import {AcademicCapIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

const CounsellingSearch = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedState,
  onStateChange,
  typeOptions,
  stateOptions,
  onClearFilters,
}: ICounsellingSearchProps) => {
  const [openFilter, setOpenFilter] = useState<'type' | 'state' | null>(null);

  const activeFilters = [selectedType, selectedState].filter(Boolean);

  return (
    <ExploreSearchShell
      sectionLabel="Counsellings"
      sectionIcon={<AcademicCapIcon className="h-4 w-4" />}
      searchQuery={searchQuery}
      searchPlaceholder="Search counsellings"
      onSearchChange={onSearchChange}
      activeFilters={activeFilters}
      onClearFilters={onClearFilters}
      filtersContent={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          <ExploreFilterSelect
            label="Counselling type"
            selectedValue={selectedType}
            options={typeOptions}
            allLabel="All types"
            isOpen={openFilter === 'type'}
            onToggle={() =>
              setOpenFilter(current => (current === 'type' ? null : 'type'))
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onTypeChange}
          />
          <ExploreFilterSelect
            label="State / authority"
            selectedValue={selectedState}
            options={stateOptions}
            allLabel="All states"
            isOpen={openFilter === 'state'}
            onToggle={() =>
              setOpenFilter(current => (current === 'state' ? null : 'state'))
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onStateChange}
          />
        </div>
      }
    />
  );
};

export default CounsellingSearch;
