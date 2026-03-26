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
  seatsMin: number | '';
  seatsMax: number | '';
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
  seatsMin: '',
  seatsMax: '',
  course: [],
  courseType: [],
  degree: [],
};

export type DynamicCrFieldKey = `cr_${number}_${number}`;

export type BaseDisplayedFieldKey =
  | 'round'
  | 'stateRank'
  | 'aiRank'
  | 'quota'
  | 'category'
  | 'state'
  | 'institute'
  | 'course'
  | 'seats'
  | 'fee'
  | 'stipendYear1'
  | 'bondYears'
  | 'bondPenalty'
  | 'beds';

export type DisplayedFieldKey = BaseDisplayedFieldKey | DynamicCrFieldKey;

export type DisplayedFields = Record<string, boolean>;

export const DISPLAYED_FIELD_LABELS: Record<BaseDisplayedFieldKey, string> = {
  round: 'Round',
  stateRank: 'State Rank',
  aiRank: 'AI Rank',
  quota: 'Quota',
  category: 'Category',
  state: 'State',
  institute: 'Institute',
  course: 'Course',
  seats: 'Seats',
  fee: 'Fee',
  stipendYear1: 'Stipend Year 1',
  bondYears: 'Bond Years',
  bondPenalty: 'Bond Penalty',
  beds: 'Beds',
};

/** Column order and headers for table and sort options */
export const COLUMN_ORDER: BaseDisplayedFieldKey[] = [
  'round',
  'stateRank',
  'aiRank',
  'quota',
  'category',
  'state',
  'institute',
  'course',
  'seats',
  'fee',
  'stipendYear1',
  'bondYears',
  'bondPenalty',
  'beds',
];

export const COLUMN_HEADERS: Record<BaseDisplayedFieldKey, string> = {
  round: 'ROUND',
  stateRank: 'STATE RANK',
  aiRank: 'AI RANK',
  quota: 'QUOTA',
  category: 'CATEGORY',
  state: 'STATE',
  institute: 'INSTITUTE',
  course: 'COURSE',
  seats: 'SEATS',
  fee: 'FEE',
  stipendYear1: 'STIPEND YEAR 1',
  bondYears: 'BOND YEARS',
  bondPenalty: 'BOND PENALTY',
  beds: 'BEDS',
};

export const DEFAULT_DISPLAYED_FIELDS: DisplayedFields = {
  round: true,
  stateRank: true,
  aiRank: true,
  quota: true,
  category: true,
  state: true,
  institute: true,
  course: true,
  seats: true,
  fee: true,
  stipendYear1: true,
  bondYears: true,
  bondPenalty: true,
  beds: true,
};

export const ALL_DYNAMIC_CR_FIELDS: DynamicCrFieldKey[] = (['2022', '2023', '2024', '2025'] as const).flatMap(
  year =>
    [1, 2, 3, 4, 5].map(
      round => `cr_${year}_${round}` as DynamicCrFieldKey,
    ),
);

export function getDynamicCrLabel(field: string): string {
  const stateMatch = /^crState_(\d{4})_(\d+)$/.exec(field);
  if (stateMatch) {
    return `CR State ${stateMatch[1]} ${stateMatch[2]}`;
  }
  const match = /^cr_(\d{4})_(\d+)$/.exec(field);
  if (!match) return field;
  return `CR ${match[1]} ${match[2]}`;
}

export type InsightsPageType =
  | 'Allotments'
  | 'Closing Ranks'
  | 'Seat Matrix'
  | 'Fee, Stipend and Bond';

export const PAGE_FIELD_CONFIG: Record<InsightsPageType, { staticFields: BaseDisplayedFieldKey[]; includeDynamicCr: boolean }> = {
  Allotments: {
    staticFields: ['round', 'stateRank', 'aiRank', 'state', 'institute', 'course', 'quota', 'category', 'fee', 'stipendYear1', 'bondYears', 'bondPenalty', 'beds'],
    includeDynamicCr: false,
  },
  'Closing Ranks': {
    staticFields: ['quota', 'category', 'stateRank', 'aiRank', 'state', 'institute', 'course', 'fee', 'stipendYear1', 'bondYears', 'bondPenalty', 'beds'],
    includeDynamicCr: true,
  },
  'Seat Matrix': {
    staticFields: ['round', 'quota', 'category', 'state', 'institute', 'course', 'seats', 'fee', 'stipendYear1', 'bondYears', 'bondPenalty', 'beds'],
    includeDynamicCr: true,
  },
  'Fee, Stipend and Bond': {
    staticFields: ['state', 'institute', 'course', 'quota', 'fee', 'stipendYear1', 'bondYears', 'bondPenalty', 'beds'],
    includeDynamicCr: false,
  },
};
