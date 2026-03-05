import ConfirmationModal from '@/common/ConfirmationModal';
import Modal from '@/common/Modal';
import PremiumModal from '@/common/PremiumModal';
import {BASE_URL, RESET_DATA} from '@/constants';
import {
  QBankResetIcon,
  ResetIcon,
  ResetInfoCircleIcon,
  ResetPasswordIcon,
  TestsResetIcon,
} from '@/elements/Icons';
import {fetchHelper, showToast} from '@/utils/helpers';
import {useAppSelector} from 'lib/redux/hooks/appHooks';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
type Props = {
  isOpen: boolean;
  onClose: () => void;
};
type ResetType = 'qbank' | 'test' | 'both';
type ResetDatesIds = 'qbank' | 'test' | 'both';
type ResetItem = {
  created_at: string;
  reset_type: 'qbank' | 'test';
  status: 'in_progress' | 'completed' | 'pending';
  user: number;
  next_reset_date: string;
};
const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
const ResetDataModal: React.FC<Props> = ({isOpen, onClose}) => {
  const router = useRouter();
  const userInfo = useAppSelector(state => state.user.userInfo);
  const {enable_reset_feature: enableResetFeature = false} = userInfo || {};
  //   const {isMissionPlan} = useUserSubscription(userInfo ?? undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [enableResetFeatureOpen, setEnableResetFeatureOpen] = useState(false);
  const [isQbankInProgress, setIsQbankInProgress] = useState(false);
  const [isTestInProgress, setIsTestInProgress] = useState(false);
  const [isQbankDisabled, setIsQbankDisabled] = useState(false);
  const [isTestDisabled, setIsTestDisabled] = useState(false);
  const [resetDates, setResetDates] = useState<
    Record<ResetDatesIds, {lastResetDate: string}>
  >({
    qbank: {lastResetDate: ''},
    test: {lastResetDate: ''},
    both: {lastResetDate: ''},
  });
  const items = useMemo(
    () => [
      {
        id: 1,
        title: 'Reset QBanks Only',
        subTitle:
          'This will clear your progress on the QBanks and subsequently all your QBanks scores.',
        for: 'qbank' as ResetType,
        Icon: QBankResetIcon,
      },
      {
        id: 2,
        title: 'Reset Tests Only',
        subTitle: 'This will delete all your tests and start over.',
        for: 'test' as ResetType,
        Icon: TestsResetIcon,
      },
      {
        id: 3,
        title: 'Reset Both QBanks & Tests',
        subTitle: 'This will clear all your Tests and QBanks data.',
        for: 'both' as ResetType,
        Icon: ResetPasswordIcon,
      },
    ],
    [],
  );
  const disableSelectable = (id: number): boolean => {
    if (id === 1) {
      // QBank only
      return isQbankInProgress || isQbankDisabled;
    }
    if (id === 2) {
      // Test only
      return isTestInProgress || isTestDisabled;
    }
    if (id === 3) {
      // Both: disable if either side is unavailable
      return (
        isQbankInProgress ||
        isQbankDisabled ||
        isTestInProgress ||
        isTestDisabled
      );
    }
    return false;
  };
  const isIndividualSelected =
    (isQbankInProgress ||
      isQbankDisabled ||
      isTestInProgress ||
      isTestDisabled) &&
    !(
      (isQbankInProgress || isQbankDisabled) &&
      (isTestInProgress || isTestDisabled)
    );
  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetchHelper(BASE_URL + RESET_DATA, 'GET');
      const data: ResetItem[] = (res?.data || []) as ResetItem[];
      let latestQBank: ResetItem | null = null;
      let latestTest: ResetItem | null = null;
      data.forEach(item => {
        const created = new Date(item.created_at);
        if (item.reset_type === 'qbank') {
          if (!latestQBank || created > new Date(latestQBank.created_at)) {
            latestQBank = item;
          }
          setIsQbankInProgress(item.status === 'in_progress');
          setIsQbankDisabled(item.status === 'completed');
          setResetDates(prev => ({
            ...prev,
            qbank: {lastResetDate: formatDate(created)},
          }));
        }
        if (item.reset_type === 'test') {
          if (!latestTest || created > new Date(latestTest.created_at)) {
            latestTest = item;
          }
          setIsTestInProgress(item.status === 'in_progress');
          setIsTestDisabled(item.status === 'completed');
          setResetDates(prev => ({
            ...prev,
            test: {lastResetDate: formatDate(created)},
          }));
        }
        if (latestQBank && latestTest) {
          const qbankDate = new Date(latestQBank.created_at);
          const testDate = new Date(latestTest.created_at);
          const mostRecent = qbankDate > testDate ? latestQBank : latestTest;
          setResetDates(prev => ({
            ...prev,
            both: {lastResetDate: formatDate(mostRecent.created_at)},
          }));
        }
      });
      // ✅ Only set "both" if both qbank & test resets exist
    } catch (_e) {
      setIsQbankDisabled(true);
      setIsTestDisabled(true);
    }
  }, []);
  const handleSubmit = useCallback(async () => {
    try {
      // Determine selected type
      let type: ResetType | undefined;
      if (selectedIndex === 0) type = 'qbank';
      if (selectedIndex === 1) type = 'test';
      if (selectedIndex === 2) type = 'both';
      setIsConfirmOpen(false);
      if (!type) return;
      // Optimistic disable UI immediately based on selection
      if (type === 'qbank') {
        setIsQbankInProgress(true);
        setIsQbankDisabled(true);
      } else if (type === 'test') {
        setIsTestInProgress(true);
        setIsTestDisabled(true);
      } else if (type === 'both') {
        setIsQbankInProgress(true);
        setIsTestInProgress(true);
        setIsQbankDisabled(true);
        setIsTestDisabled(true);
      }
      if (type === 'both') {
        const [qbankRes, testRes] = await Promise.all([
          fetchHelper(BASE_URL + RESET_DATA, 'POST', {type: 'qbank'}),
          fetchHelper(BASE_URL + RESET_DATA, 'POST', {type: 'test'}),
        ]);
        if (qbankRes && testRes) {
          showToast('success', 'Both QBanks and Tests deletion in progress');
          const now = formatDate(new Date());
          setResetDates(prev => ({
            ...prev,
            qbank: {lastResetDate: now},
            test: {lastResetDate: now},
            both: {lastResetDate: now},
          }));
          fetchProgress();
        }
      } else {
        const res = await fetchHelper(BASE_URL + RESET_DATA, 'POST', {type});
        if (res) {
          const message =
            type === 'qbank'
              ? 'QBanks deletion in progress'
              : 'Tests deletion in progress';
          showToast('success', message);
          const now = formatDate(new Date());
          if (type === 'qbank') {
            setResetDates(prev => ({
              ...prev,
              qbank: {lastResetDate: now},
              //   both: {lastResetDate: now},
            }));
          } else if (type === 'test') {
            setResetDates(prev => ({
              ...prev,
              test: {lastResetDate: now},
              //   both: {lastResetDate: now},
            }));
          }
          fetchProgress();
        }
      }
      setSelectedIndex(null);
      onClose();
    } catch (e: any) {
      showToast('error', e?.message || 'Failed to reset data');
    }
  }, [selectedIndex, onClose, fetchProgress]);
  useEffect(() => {
    if (isOpen && enableResetFeature) fetchProgress();
  }, [isOpen, fetchProgress]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        shouldHaveCrossIcon={true}
        buttonAdditionalClass="bg-transparent"
        containerAdditionalClasses="max-w-xl rounded-2xl"
        modalPositionClass="absolute -top-6 left-0 right-0 "
        modalClasses="pt-0">
        <div className="flex flex-col -mx-6 -mt-6 px-6 pt-4 pb-8 bg-primary-blue/10">
          <div className="w-12 h-12 mb-6 bg-primary-blue/10 rounded-lg flex items-center justify-center">
            <ResetIcon className="w-6 h-6 text-white" stroke="#0483F7" />
          </div>
          <h2 className="text-3xl font-besley text-primary-dark">Reset Data</h2>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-xl text-primary-dark font-openSauceOneMedium">
            You can reset your activity for QBanks and Tests to start over with
            a clear record.
          </p>
          <div className="space-y-4">
            {items?.map((item, index) => {
              const disabled =
                disableSelectable(item.id) || !enableResetFeature;
              const isSelected = selectedIndex === index;
              const dateKey: ResetDatesIds =
                item.id === 1 ? 'qbank' : item.id === 2 ? 'test' : 'both';
              const lastReset = resetDates[dateKey]?.lastResetDate;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedIndex(index)}
                  className={`w-full text-left border rounded-xl p-3 flex items-start justify-between ${
                    disabled
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                      : isSelected
                        ? 'border-primary-blue bg-primary-blue/10'
                        : 'border-customGray-15 bg-white'
                  }`}>
                  <div>
                    <div className="text-base text-customGray-90 font-openSauceOneMedium">
                      {item.title}
                    </div>
                    <div className="text-sm text-customGray-60 mt-2 font-interMedium">
                      {item.subTitle}
                    </div>
                    {disabled &&
                      (item.id !== 3 ? (
                        lastReset && (
                          <div className="text-sm text-gray-800 mt-2 font-medium">
                            You have reset the {item.for} on{' '}
                            <span className="font-semibold">{lastReset}</span>
                          </div>
                        )
                      ) : isIndividualSelected ? (
                        <div className="text-sm text-gray-800 mt-2 font-medium">
                          This option isn&apos;t available right now because
                          you&apos;ve already reset your QBank/Test earlier
                        </div>
                      ) : (
                        lastReset && (
                          <div className="text-sm text-gray-800 mt-2 font-medium">
                            You have reset the {item.for} on{' '}
                            <span className="font-semibold">{lastReset}</span>
                          </div>
                        )
                      ))}
                  </div>
                  <div>
                    <item.Icon className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-row border border-[#7dc4f8] bg-blue-50 p-4 rounded-xl items-center gap-2">
            <div>
              <ResetInfoCircleIcon />
            </div>
            <p className="text-sm text-customGray-80 font-openSauceOneMedium">
              <span className="text-secondary-orange">Note: </span>
              Please check our{' '}
              <span
                className="text-primary-blue cursor-pointer font-openSauceOneMedium text-sm"
                onClick={() => router.push('/faqs')}>
                FAQs
              </span>{' '}
              to know how many times you can reset as per your plan.
            </p>
          </div>
          <div className="pt-2 border-t border-customGray-10 mt-2" />
          <div className="w-full flex ">
            <button
              type="button"
              disabled={selectedIndex === null && enableResetFeature}
              onClick={() => {
                // if (selectedIndex === null ) return;
                if (!enableResetFeature) {
                  setEnableResetFeatureOpen(true);
                  onClose();
                  return;
                }
                // Premium user
                setIsConfirmOpen(true);
                onClose();
              }}
              className="w-full mt-2 rounded-2xl py-4 px-4 text-base items-center border border-customGray-20 text-secondary-red font-interSemibold disabled:opacity-50">
              Reset Data
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmationModal
        isModalOpen={isConfirmOpen}
        setIsModalOpen={setIsConfirmOpen}
        heading="Are you sure you want to continue?"
        content={`This action will permanently delete all your ${
          selectedIndex === 0
            ? 'Qbank'
            : selectedIndex === 1
              ? 'Test'
              : 'test and QBank'
        } data, including all associated data, and this process cannot be reversed.`}
        showButton={true}
        buttonText="Confirm Reset"
        onClick={handleSubmit}
      />
      {/* Premium paywall */}
      <PremiumModal
        isOpen={enableResetFeatureOpen}
        onClose={() => setEnableResetFeatureOpen(false)}
        onBuyNow={() => {
          setEnableResetFeatureOpen(false);
          router.push('/plans');
        }}
      />
    </>
  );
};
export default ResetDataModal;
