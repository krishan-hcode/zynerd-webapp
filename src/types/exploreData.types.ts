import type {IInstitute} from '@/types/institutes.types';
import type {IUniversity} from '@/types/universities.types';
import type {ICourse} from '@/types/courses.types';

export interface IExploreDataRepository {
  getInstitutes: () => Promise<IInstitute[]>;
  getUniversities: () => Promise<IUniversity[]>;
  getCourses: () => Promise<ICourse[]>;
}
