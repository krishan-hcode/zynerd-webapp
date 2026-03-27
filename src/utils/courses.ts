import type {ICourse} from '@/types/courses.types';

const getUniqueSorted = (values: string[]): string[] =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

export const getCourseClinicalTypeOptions = (courses: ICourse[]): string[] =>
  getUniqueSorted(courses.map(course => course.clinicalType));

export const getCourseDegreeTypeOptions = (courses: ICourse[]): string[] =>
  getUniqueSorted(courses.map(course => course.degreeType));

export const getCourseDegreeTermOptions = (courses: ICourse[]): string[] =>
  getUniqueSorted(courses.map(course => course.degreeTerm));
