import {collegeStates} from '@/constants';
import Button from '@/elements/Button';
import {Field, Formik, Form as FormikForm} from 'formik';
import {RootState} from 'lib/redux/store';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';

export interface IAddressInfo {
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  country_state: string;
  country: string;
  landmark: string;
}

const addressSchema = Yup.object().shape({
  address1: Yup.string().required('Please enter address details'),
  address2: Yup.string().required('Please enter address details'),
  city: Yup.string().required('Please enter city name'),
  pincode: Yup.string()
    .required('Please enter pincode')
    .max(6, 'pincode must have 6 digits')
    .min(6, 'pincode must have 6 digits'),
  country_state: Yup.string().required('Please enter a state'),
  country: Yup.string(),
});

const initialFormValues = {
  address1: '',
  address2: '',
  city: '',
  pincode: '',
  country_state: '',
  country: 'IN',
  landmark: '',
};

const AddressInfo = ({
  subscriptionId = '',
  handleSubmit,
}: {
  closeModal?: (() => void) | null;
  subscriptionId?: string;
  handleSubmit: (payload: {
    address1: string;
    address2: string;
    city: string;
    pincode: string;
    country_state: string;
    country: string;
    landmark: string;
  }) => void;
}) => {
  const userAddress = useSelector(
    (state: RootState) => state.user?.userInfo?.address_info?.[0],
  ) as IAddressInfo;

  return (
    <div>
      <h1 className="text-3xl text-black font-semibold py-2">
        Enter address for notes delivery
      </h1>
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
        validationSchema={addressSchema}
        onSubmit={payload => {
          handleSubmit(payload);
        }}>
        {({errors, touched}) => (
          <FormikForm className="flex flex-col">
            <label className=" text-slate-500" htmlFor="address1">
              Flat, House no., Building, Company, Apartment*
            </label>
            <Field
              className={`${
                errors.address1 && touched.address1 ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="address1"
              type="address"
              placeholder="Flat, house no, building, company, apartment"
              name="address1"
            />
            {errors.address1 && touched.address1 ? (
              <div className="text-red-500 text-sm">{errors.address1}</div>
            ) : null}
            {/* address line 2 */}
            <label className=" text-slate-500" htmlFor="address2">
              Area, Street, Sector, Village*
            </label>
            <Field
              className={`${
                errors.address2 && touched.address2 ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="address2"
              type="address"
              placeholder="Area, street, sector, village"
              name="address2"
            />
            {errors.address2 && touched.address2 ? (
              <div className="text-red-500 text-sm">{errors.address2}</div>
            ) : null}
            {/* Landmark */}
            <label className=" text-slate-500" htmlFor="landmark">
              Landmark
            </label>
            <Field
              className={`${
                errors.landmark && touched.landmark ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="landmark"
              type="text"
              placeholder="Enter landmark"
              name="landmark"
            />
            {errors.landmark && touched.landmark ? (
              <div className="text-red-500 text-sm">{errors.landmark}</div>
            ) : null}
            {/* city */}
            <label className=" text-slate-500" htmlFor="city">
              City*
            </label>
            <Field
              className={`${
                errors.city && touched.city ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="city"
              type="city"
              placeholder="Enter city"
              name="city"
            />
            {errors.city && touched.city ? (
              <div className="text-red-500 text-sm">{errors.city}</div>
            ) : null}
            {/* Pincode */}
            <label className=" text-slate-500" htmlFor="pincode">
              Pincode*
            </label>
            <Field
              className={`${
                errors.pincode && touched.pincode ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="pincode"
              type="number"
              placeholder="Enter pincode"
              name="pincode"
              maxLength={6}
            />
            {errors.pincode && touched.pincode ? (
              <div className="text-red-500 text-sm">{errors.pincode}</div>
            ) : null}

            {/* Country */}
            <label className=" text-slate-500" htmlFor="country">
              Country*
            </label>
            <Field
              disabled
              className={`${
                errors.country && touched.country ? 'border-red-500' : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="country"
              type="text"
              placeholder="India"
              value="India"
              name="country"
            />
            {/* State start */}
            <label className=" text-slate-500" htmlFor="country_state">
              State*
            </label>
            <Field
              className={`${
                errors.country_state && touched.country_state
                  ? 'border-red-500'
                  : ''
              } border-2 p-2 rounded-md  mt-4 mb-2`}
              id="country_state"
              as="select"
              name="country_state">
              <option selected value="" disabled label="Select a state">
                Select a state
              </option>
              {collegeStates.map(college => (
                <option key={college.name} value={college.key}>
                  {college.name}
                </option>
              ))}
            </Field>
            {errors.country_state && touched.country_state ? (
              <div className="text-red-500 text-sm">{errors.country_state}</div>
            ) : null}
            {/* State end */}
            <Button
              additionalClasses="py-3 mt-2 flex justify-center"
              variant="secondary"
              type="submit">
              Add
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddressInfo;
