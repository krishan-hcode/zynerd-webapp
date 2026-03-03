'use client';

import ProfileCard from '@/common/ProfileCard';
import SubscriptionCard from '@/common/SubscriptionCard';
import {collegeYears} from '@/constants';
import {
  DropArrowDownIcon,
  DropArrowUpIcon,
  NotesIcon,
  PremiumHeaderIcon,
} from '@/elements/Icons';
import {useUserSubscription} from '@/hooks/useUserSubscription';
import PremiumBanner from '@/qbank/PremiumBanner';
import {buildValidityDate} from '@/utils/utils';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {useAppSelector} from 'lib/redux/hooks/appHooks';
import {RootState} from 'lib/redux/store';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {useSelector} from 'react-redux';

dayjs.extend(utc);

const ProfileLeft = () => {
  const router = useRouter();
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const userInfo = useAppSelector(state => state.user.userInfo);
  // Extend dayjs with UTC plugin
  const {isPremium, isMissionPlan, isNonMissionPlan} = useUserSubscription(
    userInfo ?? undefined,
  );

  const isActiveSubscription = (startAt: string, duration: number) => {
    const endDate = dayjs.utc(startAt).add(duration, 'day');
    return !dayjs().isAfter(endDate);
  };

  // Transform subscription data from API

  const subscriptionData =
    userData?.subscription_info?.map((subscription: any) => ({
      title: subscription.plan__collection__name,
      validity: buildValidityDate(subscription.start_at, subscription.duration),
      isActive: isActiveSubscription(
        subscription.start_at,
        subscription.duration,
      ),
    })) || [];

  // Helper function to get display value for current_year (same as EducationRight)
  const getYearDisplayValue = (value: any) => {
    if (typeof value === 'object' && value?.name) {
      return value.name;
    }
    if (typeof value === 'string' && value) {
      const yearObj = collegeYears.find(y => y.key === value);
      return yearObj?.name || value;
    }
    return '';
  };

  const toggleSubscriptions = () => {
    setShowAllSubscriptions(prev => !prev);
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 font-sauce overflow-visible pt-10">
      <div className="relative">
        <ProfileCard
          firstName={userData?.first_name || ''}
          lastName={userData?.last_name || ''}
          course={userData?.course?.name || ''}
          year={getYearDisplayValue(userData?.current_year)}
          imageUrl={userData?.image_file}
          onEditProfile={() => router.push('/edit-profile')}
        />
        {/* Always-visible soft blurred shadow below profile card */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-3 bg-primaryBlue/60 blur-md rounded-full z-0" />
      </div>

      {/* Premium Section */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl font-sauce font-bold text-lightBlue-900">
          Premium
        </h2>
        {/* Subscription section: show Buy button when no subscription; else list subscriptions */}

        <div className="flex flex-col justify-center space-y-2 md:space-y-3">
          {subscriptionData
            ?.slice(0, showAllSubscriptions ? subscriptionData.length : 1)
            .map((subscription, index) => (
              <SubscriptionCard
                key={index}
                title={subscription.title}
                validity={subscription.validity}
                isActive={subscription.isActive}
              />
            ))}

          {subscriptionData?.length > 1 && (
            <button
              onClick={toggleSubscriptions}
              className="flex mx-auto items-center justify-center gap-2 px-4 py-1 border rounded-full border-gray-300 hover:bg-gray-100 transition-colors">
              <span className="text-gray-600 font-medium text-sm">
                {showAllSubscriptions ? 'Show Less' : 'View All'}
              </span>
              {showAllSubscriptions ? (
                <DropArrowUpIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <DropArrowDownIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
        <PremiumBanner
          isPremium={isNonMissionPlan ?? false}
          onUpgradeClick={() => router.push('/plans')}
          missionPlan={isMissionPlan}
        />
        {/* Action Links */}
        <div className="space-y-1 md:space-y-2">
          <button
            onClick={() => router.push('/plans')}
            className="w-full flex items-center justify-between px-3 pt-3 pb-5 hover:bg-gray-50 rounded-lg border-b transition-colors">
            <div className="flex items-center space-x-3">
              <PremiumHeaderIcon className="w-6 h-6 md:w-6 md:h-6 text-orange_900 flex-shrink-0" />
              <span className="text-sm md:text-base text-lightBlue-800 font-medium font-sauce">
                Explore More Plans
              </span>
            </div>
            <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
          </button>

          <button
            onClick={() => router.push('/plans/only-notes')}
            className="w-full flex items-center justify-between px-3 pt-3 pb-5 border-b hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <NotesIcon className="w-6 h-6 md:w-6 md:h-6 text-orange_900 flex-shrink-0" />
              <span className="text-sm md:text-base text-lightBlue-800 font-medium font-sauce">
                Buy Notes
              </span>
            </div>
            <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeft;
