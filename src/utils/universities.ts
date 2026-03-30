import type {IInstitute} from '@/types/institutes.types';
import type {IUniversity, IUniversityLookupResult} from '@/types/universities.types';

const UNIVERSITY_TYPE_PRIORITY: string[] = [
  'Central University',
  'State Autonomous',
  'State Govt University',
  'State Private University',
  'Deemed University',
  'State University',
];

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getMostFrequentValue = (values: string[]): string => {
  const counts = new Map<string, number>();
  values.forEach(value => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  const sortedByFrequency = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  return sortedByFrequency[0]?.[0] ?? '';
};

const inferUniversityType = (institutes: IInstitute[]): string => {
  const universityName = institutes[0]?.university.toLowerCase() ?? '';
  const hasDeemedInstitute = institutes.some(i =>
    i.instituteType.toLowerCase().includes('deemed'),
  );
  const hasCentralAuthority = institutes.some(i =>
    i.authority.toLowerCase().includes('central'),
  );
  const hasStateAuthority = institutes.some(i =>
    i.authority.toLowerCase().includes('state'),
  );
  const hasPrivateInstitute = institutes.some(i =>
    i.instituteType.toLowerCase().includes('private'),
  );
  if (hasDeemedInstitute || universityName.includes('academy of higher education')) {
    return 'Deemed University';
  }
  if (universityName.includes('autonomous')) return 'State Autonomous';
  if (hasCentralAuthority || universityName.includes('aiims')) return 'Central University';
  if (hasPrivateInstitute) return 'State Private University';
  if (hasStateAuthority) return 'State Govt University';
  return 'State University';
};

export const deriveUniversities = (institutes: IInstitute[]): IUniversity[] => {
  const grouped = new Map<string, IInstitute[]>();
  institutes.forEach(institute => {
    const existing = grouped.get(institute.university) ?? [];
    grouped.set(institute.university, [...existing, institute]);
  });

  const slugCounts = new Map<string, number>();
  return Array.from(grouped.entries())
    .map(([name, linkedInstitutes], index) => {
      const baseSlug = slugify(name);
      const seen = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, seen + 1);
      return {
        id: index + 1,
        name,
        slug: seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`,
        state: getMostFrequentValue(linkedInstitutes.map(i => i.state)),
        universityType: inferUniversityType(linkedInstitutes),
        instituteCount: linkedInstitutes.length,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getUniversityTypeOptions = (universities: IUniversity[]): string[] =>
  UNIVERSITY_TYPE_PRIORITY.filter(type =>
    universities.some(university => university.universityType === type),
  );

export const getUniversityStateOptions = (universities: IUniversity[]): string[] =>
  Array.from(new Set(universities.map(university => university.state))).sort((a, b) =>
    a.localeCompare(b),
  );

export const getUniversityWithAffiliatedInstitutes = (
  slug: string,
  institutes: IInstitute[],
): IUniversityLookupResult => {
  const universities = deriveUniversities(institutes);
  const university = universities.find(item => item.slug === slug) ?? null;
  if (!university) {
    return {university: null, affiliatedInstitutes: []};
  }
  const affiliatedInstitutes = institutes.filter(
    institute => institute.university === university.name,
  );
  return {university, affiliatedInstitutes};
};
