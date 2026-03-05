export interface IVideoItem {
  id: string;
  thumbnailUrl: string;
  title: string;
  uploadDate: string;
  language: string;
  tags?: string[];
  videoLink?: string;
}

export interface IVideoCardProps {
  video: IVideoItem;
  onVideoClick?: (video: IVideoItem) => void;
}

export interface IVideoSectionData {
  id: string;
  title: string;
  viewMoreUrl: string;
  videos: IVideoItem[];
}

export interface IVideoSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedCounselling: string;
  onCounsellingChange: (value: string) => void;
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  counsellingOptions: string[];
  languageOptions: string[];
}

export interface IVideoSectionProps {
  title: string;
  viewMoreUrl?: string;
  videos: IVideoItem[];
  onVideoClick?: (video: IVideoItem) => void;
}
