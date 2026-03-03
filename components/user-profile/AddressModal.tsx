'use client';

import {IAddress} from '@/account/types';
import Modal from '@/common/Modal';
import {
  BASE_URL,
  USER_ADDRESS_PATH,
  USER_DATA_KEY,
  collegeStates,
} from '@/constants';
import {LocationIcon} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import {fetchHelper, showToast} from '@/utils/helpers';
import {Field, Form, Formik} from 'formik';
import {updateAddress, updateUserData} from 'lib/redux/slices/userSlice';
import React, {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';

const getInitialValues = () => {
  return {
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    country_state: '',
    pincode: '',
    gst: '',
    country: 'India',
  };
};

// Address Form Modal
const AddressModal: React.FC<any> = ({isOpen, onClose, userData}) => {
  const dispatch = useDispatch();
  const {setUserData} = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState<IAddress | null>(null);
  const [formValues, setFormValues] = useState(getInitialValues());

  // Professional handler functions
  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
  };

  const handleAddressConfirm = async () => {
    if (!savedAddress) return;

    try {
      const response = await fetchHelper(
        BASE_URL + USER_ADDRESS_PATH,
        'POST',
        savedAddress,
      );

      if ([200, 201].includes(response.status) && response.data) {
        // Update Redux store
        dispatch(updateAddress(response.data));

        // Update context and localStorage
        const updatedUserData = {
          ...(userData && typeof userData === 'object' ? userData : {}),
          address_info: [response.data],
        };
        dispatch(updateUserData(updatedUserData as any));
        setUserData && setUserData(updatedUserData as any);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUserData));

        showToast('success', 'Address saved successfully');
        setShowConfirmModal(false);
        onClose();
      } else {
        showToast('error', 'Failed to save address. Please try again.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('error', 'Something went wrong. Please try again.');
    }
  };

  const handleAddressEdit = () => {
    setShowConfirmModal(false);
    // Keep the address modal open for editing
  };

  // Validation schema for address form
  const getValidationSchema = () => {
    return Yup.object().shape({
      address1: Yup.string()
        .min(2, 'Address is too short')
        .required('Flat, House No., Building, Company, Apartment is required'),
      address2: Yup.string()
        .min(2, 'Area/Street is too short')
        .required('Area, Street, Sector, Village is required'),
      landmark: Yup.string(),
      city: Yup.string()
        .min(2, 'City name is too short')
        .required('City is required'),
      country_state: Yup.string().required('State is required'),
      pincode: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode')
        .required('Pincode is required'),
      gst: Yup.string(),
    });
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Store the form data for confirmation
      const addressData = {
        ...values,
        country: 'IN',
      };

      setFormValues(values);
      setSavedAddress(addressData);
      setShowConfirmModal(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error preparing address:', error);
      showToast('error', 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmModal}
        onClose={handleClose}
        shouldHaveCrossIcon={true}
        modalPositionClass="absolute -top-5 left-0 right-0 "
        containerAdditionalClasses="max-w-md rounded-2xl font-sauce">
        <div>
          <h2 className="text-2xl font-regular text-primary-dark mb-6 font-besley">
            Address for Notes Delivery
          </h2>

          <Formik
            initialValues={formValues}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize>
            {({errors, touched, values, setFieldValue, isValid, dirty}) => (
              <Form className="space-y-4">
                {/* Flat, House No., Building, Company, Apartment */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Flat, House No., Building, Company, Apartment{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="address1"
                    placeholder="Enter Flat, House No., Building, Company, Apartment"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-primary-dark text-sm placeholder:font-openSauceOneMedium placeholder:text-sm placeholder:text-customGray-40`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('address1', e.target.value);
                    }}
                  />
                  {errors.address1 && touched.address1 && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.address1)}
                    </div>
                  )}
                </div>

                {/* Area, Street, Sector, Village */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Area, Street, Sector, Village{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="address2"
                    placeholder="Enter Area, Street, Sector, Village"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-primary-dark  text-sm placeholder:font-openSauceOneMedium placeholder:text-sm placeholder:text-customGray-40`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('address2', e.target.value);
                    }}
                  />
                  {errors.address2 && touched.address2 && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.address2)}
                    </div>
                  )}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Landmark
                  </label>
                  <Field
                    type="text"
                    name="landmark"
                    placeholder="Enter Landmark"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-primary-dark  text-sm placeholder:font-openSauceOneMedium placeholder:text-sm placeholder:text-customGray-40`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('landmark', e.target.value);
                    }}
                  />
                  {errors.landmark && touched.landmark && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.landmark)}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="country"
                    value="India"
                    disabled
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 bg-gray-100 text-sm font-openSauceOneMedium text-primary-dark  disabled:font-openSauceOneMedium disabled:text-customGray-60`}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="country_state"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-sm ${values.country_state === '' ? 'text-customGray-40' : 'text-primary-dark'}`}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('country_state', e.target.value);
                    }}>
                    <option value="" disabled>
                      Select State
                    </option>
                    {collegeStates?.map(state => (
                      <option key={state.key} value={state.key}>
                        {state.name}
                      </option>
                    ))}
                  </Field>
                  {errors.country_state && touched.country_state && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.country_state)}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-primary-dark text-sm placeholder:font-openSauceOneMedium placeholder:text-sm placeholder:text-customGray-40`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('city', e.target.value);
                    }}
                  />
                  {errors.city && touched.city && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.city)}
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-interMedium text-primary-dark mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="pincode"
                    placeholder="Enter Pincode"
                    className={`w-full p-4 border rounded-md focus:outline-none focus:ring-0 focus:ring-white border-gray-300 font-openSauceOneMedium text-primary-dark text-sm placeholder:font-openSauceOneMedium placeholder:text-sm placeholder:text-customGray-40`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('pincode', e.target.value);
                    }}
                  />
                  {errors.pincode && touched.pincode && (
                    <div className="text-red-500 text-xs mt-1">
                      {String(errors.pincode)}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !isValid ||
                      !values.address1 ||
                      !values.address2 ||
                      !values.city ||
                      !values.country_state ||
                      !values.pincode ||
                      !dirty
                    }
                    className="flex-1 bg-primaryBlue text-white p-5 rounded-xl  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs">
                    {isSubmitting ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>

      {/* Confirm Address Modal */}
      <ConfirmAddressModal
        isOpen={showConfirmModal}
        onClose={handleConfirmModalClose}
        address={savedAddress!}
        onConfirm={handleAddressConfirm}
        onEdit={handleAddressEdit}
      />
    </>
  );
};

