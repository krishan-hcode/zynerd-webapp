import {
  BASE_URL,
  COUNTRY_CODE_KEY,
  PROJECT_CONFIG,
  UPDATE_USER_PROFILE_PATH,
  USER_DATA_KEY,
} from '@/constants';
import {fetchHelper, showToast} from '@/utils/helpers';
import {setProjectConfig} from 'lib/redux/slices/projectConfigSlice';
import {updateUserData} from 'lib/redux/slices/userSlice';
import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect} from 'react';
import {Toaster} from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import Sidebar from './global/Sidebar';
import {UserContext} from './global/UserContext';

export default function Layout({children}: {children: React.ReactNode}) {
  const {authToken, setEmail, setUserData} = useContext(UserContext);
  const dispatch = useDispatch();
  const {pathname = ''} = useRouter();
  const {userData} = useContext(UserContext);

  const getProjectConfig = async () => {
    try {
      const response = await fetchHelper(BASE_URL + PROJECT_CONFIG, 'GET');
      if (response?.status === 200 && response?.data) {
        // TODO: Moivng this data from redux to index db in next release
        dispatch(setProjectConfig(response.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (authToken && pathname !== '/login') {
      getUserData();
      getProjectConfig();
    }
  }, [authToken]);

  const getUserData = useCallback(async () => {
    const response = await fetchHelper(
      BASE_URL + UPDATE_USER_PROFILE_PATH + '?address=1',
      'GET',
    );

    if (response.status === 200 && response.data) {
      localStorage.setItem(COUNTRY_CODE_KEY, response.data?.region);

      setEmail && setEmail(response.data.email || '');
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
      // Added user data in user context
      setUserData && setUserData(response.data);
      dispatch(updateUserData(response.data));
    } else {
      showToast('error', 'Something went wrong');
    }
  }, []);

  return (
    <div className="relative md:w-[99.6vw]">
      <Toaster />
      <div
        className={
          authToken && userData?.email !== '' ? 'md:flex md:row-span-2' : ''
        }>
        {authToken && userData?.email !== '' ? <Sidebar /> : ''}
        <div
          className={
            authToken && userData?.email !== ''
              ? 'lg:max-w-full overflow-x-auto md:flex-grow'
              : ''
          }>
          {children}
        </div>
      </div>
    </div>
  );
}
