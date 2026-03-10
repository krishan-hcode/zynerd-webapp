export interface IInsightRecord {
  id: string;
  counsellingSlug: string;
  round: number;
  aiRank: number | null;
  stateRank: number | null;
  state: string;
  institute: string;
  course: string;
  quota: string;
  category: string;
  fee: string;
  beds: number;
  bondYears: number;
  bondPenalty: string;
  stipendYear1: string;
  /** Optional: for session filter */
  session?: string;
  /** Optional: for institute type filter */
  instituteType?: 'Government' | 'Private';
  /** Optional: for course type filter (e.g. Clinical, Non-Clinical) */
  courseType?: string;
  /** Optional: for degree filter (e.g. MD, MS, DNB) */
  degree?: string;
}
