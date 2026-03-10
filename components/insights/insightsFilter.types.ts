export type SessionYear = '2022' | '2023' | '2024' | '2025';

export const SESSION_OPTIONS: SessionYear[] = ['2022', '2023', '2024', '2025'];

/** Rounds available per session (e.g. some sessions have 3 rounds, others 4 or 5) */
export const SESSION_ROUNDS: Record<SessionYear, number[]> = {
  '2022': [1, 2, 3],
  '2023': [1, 2, 3, 4],
  '2024': [1, 2, 3, 4, 5],
  '2025': [1, 2, 3, 4, 5],
};

export interface InsightFilters {
  aiRankMin: number | '';
  aiRankMax: number | '';
  stateRankMin: number | '';
  stateRankMax: number | '';
  session: SessionYear;
  rounds: number[];
  quotas: string[];
  categories: string[];
  states: string[];
  institutes: string[];
  instituteType: { government: boolean; private: boolean };
  bedsMin: number | '';
  bedsMax: number | '';
  feeMin: number | '';
  feeMax: number | '';
  bondYearsMin: number | '';
  bondYearsMax: number | '';
  bondPenaltyMin: number | '';
  bondPenaltyMax: number | '';
  course: string[];
  courseType: string[];
  degree: string[];
}

export const DEFAULT_FILTERS: InsightFilters = {
  aiRankMin: '',
  aiRankMax: '',
  stateRankMin: '',
  stateRankMax: '',
  session: '2025',
  rounds: [],
  quotas: [],
  categories: [],
  states: [],
  institutes: [],
  instituteType: { government: false, private: false },
  bedsMin: '',
  bedsMax: '',
  feeMin: '',
  feeMax: '',
  bondYearsMin: '',
  bondYearsMax: '',
  bondPenaltyMin: '',
  bondPenaltyMax: '',
  course: [],
  courseType: [],
  degree: [],
};

export type DisplayedFieldKey =
  | 'round'
  | 'stateRank'
  | 'aiRank'
  | 'state'
  | 'institute'
  | 'course'
  | 'quota'
  | 'category'
  | 'fee'
  | 'beds'
  | 'bondYears'
  | 'bondPenalty'
  | 'stipendYear1';

export type DisplayedFields = Record<DisplayedFieldKey, boolean>;

export const DISPLAYED_FIELD_LABELS: Record<DisplayedFieldKey, string> = {
  round: 'Round',
  stateRank: 'State Rank',
  aiRank: 'AI Rank',
  state: 'State',
  institute: 'Institute',
  course: 'Course',
  quota: 'Quota',
  category: 'Category',
  fee: 'Fee',
  beds: 'Beds',
  bondYears: 'Bond Years',
  bondPenalty: 'Bond Penalty',
  stipendYear1: 'Stipend Year 1',
};

/** Column order and headers for table and sort options */
export const COLUMN_ORDER: DisplayedFieldKey[] = [
  'round',
  'stateRank',
  'aiRank',
  'state',
  'institute',
  'course',
  'quota',
  'category',
  'fee',
  'beds',
  'bondYears',
  'bondPenalty',
  'stipendYear1',
];

export const COLUMN_HEADERS: Record<DisplayedFieldKey, string> = {
  round: 'ROUND',
  stateRank: 'STATE RANK',
  aiRank: 'AI RANK',
  state: 'STATE',
  institute: 'INSTITUTE',
  course: 'COURSE',
  quota: 'QUOTA',
  category: 'CATEGORY',
  fee: 'FEE',
  beds: 'BEDS',
  bondYears: 'BOND YEARS',
  bondPenalty: 'BOND PENALTY',
  stipendYear1: 'STIPEND YEAR 1',
};

export const DEFAULT_DISPLAYED_FIELDS: DisplayedFields = {
  round: true,
  stateRank: true,
  aiRank: true,
  state: true,
  institute: true,
  course: true,
  quota: true,
  category: true,
  fee: true,
  beds: true,
  bondYears: true,
  bondPenalty: true,
  stipendYear1: true,
};
