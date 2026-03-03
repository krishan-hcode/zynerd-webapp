'use client';

import Modal from '@/common/Modal';
import {BASE_URL, PROFILE_ROUTE} from '@/constants';
import {CheckIcon, RemoveIcon} from '@/elements/Icons';
import {IAccountDeletionModalProps} from '@/qbank/types';
import {fetchHelper, showToast} from '@/utils/helpers';
import React, {useCallback, useState} from 'react';

const deleteAccountPoints: string[] = [
  "You'll be logged out of Cerebellum & your account will be deleted within 48 hours",
  'Your active subscription will be canceled.',
  "You'll not be able to access your videos, QBank.",
  "You'll not be able to access your bookmarked content",
  "You'll not be able to sign in to your account. You'll have to create new account.",
];

type Props = IAccountDeletionModalProps & {
  onProceed: () => void; // called when OTP is sent successfully
};

const DeleteAccountModal: React.FC<Props> = ({isOpen, onClose, onProceed}) => {
  const [loading, setLoading] = useState(false);

  const onDelete = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchHelper(BASE_URL + PROFILE_ROUTE, 'DELETE');

      setLoading(false);
      showToast('success', res?.data.detail || 'OTP sent to your email');
      onProceed();
    } catch (e: any) {
      setLoading(false);
      showToast('error', e?.message || 'Failed to start deletion');
    }
  }, [onProceed]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={true}
      containerAdditionalClasses="max-w-xl rounded-2xl"
      modalPositionClass="absolute -top-4 left-0 right-0 "
      modalClasses="pt-0">
      <div>
        <h2 className="text-2xl text-primary-dark mb-8 font-besley">
          Delete Account
        </h2>
        <h1 className="text-xl text-primary-dark font-openSauceOneMedium mb-2">
          Please read below before deleting your account.
        </h1>
        <p className="text-xs font-interMedium text-customGray-60 mb-4">
          The Cerebellum account you are attempting to delete provides access to
          a wide variety of learning resources for NEETPG/INICET/NEXT and FMGE
          preparation. These include videos, tests, notes, QBank and offline
          sessions. Upon deletion, your account and related data will be
          permanently deleted.
        </p>

        <div className="border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-openSauceOneMedium text-customGray-90">
              On deleting your account
            </h2>
            <div className="w-12 h-12 bg-secondary-red/10 rounded-lg flex items-center justify-center">
              <RemoveIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-3">
            {deleteAccountPoints?.map((DeletePoints, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="justify center">
                  <CheckIcon className="w-6 h-6" />
                </span>
                <p className="text-sm font-interMedium text-customGray-60">
                  {DeletePoints}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm font-openSauceOneMedium text-customGray-90">
          If you decide to use Cerebellum again, just download it from Google
          Play Store or App Store. Once downloaded, sign in/register with your
          existing or new email address.
        </div>
        <div className="border-t border-gray-200 mt-4" />
        <div className="w-full px-0 py-4 flex gap-3">
          <button
            onClick={onDelete}
            disabled={loading}
            className="flex-1 border border-customGray-20 rounded-xl py-4 text-secondary-red font-interSemibold text-sm sm:text-base  disabled:opacity-50">
            Delete Account
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-customGray-90 rounded-xl py-4 text-white font-interSemibold text-sm sm:text-base">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
