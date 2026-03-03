'use client';

import LogoutModal from '@/common/LogoutModal';
import {handleRateUs, WebSiteLink} from '@/constants';
import {
  ContactIcon,
  EducationDetailIcon,
  FAQsIcon,
  InfooIcon,
  LegalPolicyIcon,
  LogOutIcon,
  RateIcon,
  ResetIcon,
  ShareAppIcon,
} from '@/elements/Icons';
import {UserContext} from '@/global/UserContext';
import {useShareApp} from '@/hooks/useShareApp';
import {MenuItem} from '@/qbank/types';
import {handleAppLogout} from '@/utils/helpers';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import {useAppSelector} from 'lib/redux/hooks/appHooks';
import {useRouter} from 'next/router';
import type React from 'react';
import {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import DeleteAccountModal from './DeleteAccountModal';
import OtpVerifyModal from './OtpVerifyModal';
import ResetDataModal from './ResetDataModal';

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const shareApp = useShareApp();
  const {setAuthToken, setUserData, setUserRole} = useContext(UserContext);
  const userInfo = useAppSelector(state => state.user.userInfo);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState<boolean>(false);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await handleAppLogout(
      setAuthToken,
      setUserData,
      setUserRole,
      dispatch,
      router,
    );
  };

  const handleDeleteClick = () => {
    setIsDeleteAccountModalVisible(true);
  };

  const settingsItems: MenuItem[] = [
    {
      icon: EducationDetailIcon,
      label: 'Education Details',
      onClick: () => router.push('/education-details'),
    },
    {
      icon: ShareAppIcon,
      label: 'Share App',
      onClick: shareApp,
    },
  ];

  const cerebellumItems: MenuItem[] = [
    {
      icon: InfooIcon,
      label: 'About Us',
      onClick: () => window.open(WebSiteLink.aboutUs, '_blank'),
    },
    {
      icon: FAQsIcon,
      label: 'FAQs',
      onClick: () => router.push('/faqs'),
    },
    {
      icon: ContactIcon,
      label: 'Contact Support',
      onClick: () => window.open(WebSiteLink.contactSupport, '_blank'),
    },
    {
      icon: RateIcon,
      label: 'Rate Us',
      onClick: handleRateUs,
    },
  ];

  const legalItems: MenuItem[] = [
    {
      icon: LegalPolicyIcon,
      label: 'Terms & Conditions',
      onClick: () => window.open(WebSiteLink.termsConditions, '_blank'),
    },
    {
      icon: LegalPolicyIcon,
      label: 'Privacy Policy',
      onClick: () => window.open(WebSiteLink.privacyPolicy, '_blank'),
    },
    {
      icon: LegalPolicyIcon,
      label: 'Cancellation Policy',
      onClick: () => window.open(WebSiteLink.cancellationPolicy, '_blank'),
    },
  ];

  const moreItems: MenuItem[] = [
    {
      icon: LogOutIcon,
      label: 'Log Out',
      onClick: () => setIsModalVisible(true),
    },

    {
      icon: ResetIcon,
      label: 'Reset Data',
      onClick: () => setIsResetOpen(true),
    },
  ];

  const renderSection = (title: string, items: MenuItem[], className = '') => (
    <div className={`space-y-2 md:space-y-3 font-sauce ${className}`}>
      <h2 className="text-base md:text-lg font-sauce font-bold text-lightBlue-900">
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 transition-colors group border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0 font-medium" />
              <span className="text-sm md:text-base text-lightBlue-800 group-hover:text-lightBlue-900 font-sauce font-medium">
                {item.label}
              </span>
            </div>
            <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4 md:space-y-6 font-sauce">
      {/* Logout Modal */}
      <LogoutModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onProceed={() => {
          setIsDeleteAccountModalVisible(false);
          setIsOtpOpen(true);
        }}
      />
      <OtpVerifyModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onReopen={() => setIsOtpOpen(true)}
      />

      {/* Reset Data Modal */}
      <ResetDataModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />

      {/* Settings Section */}
      {renderSection('Settings', settingsItems)}

      {/* Cerebellum Section */}
      {renderSection('Cerebellum', cerebellumItems)}

      {/* Legal Section */}
      {renderSection('Legal', legalItems)}

      {/* More Section */}
      <div className="space-y-2 md:space-y-3 font-sauce">
        <h2 className="text-base md:text-lg font-sauce font-bold text-lightBlue-900">
          More
        </h2>
        <div className="space-y-1">
          {moreItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 transition-colors group border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0 font-medium" />
                <span className="text-sm md:text-base font-medium text-lightBlue-800 group-hover:text-lightBlue-900 font-sauce">
                  {item.label}
                </span>
              </div>
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}

          {/* Delete Account */}
          <div>
            <button
              className="w-full text-xs text-gray-400 font-medium font-sauce flex items-center justify-start p-3 md:p-4 transition-colors group border-b border-gray-200"
              onClick={handleDeleteClick}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
