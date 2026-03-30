import type {ICourse} from '@/types/courses.types';

const SPECIALTIES = [
  'Anaesthesia',
  'Cardiology',
  'Child Health',
  'Clinical Pathology',
  'Community Medicine',
  'Dermatology, Venereology and Leprosy',
  'Diabetology',
  'Emergency Medicine',
  'Forensic Medicine',
  'Health Administration',
  'Health Education',
  'Hospital Administration',
  'Immuno-Haematology and Blood Transfusion',
  'Industrial Health',
  'Leprosy',
  'Marine Medicine',
  'Microbiology',
  'Obstetrics and Gynaecology',
  'Ophthalmology',
  'Orthopaedics',
  'Oto-Rhino-Laryngology',
  'Physical Medicine and Rehabilitation',
  'Psychological Medicine',
  'Public Health',
  'Radiation Medicine',
  'Radio Therapy',
  'Radio-Diagnosis',
  'Sports Medicine',
  'Transfusion Medicine',
  'Tuberculosis and Chest Diseases',
  'Biochemistry',
  'Bio-Physics',
  'CCM',
  'Anatomy',
  'Aviation Medicine/Aerospace Medicine',
  'Community and Family Medicine',
  'Family Medicine',
  'General Medicine',
  'Geriatrics',
  'Immunology',
  'Medical Genetics',
  'Nuclear Medicine',
  'Pediatrics',
];

const CLINICAL_TYPES = [
  'Clinical',
  'Para-Clinical',
  'Non-Clinical',
  'Pre-Clinical / Degree',
];

const DEGREE_CONFIGS = [
  {degreeType: 'Diploma', degreeTerm: '2 years'},
  {degreeType: 'MD', degreeTerm: '3 years'},
  {degreeType: 'MS', degreeTerm: '3 years'},
] as const;

const buildCourseName = (degreeType: string, specialty: string): string => {
  if (degreeType === 'Diploma') {
    return `Diploma in ${specialty}`;
  }
  return `${degreeType} ${specialty}`;
};

export const generateCoursesData = (): ICourse[] =>
  Array.from({length: 127}, (_, index) => {
    const specialty = SPECIALTIES[index % SPECIALTIES.length];
    const degreeConfig = DEGREE_CONFIGS[Math.floor(index / SPECIALTIES.length)];
    const clinicalType = CLINICAL_TYPES[(index + degreeConfig.degreeType.length) % CLINICAL_TYPES.length];

    return {
      id: index + 1,
      name: buildCourseName(degreeConfig.degreeType, specialty),
      clinicalType,
      degreeType: degreeConfig.degreeType,
      degreeTerm: degreeConfig.degreeTerm,
    };
  });
