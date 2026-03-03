import {Field} from 'formik';
import {HTMLInputTypeAttribute} from 'react';

const FormikInputField = ({
  errors,
  touched,
  label = '',
  placeholder = '',
  id = '',
  value = undefined,
  inputType = 'input',
  type = 'text',
  additionalClasses = '',
  ...props
}: {
  touched: any;
  errors: any;
  label: string;
  placeholder: string;
  id: string;
  disabled?: boolean;
  inputType?: 'input' | 'textarea';
  value?: string | number | readonly string[] | undefined;
  type?: HTMLInputTypeAttribute;
  additionalClasses?: string;
}) => {
  return (
    <>
      <label className="mt-2 text-slate-600 font-semibold" htmlFor={id}>
        {label}
      </label>
      <Field
        {...props}
        className={`${
          errors[id] && touched[id] ? 'border-red-500' : 'border-gray-600'
        } disabled:cursor-none border disabled:pointer-events-none placeholder:text-gray-400 disabled:border-gray-200 p-2 rounded-md mb-2 bg-white ${additionalClasses}`}
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={value}
        as={inputType}
        type={type}
      />
      {errors[id] && touched[id] && (
        <div className="text-red-500 text-sm">{errors[id]}</div>
      )}
    </>
  );
};

export default FormikInputField;
