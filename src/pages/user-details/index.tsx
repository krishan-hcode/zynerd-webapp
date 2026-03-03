// pages/personal-details.tsx
import {
  BASE_URL,
  COLLEGE_LIST_ROUTE,
  collegeStates,
  collegeYears,
  GET_COURSES_PATH,
  UPDATE_USER_PROFILE_PATH,
  USER_DATA_KEY,
} from '@/constants';
import Button from '@/elements/Button';
import {CalenderProfileIcon, PencilIcon, RemoveIcon} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import LeftSidebar from '@/signup/leftsidebar';
import {fetchHelper, showToast} from '@/utils/helpers';
import {buildErrorMessage, classNames} from '@/utils/utils';
import dayjs from 'dayjs';
import {ErrorMessage, Field, Formik, Form as FormikForm} from 'formik';
import {updateUserData} from 'lib/redux/slices/userSlice';
import {RootState} from 'lib/redux/store';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';

interface ICourse {
  id: string;
  name: string;
}

interface ICollege {
  id: string;
  name: string;
}

const PersonalDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is required')
    .max(40, 'Full Name must be at most 40 characters')
    .matches(/^[A-Za-z\s]+$/, 'Only alphabets and spaces are allowed'),
  email: Yup.string()
    .matches(
      /^[A-Za-z0-9._%+\-@]+$/,
      'Only letters, numbers and . _ % + - are allowed',
    )
    .email('Enter a valid email')
    .required('Email is required'),
  birth_date: Yup.date()
    .required('Birthday is required')
    .max(new Date('2008-02-01'), 'Birth date must be on or before 01 Feb 2008'),
  referral: Yup.string()
    .nullable()
    .test(
      'referral-length',
      'Referral code must be at least 4 characters',
      val => !val || val.length >= 4,
    ),
});

const EducationDetailsSchema = Yup.object().shape({
  college_state: Yup.string().required('College State is required'),
  college: Yup.string().required('College is required'),
  current_year: Yup.string().required('Current Year is required'),
});

const CourseExamSchema = Yup.object().shape({
  exam: Yup.string().required('Please select an exam'),
});

