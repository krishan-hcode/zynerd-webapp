'use client';

import Modal from '@/common/Modal';
import {BASE_URL, UPDATE_USER_PROFILE_PATH, USER_DATA_KEY} from '@/constants';
import {CalenderProfileIcon} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import {fetchHelper, showToast} from '@/utils/helpers';
import dayjs from 'dayjs';
import {Field, Form, Formik} from 'formik';
import {updateUserData} from 'lib/redux/slices/userSlice';
import React, {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';

const ProfileEditModal: React.FC<any> = ({
  isOpen,
  onClose,

  userData,
}) => {
  const dispatch = useDispatch();
  const {setUserData, region} = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create validation schema for all fields
  const getValidationSchema = () => {
    return Yup.object().shape({
      fullName: Yup.string()
        .min(2, 'Name is too short')
        .max(100, 'Name is too long')
        .required('Full name is required'),
      whatsapp: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Invalid Phone number')
        .required('WhatsApp number is required'),
      birthday: Yup.string().required('Birthday is required'),
    });
  };

  const getInitialValues = () => {
    // Format birthday to YYYY-MM-DD for date input
    const formatBirthdayForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    // Strip leading +<region> from whatsapp if present for cleaner editing
    const fullWhatsapp: string =
      ((userData as any)?.whatsapp_no as string) || '';
    const regionPrefix = `+${region || ''}`;
    const whatsappDigits = fullWhatsapp.startsWith(regionPrefix)
      ? fullWhatsapp.slice(regionPrefix.length).trim()
      : fullWhatsapp;

    const u = userData as any;
    return {
      fullName: u?.first_name + ' ' + u?.last_name || '',
      whatsapp: whatsappDigits,
      birthday: formatBirthdayForInput(String(u?.birth_date || '')),
    };
  };

  const handleSubmit = async (values: {
    fullName: string;
    whatsapp: string;
    birthday: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Split fullName into first and last
      const nameParts = values?.fullName.trim().split(' ');
      const payload = {
        first_name: nameParts[0] || '',
        last_name: nameParts?.slice(1).join(' ') || '',
        whatsapp_no: `+${region || ''}${String(values.whatsapp || '').replace(/\s+/g, '')}`,
        birth_date: values?.birthday,
      };

      const response = await fetchHelper(
        BASE_URL + UPDATE_USER_PROFILE_PATH,
        'PATCH',
        payload,
      );

      if (response.status === 200) {
        const newData = {
          ...(userData && typeof userData === 'object' ? userData : {}),
          ...payload,
        };

        dispatch(updateUserData(newData as any));
        setUserData && setUserData(newData as any);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(newData));

        showToast('success', 'Profile updated successfully');
        onClose();
      } else {
        showToast('error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={true}
      containerAdditionalClasses="max-w-lg rounded-2xl font-sauce w-[80vw]">
      <div>
        <h2 className="text-2xl font-besley text-primary-dark mb-6 ">
          Edit Profile
        </h2>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount>
          {({
            errors,
            touched,
            values,
            setFieldValue,
            initialValues,
            dirty,
            isValid,
          }) => {
            // Check if any value has changed from initial values
            const hasChanges =
              values.fullName !== initialValues.fullName ||
              values.whatsapp !== initialValues.whatsapp ||
              values.birthday !== initialValues.birthday;

            const isSaveDisabled = isSubmitting || !hasChanges || !isValid;

            return (
              <Form className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-4 border border-customGray-10 rounded-lg focus:outline-none focus:ring-0 focus:ring-white font-openSauceOneMedium text-sm text-primary-dark `}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('fullName', e.target.value);
                    }}
                  />
                  {errors.fullName && touched.fullName && (
                    <div className="text-red-500 text-sm mt-1">
                      {String(errors.fullName)}
                    </div>
                  )}
                </div>

                {/* WhatsApp Number Field */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full px-3 py-2  border border-customGray-10 rounded-lg flex items-center">
                    <span className="font-openSauceOneMedium text-sm  text-customGray-70">
                      +{region || '91'}
                    </span>
                    <Field
                      type="tel"
                      name="whatsapp"
                      placeholder="Enter WhatsApp number"
                      className={`flex-1 border-none outline-none focus:ring-0 focus:outline-none font-openSauceOneMedium text-sm text-primary-dark`}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // allow only digits, max 10
                        const digits = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10);
                        setFieldValue('whatsapp', digits);
                      }}
                    />
                  </div>
                  {errors.whatsapp && touched.whatsapp && (
                    <div className="text-red-500 text-sm mt-1">
                      {String(errors.whatsapp)}
                    </div>
                  )}
                </div>

                {/* Birthday Field */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Birthday <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* Visible formatted display */}
                    <div className="w-full  px-3 py-4 pr-10 border border-customGray-10 rounded-lg text-primary-dark min-h-[54px] flex items-center font-openSauceOneMedium text-sm ">
                      {values.birthday && dayjs(values.birthday).isValid() ? (
                        dayjs(values.birthday).format('DD MMM, YYYY')
                      ) : (
                        <span className="font-openSauceOneMedium text-sm  text-customGray-70">
                          Select Date
                        </span>
                      )}
                    </div>
                    {/* Invisible native date picker overlay */}
                    <input
                      type="date"
                      value={values.birthday}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('birthday', e.target.value);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-openSauceOneMedium text-sm text-primary-dark"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CalenderProfileIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.birthday && touched.birthday && (
                    <div className="text-red-500 text-sm mt-1">
                      {String(errors.birthday)}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-6">
                  <button
                    type="submit"
                    disabled={isSaveDisabled}
                    className={`flex-1 text-white py-4 px-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-primary-blue`}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-white border border-customGray-20 text-gray-700 py-4 px-4 rounded-2xl hover:bg-gray-300 focus:outline-none disabled:opacity-50 font-medium">
                    Cancel
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
