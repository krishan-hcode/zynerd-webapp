'use client';

import Modal from '@/common/Modal';
import {
  BASE_URL,
  COLLEGE_LIST_ROUTE,
  collegeStates,
  collegeYears,
  GET_COURSES_PATH,
  UPDATE_USER_PROFILE_PATH,
  USER_DATA_KEY,
} from '@/constants';
import {DropArrowDownIcon} from '@/elements/Icons';
import {IUserData} from '@/global/UserContext';
import {useUserSubscription} from '@/hooks/useUserSubscription';
import {fetchHelper, showToast} from '@/utils/helpers';
import {hasAnyActiveSubscription} from '@/utils/utils';
import {Field, Form, Formik} from 'formik';
import {updateUserData} from 'lib/redux/slices/userSlice';
import {RootState} from 'lib/redux/store';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';

type EducationValues = {
  course: string;
  college_state: string;
  college: string;
  current_year: string;
};

// Extended user data type that can handle both string and object formats
interface ExtendedUserData extends Omit<
  IUserData,
  'college_state' | 'current_year'
> {
  college_state: string | {key: string; name: string};
  current_year: string | {key: string; name: string};
}

interface Course {
  id: string | number;
  name: string;
}

interface College {
  id: string | number;
  name: string;
}

// Helper function to convert string to number for course/college IDs
const convertToNumber = (id: string | number): number => {
  return typeof id === 'string' ? parseInt(id, 10) : id;
};

interface CollegeState {
  key: string;
  name: string;
}

interface CollegeYear {
  key: string;
  name: string;
}

interface EducationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ValidationSchema = Yup.object().shape({
  course: Yup.string().required('Required'),
  college_state: Yup.string().required('Required'),
  college: Yup.string().required('Required'),
  current_year: Yup.string().required('Required'),
});

