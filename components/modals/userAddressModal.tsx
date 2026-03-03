import {IAddress} from '@/account/types';
import Modal from '@/common/Modal';
import {BASE_URL, USER_ADDRESS_PATH, collegeStates} from '@/constants';
import Button from '@/elements/Button';
import FormikInputField from '@/elements/FormikInputField';
import {fetchHelper, showToast} from '@/utils/helpers';
import {buildErrorMessage} from '@/utils/utils';
import addressSchema from '@/utils/validations/addressSchema';
import {Field, Form, Formik} from 'formik';
import {useAppDispatch} from 'lib/redux/hooks/appHooks';
import {updateAddress} from 'lib/redux/slices/userSlice';
import {RootState} from 'lib/redux/store';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  createPaymentOrder: (planId: string) => Promise<void>;
  selectedPlanId: string;
}

const UserAddressModal = ({
  isOpen,
  setIsOpen,
  createPaymentOrder,
  selectedPlanId,
}: IProps) => {
  const userData = useSelector((state: RootState) => state.user?.userInfo);
  const [userAddress, setUserAddress] = useState<IAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData?.address_info?.length) {
      setUserAddress(userData.address_info[0]);
    }
  }, []);

  const handleAddressUpdation = async (payload: IAddress) => {
    try {
      setIsLoading(true);
      const url =
        BASE_URL +
        USER_ADDRESS_PATH +
        (userAddress?.id ? userAddress?.id + '/' : '');
      const response = await fetchHelper(
        url,
        userAddress?.id ? 'PATCH' : 'POST',
        {...payload, country: 'IN'},
      );
      setIsLoading(false);
      if ([200, 201].includes(response.status) && response.data) {
        setUserAddress(response.data);
        dispatch(updateAddress(response.data));
        showToast('success', 'Address Updated');
        setIsOpen(false);
        createPaymentOrder(selectedPlanId);
      } else {
        showToast('error', buildErrorMessage(response));
      }
    } catch (error) {
      setIsOpen(false);
      setIsLoading(false);
      showToast('error', buildErrorMessage(error));
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      containerAdditionalClasses="max-w-2xl sm:my-2"
      modalClasses="pt-0">
      <Formik
        initialValues={{
          address1: userAddress?.address1 ?? '',
          address2: userAddress?.address2 ?? '',
          landmark: userAddress?.landmark ?? '',
          city: userAddress?.city ?? '',
          country_state: userAddress?.country_state ?? '',
          pincode: userAddress?.pincode ?? '',
          country: 'India',
        }}
        enableReinitialize
        validationSchema={addressSchema}
        onSubmit={(values: any) => {
          handleAddressUpdation(values);
        }}>
        {({errors, touched}: {errors: any; touched: any}) => (
          <Form className="flex flex-col">
            <FormikInputField
              label="Flat, House no, Building, Company, Apartment *"
              errors={errors}
              touched={touched}
              id="address1"
              placeholder="Flat, House no, Building, Company, Apartment"
              value={userAddress?.address1 || undefined}
              additionalClasses="bg-slate-100"
            />
            {/* address line 2 */}
            <FormikInputField
              label="Area, Street, Sector, Village *"
              errors={errors}
              touched={touched}
              id="address2"
              placeholder="Area, Street, Sector, Village"
              value={userAddress?.address2 || undefined}
              additionalClasses="bg-slate-100"
            />
            {/* landmark */}
            <FormikInputField
              label="Landmark"
              errors={errors}
              touched={touched}
              id="landmark"
              placeholder="Enter landmark"
              value={userAddress?.landmark || undefined}
              additionalClasses="bg-slate-100"
            />
            <FormikInputField
              label="City *"
              errors={errors}
              touched={touched}
              id="city"
              placeholder="Enter city"
              value={userAddress?.city || undefined}
              additionalClasses="bg-slate-100"
            />
            <FormikInputField
              label="Pincode *"
              errors={errors}
              touched={touched}
              id="pincode"
              placeholder="Enter pincode"
              value={userAddress?.pincode || undefined}
              type="number"
              additionalClasses="bg-slate-100"
            />
            <FormikInputField
              label="GST number"
              errors={errors}
              touched={touched}
              id="gst"
              placeholder={'Enter GST number'}
              value={userAddress?.gst || undefined}
              additionalClasses="bg-slate-100"
            />
            <FormikInputField
              label="Country *"
              errors={errors}
              touched={touched}
              id="country"
              placeholder="India"
              disabled={true}
              additionalClasses="bg-slate-100"
            />
            <label
              className="text-slate-600 font-semibold mt-2"
              htmlFor="country_state">
              State *
            </label>
            <Field
              className={`${
                errors.country_state && touched.country_state
                  ? 'border-red-500'
                  : ''
              } border disabled:border-gray-200 p-2 rounded-md mb-2 bg-slate-100`}
              id="country_state"
              as="select"
              name="country_state">
              <option selected value="" disabled label="Select a state">
                Select a state
              </option>
              {collegeStates.map(college => (
                <option
                  selected={college.key === userAddress?.country_state}
                  key={college.name}
                  value={college.key}>
                  {college.name}
                </option>
              ))}
            </Field>
            {errors.country_state && touched.country_state && (
              <div className="text-red-500 text-sm">{errors.country_state}</div>
            )}
            <div className="flex justify-end items-end gap-3">
              <Button
                disabled={isLoading}
                additionalClasses="flex justify-center mt-4"
                variant="primary"
                type="button"
                onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                additionalClasses="flex justify-center mt-4"
                variant="secondary"
                type="submit">
                Update Address
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UserAddressModal;
