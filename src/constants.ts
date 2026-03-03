import {Country} from 'countries-list';
import {ReactElement} from 'react';

export interface INavbarLink {
  id: number;
  title: string;
  url: string;
  icon: ReactElement;
  items: INavbarLink[];
}

// Auth keys
export const RAZORPAY_KEY = process.env.RAZORPAY_KEY;

export const BASE_URL = process.env.BASE_URL;
export const NEST_BASE_URL = process.env.NEST_BASE_URL;
// API paths
export const USER_PROFILE_PATH = '/user-profile/';
export const USER_ADDRESS_PATH = '/address-info/';
export const UPDATE_USER_PROFILE_PATH = '/user-profile/me/';
export const GET_USER_PATH = (phone: string) => `/user-profile/${phone}/`;
// Account deletion
export const PROFILE_ROUTE = '/user-profile/me/';
export const DELETE_ACCOUNT_ROUTE = '/delete-account/';
export const RESET_DATA = '/data-reset/';

export const GET_COURSES_PATH = '/courses/';
export const GET_PREMIUM_PLANS_PATH = '/subject/home/collections/';
export const ORDER_PATH = '/order/';
export const RAZORPAY_PAYMENT_SUCCESS_PATH = '/charge/';
export const REGENERATE_AUTH_TOKEN_PATH = '/token/refresh/';
export const COUPON_LIST_PATH = '/coupons/';
export const COLLEGE_LIST_ROUTE = '/college/';

// FAQs
export const GET_FAQ_ROUTE = '/faq/';
export const PATCH_FAQ_ROUTE = (id: string | number) => `/faq/${id}/`;
export const EXTERNAL_MEDIA = '/external-media/';
export const SUGGESTED_CONTENT = '/suggested-content/content/';
export const ATTEMPT_HOMEPAGE_MCQ = '/attempted-question/home/qbank/';
export const GET_TEACHER_LIST = '/teachers/';
export const PROJECT_CONFIG = '/project-configs/';
export const PLATFROM_META = '/platform-metadata/';
export const GET_NOTES_LIST = '/exclusive-content/';
export const VERIFY_EXCLUSIVE_COUPONS = (contentId: string, coupon: string) =>
  `/apply-coupons/${contentId}/?coupon_code=${coupon}`;

export const GET_ALL_COUPON_LIST = (queryName: string, queryValue: string) =>
  `/coupons/?${queryName}=${queryValue}`;

// Local storage keys
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
export const USER_DATA_KEY = 'USER_DATA';
export const COUNTRY_CODE_KEY = 'REGION';
export const IS_AMBASSADOR_KEY = 'IS_AMBASSADOR';
export const USER_ROLE_KEY = 'user_role';
export const SESSION_STORAGE_MOCK_TEST_FILTERS =
  'SESSION_STORAGE_MOCK_TEST_FILTERS';
export const INDIA_COUNTRY_CODE = '+91';
export const INTRO_VIDEO = '/intro-video/';

export const INDIA_COUNTRY_CODE_MOCK_DATA: Country = {
  name: 'India',
  native: 'भारत',
  phone: '91',
  continent: 'AS',
  capital: 'New Delhi',
  currency: 'INR',
  languages: ['hi', 'en'],
  emoji: '🇮🇳',
  emojiU: 'U+1F1EE U+1F1F3',
};

export const errorMessage = {
  OTP_NOT_SENT: 'Unable to send OTP',
  SESSION_ERROR: 'Unable to fetch session',
  NO_SESSION_FOUND: 'Session not found',
  INVALID_OTP: 'Check the OTP you entered',
  OTP_ALREADY_USER: 'OTP is already used',
  WRONG_DETAILS: 'Check your credentials',
  INVALID_NUMBER: 'Please enter a valid number',
  NO_CHAPTER_FOUND: 'Invalid chapter selected',
  WHATSAPP_NO_ALREADY_EXIST: 'This whatsapp number is already used',
  COLLEGE_FETCH_FAILED: 'Unable to fetch college list',
  RUN_TIME_ERROR: 'Something went wrong', // front end error
  SERVER_ERROR: 'Unable to process the request', // 500+
  NETWORK_ERROR: 'No internet access', // netwrok +
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  CLEAR_STORAGE_ERROR: 'Enable to clear storage',
  SAVE_STORAGE_ERROR: 'Enable to save to storage',
  MIN_4_CHARACTERS_ERROR: 'Please add atleast 4 characters',
  LOG_OUT_MSG:
    'Your account has logged in from another device. Kindly log in again to continue',
  UNABLE_TO_BOOKMARK: 'Unable to bookmark the question. Please try again.',
  OFFLINE_ERROR: 'You are offline, Please check your internet connection',
  NOT_ENOUGH_TIME_WINDOW_ERROR:
    'Not enough time window left to start the test.',
  NOT_ENOUGH_TIME_WINDOW_MESSAGE:
    'You are late for this Live Test. You can attempt it after the Live test window ends.',
};

