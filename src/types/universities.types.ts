import type {IInstitute} from '@/types/institutes.types';

export interface IUniversity {
  id: number;
  name: string;
  slug: string;
  state: string;
  universityType: string;
  instituteCount: number;
}

export interface IUniversitiesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUniversityType: string;
  onUniversityTypeChange: (value: string) => void;
  selectedState: string;
  onStateChange: (value: string) => void;
  universityTypeOptions: string[];
  stateOptions: string[];
  onClearFilters: () => void;
}

export interface IUniversitiesListProps {
  universities: IUniversity[];
  totalCount: number;
  viewMode: IUniversitiesViewMode;
  onViewModeChange: (mode: IUniversitiesViewMode) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface IUniversityLookupResult {
  university: IUniversity | null;
  affiliatedInstitutes: IInstitute[];
}

export type IUniversitiesViewMode = 'grid' | 'list';
