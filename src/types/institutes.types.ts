export interface IInstitute {
  id: number;
  slug: string;
  name: string;
  university: string;
  city: string;
  state: string;
  instituteType: string;
  authority: string;
  counsellingBody: string;
  beds: number;
  localDistinction: string;
}

export interface IInstitutesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedInstituteType: string;
  onInstituteTypeChange: (value: string) => void;
  selectedAuthority: string;
  onAuthorityChange: (value: string) => void;
  selectedState: string;
  onStateChange: (value: string) => void;
  selectedUniversity: string;
  onUniversityChange: (value: string) => void;
  instituteTypeOptions: string[];
  authorityOptions: string[];
  stateOptions: string[];
  universityOptions: string[];
  onClearFilters: () => void;
}

export interface IInstitutesListProps {
  institutes: IInstitute[];
  totalCount: number;
  viewMode: IInstitutesViewMode;
  onViewModeChange: (mode: IInstitutesViewMode) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export type IInstitutesViewMode = 'grid' | 'list';
