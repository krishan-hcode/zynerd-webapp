export interface ICounselling {
  id: number;
  name: string;
  subtitle: string;
  slug: string;
}

export type ICounsellingsViewMode = 'grid' | 'list';

export interface ICounsellingListProps {
  counsellings: ICounselling[];
  totalCount: number;
  viewMode: ICounsellingsViewMode;
  onViewModeChange: (mode: ICounsellingsViewMode) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface ICounsellingSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  selectedState: string;
  onStateChange: (s: string) => void;
  typeOptions: string[];
  stateOptions: string[];
  onClearFilters: () => void;
}
