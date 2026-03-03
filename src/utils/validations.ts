export const mobileNumberRegex = /^[4-9][0-9]{7,9}$/g; // check for first digit between 6-9 and total 10 digits

export const optRegex = /^[0-9]{4,6}$/g; // check for min 4 digits and max. 6 digits

export const testNameRegex = /^.{4,}$/g; // match all characters except newline with min. length 4

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const nameRegex = /^[ a-zA-z].+([\s][a-zA-Z ].+)*$/g; // check lowercase/ uppercase including space ` ` and min length 3

export const aadharNumberRegex = /^[0-9]{12}$/g; // check for 12 digits

// Checking for filters on test router
export const testRouteRegex = /^\/test(\?filters=(\d+(,|%2C))*\d+)?$/;

export const isValidNumber = (numb: string, isIndianNumber: boolean) => {
  return isIndianNumber ? numb.match(mobileNumberRegex) !== null : true;
};

export const isValidOtp = (opt: string) => {
  return opt.match(optRegex) !== null;
};
export const isValidAadhar = (aadhar: string) => {
  return aadhar.match(aadharNumberRegex) !== null;
};
export const isValidEmail = (mail: string) => {
  return mail.match(emailRegex) !== null;
};

export const isValidName = (name: string) => {
  return name.match(nameRegex) !== null;
};
