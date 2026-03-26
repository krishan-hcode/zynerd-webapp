export interface IInsightRecord {
  id: string;
  counsellingSlug: string;
  round: number;
  aiRank: number | null;
  stateRank: number | null;
  state: string;
  institute: string;
  instituteDisplayName?: string;
  course: string;
  courseDisplayName?: string;
  quota: string;
  category: string;
  fee: string;
  beds: number;
  bondYears: number;
  bondPenalty: string;
  stipendYear1: string;
  stipendYear2: string;
  stipendYear3: string;
  seatLeavingPenalty: string;
  /** Optional: for session filter */
  session?: string;
  /** Optional: for institute type filter */
  instituteType?: 'Government' | 'Private';
  /** Optional: for course type filter (e.g. Clinical, Non-Clinical) */
  courseType?: string;
  /** Optional: for degree filter (e.g. MD, MS, DNB) */
  degree?: string;
  /** Optional: seat count for Seat Matrix page */
  seats?: number;
  /** Optional dynamic closing-rank style fields, e.g. cr_2025_1 */
  [key: `cr_${number}_${number}` | `crState_${number}_${number}`]:
    | number
    | string
    | number[]
    | string[]
    | null
    | undefined;

  // Optional remarks fields for detailed UI
  feeRemarks?: string | null;
  bondPenaltyRemarks?: string | null;
  stipendYear1Remarks?: string | null;
  seatLeavingPenaltyRemarks?: string | null;
  courseDiscontinuationPenaltyRemarks?: string | null;
}
