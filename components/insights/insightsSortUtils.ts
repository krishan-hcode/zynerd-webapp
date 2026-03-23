import type { IInsightRecord } from '@/types/insights.types';
import type { SortByOption } from '@/insights/SortByModal';

export type SortDirection = 'asc' | 'desc';

/** Parse currency string (e.g. "₹15,000*") to number for sorting */
function parseCurrency(value: string): number {
  const num = value.replace(/[^\d]/g, '');
  return num ? parseInt(num, 10) : 0;
}

function compareNum(a: number | null, b: number | null): number {
  const va = a ?? -Infinity;
  const vb = b ?? -Infinity;
  return va - vb;
}

function compareStr(a: string, b: string): number {
  return (a ?? '').localeCompare(b ?? '', undefined, { sensitivity: 'base' });
}

export function sortInsightRecords(
  records: IInsightRecord[],
  sortBy: SortByOption,
  direction: SortDirection = 'asc',
): IInsightRecord[] {
  if (sortBy === 'default') {
    return [...records];
  }

  const multiplier = direction === 'desc' ? -1 : 1;
  return [...records].sort((a, b) => {
    let result: number;
    switch (sortBy) {
      case 'round':
        result = a.round - b.round;
        break;
      case 'stateRank':
        result = compareNum(a.stateRank, b.stateRank);
        break;
      case 'aiRank':
        result = compareNum(a.aiRank, b.aiRank);
        break;
      case 'state':
        result = compareStr(a.state, b.state);
        break;
      case 'institute':
        result = compareStr(a.institute, b.institute);
        break;
      case 'course':
        result = compareStr(a.course, b.course);
        break;
      case 'quota':
        result = compareStr(a.quota, b.quota);
        break;
      case 'category':
        result = compareStr(a.category, b.category);
        break;
      case 'fee':
        result = parseCurrency(a.fee) - parseCurrency(b.fee);
        break;
      case 'beds':
        result = a.beds - b.beds;
        break;
      case 'bondYears':
        result = a.bondYears - b.bondYears;
        break;
      case 'bondPenalty': {
        const pa = a.bondPenalty && a.bondPenalty !== '—' ? parseCurrency(a.bondPenalty) : -Infinity;
        const pb = b.bondPenalty && b.bondPenalty !== '—' ? parseCurrency(b.bondPenalty) : -Infinity;
        result = pa - pb;
        break;
      }
      case 'stipendYear1':
        result = parseCurrency(a.stipendYear1) - parseCurrency(b.stipendYear1);
        break;
      default:
        result = 0;
    }
    return result * multiplier;
  });
}
