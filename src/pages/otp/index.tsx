import Loader from '@/common/Loader';
import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  REFRESH_TOKEN_KEY,
  USER_PROFILE_PATH,
  USER_ROLE_KEY,
} from '@/constants';
import {StarIcon} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import CarouselSection from '@/login/loginCarousel';
import {fetchHelper, showToast} from '@/utils/helpers';
import {isValidOtp} from '@/utils/validations';
import {RootState} from 'lib/redux/store';
import {NextPage} from 'next';
import Head from 'next/head';
import {NextRouter, useRouter, withRouter} from 'next/router';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {GoogleReCaptcha} from 'react-google-recaptcha-v3';
import {useSelector} from 'react-redux';

interface WithRouterProps {
  router: NextRouter;
}

interface OTPProps extends WithRouterProps {}

export const Otp: NextPage<OTPProps> = props => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user?.userInfo);

  const [counterStart, setCounterStart] = useState(true);
  const [timeRemain, setTimeRemain] = useState(120);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const router = useRouter();
  const {setAuthToken, setEmail, setUserRole, setRefreshToken} =
    useContext(UserContext);
  const phoneNumber = props.router.query?.phoneNumber || '';
  const region = props.router.query?.region || '';
  const isOtpComplete = otp.every(digit => digit !== '');

  useEffect(() => {
    if (counterStart && timeRemain > 0) {
      const timer = setInterval(() => {
        setTimeRemain(timeRemain - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeRemain === 0) {
      setCounterStart(false);
    }
  }, [counterStart, timeRemain]);

  const maskPhoneNumber = (phoneNumber: string | string[]) => {
    const visibleDigits = phoneNumber.slice(-4);
    return `+91-XXXXXX${visibleDigits}`;
  };

  const resendOtp = async () => {
    try {
      const response = await fetchHelper(BASE_URL + USER_PROFILE_PATH, 'POST', {
        phone: phoneNumber,
        region,
        recaptcha: recaptchaToken,
      });
      if (response.status === 200) {
        return response;
      } else {
        throw new Error('Unable to send OTP');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
  };

  const resendOtpHandler = async () => {
    if (timeRemain > 0) return; // prevent multiple clicks

    if (!recaptchaToken) {
      showToast('error', 'Recaptcha verification failed, please try again');
      return;
    }

    try {
      if (timeRemain === 0 && recaptchaToken) {
        await resendOtp();

        setTimeRemain(120);
        setCounterStart(true);
      } else {
        throw new Error('Unable to send OTP');
      }
    } catch (error: any) {
      showToast('error', 'Something went wrong');
    }
  };

  const setAuthData = (userData: {token: string; refresh_token: string}) => {
    localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, userData.refresh_token);
    setAuthToken && setAuthToken(userData.token);
    setRefreshToken && setRefreshToken(userData.refresh_token);
  };

  const getUserRole = (user: any) => {
    if (user.is_bdm) {
      return 'bdm';
    } else if (user.is_ambassador) {
      return 'ambassador';
    } else {
      return 'student';
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isOtpComplete) {
        handleVerify();
      }
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`);
        if (prev) (prev as HTMLInputElement).focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpInput = (
    e: React.FormEvent<HTMLInputElement>,
    index: number,
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`);
        if (prev) (prev as HTMLInputElement).focus();
      }
    }
  };

  // Allow pasting full OTP into any box
  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const pasted = e.clipboardData.getData('text') || '';
    const digits = pasted
      .replace(/[^0-9]/g, '')
      .slice(0, 6 - index)
      .split('');
    if (!digits.length) return;
    e.preventDefault();
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[index + i] = digits[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(index + digits.length, 5);
    const nextEl = document.getElementById(`otp-${nextIndex}`);
    if (nextEl) (nextEl as HTMLInputElement).focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (isValidOtp(otpValue) && phoneNumber && region) {
      if (!acceptedTerms) {
        return showToast('error', 'Please accept terms and conditions');
      }
      setIsLoading(true);
      const response = await fetchHelper(BASE_URL + USER_PROFILE_PATH, 'POST', {
        phone: phoneNumber,
        region,
        otp: otpValue,
      });

      setIsLoading(false);

      if (response.status === 200 && response.data?.token) {
        setAuthData(response.data);
        localStorage.setItem(USER_ROLE_KEY, getUserRole(response.data));
        setUserRole && setUserRole(getUserRole(response.data));

        if (response.data.email) {
          setEmail?.(response.data.email);
          // Check if there's a saved redirect URL
          const redirectUrl = localStorage.getItem('REDIRECT_AFTER_LOGIN');
          if (redirectUrl) {
            router.replace(redirectUrl);
            // Clear the saved redirect URL
            localStorage.removeItem('REDIRECT_AFTER_LOGIN');
            return;
          }
          router.replace('/plans');
        } else {
          router.replace('/user-details');
        }
      } else {
        showToast('error', 'Please enter a valid OTP', 'wrong_otp');
      }
    } else {
      const OTPInputElement =
        window.document.getElementById('otp-number-input');

      OTPInputElement?.classList.add('input_error');

      // removes error class after 4 seconds
      setTimeout(() => {
        OTPInputElement?.classList.remove('input_error');
      }, 4000);
      showToast('error', 'Please enter a valid OTP', 'wrong_otp');
    }
  };

  const setRecaptchaKey = useCallback((key: string | null) => {
    setRecaptchaToken(key);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white min-h-screen py-4 px-8 md:p-10">
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
            <div className="w-full flex justify-center items-center  ">
              <div className="w-12 h-12  bg-primary-blue/10 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-mincho text-primary-dark text-center mb-6">
              Enter OTP
            </h1>

            <p className="text-center font-inter text-xs text-customGray-80 font-medium mb-8">
              Enter the 6-digit code we just texted to <br />
              <span className="inline-flex items-center gap-1 flex-wrap justify-center">
                your mobile number {maskPhoneNumber(phoneNumber)}
                <img
                  src="/assets/EditIcon.svg"
                  alt="edit"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() =>
                    router.push(`/login?phoneNumber=${phoneNumber}`)
                  }
                />
              </span>
            </p>

            {/* OTP Input */}
            <div
              id="otp-number-input"
              className="flex justify-between gap-3 sm:gap-3 mb-6 w-full max-w-md mx-auto">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e, index)}
                  onKeyDown={e => handleOtpKeyDown(e, index)}
                  onInput={e => handleOtpInput(e, index)}
                  onPaste={e => handleOtpPaste(e, index)}
                  id={`otp-${index}`}
                  className="
        w-10 h-10 text-base 
        sm:w-12 sm:h-12 sm:text-lg 
        md:w-14 md:h-14 md:text-xl
        text-center border-2 border-gray-200 rounded-lg text-primary-dark font-sauce font-medium
        focus:ring-2 focus:ring-blue-500 focus:outline-none
      "
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="mt-4 text-center">
              {timeRemain > 0 ? (
                <p className="text-xxs text-customGray-50 font-inter font-semibold text-center mb-6">
                  Didn’t receive the OTP? Resend in {timeRemain} seconds
                </p>
              ) : (
                <button
                  onClick={resendOtpHandler}
                  className="text-sm text-blue-500 hover:underline mb-6 block mx-auto">
                  Resend OTP
                </button>
              )}
              <GoogleReCaptcha onVerify={setRecaptchaKey} action="resend_otp" />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isOtpComplete} // disable until OTP is filled
              className={`w-full px-3 py-4 rounded-2xl font-medium text-base transition ${
                isOtpComplete
                  ? 'bg-customGray-90 text-white cursor-pointer'
                  : 'bg-customGray-10 text-white cursor-not-allowed'
              }`}>
              Continue
            </button>
          </div>
        </Loader>
      </div>
    </div>
  );
};

export default withRouter(Otp);