export const collegeStates = [
  {key: 'AP', name: 'Andhra Pradesh'},
  {key: 'AR', name: 'Arunachal Pradesh'},
  {key: 'AS', name: 'Assam'},
  {key: 'BR', name: 'Bihar'},
  {key: 'CH', name: 'Chandigarh'},
  {key: 'CT', name: 'Chhattisgarh'},
  {key: 'DL', name: 'Delhi'},
  {key: 'GA', name: 'Goa'},
  {key: 'GJ', name: 'Gujarat'},
  {key: 'HP', name: 'Himachal Pradesh'},
  {key: 'HR', name: 'Haryana'},
  {key: 'JH', name: 'Jharkhand'},
  {key: 'JK', name: 'Jammu and Kashmir'},
  {key: 'KA', name: 'Karnataka'},
  {key: 'KL', name: 'Kerala'},
  {key: 'MH', name: 'Maharashtra'},
  {key: 'ML', name: 'Meghalaya'},
  {key: 'MN', name: 'Manipur'},
  {key: 'MP', name: 'Madhya Pradesh'},
  {key: 'MZ', name: 'Mizoram'},
  {key: 'OR', name: 'Odisha'},
  {key: 'PB', name: 'Punjab'},
  {key: 'PY', name: 'Puducherry'},
  {key: 'RJ', name: 'Rajasthan'},
  {key: 'SK', name: 'Sikkim'},
  {key: 'TG', name: 'Telangana'},
  {key: 'TN', name: 'Tamil Nadu'},
  {key: 'TR', name: 'Tripura'},
  {key: 'UP', name: 'Uttar Pradesh'},
  {key: 'UT', name: 'Uttarakhand'},
  {key: 'WB', name: 'West Bengal'},
  // these states don't have any college
  {key: 'AN', name: 'Andaman and Nicobar Islands'},
  {key: 'DH', name: 'Dadra and Nagar Haveli and Daman and Diu'},
  {key: 'LA', name: 'Ladakh'},
  {key: 'LD', name: 'Lakshadweep'},
  {key: 'NL', name: 'Nagaland'},
];

export const collegeYears: {key: string; name: string}[] = [
  {key: 'first_prof', name: 'First Year'},
  {key: 'second_prof', name: 'Second Year'},
  {key: 'third_prof', name: 'Third Year'},
  {key: 'forth_prof', name: 'Fourth Year'},
  {key: 'intern', name: 'Intern'},
  {key: 'post_intern', name: 'Post Intern'},
];

export const NOTES_STATIC_IMAGE_PATH = '/assets/notes_default.webp';
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const WebSiteLink = {
  aboutUs: 'https://cerebellumacademy.com/about-us/',
  termsConditions: 'https://cerebellumacademy.com/terms-and-conditions/',
  cancellationPolicy: 'https://cerebellumacademy.com/cancellation-policy/',
  privacyPolicy: 'https://cerebellumacademy.com/privacy-policy/',
  contactSupport: 'https://www.cerebellumacademy.com/help-center/',
};

export const APP_LINKS = {
  playStore:
    'https://play.google.com/store/apps/details?id=com.cerebellummobileapp&hl=en_IN&pli=1',
  appStore:
    'https://apps.apple.com/in/app/cerebellum-neet-pg-inicet-fmge/id1662462131',
};

export const shareMessage = (
  referralCode: string,
  storeUrl: string,
): string => {
  return `Hey, I am loving the Cerebellum App for learning from the best of teachers for my PG entrance.\nI recommend this for you as well. Use my referral code while signing up, \nto get the referral benefits: ${
    referralCode ? referralCode : ''
  }  \n\nCerebellum Academy app link \n${storeUrl}`;
};

export const getStoreUrl = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isIOS) {
    return APP_LINKS.appStore;
  } else if (isAndroid) {
    return APP_LINKS.playStore;
  } else {
    return APP_LINKS.playStore;
  }
};

// Function to detect device type and navigate to appropriate app store
export const handleRateUs = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isIOS) {
    window.open(
      'https://apps.apple.com/in/app/cerebellum-neet-pg-inicet-fmge/id1662462131',
      '_blank',
    );
  } else if (isAndroid) {
    window.open(
      'https://play.google.com/store/apps/details?id=com.cerebellummobileapp&hl=en_IN&pli=1',
      '_blank',
    );
  } else {
    // Fallback for other devices - open Android store
    window.open(
      'https://play.google.com/store/apps/details?id=com.cerebellummobileapp&hl=en_IN&pli=1',
      '_blank',
    );
  }
};

// File validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/'],
};

// File validation helper
export const validateFile = (file: File): string | null => {
  if (!file.type.startsWith(FILE_VALIDATION.ALLOWED_TYPES[0])) {
    return 'Please select a valid image file';
  }
  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    return 'Image size should be less than 5MB';
  }
  return null;
};
