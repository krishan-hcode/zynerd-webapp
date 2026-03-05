export interface ICounselling {
  id: number;
  name: string;
  subtitle: string;
  slug: string;
}

export interface ICounsellingListProps {
  counsellings: ICounselling[];
  totalCount: number;
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
}
