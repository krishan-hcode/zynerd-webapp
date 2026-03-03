import {IAddress} from '@/account/types';
import {
  AUTH_TOKEN_KEY,
  COUNTRY_CODE_KEY,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
  USER_ROLE_KEY,
} from '@/constants';
import {isJsonData} from '@/utils/helpers';
import React, {createContext, memo, useEffect, useMemo, useState} from 'react';

export interface IUserData {
  region: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image_file: string;
  image_caption: string;
  is_verified: boolean;
  phone_number: string;
  referral_code: string;
  whatsapp_no: string;
  state: string;
  previous_attempts: number;
  current_year: string;
  email_opt_in: boolean;
  whatsapp_opt_in: boolean;
  message_opt_in: boolean;
  tnc_approved: boolean;
  devices_unique_ids: string[];
  active_qbank_subscription?: boolean;
  enable_reset_feature?: boolean;
  college: {
    country: string;
    created_at: string;
    id: number;
    name: string;
    state: string;
  };
  course: {
    created_at: string;
    id: number;
    name: string;
  };
  birth_date: string;
  college_state: string;
  user: number;
  uuid: string;
  purchased_complete_course: 'complete_course' | 'complete_subject' | null;
  screenshot_taken: number;
  ss_limit_reached: boolean;
  preferred_language: {
    id: number;
    name: string;
  };
  address_info: IAddress[];
  subscription_info: {
    plan__id: string;
    plan__collection__is_complete_course: boolean;
    plan__collection__name: string;
    duration: number;
    start_at: Date;
  }[];
  extension_plan_duration: number;
  subscription_status: {
    has_extension: boolean;
    duration_left: number;
  } | null;
  lastBannerDate?: string;
  restrict_qbank_analytics?: boolean;
}

interface IUserContext {
  authToken: string | null;
  setAuthToken: ((e: string | null) => void) | undefined;
  refreshToken: string | null;
  setRefreshToken: ((e: string | null) => void) | undefined;
  email: string | null;
  setEmail: ((e: string | null) => void) | undefined;
  userData: IUserData | null;
  setUserData: ((e: IUserData | null) => void) | undefined;
  region: string;
  setRegion: ((e: string) => void) | undefined;
  userRole: string;
  setUserRole: ((e: string) => void) | undefined;
}

const initialData: IUserContext = {
  authToken: null,
  setAuthToken: undefined,
  refreshToken: null,
  setRefreshToken: undefined,
  email: null,
  setEmail: undefined,
  userData: null,
  setUserData: undefined,
  region: '',
  setRegion: undefined,
  userRole: '',
  setUserRole: undefined,
};

export const UserContext = createContext(initialData);

const UserContextHook = ({children}: {children: React.ReactNode}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  const contextValues = useMemo(
    () => ({
      authToken,
      setAuthToken,
      refreshToken,
      setRefreshToken,
      email,
      setEmail,
      userData,
      setUserData,
      region,
      setRegion,
      userRole,
      setUserRole,
    }),
    [authToken, email, refreshToken, region, userData, userRole],
  );

  useEffect(() => {
    const authTokenFromStorage = localStorage.getItem(AUTH_TOKEN_KEY);
    const refreshTokenFromStorage = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userDataFromStorage = localStorage.getItem(USER_DATA_KEY);
    const regionFromStorage = localStorage.getItem(COUNTRY_CODE_KEY)! || '';

    const user_role: string = localStorage.getItem(USER_ROLE_KEY) || '';
    setUserRole(user_role);

    setRegion(regionFromStorage);

    setAuthToken(authTokenFromStorage ? authTokenFromStorage : null);
    setRefreshToken(refreshTokenFromStorage ? refreshTokenFromStorage : null);

    // Checks if user data is in JSON format
    if (userDataFromStorage && isJsonData(userDataFromStorage)) {
      const parsedUserData = JSON.parse(userDataFromStorage);
      setUserData(parsedUserData);
    } else {
      setUserData(null);
    }
  }, []);

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

export default memo(UserContextHook);
