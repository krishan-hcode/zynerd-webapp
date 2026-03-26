import type {IInsightRecord} from '@/types/insights.types';
import type {InsightFilters} from '@/insights/insightsFilter.types';

function parseFee(fee: string): number | null {
  const num = fee.replace(/[^\d]/g, '');
  return num ? parseInt(num, 10) : null;
}

function parseBondPenalty(penalty: string): number | null {
  if (!penalty || penalty === '—' || penalty === '-') return null;
  const num = penalty.replace(/[^\d]/g, '');
  return num ? parseInt(num, 10) : null;
}

function toNum(v: number | ''): number | null {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function applyInsightFilters(
  records: IInsightRecord[],
  filters: InsightFilters,
): IInsightRecord[] {
  return records.filter(record => {
    const aiRank = record.aiRank ?? null;
    const stateRank = record.stateRank ?? null;
    const feeNum = parseFee(record.fee);

    const aiMin = toNum(filters.aiRankMin);
    const aiMax = toNum(filters.aiRankMax);
    if (aiMin != null && (aiRank == null || aiRank < aiMin)) return false;
    if (aiMax != null && (aiRank == null || aiRank > aiMax)) return false;

    const srMin = toNum(filters.stateRankMin);
    const srMax = toNum(filters.stateRankMax);
    if (srMin != null && (stateRank == null || stateRank < srMin)) return false;
    if (srMax != null && (stateRank == null || stateRank > srMax)) return false;

    if (record.session != null && filters.session && record.session !== filters.session) {
      return false;
    }

    if (filters.rounds.length > 0 && !filters.rounds.includes(record.round)) {
      return false;
    }

    if (filters.quotas.length > 0 && !filters.quotas.includes(record.quota)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(record.category)) return false;
    if (filters.states.length > 0 && !filters.states.includes(record.state)) return false;
    if (filters.institutes.length > 0 && !filters.institutes.includes(record.institute)) return false;

    if (record.instituteType && (filters.instituteType.government || filters.instituteType.private)) {
      const wantGovt = filters.instituteType.government;
      const wantPrivate = filters.instituteType.private;
      const isGovt = record.instituteType === 'Government';
      if (wantGovt && !wantPrivate && !isGovt) return false;
      if (wantPrivate && !wantGovt && isGovt) return false;
      if (wantGovt && wantPrivate) {
        // both selected: show both
      } else if (!wantGovt && !wantPrivate) {
        return false;
      }
    }

    const bedsMin = toNum(filters.bedsMin);
    const bedsMax = toNum(filters.bedsMax);
    if (bedsMin != null && record.beds < bedsMin) return false;
    if (bedsMax != null && record.beds > bedsMax) return false;

    if (feeNum != null) {
      const feeMin = toNum(filters.feeMin);
      const feeMax = toNum(filters.feeMax);
      if (feeMin != null && feeNum < feeMin) return false;
      if (feeMax != null && feeNum > feeMax) return false;
    }

    const bondYearsMin = toNum(filters.bondYearsMin);
    const bondYearsMax = toNum(filters.bondYearsMax);
    if (bondYearsMin != null && record.bondYears < bondYearsMin) return false;
    if (bondYearsMax != null && record.bondYears > bondYearsMax) return false;

    const bondPenaltyNum = parseBondPenalty(record.bondPenalty);
    if (bondPenaltyNum != null) {
      const penaltyMin = toNum(filters.bondPenaltyMin);
      const penaltyMax = toNum(filters.bondPenaltyMax);
      if (penaltyMin != null && bondPenaltyNum < penaltyMin) return false;
      if (penaltyMax != null && bondPenaltyNum > penaltyMax) return false;
    }

    const seatsMin = toNum(filters.seatsMin);
    const seatsMax = toNum(filters.seatsMax);
    const seats = record.seats ?? null;
    if (seatsMin != null && (seats == null || seats < seatsMin)) return false;
    if (seatsMax != null && (seats == null || seats > seatsMax)) return false;

    if (filters.course.length > 0) {
      const recordCourseNorm = record.course?.trim().toUpperCase() ?? '';
      const selectedNorm = filters.course.map(c => c.trim().toUpperCase());
      if (!recordCourseNorm || !selectedNorm.includes(recordCourseNorm)) {
        return false;
      }
    }

    if (filters.courseType.length > 0) {
      const recordCourseType = record.courseType?.trim() ?? '';
      if (!recordCourseType || !filters.courseType.includes(recordCourseType)) {
        return false;
      }
    }

    if (filters.degree.length > 0) {
      const recordDegree = record.degree?.trim() ?? '';
      if (!recordDegree || !filters.degree.includes(recordDegree)) {
        return false;
      }
    }

    return true;
  });
}
