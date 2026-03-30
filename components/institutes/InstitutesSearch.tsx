import ExploreFilterSelect from '@/common/ExploreFilterSelect';
import ExploreSearchShell from '@/common/ExploreSearchShell';
import type {IInstitutesSearchProps} from '@/types/institutes.types';
import {BuildingOffice2Icon} from '@heroicons/react/24/outline';
import {useState} from 'react';

const InstitutesSearch = ({
  searchQuery,
  onSearchChange,
  selectedInstituteType,
  onInstituteTypeChange,
  selectedAuthority,
  onAuthorityChange,
  selectedState,
  onStateChange,
  selectedUniversity,
  onUniversityChange,
  instituteTypeOptions,
  authorityOptions,
  stateOptions,
  universityOptions,
  onClearFilters,
}: IInstitutesSearchProps) => {
  const [openFilter, setOpenFilter] = useState<
    'type' | 'authority' | 'state' | 'university' | null
  >(null);
  const activeFilters = [
    selectedInstituteType,
    selectedAuthority,
    selectedState,
    selectedUniversity,
  ].filter(Boolean);

  return (
    <ExploreSearchShell
      sectionLabel="Institutes"
      sectionIcon={<BuildingOffice2Icon className="h-4 w-4" />}
      searchQuery={searchQuery}
      searchPlaceholder="Search institutes"
      onSearchChange={onSearchChange}
      activeFilters={activeFilters}
      onClearFilters={onClearFilters}
      filtersContent={
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl  gap-3">
          <ExploreFilterSelect
            label="Institute Type"
            selectedValue={selectedInstituteType}
            options={instituteTypeOptions}
            allLabel="All Institute Types"
            isOpen={openFilter === 'type'}
            onToggle={() =>
              setOpenFilter(current => (current === 'type' ? null : 'type'))
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onInstituteTypeChange}
          />
          <ExploreFilterSelect
            label="Authority / Board"
            selectedValue={selectedAuthority}
            options={authorityOptions}
            allLabel="All Authorities"
            isOpen={openFilter === 'authority'}
            onToggle={() =>
              setOpenFilter(current =>
                current === 'authority' ? null : 'authority',
              )
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onAuthorityChange}
          />
          <ExploreFilterSelect
            label="State"
            selectedValue={selectedState}
            options={stateOptions}
            allLabel="All States"
            isOpen={openFilter === 'state'}
            onToggle={() =>
              setOpenFilter(current => (current === 'state' ? null : 'state'))
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onStateChange}
          />
          <ExploreFilterSelect
            label="Universities"
            selectedValue={selectedUniversity}
            options={universityOptions}
            allLabel="All Universities"
            isOpen={openFilter === 'university'}
            onToggle={() =>
              setOpenFilter(current =>
                current === 'university' ? null : 'university',
              )
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onUniversityChange}
          />
        </div>
      }
    />
  );
};

export default InstitutesSearch;
