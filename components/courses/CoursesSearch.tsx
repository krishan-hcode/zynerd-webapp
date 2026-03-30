import ExploreFilterSelect from '@/common/ExploreFilterSelect';
import ExploreSearchShell from '@/common/ExploreSearchShell';
import type {ICoursesSearchProps} from '@/types/courses.types';
import {BookOpenIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

const CoursesSearch = ({
  searchQuery,
  onSearchChange,
  selectedClinicalType,
  onClinicalTypeChange,
  selectedDegreeType,
  onDegreeTypeChange,
  selectedDegreeTerm,
  onDegreeTermChange,
  clinicalTypeOptions,
  degreeTypeOptions,
  degreeTermOptions,
  onClearFilters,
}: ICoursesSearchProps) => {
  const [openFilter, setOpenFilter] = useState<
    'clinicalType' | 'degreeType' | 'degreeTerm' | null
  >(null);

  const activeFilters = [
    selectedClinicalType,
    selectedDegreeType,
    selectedDegreeTerm,
  ].filter(Boolean);

  return (
    <ExploreSearchShell
      sectionLabel="Courses"
      sectionIcon={<BookOpenIcon className="h-4 w-4" />}
      searchQuery={searchQuery}
      searchPlaceholder="Search courses"
      onSearchChange={onSearchChange}
      activeFilters={activeFilters}
      onClearFilters={onClearFilters}
      filtersContent={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl">
          <ExploreFilterSelect
            label="Clinical Type"
            selectedValue={selectedClinicalType}
            options={clinicalTypeOptions}
            allLabel="All Clinical Types"
            isOpen={openFilter === 'clinicalType'}
            onToggle={() =>
              setOpenFilter(current =>
                current === 'clinicalType' ? null : 'clinicalType',
              )
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onClinicalTypeChange}
          />
          <ExploreFilterSelect
            label="Degree Types"
            selectedValue={selectedDegreeType}
            options={degreeTypeOptions}
            allLabel="All Degree Types"
            isOpen={openFilter === 'degreeType'}
            onToggle={() =>
              setOpenFilter(current =>
                current === 'degreeType' ? null : 'degreeType',
              )
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onDegreeTypeChange}
          />
          <ExploreFilterSelect
            label="Degree Terms"
            selectedValue={selectedDegreeTerm}
            options={degreeTermOptions}
            allLabel="All Degree Terms"
            isOpen={openFilter === 'degreeTerm'}
            onToggle={() =>
              setOpenFilter(current =>
                current === 'degreeTerm' ? null : 'degreeTerm',
              )
            }
            onClose={() => setOpenFilter(null)}
            onSelect={onDegreeTermChange}
          />
        </div>
      }
    />
  );
};

export default CoursesSearch;
