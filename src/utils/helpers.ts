import {IAddressInfo} from '@/account/addressInfo';
import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  COUNTRY_CODE_KEY,
  INDIA_COUNTRY_CODE,
  ORDER_PATH,
  RAZORPAY_KEY,
  REFRESH_TOKEN_KEY,
  REGENERATE_AUTH_TOKEN_PATH,
} from '@/constants';
import {IUserData} from '@/global/UserContext';
import {AnyAction} from '@reduxjs/toolkit';
import axios, {AxiosResponse} from 'axios';
import dayjs from 'dayjs';
import {clearIndexedDB} from 'lib/indexedDB/initIndexedDB';
import {resetStore} from 'lib/redux/rootReducer';
import {NextRouter} from 'next/router';
import {Dispatch} from 'react';
import toast, {ToastOptions} from 'react-hot-toast';
import {authInterceptor} from './api/authInterceptor';
import {buildErrorMessage, encrypt} from './utils';

export interface IRazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface IApiResponse {
  status: number;
  data: any;
  statusText?: string;
  error?: unknown;
  message?: string;
}

export const generateAuthenticationToken = (token: string) => {
  if (token) {
    return `Bearer ${token}`;
  } else {
    return '';
  }
};

export const fetchHelper = async (
  url: string,
  method: RequestInit['method'] = 'POST',
  payload: any = {},
  authToken: string = '',
  isNodeServer: boolean = false,
): Promise<IApiResponse> => {
  try {
    const auth_token = authToken || localStorage.getItem(AUTH_TOKEN_KEY);
    let encryptedPayload;

    const isPayloadFormData = payload instanceof FormData;

    if ((method === 'POST' || method === 'PATCH') && !isPayloadFormData) {
      const bodyData = JSON.stringify(payload);
      if (payload && !isNodeServer) {
        // Encrypted the string body data
        const encryptRes = encrypt(bodyData.toString());
        // Created the payload with key, is_encrypted and encrypted data fields
        encryptedPayload = {
          key: encryptRes?.encodedKey,
          encrypted_data: encryptRes?.encodedData,
        };
      } else {
        encryptedPayload = bodyData;
      }
    }

    if (isPayloadFormData) {
      encryptedPayload = payload;
    }

    const requestConfig = {
      url,
      method,
      headers: {
        'content-type': 'application/json',
        ...(auth_token
          ? {Authorization: `${generateAuthenticationToken(auth_token)}`}
          : {}),
        ...(isPayloadFormData && {'content-type': 'multipart/form-data'}),
      },
      ...(method !== 'GET' ? {data: encryptedPayload} : {}),
    };

    const {apiClient, requestInterceptor, responseInterceptor} =
      await authInterceptor();
    const response = await apiClient.request(requestConfig);
    apiClient.interceptors.request.eject(requestInterceptor);
    apiClient.interceptors.response.eject(responseInterceptor);
    apiClient.interceptors.request.clear();
    apiClient.interceptors.response.clear();

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: AxiosResponse | any) {
    return {
      status: error?.response?.status || null,
      statusText: error?.toString() || '',
      message: error?.response?.data?.detail || '',
      data: null,
      error,
    };
  }
};

export const refreshTokenRequest = async () => {
  try {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    // Prepare the API request payload
    const requestConfig = {
      // withCredentials: true,
      method: 'POST',
      url: REGENERATE_AUTH_TOKEN_PATH,
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        refresh,
      },
    };
    //Create a request to get updated access and refresh tokens
    const response = await axios.request(requestConfig);
    // Access and refresh token have been updated in asyncStorage

    localStorage.setItem(AUTH_TOKEN_KEY, response.data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);

    // Return the access token
    return response.data.access;
  } catch (error: any) {
    // The client was given an error response (5xx, 4xx)
    if (error.response) {
      // User logs out if API returns an error
      removeAuthStoredData();
      window.location.replace('/login');
    }
  }
};

