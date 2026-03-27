import {generateCoursesData} from '@/data/coursesGeneratedData';
import {generateUniversitiesAndInstitutes} from '@/data/institutesGeneratedData';
import type {ICourse} from '@/types/courses.types';
import type {IInstitute} from '@/types/institutes.types';
import type {IExploreDataRepository} from '@/types/exploreData.types';
import type {IUniversity} from '@/types/universities.types';
import {deriveUniversities} from '@/utils/universities';
let cachedInstitutes: IInstitute[] | null = null;
let cachedCourses: ICourse[] | null = null;
const getLocalInstitutes = (): IInstitute[] => {
  if (cachedInstitutes) return cachedInstitutes;
  cachedInstitutes = generateUniversitiesAndInstitutes();
  return cachedInstitutes;
};
const getLocalCourses = (): ICourse[] => {
  if (cachedCourses) return cachedCourses;
  cachedCourses = generateCoursesData();
  return cachedCourses;
};

export const localExploreDataRepository: IExploreDataRepository = {
  async getInstitutes() {
    return getLocalInstitutes();
  },
  async getUniversities() {
    return deriveUniversities(getLocalInstitutes()) as IUniversity[];
  },
  async getCourses() {
    return getLocalCourses();
  },
};
