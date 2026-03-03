import React from 'react';

const DEFAULT_CLASSES =
  ' inline-flex items-center text-sm rounded-2xl px-2 md:px-4 py-2 md:py-3 font-medium shadow-sm disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:outline-none ';

const VARIANT_CLASSES = {
  primary: ' bg-white text-lightGray focus:ring-lightGray ',
  secondary: ' bg-primary-blue text-white focus:ring-cobalt ',
  default: ' bg-customGray-90 text-white focus:ring-cobalt ',
};

export const BUTTON_PRIMARY_CLASSES = `${DEFAULT_CLASSES} ${VARIANT_CLASSES.primary}`;
export const BUTTON_SECONDARY_CLASSES = `${DEFAULT_CLASSES} ${VARIANT_CLASSES.secondary}`;
export const BUTTON_DEFAULT_CLASSES = `${DEFAULT_CLASSES} ${VARIANT_CLASSES.default}`;

const Button = ({
  variant = 'primary',
  additionalClasses = '',
  onClick,
  children,
  type = 'button',
  disabled = false,
  ...props
}: {
  variant: 'primary' | 'secondary' | 'default';
  additionalClasses?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) => {
  const variants = {
    primary: `${BUTTON_PRIMARY_CLASSES} `,
    secondary: `${BUTTON_SECONDARY_CLASSES} `,
    default: `${BUTTON_DEFAULT_CLASSES} `,
  };

  return (
    <button
      type={type}
      className={variants[variant] + additionalClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