export const showToast = (
  type: 'success' | 'error' = 'success',
  message: string = '',
  toastId?: string,
) => {
  const options: ToastOptions = {position: 'top-right', id: toastId};

  toast[type](message, options);
};

export const reverseString = (str: string) => {
  let splitString = str.split('');
  let reverseArray = splitString.reverse();

  return reverseArray.join('');
};

export const isJsonData = (text: string) => {
  if (typeof text !== 'string') {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

export const loadScript = (src: string) => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOption = ({
  subjectName,
  amount,
  currency,
  order_id,
  email,
  phone_number,
  first_name,
  last_name,
  handler,
}: {
  subjectName: string;
  amount: number;
  currency: string;
  order_id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  handler: (res: IRazorpaySuccessResponse) => void;
}) => {
  return {
    description: `Buying subject ${subjectName} `,
    currency: currency.toUpperCase(),
    key: RAZORPAY_KEY,
    amount,
    name: 'Cerebellum',
    order_id,
    prefill: {
      email: email,
      contact: phone_number,
      name: `${first_name} ${last_name}`.trim(),
    },
    handler,
  };
};

export const ordinalSuffixOf = (n: number) => {
  let s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const removeAuthStoredData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.location.reload();
};

export const getSubscriptionEndDate = (duration: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + duration);
  return startDate;
};

export const removeAndAddPlus = (region: string) => {
  const removePlusFromRegion = region && region.replace(/\+/g, '');
  return '+' + removePlusFromRegion;
};

export const getCurrencySymbol = (region: string = '') => {
  let isClient = typeof window === 'undefined' ? false : true;

  const regionFromStorage: string =
    region || (isClient ? localStorage.getItem(COUNTRY_CODE_KEY)! : '');
  return removeAndAddPlus(regionFromStorage) === INDIA_COUNTRY_CODE ? '₹' : '$';
};

export const isIndianCurrency = (region: string = '') => {
  let isClient = typeof window === 'undefined' ? false : true;

  const regionFromStorage: string =
    region || (isClient ? localStorage.getItem(COUNTRY_CODE_KEY)! : '');
  return removeAndAddPlus(regionFromStorage) === INDIA_COUNTRY_CODE;
};

export const addZero = (value: number) => {
  return (value < 10 ? '0' : '') + value;
};

export const getAvailableYearsAfter2023 = () => {
  const currentYear = dayjs().year();
  let availableYearsList: number[] = [];

  for (let year = currentYear; year >= 2023; year--) {
    availableYearsList.push(year);
  }
  return availableYearsList.reverse();
};

export const copyText = (text?: string) => {
  // Copy the text inside the text field
  navigator.clipboard.writeText(text || '');
};

/**
 * Aggregates subscriptions by combining durations for objects with the same plan__collection__id
 * and different types. If no matching subscription is found, a new one is added to the result array.
 * @param subscriptions An array of subscription objects
 * @returns An array of aggregated subscription objects
 */
export const aggregatedSubscriptions = (subscriptions: any) => {
  return subscriptions.reduce((result: any, subscription: any) => {
    // Find index of existing subscription with the same plan__collection__id and different type
    const existingSubscriptionIndex = result?.findIndex(
      (item: any) =>
        item.plan__collection__id === subscription.plan__collection__id &&
        item.plan__type !== subscription.plan__type,
    );

    if (existingSubscriptionIndex !== -1) {
      // If existing subscription is found, add duration to it and update type to 'extension'
      result[existingSubscriptionIndex].duration += subscription.duration;
      result[existingSubscriptionIndex].plan__type = 'extension';
    } else {
      // If no existing subscription is found, add a new subscription to the result array
      const {
        plan__id,
        duration,
        start_at,
        plan__type,
        plan__collection__id,
        plan__collection__name,
        plan__collection__is_complete_course,
      } = subscription;
      result.push({
        plan__id,
        duration,
        start_at,
        plan__type,
        plan__collection__id,
        plan__collection__name,
        plan__collection__is_complete_course,
      });
    }
    return result;
  }, []);
};

/**
 * Checks if any subscription in the provided array is an extension plan based on the remaining days.
 * @param subscriptions An array of subscription objects
 * @param extendPlanDay The threshold number of days for considering a plan as an extension
 * @returns A boolean indicating whether any subscription is an extension plan
 */
export const isExtensionPlan = (subscriptions: any, extendPlanDay: number) => {
  // Get the current date
  const currentDate = dayjs();
  const aggregateSubscriptions = aggregatedSubscriptions(subscriptions);
  if (aggregateSubscriptions?.length > 0) {
    for (const subscription of aggregateSubscriptions) {
      if (subscription.plan__type !== 'extension') {
        // Using the start date and duration, find the end date of the subscription
        const subscriptionEndDate = dayjs(subscription?.start_at).add(
          subscription?.duration,
          'day',
        );

        // Calculate the remaining days of the subscription
        const remainingDay = subscriptionEndDate.diff(currentDate, 'd');

        // Check if remaining days are less than or equal to the threshold for extension
        if (remainingDay <= extendPlanDay) {
          return true; // If true, at least one subscription qualifies as an extension plan
        }
      }
    }
  }
  // If no subscription qualifies as an extension plan, return false
  return false;
};

export const getQuestionByAppliedFilter = (
  testList: any[],
  questionAttemptionStatus: string = 'All',
) => {
  let testQuestions = [];
  switch (questionAttemptionStatus) {
    case 'Review later':
      testQuestions = testList.filter(
        question => question.attempted_choice?.review_later,
      );
      break;
    case 'Marked as guess':
      testQuestions = testList.filter(
        question => question.attempted_choice?.is_guessed,
      );
      break;

    case 'Not Answered':
      testQuestions = testList.filter(
        question =>
          question.attempted_choice &&
          !question.attempted_choice?.question_choice_id,
      );
      break;
    case 'Not Visited':
      testQuestions = testList.filter(question => !question.attempted_choice);
      break;
    case 'Correct':
      testQuestions = testList.filter(
        question =>
          question.attempted_choice &&
          question.attempted_choice?.question_choice_id ===
            question?.correct_choice_id,
      );
      break;

    case 'Incorrect':
      testQuestions = testList.filter(
        question =>
          question.attempted_choice?.question_choice_id &&
          question.attempted_choice?.question_choice_id !==
            question?.correct_choice_id,
      );
      break;
    case 'All':
      testQuestions = testList;
      break;
    default:
      testQuestions = testList;
      break;
  }
  return testQuestions;
};
export const createOrder = async (
  student: number,
  plan: string,
  coupon_code?: string,
  currency?: string,
  isExclusiveContent?: boolean,
  addressInfo?: IAddressInfo,
): Promise<any> => {
  try {
    let body;
    if (isExclusiveContent) {
      body = coupon_code
        ? {
            student,
            exclusive_content: plan,
            coupon_code,
            currency,
            address_detail: addressInfo,
          }
        : {
            student,
            exclusive_content: plan,
            currency,
            address_detail: addressInfo,
          };
    } else {
      body = coupon_code
        ? {student, plan, coupon_code, currency}
        : {student, plan, currency};
    }

    return await fetchHelper(BASE_URL + ORDER_PATH, 'POST', body);
  } catch (error: any) {
    throw new Error(buildErrorMessage(error));
  }
};
export const handleAppLogout = async (
  setAuthToken: ((token: string | null) => void) | undefined,
  setUserData: ((data: IUserData | null) => void) | undefined,
  setUserRole: ((role: string) => void) | undefined,
  dispatch: Dispatch<AnyAction>,
  router: NextRouter,
) => {
  try {
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();

    // Reset auth context
    setAuthToken?.(null);
    setUserData?.(null);
    setUserRole?.('');

    // Reset Redux store
    dispatch(resetStore());

    // Clear IndexedDB stores
    await clearIndexedDB();

    // Show success message
    showToast('success', 'Logged out successfully');

    // Redirect to login
    router.replace('/login');
  } catch (error) {
    console.log('Failed to logout:', error);
  }
};
