import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {Country, countries} from 'countries-list';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {GoogleReCaptcha} from 'react-google-recaptcha-v3';
import {useDispatch} from 'react-redux';

import Loader from '@/common/Loader';
import Modal from '@/common/Modal';
import {
  BASE_URL,
  COUNTRY_CODE_KEY,
  INDIA_COUNTRY_CODE_MOCK_DATA,
  USER_PROFILE_PATH,
} from '@/constants';
import {UserContext} from '@/global/UserContext';
import {fetchHelper, loadScript, showToast} from '@/utils/helpers';
import {isValidNumber} from '@/utils/validations';
import {updateIsUserVerified} from 'lib/redux/slices/userSlice';
import Image from 'next/image';

// illustration (you can replace with your own asset)
import CarouselSection from '../../../components/login/loginCarousel';
import WhatsappImage from '../../../public/assets/Whatsapp.svg';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const phoneNumberFromProps: string =
    (router.query?.phoneNumber as string) || '';
  const [phoneNumber, setPhoneNumber] = useState<string>(
    phoneNumberFromProps || '',
  );
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [countryList, setCountryList] = useState(Object.values(countries));
  const [searchedText, setSearchedText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    Object.values(countries)?.find(c => c.name === 'India') ||
      INDIA_COUNTRY_CODE_MOCK_DATA,
  );

  const {
    setAuthToken,
    setRefreshToken,
    setUserRole,
    setUserData,
    setEmail,
    authToken = '',
  } = useContext(UserContext);

  const setRecaptchaKey = useCallback((key: string | null) => {
    setRecaptchaToken(key);
  }, []);

  const isIndianNumber = useMemo(
    () => selectedCountry?.phone === '91',
    [selectedCountry?.phone],
  );

  const isContinueEnabled = useMemo(() => {
    const digits = (phoneNumber || '').replace(/\D/g, '');
    return isIndianNumber ? digits.length === 10 : digits.length >= 8;
  }, [isIndianNumber, phoneNumber]);

  useEffect(() => {
    if (authToken) router.replace('/plans');
  }, [authToken, router]);

  useEffect(() => {
    if (isModalOpen) loadScript('https://otpless.com/auth.js');
  }, [isModalOpen]);

  // filter countries on search
  const filterSearchedCountries = (searchedInput: string) => {
    if (searchedInput.length) {
      setCountryList(
        Object.values(countries).filter(c =>
          c.name.toLowerCase().includes(searchedInput.toLowerCase()),
        ),
      );
    } else {
      setCountryList(Object.values(countries));
    }
  };

  // handle login
  const handleLogin = async () => {
    try {
      if (!recaptchaToken) {
        showToast(
          'error',
          'Unable to login. Please try again later',
          'login_error',
        );
        return;
      }
      if (!isValidNumber(phoneNumber, isIndianNumber)) {
        const inputEl = document.getElementById('mobile-number-input');
        inputEl?.classList.add('input_error');
        setTimeout(() => inputEl?.classList.remove('input_error'), 4000);
        showToast(
          'error',
          'Please enter a valid mobile number',
          'enter_number',
        );
        return;
      }

      setIsLoading(true);
      localStorage.setItem(COUNTRY_CODE_KEY, selectedCountry.phone);

      const response = await fetchHelper(BASE_URL + USER_PROFILE_PATH, 'POST', {
        phone: phoneNumber,
        region: selectedCountry.phone,
        recaptcha: recaptchaToken,
      });

      if (response.status === 200) {
        dispatch(
          updateIsUserVerified({tnc_approved: response.data.tnc_approved}),
        );
        router.replace({
          pathname: '/otp',
          query: {phoneNumber, region: selectedCountry.phone},
        });
      } else {
        showToast('error', 'Something went wrong!', 'login_error');
      }
    } catch (error: any) {
      showToast(
        'error',
        error?.detail || 'Something went wrong!',
        'login_error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white min-h-screen py-4 px-8 md:p-10 overflow-y-auto">
      <Head>
        <title>Login – Cerebellum Academy</title>
      </Head>

      {/* LEFT SIDE */}

      <div className="w-full lg:flex-[0.55] ">
        <CarouselSection />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:flex-[0.45] flex flex-col justify-center items-center">
        <Loader isLoading={isLoading}>
          <div className="w-full max-w-md lg:max-w-lg bg-white rounded-md">
            <h1 className="text-3xl font-mincho text-primary-dark text-center mb-10">
              Login to Continue
            </h1>

            {/* phone input */}
            <div className="flex items-start space-x-1 mb-4">
              <Menu as="div" className="relative inline-block text-left">
                <div className="w-20">
                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-lg border border-customGray-10 bg-white text-customGray-70 px-2 py-[17px] text-sm font-sauce font-medium hover:bg-gray-50">
                    +{selectedCountry.phone}
                    <ChevronDownIcon className="h-5 w-5 text-customGray-90" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95">
                  <Menu.Items className="max-h-[40vh] w-72 overflow-y-scroll absolute z-10 mt-2 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                    <div>
                      <div className="sticky top-0 bg-white p-2">
                        <input
                          className="w-full px-2 py-1 border-gray-300 rounded-md border text-sm"
                          type="search"
                          placeholder="Search"
                          value={searchedText}
                          onChange={e => {
                            setSearchedText(e.target.value);
                            filterSearchedCountries(e.target.value);
                          }}
                        />
                      </div>
                      {countryList.map(country => (
                        <Menu.Item key={country.name}>
                          {({active}) => (
                            <li
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'px-4 py-2 text-sm cursor-pointer',
                              )}
                              onClick={() => setSelectedCountry(country)}>
                              {country.emoji} {country.name}
                            </li>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <input
                maxLength={isIndianNumber ? 10 : 12}
                id="mobile-number-input"
                type="tel"
                placeholder="Enter Mobile Number"
                value={phoneNumber}
                onChange={e => {
                  const numeric = e.target.value.replace(/\D/g, '');
                  setPhoneNumber(numeric);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && isContinueEnabled) {
                    e.preventDefault();
                    handleLogin();
                  }
                }}
                className="w-full inline px-2 py-[17px] rounded-lg border border-customGray-10 font-sauce text-primary-dark font-medium text-sm placeholder:text-customGray-40 placeholder:text-sm placeholder:font-sauce"
              />
            </div>

            <GoogleReCaptcha onVerify={setRecaptchaKey} action="page_view" />

            <p className="text-xs font-inter text-customGray-80 mt-6 text-center mb-6">
              By clicking on Continue, I accept the{' '}
              <a
                href="https://www.cerebellumacademy.com/terms-and-conditions/"
                className="text-blue-500 hover:underline">
                Terms & Conditions
              </a>
              ,{' '}
              <a
                href="https://www.cerebellumacademy.com/privacy-policy/"
                className="text-blue-500 hover:underline">
                Privacy Policy
              </a>{' '}
              &{' '}
              <a
                href="https://www.cerebellumacademy.com/device-usage-policy/"
                className="text-blue-500 hover:underline">
                Content Policy
              </a>
            </p>
            <button
              onClick={handleLogin}
              disabled={!isContinueEnabled}
              className={classNames(
                'w-full px-3 py-4 rounded-2xl font-medium text-base transition',
                isContinueEnabled
                  ? 'bg-customGray-90 text-white cursor-pointer'
                  : 'bg-customGray-10 text-white cursor-not-allowed',
              )}>
              Continue
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="w-full" />
              <span className="px-2 font-inter text-customGray-60 font-normal text-xs">
                OR
              </span>
              <hr className="w-full" />
            </div>

            {/* WhatsApp login */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center cursor-pointer rounded-2xl border border-customGray-15 px-3 py-4">
              <span className="">
                <Image
                  src={WhatsappImage}
                  alt="WhatsApp"
                  width={24} // adjust size
                  height={24}
                />
              </span>
              <span className="ml-2 text-sm font-inter font-semibold text-customGray-90">
                Continue with WhatsApp
              </span>
            </div>
          </div>
        </Loader>
      </div>

      {/* WhatsApp Modal */}
      <Modal
        shouldHaveCrossIcon
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        containerAdditionalClasses="max-w-xl">
        <div className="shadow-none drop-shadow-none" id="otpless-login-page" />
      </Modal>
    </div>
  );
};

export default Login;
