import type {IInstitute} from '@/types/institutes.types';

const STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

const INSTITUTE_TYPES: IInstitute['instituteType'][] = [
  'Government Institute',
  'Private Institute (State University)',
  'Deemed',
  'INI (Institute of National Importance)',
  'AFMS',
];

const AUTHORITIES = [
  'State Authority',
  'Central Authority',
  'Deemed Authority',
];

const COUNSELLING_BODIES = [
  'MCC',
  'State CET Cell',
  'Dr. NTRUHS',
  'KEA',
  'DME',
];
const LOCAL_DISTINCTIONS = [
  'AU Local',
  'State Quota',
  'Home University',
  'All India',
  'Minority',
];

const CITIES = [
  'Hyderabad',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Mumbai',
  'Pune',
  'Lucknow',
  'Jaipur',
  'Patna',
  'Ahmedabad',
];

const UNIVERSITY_SEEDS: Array<{name: string; state: string; city: string}> = [
  {name: 'Andhra Medical Sciences University', state: 'Andhra Pradesh', city: 'Vijayawada'},
  {name: 'Bihar Institute of Health University', state: 'Bihar', city: 'Patna'},
  {name: 'Delhi Health Sciences University', state: 'Delhi', city: 'New Delhi'},
  {name: 'Gujarat Medical Education University', state: 'Gujarat', city: 'Ahmedabad'},
  {name: 'Karnataka Clinical Sciences University', state: 'Karnataka', city: 'Bengaluru'},
  {name: 'Kerala Medical Innovation University', state: 'Kerala', city: 'Kochi'},
  {name: 'Madhya Health and Research University', state: 'Madhya Pradesh', city: 'Bhopal'},
  {name: 'Maharashtra National Medical University', state: 'Maharashtra', city: 'Mumbai'},
  {name: 'Punjab Allied Health University', state: 'Punjab', city: 'Ludhiana'},
  {name: 'Rajasthan Health Policy University', state: 'Rajasthan', city: 'Jaipur'},
  {name: 'Tamil Nadu Institute of Medicine University', state: 'Tamil Nadu', city: 'Chennai'},
  {name: 'Telangana Advanced Clinical University', state: 'Telangana', city: 'Hyderabad'},
  {name: 'Uttar Pradesh Medical Studies University', state: 'Uttar Pradesh', city: 'Lucknow'},
  {name: 'West Bengal Medical Scholars University', state: 'West Bengal', city: 'Kolkata'},
  {name: 'Coastal Health Sciences University', state: 'Andhra Pradesh', city: 'Visakhapatnam'},
  {name: 'Eastern Clinical University', state: 'Bihar', city: 'Gaya'},
  {name: 'Capital Region Medical University', state: 'Delhi', city: 'New Delhi'},
  {name: 'Western India Medical University', state: 'Gujarat', city: 'Surat'},
  {name: 'South Tech Health University', state: 'Karnataka', city: 'Mysuru'},
  {name: 'Malabar Medical University', state: 'Kerala', city: 'Kozhikode'},
  {name: 'Central India Institute University', state: 'Madhya Pradesh', city: 'Indore'},
  {name: 'Konkan Medical University', state: 'Maharashtra', city: 'Pune'},
  {name: 'Doaba Health University', state: 'Punjab', city: 'Jalandhar'},
  {name: 'Desert State Medical University', state: 'Rajasthan', city: 'Jodhpur'},
  {name: 'Cauvery Medical University', state: 'Tamil Nadu', city: 'Coimbatore'},
  {name: 'Deccan Clinical University', state: 'Telangana', city: 'Warangal'},
  {name: 'Ganga Medical University', state: 'Uttar Pradesh', city: 'Varanasi'},
  {name: 'Hooghly Health University', state: 'West Bengal', city: 'Howrah'},
  {name: 'National Institute University of Medicine', state: 'Andhra Pradesh', city: 'Kakinada'},
  {name: 'Frontier Medical University', state: 'Karnataka', city: 'Hubli'},
];

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const generateUniversitiesAndInstitutes = (): IInstitute[] =>
  (() => {
    const slugCounts = new Map<string, number>();
    return UNIVERSITY_SEEDS.flatMap((universitySeed, universityIdx) =>
      Array.from({length: 2}, (_, instituteIdx) => {
        const idx = universityIdx * 2 + instituteIdx;
        const instituteName = `${universitySeed.city} Medical College ${instituteIdx + 1}`;
        const instituteType = INSTITUTE_TYPES[idx % INSTITUTE_TYPES.length];
        const authority = AUTHORITIES[idx % AUTHORITIES.length];
        const counsellingBody = COUNSELLING_BODIES[idx % COUNSELLING_BODIES.length];
        const localDistinction = LOCAL_DISTINCTIONS[idx % LOCAL_DISTINCTIONS.length];
        const baseSlug = slugify(instituteName);
        const seenCount = slugCounts.get(baseSlug) ?? 0;
        slugCounts.set(baseSlug, seenCount + 1);
        return {
          id: idx + 1,
          slug: seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`,
          name: instituteName,
          university: `${universitySeed.name}, ${universitySeed.city}`,
          city: universitySeed.city || CITIES[idx % CITIES.length],
          state: universitySeed.state || STATES[idx % STATES.length],
          instituteType,
          authority,
          counsellingBody,
          beds: 500 + (idx % 15) * 75,
          localDistinction,
        };
      }),
    );
  })();