const EducationEditModal: React.FC<EducationEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((s: RootState) => s.user.userInfo);
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const initialValues: EducationValues = useMemo(() => {
    return {
      course: userData?.course?.id?.toString?.() || '',
      college_state:
        typeof userData?.college_state === 'object'
          ? (userData?.college_state as {key: string; name: string})?.key
          : userData?.college_state || collegeStates[0].key,
      college: userData?.college?.id?.toString?.() || '',
      current_year:
        typeof userData?.current_year === 'object'
          ? (userData?.current_year as {key: string; name: string})?.key
          : userData?.current_year || '',
    };
  }, [userData]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await fetchHelper(BASE_URL + GET_COURSES_PATH, 'GET');
        if (res.status === 200 && res.data) setCourses(res.data);
      } catch {}
    };
    getCourses();
  }, []);

  const fetchColleges = async (stateKey: string) => {
    try {
      const res = await fetchHelper(
        BASE_URL + COLLEGE_LIST_ROUTE + `?state=${stateKey}`,
        'GET',
      );
      if (res.status === 200 && res.data) {
        setColleges(res.data);
      }
    } catch {}
  };

  const {isMissionPlan} = useUserSubscription(userData ?? undefined);

  useEffect(() => {
    const stateKey = initialValues.college_state || collegeStates[0].key;
    fetchColleges(stateKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (values: EducationValues) => {
    setLoading(true);
    try {
      // Only include changed fields compared to initialValues
      const payload: Partial<EducationValues> = {};
      if (values.course && values.course !== initialValues.course) {
        payload.course = values.course;
      }
      if (
        values.college_state &&
        values.college_state !== initialValues.college_state
      ) {
        payload.college_state = values.college_state;
      }
      if (values.college && values.college !== initialValues.college) {
        payload.college = values.college;
      }
      if (
        values.current_year &&
        values.current_year !== initialValues.current_year
      ) {
        payload.current_year = values.current_year;
      }

      if (Object.keys(payload).length === 0) {
        showToast('success', 'No changes to save');
        onClose();
        return;
      }
      const res = await fetchHelper(
        BASE_URL + UPDATE_USER_PROFILE_PATH,
        'PATCH',
        payload,
      );
      if (res.status === 200 && res.data) {
        // Merge server response with enriched objects so UI shows names immediately
        const merged: ExtendedUserData = {
          ...(userData as ExtendedUserData),
          ...(res.data as Partial<ExtendedUserData>),
        };
        if (payload.course) {
          const courseObj = courses.find(
            c => String(c.id) === String(values.course),
          );
          merged.course = {
            id: convertToNumber(values.course),
            name: courseObj?.name || merged.course?.name,
            created_at: merged.course?.created_at || new Date().toISOString(),
          };
        }
        // If course wasn't changed but API returned a primitive id, keep previous object to avoid UI blanks
        if (!payload.course && merged && typeof merged.course !== 'object') {
          merged.course =
            (userData as ExtendedUserData)?.course || merged.course;
        }
        if (payload.college) {
          const collegeObj = colleges.find(
            c => String(c.id) === String(values.college),
          );
          merged.college = {
            id: convertToNumber(values.college),
            name: collegeObj?.name || merged.college?.name,
            country: merged.college?.country || '',
            created_at: merged.college?.created_at || new Date().toISOString(),
            state: merged.college?.state || '',
          };
        }
        if (!payload.college && merged && typeof merged.college !== 'object') {
          merged.college =
            (userData as ExtendedUserData)?.college || merged.college;
        }
        // College State
        if (payload.college_state) {
          const stateObj: CollegeState | undefined = collegeStates.find(
            s => s.key === values.college_state,
          );
          merged.college_state = {
            key: values.college_state,
            name: stateObj?.name || values.college_state,
          };
        } else if (merged && typeof merged.college_state === 'string') {
          const stateObj: CollegeState | undefined = collegeStates.find(
            s => s.key === merged.college_state,
          );
          merged.college_state = {
            key: merged.college_state,
            name: stateObj?.name || merged.college_state,
          };
        }

        // Current Year
        if (payload.current_year) {
          const yearObj: CollegeYear | undefined = collegeYears.find(
            y => y.key === values.current_year,
          );
          merged.current_year = {
            key: values.current_year,
            name: yearObj?.name || values.current_year,
          };
        } else if (merged && typeof merged.current_year === 'string') {
          const yearObj: CollegeYear | undefined = collegeYears.find(
            y => y.key === merged.current_year,
          );
          merged.current_year = {
            key: merged.current_year,
            name: yearObj?.name || merged.current_year,
          };
        }

        // Convert back to IUserData format for Redux store
        dispatch(updateUserData(merged as IUserData));
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(merged));

        showToast('success', 'Education details updated');
        onClose();
      } else {
        showToast('error', 'Failed to update. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = useMemo(() => {
    return hasAnyActiveSubscription(userData?.subscription_info ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.subscription_info]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={true}
      containerAdditionalClasses="max-w-xl rounded-2xl font-sauce">
      <h2 className="text-2xl font-regular text-primary-dark mb-6 font-besley">
        Edit Education Details
      </h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}>
        {({setFieldValue, errors, touched, dirty}) => (
          <Form className="space-y-4">
            {/* Course */}
            <div>
              <label className="block text-xs font-inter font-medium text-primary-dark mb-2">
                Exam / Course <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  disabled={!(isMissionPlan || !hasActiveSubscription)}
                  as="select"
                  name="course"
                  className="w-full appearance-none [background-image:none] py-4 px-4 border rounded-xl text-sm text-primary-dark font-sauce font-medium border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                <DropArrowDownIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
                  width={24}
                  height={24}
                />
              </div>
              {touched.course && errors.course && (
                <div className="text-red-500 text-sm mt-1">
                  {String(errors.course)}
                </div>
              )}
            </div>

            {/* College State */}
            <div>
              <label className="block text-xs font-inter font-medium text-primary-dark mb-2">
                College State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  as="select"
                  name="college_state"
                  className="w-full appearance-none [background-image:none] py-4 px-4 border rounded-xl border-gray-300 text-sm text-primary-dark font-sauce font-medium"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('college_state', e.target.value);
                    fetchColleges(e.target.value);
                  }}>
                  {collegeStates.map(s => (
                    <option key={s.key} value={s.key}>
                      {s.name}
                    </option>
                  ))}
                </Field>
                <DropArrowDownIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark pointer-events-none"
                  width={24}
                  height={24}
                />
              </div>

              {touched.college_state && errors.college_state && (
                <div className="text-red-500 text-sm mt-1">
                  {String(errors.college_state)}
                </div>
              )}
            </div>

            {/* College */}
            <div className="relative">
              <label className="block text-xs font-inter font-medium text-primary-dark mb-2">
                College <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Field
                  as="select"
                  name="college"
                  className="w-full appearance-none [background-image:none] py-4 pl-4 pr-10 border rounded-xl border-gray-300 text-sm text-primary-dark font-sauce font-medium truncate">
                  <option value="" disabled>
                    Select College
                  </option>
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Field>

                {/* Custom dropdown icon — absolutely positioned */}
                <DropArrowDownIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark pointer-events-none"
                  width={24}
                  height={24}
                />
              </div>

              {touched.college && errors.college && (
                <div className="text-red-500 text-sm mt-1">
                  {String(errors.college)}
                </div>
              )}
            </div>

            {/* Current Year */}
            <div>
              <label className="block text-xs font-inter font-medium text-primary-dark mb-2">
                Current Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  as="select"
                  name="current_year"
                  className="w-full appearance-none [background-image:none] py-4 px-4 border rounded-xl border-gray-300 text-sm text-primary-dark font-sauce font-medium">
                  <option value="" disabled>
                    Select Year
                  </option>
                  {collegeYears.map(y => (
                    <option key={y.key} value={y.key}>
                      {y.name}
                    </option>
                  ))}
                </Field>
                {/* Custom dropdown icon — absolutely positioned */}
                <DropArrowDownIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark pointer-events-none"
                  width={24}
                  height={24}
                />
              </div>
              {touched.current_year && errors.current_year && (
                <div className="text-red-500 text-sm mt-1">
                  {String(errors.current_year)}
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                type="submit"
                disabled={loading || !dirty}
                className="flex-1 bg-primary-blue text-white py-4 px-4 rounded-2xl  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {loading ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-white border border-customGray-20 text-gray-700 py-4 px-4 rounded-2xl hover:bg-gray-300 focus:outline-none disabled:opacity-50 font-medium">
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EducationEditModal;
