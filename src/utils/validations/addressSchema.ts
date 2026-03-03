import * as Yup from 'yup';

const addressSchema = Yup.object().shape({
  address1: Yup.string().required('Please enter address details'),
  address2: Yup.string().required('Please enter address details'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .min(6, 'pincode must have 6 digits')
    .max(6, 'pincode must have 6 digits'),
  country_state: Yup.string().required('state is required'),
  landmark: Yup.string(),
  gst: Yup.string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format',
    )
    .length(15, 'GST number must be exactly 15 characters'),
});

export default addressSchema;