const PersonalDetails = () => {
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [personalValues, setPersonalValues] = useState<any | null>(null);
  const [educationValues, setEducationValues] = useState<any | null>(null);

  // Functionality from old code
  const [availableCourses, setAvailableCourses] = useState<ICourse[]>([]);
  const [collegeList, setCollegeList] = useState<ICollege[]>([]);
  const [selectedCollegeState, setSelectedCollegeState] = useState(
    collegeStates[0].key,
  );

  const {setEmail, setUserData} = useContext(UserContext);
  const dispatch = useDispatch();

  // Fetch available courses
  const fetchAvailableCourses = useCallback(async () => {
    try {
      const response = await fetchHelper(BASE_URL + GET_COURSES_PATH, 'GET');
      if (response.status === 200 && response.data) {
        setAvailableCourses(response.data);
      } else {
        showToast('error', 'Unable to get available courses');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
  }, []);

  // Fetch college list based on state
  const fetchCollegeList = useCallback(async (state: string) => {
    try {
      const response = await fetchHelper(
        BASE_URL + COLLEGE_LIST_ROUTE + `?state=${state}`,
        'GET',
      );
      if (response.status === 200 && response.data) {
        setCollegeList(response.data);
      } else {
        showToast('error', 'Unable to get college list');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
  }, []);

  const openBirthDatePicker = () => {
    const el = document.getElementById('birth_date') as HTMLInputElement | null;
    if (el) {
      // @ts-ignore
      if (typeof el.showPicker === 'function') {
        // @ts-ignore
        el.showPicker();
      } else {
        el.focus();
        el.click();
      }
    }
  };

  // Load courses on mount
  useEffect(() => {
    fetchAvailableCourses();
  }, [fetchAvailableCourses]);

  // Load colleges when state changes
  useEffect(() => {
    if (selectedCollegeState) {
      fetchCollegeList(selectedCollegeState);
    }
  }, [fetchCollegeList, selectedCollegeState]);

  const handleSubmit = (values: any) => {
    setPersonalValues(values);
    setStep(2);
  };

  const handleEducationSubmit = (values: any) => {
    setEducationValues(values);
    setStep(3);
  };

  // Fetch and hydrate latest user profile into context/redux/localStorage
  const hydrateUserProfile = async () => {
    const userProfile = await fetchHelper(
      BASE_URL + UPDATE_USER_PROFILE_PATH,
      'GET',
    );

    if (userProfile.status === 200 && userProfile.data) {
      setEmail && setEmail(userProfile.data?.email || '');
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile.data));
      setUserData && setUserData(userProfile.data);
      dispatch(updateUserData(userProfile.data));
    }
  };

  const handleCourseSubmit = async (values: any, {setSubmitting}: any) => {
    try {
      if (!personalValues || !educationValues) {
        setSubmitting(false);
        return;
      }

      const splitName = personalValues.name.split(' ');

      const payload = {
        first_name: splitName[0],
        last_name: splitName[1] || '',
        email: personalValues.email,
        birth_date: personalValues.birth_date,
        college_state: educationValues.college_state,
        college: educationValues.college,
        current_year: educationValues.current_year,
        course: values.exam,
        referred_by: personalValues.referral || '',
        tnc_approved: true,
      };

      let response;

      if (selectedFile) {
        // 🟦 Use FormData only if image is present
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('image_file', selectedFile);

        response = await fetchHelper(
          BASE_URL + UPDATE_USER_PROFILE_PATH,
          'PATCH',
          formData,
        );
      } else {
        // 🟨 Send JSON if no image
        response = await fetchHelper(
          BASE_URL + UPDATE_USER_PROFILE_PATH,
          'PATCH',
          payload,
        );
      }

      if (response.status === 200 && response.data) {
        await hydrateUserProfile(); // refresh data in store/localStorage
        const redirectUrl = localStorage.getItem('REDIRECT_AFTER_LOGIN');
        if (redirectUrl) {
          router.replace(redirectUrl);
          // Clear the saved redirect URL
          localStorage.removeItem('REDIRECT_AFTER_LOGIN');
          return;
        }
        router.replace('/plans');
      } else {
        showToast('error', buildErrorMessage(response?.error));
        setSubmitting(false);
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row">
      <Head>
        <title>
          {step === 1
            ? 'Personal Details'
            : step === 2
              ? 'Education Details'
              : 'Course/Exam'}
        </title>
      </Head>

      {/* Left Sidebar */}
      <LeftSidebar
        step={step}
        onBack={() =>
          setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))
        }
      />

      {/* Right Form Section */}
      <div className="flex-1 relative bg-white flex justify-center items-start p-5 md:p-10">
        {step === 1 ? (
          <Formik
            initialValues={{
              name: personalValues?.name || '',
              email: personalValues?.email || '',
              birth_date: personalValues?.birth_date || '',
              referral: personalValues?.referral || '',
            }}
            enableReinitialize
            validationSchema={PersonalDetailsSchema}
            onSubmit={handleSubmit}>
            {({errors, touched, values, setFieldValue, isValid, dirty}) => (
              <FormikForm className="bg-white px-5 md:px-20 lg:px-30 xl:px-40 justify-start rounded-2xl  w-full max-w-3xl mx-auto pb-24 lg:pb-0">
                {/* Top avatar and actions */}
                <div className="flex items-center pt-8">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="upload-photo"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setProfileImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {profileImage ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-primary-blue/10">
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="upload-photo"
                          className="inline-flex items-center space-x-2 border border-primary-blue text-[#0b1b33] px-4 py-[9px] rounded-lg text-sm cursor-pointer hover:bg-[#f6faff]">
                          <PencilIcon className="w-5 h-5 text-customGray-90" />
                          <span className="text-sm text-gray-90 font-inter font-medium">
                            Edit Photo
                          </span>
                        </label>
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => setProfileImage(null)}
                          className="w-12 h-10 bg-white border border-customGray-20 rounded-lg flex items-center justify-center">
                          <RemoveIcon className="w-6 h-6 text-primary-dark " />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <img
                        src="/assets/doctors.svg"
                        alt="Doctor"
                        className="w-18 h-18 inline"
                      />
                      <label
                        htmlFor="upload-photo"
                        className="inline-flex items-center space-x-2 border border-primary-blue text-[#0b1b33] px-4 py-1 rounded-xl text-sm cursor-pointer hover:bg-[#f6faff]">
                        <span className="text-[#1d78ff] text-lg">＋</span>
                        <span>Add Photo</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="pb-8 pt-6 ">
                  {/* Full Name */}
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="block text-primary-dark text-xs font-inter font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="name"
                      name="name"
                      maxLength={40}
                      placeholder="Enter Full Name"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const sanitized = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          '',
                        );
                        setFieldValue('name', sanitized);
                      }}
                      className="w-full border placeholder:text-sm placeholder:text-customGray-40 placeholder:font-openSauceOneMedium  font-openSauceOneMedium text-primary-dark text-sm border-customGray-10 p-4 h-14 rounded-xl mt-1 focus:outline-none"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="block text-primary-dark text-xs font-inter font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="email"
                      name="email"
                      placeholder="Enter Email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const sanitized = e.target.value.replace(
                          /[^A-Za-z0-9._%+\-@]/g,
                          '',
                        );
                        setFieldValue('email', sanitized);
                      }}
                      className="w-full border border-customGray-10 placeholder:text-sm placeholder:text-customGray-40 placeholder:font-openSauceOneMedium font-openSauceOneMedium text-sm text-primary-dark p-4 h-14 rounded-xl mt-1 focus:outline-none"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Birthday */}
                  <div className="mb-5">
                    <label
                      htmlFor="birth_date"
                      className="block text-primary-dark text-xs font-inter font-medium mb-1">
                      Birthday <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="relative cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openBirthDatePicker();
                        }
                      }}
                      onClick={() => {
                        openBirthDatePicker();
                      }}>
                      <div className="w-full px-3 py-4 pr-10 border border-customGray-10 rounded-lg text-primary-dark min-h-[54px] flex items-center font-openSauceOneMedium text-sm">
                        {values.birth_date &&
                        dayjs(values.birth_date).isValid() ? (
                          dayjs(values.birth_date).format('DD MMM, YYYY')
                        ) : (
                          <span className="font-openSauceOneMedium text-sm text-customGray-40">
                            Select Date
                          </span>
                        )}
                      </div>

                      <input
                        type="date"
                        id="birth_date"
                        value={values.birth_date}
                        onChange={e =>
                          setFieldValue('birth_date', e.target.value)
                        }
                        max="2008-02-01"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 bg-transparent"
                      />

                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalenderProfileIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <ErrorMessage
                      name="birth_date"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Referral Code */}
                  <div className="mb-8">
                    <label
                      htmlFor="referral"
                      className="block text-primary-dark text-xs font-inter font-medium mb-1">
                      Do you have a referral code?
                    </label>
                    <Field
                      id="referral"
                      name="referral"
                      placeholder="Enter Referral Code"
                      maxLength={50}
                      className="w-full border border-customGray-10 p-4 h-14 placeholder:text-sm placeholder:text-customGray-40 placeholder:font-openSauceOneMedium text-sm font-openSauceOneMedium text-primary-dark rounded-xl mt-1 focus:outline-none"
                    />
                    <ErrorMessage
                      name="referral"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="absolute left-0 right-0 hidden lg:block">
                    <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                  </div>

                  {/* Continue Button */}
                  <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-white lg:bg-transparent pt-4 pb-4 px-5 md:px-20 lg:pt-6 lg:pb-0 lg:px-0  lg:shadow-none z-50">
                    <div className="absolute top-[-5px] left-0 right-0 lg:hidden">
                      <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      additionalClasses={classNames(
                        'w-full h-14 text-sm font-interSemibold justify-center rounded-xl bg-customGray-90',
                        !isValid ? 'opacity-50 cursor-not-allowed' : '',
                      )}>
                      Continue
                    </Button>
                  </div>
                </div>
              </FormikForm>
            )}
          </Formik>
        ) : step === 2 ? (
          <Formik
            initialValues={{
              college_state: educationValues?.college_state || '',
              college: educationValues?.college || '',
              current_year: educationValues?.current_year || '',
            }}
            validateOnMount
            enableReinitialize
            validationSchema={EducationDetailsSchema}
            onSubmit={handleEducationSubmit}>
            {({errors, touched, isValid, setFieldValue, values, dirty}) => (
              <FormikForm className="bg-white px-5 lg:pt-6 md:px-20 lg:px-40 justify-start rounded-2xl w-full max-w-3xl mx-auto pb-24 lg:pb-0">
                <div className="grid gap-5">
                  {/* College State */}
                  <div>
                    <label
                      htmlFor="college_state"
                      className="block text-[#0b1b33] text-sm mb-1">
                      College State <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="college_state"
                      name="college_state"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newState = e.target.value;
                        setSelectedCollegeState(newState);
                        setFieldValue('college_state', newState);
                        setFieldValue('college', ''); // Reset college when state changes
                      }}
                      className={classNames(
                        'w-full font-openSauceOneMedium text-sm border border-customGray-10 px-4 h-12 rounded-xl mt-1 appearance-none bg-white cursor-pointer',
                        !values.college_state
                          ? 'text-customGray-40' // placeholder style
                          : 'text-primary-dark', // normal text
                        errors.college_state && touched.college_state
                          ? 'ring-2 ring-red-300'
                          : '',
                      )}>
                      <option value="" disabled>
                        Select College State
                      </option>
                      {collegeStates.map(state => (
                        <option key={state.key} value={state.key}>
                          {state.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="college_state"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* College */}
                  <div>
                    <label
                      htmlFor="college"
                      className="block text-[#0b1b33] text-sm mb-1">
                      College <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="college"
                      name="college"
                      className={classNames(
                        'w-full border border-customGray-10 text-primary-dark font-openSauceOneMedium text-sm pl-4 pr-7 h-12 rounded-xl mt-1 appearance-none bg-white truncate overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer',
                        !values.college
                          ? 'text-customGray-40' // placeholder style
                          : 'text-primary-dark', // normal text
                        errors.college && touched.college
                          ? 'ring-2 ring-red-300'
                          : '',
                      )}>
                      <option value="" disabled>
                        Select College
                      </option>
                      {collegeList.map(college => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="college"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Current Year */}
                  <div>
                    <label
                      htmlFor="current_year"
                      className="block text-[#0b1b33] text-sm mb-1">
                      Current Year <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="current_year"
                      name="current_year"
                      className={classNames(
                        'w-full border border-customGray-10 text-primary-dark font-openSauceOneMedium text-sm px-4 h-12 rounded-xl mt-1 appearance-none bg-white cursor-pointer',
                        !values.current_year
                          ? 'text-customGray-40' // placeholder style
                          : 'text-primary-dark', // normal text
                        errors.current_year && touched.current_year
                          ? 'ring-2 ring-red-300'
                          : '',
                      )}>
                      <option value="" disabled className="text-red-400">
                        Select Year
                      </option>
                      {collegeYears.map(year => (
                        <option key={year.key} value={year.key}>
                          {year.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="current_year"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="absolute left-0 right-0 hidden lg:block">
                  <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                </div>
                <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-white lg:bg-transparent pt-4 pb-4 px-5 md:px-20 lg:pt-6 lg:pb-0 lg:px-0  lg:shadow-none z-50">
                  <div className="absolute top-[-5px] left-0 right-0 lg:hidden">
                    <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    additionalClasses={classNames(
                      'px-6 w-full justify-center py-3 h-14 bg-customGray-90 font-interSemibold text-sm rounded-xl',
                      !isValid ? 'opacity-50 cursor-not-allowed' : '',
                    )}>
                    Continue
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{exam: availableCourses[0].id}}
            enableReinitialize
            validationSchema={CourseExamSchema}
            onSubmit={handleCourseSubmit}>
            {({values, setFieldValue, isSubmitting}) => {
              return (
                <FormikForm className="bg-white px-5 lg:pt-6 md:px-20 lg:px-40 justify-start rounded-2xl w-full max-w-3xl mx-auto pb-24 lg:pb-0">
                  <label className="block text-primary-dark font-interMedium text-base mb-3">
                    Which exam would you like to prepare for?{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-3">
                    {availableCourses.map(course => {
                      const isSelected = values.exam === course.id;

                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => setFieldValue('exam', course.id)}
                          className="w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-all">
                          {/* Radio Circle */}
                          <span className="flex items-center justify-center w-5 h-5 rounded-full border border-customGray-90">
                            {isSelected && (
                              <span className="w-3 h-3 bg-[#3b82f6] rounded-full" />
                            )}
                          </span>

                          {/* Label Text */}
                          <span
                            className={`text-sm font-interMedium text-customGray-80`}>
                            {course.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="absolute lg:top-[235px] xl:top-[235px] left-0 right-0 hidden lg:block">
                    <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                  </div>
                  <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-white lg:bg-transparent pt-4 pb-4 px-5 md:px-20 lg:pt-6 lg:pb-0 lg:px-0 lg:mt-8 lg:shadow-none z-50">
                    <div className="absolute top-[-5px] left-0 right-0 lg:hidden">
                      <hr className="w-full border-t border-gray-300 my-4 overflow-visible" />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={!values.exam}
                      additionalClasses={classNames(
                        'px-8 bg-primaryBlue py-3 w-full h-12 text-interSemibold text-base justify-center rounded-xl',
                        !values.exam && !isSubmitting
                          ? 'opacity-50 cursor-not-allowed'
                          : '',
                      )}>
                      Start Learning
                    </Button>
                  </div>
                </FormikForm>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