// Confirm Address Modal
const ConfirmAddressModal: React.FC<any> = ({
  isOpen,
  onClose,
  address,
  onConfirm,
  onEdit,
}) => {
  if (!address) return null;

  const formatAddress = (addr: IAddress) => {
    const parts = [
      addr.address1,
      addr.address2,
      addr.city,
      collegeStates.find(s => s.key === addr.country_state)?.name,
      addr.pincode,
    ].filter(Boolean);

    return parts.join(', ');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={true}
      containerAdditionalClasses="max-w-md rounded-2xl font-sauce">
      <div>
        <h2 className="text-2xl font-regular text-primary-dark mb-2 font-besley">
          Confirm Address
        </h2>
        <p className="text-base text-customGray-90 mb-6 font-openSauceOneMedium">
          Please confirm below details
        </p>

        <div className="bg-white border border-customGray-10 px-3 py-4 rounded-lg mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primaryBlue/10 flex items-center justify-center">
              <LocationIcon className="w-5 h-5 text-primaryBlue" />
            </div>
            <div className="text-base text-primary-dark font-openSauceOneMedium">
              {formatAddress(address)}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 bg-white text-customGray-90 py-4 px-4 rounded-2xl border border-gray-300 focus:outline-none font-interMedium text-base ">
            Edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-gray-90 text-white py-4 px-4 rounded-2xl focus:outline-none font-interMedium text-base">
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressModal;
