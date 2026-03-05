import ConfirmationModal from '@/common/ConfirmationModal';
import Modal from '@/common/Modal';
import {BASE_URL, DELETE_ACCOUNT_ROUTE, PROFILE_ROUTE} from '@/constants';
import {RemoveIcon} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import {fetchHelper, handleAppLogout, showToast} from '@/utils/helpers';
import {TrashIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReopen?: () => void; // Callback to reopen the modal from parent
};
const OtpVerifyModal: React.FC<Props> = ({isOpen, onClose, onReopen}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRemain, setTimeRemain] = useState(120);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [otpError, setOtpError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const {setAuthToken, setUserData, setUserRole} = useContext(UserContext);
  const onVerify = useCallback(async () => {
    if (otp.length !== 6) return;
    try {
      setOtpError(''); // Clear any previous errors
      onClose();
      setConfirmOpen(true);
    } catch (e: any) {
      setLoading(false);
      showToast('error', e?.message || 'Failed to verify OTP');
    }
  }, [otp, onClose]);
  const onResend = useCallback(async () => {
    try {
      if (timeRemain === 0) {
        setLoading(true);
        const res = await fetchHelper(BASE_URL + PROFILE_ROUTE, 'DELETE', {
          recaptcha: 'web',
        });
        setLoading(false);
        setTimeRemain(120);
        showToast('success', res?.data.detail || 'OTP resent');
      }
    } catch (e: any) {
      setLoading(false);
      showToast('error', e?.message || 'Failed to resend OTP');
    }
  }, [timeRemain]);
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const res = await fetchHelper(BASE_URL + DELETE_ACCOUNT_ROUTE, 'POST', {
        otp,
      });
      if (res?.status == 200) {
        // or whatever your API uses to indicate success
        showToast('success', 'Your account has been deleted successfully.');
        // Logout and clear session
        await handleAppLogout(
          setAuthToken,
          setUserData,
          setUserRole,
          dispatch as any,
          router,
        );
      } else {
        // If API says deletion failed (likely wrong OTP)
        const errorMessage = res?.message || 'Account deletion failed';
        console.log('errmsg', errorMessage.toLowerCase());
        // Check if it's an OTP-related error
        if (
          errorMessage.toLowerCase() ===
          'the otp you entered is invalid. please enter correct otp'
        ) {
          // Close confirmation modal and reopen OTP modal with error
          setConfirmOpen(false);
          setOtpError(errorMessage);
          // Reopen the OTP modal by calling onClose and then reopening
          setTimeout(() => {
            // Close current modal and reopen it with error
            onClose();
            if (onReopen) {
              onReopen();
            }
          }, 100);
        } else {
          showToast('error', errorMessage);
        }
      }
    } catch (e: any) {
      showToast('error', e?.message || 'Account deletion failed');
    } finally {
      setConfirmOpen(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen && timeRemain > 0) {
      const timer = setInterval(
        () => setTimeRemain(timeRemain => timeRemain - 1),
        1000,
      );
      return () => clearInterval(timer);
    }
  }, [isOpen, timeRemain]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        shouldHaveCrossIcon={true}
        containerAdditionalClasses="max-w-xl rounded-2xl">
        <div className="bg-primary-blue/10 -mx-6 -mt-6 px-6 py-10">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h1 className="text-3xl font-besley text-primary-dark mb-2">
              Verify OTP for Account Deletion
            </h1>
            <div className="w-12 h-12 bg-secondary-red/10 rounded-lg flex items-center justify-center">
              <RemoveIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-6">
          <p className="text-sm font-interMedium text-customGray-80 mb-4">
            Enter the 6-digit code we sent to your registered email address
          </p>
          <input
            value={otp}
            onChange={e => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setOtpError(''); // Clear error when user types
            }}
            placeholder="Enter OTP"
            className={`w-full h-14 px-4 border font-interMedium text-primary-dark rounded-xl bg-white outline-none ${
              otpError ? 'border-red-500' : 'border-customGray-10'
            }`}
            maxLength={6}
            inputMode="numeric"
          />
          {otpError && (
            <div className="text-red-500 text-sm mt-2">{otpError}</div>
          )}
          <div className="text-center mt-3 text-xs text-gray-500">
            {timeRemain > 0 ? (
              <span>
                Didn&apos;t receive the OTP? Resend in {timeRemain} seconds
              </span>
            ) : (
              <button className="text-blue-700" onClick={onResend}>
                Resend
              </button>
            )}
          </div>
          <div className="border-t border-gray-200 mt-4" />
          <div className="w-full px-0 py-4 flex gap-3">
            <button
              disabled={otp.length !== 6 || loading}
              onClick={onVerify}
              className="flex-1 bg-secondary-red text-white rounded-2xl py-4 font-semibold disabled:opacity-50">
              Delete Account
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-customGray-90 text-white rounded-2xl py-4 font-semibold">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmationModal
        isModalOpen={confirmOpen}
        setIsModalOpen={setConfirmOpen}
        heading="Please Confirm"
        content="Are you sure you want to delete your account."
        showButton={true}
        buttonText="Delete Account"
        loading={loading}
        onClick={handleDeleteAccount}
        Icon={TrashIcon}
        iconStyles="bg-red-100 text-red-600"
      />
    </>
  );
};
export default OtpVerifyModal;
