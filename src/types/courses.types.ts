export interface ICourse {
  id: number;
  name: string;
  clinicalType: string;
  degreeType: string;
  degreeTerm: string;
}

export interface ICoursesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedClinicalType: string;
  onClinicalTypeChange: (value: string) => void;
  selectedDegreeType: string;
  onDegreeTypeChange: (value: string) => void;
  selectedDegreeTerm: string;
  onDegreeTermChange: (value: string) => void;
  clinicalTypeOptions: string[];
  degreeTypeOptions: string[];
  degreeTermOptions: string[];
  onClearFilters: () => void;
}

export interface ICoursesListProps {
  courses: ICourse[];
  totalCount: number;
  viewMode: ICoursesViewMode;
  onViewModeChange: (mode: ICoursesViewMode) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export type ICoursesViewMode = 'grid' | 'list';
