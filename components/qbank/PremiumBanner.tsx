'use client';

import {
  PremiumBlueIcon,
  PremiumHeaderIcon,
  PremiumTrophyIcon,
} from '@/elements/Icons';
import {classNames} from '@/utils/utils';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import PremiumBannerSkeleton from '../skeletons/PremiumBannerSkeleton';

const PremiumBanner = ({
  isPremium,
  onUpgradeClick,
  missionPlan,
  isLoading = false,
  className,
  bannerClassName,
}: any) => {
  const isEligibleForPremium = isPremium;

  if (isLoading) {
    return <PremiumBannerSkeleton />;
  }

  const bannerBgClass = isEligibleForPremium
    ? 'bg-extras-blue10 p-2  max-h-20'
    : 'bg-blue-500 p-2';
  const iconBgClass = isEligibleForPremium ? 'bg-primaryBlue' : 'bg-blue-400';
  const primaryTextColor = isEligibleForPremium
    ? 'text-lightBlue-400'
    : 'text-blue-100';
  const headingTextColor = isEligibleForPremium
    ? 'text-lightBlue-900'
    : 'text-white';
  const iconColor = isEligibleForPremium
    ? 'text-lightBlue-400'
    : 'text-blue-100';

  return (
    <div className={`flex flex-col w-full ${className ?? ''}`}>
      {/* Banner container */}
      <div
        className={classNames(
          'text-white rounded-full xl:px-4 xl:py-3 flex items-center justify-between cursor-pointer relative overflow-hidden z-10',
          bannerBgClass,
          missionPlan ? 'hidden' : 'block',
          bannerClassName ?? '',
        )}
        onClick={onUpgradeClick}>
        <div className="flex items-center gap-3">
          <div className={classNames('p-2 rounded-full', iconBgClass)}>
            <PremiumHeaderIcon />
          </div>
          <div>
            <p className={classNames('text-xs font-sauce', primaryTextColor)}>
              {isEligibleForPremium
                ? 'Need access to all QBank?'
                : 'Go premium for full Analytics.'}
            </p>
            <p
              className={classNames(
                'font-semibold xl:text-[18px] text-sm font-sauce',
                headingTextColor,
              )}>
              {isEligibleForPremium
                ? 'Upgrade to Mission 3.0'
                : 'Buy Mission 3.0'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowRightIcon className={classNames('h-5 w-5', iconColor)} />
          <div className="relative">
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 overflow-hidden">
              {isEligibleForPremium ? (
                <PremiumBlueIcon />
              ) : (
                <PremiumTrophyIcon />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Blurred shadow/glow below the banner */}
      <div
        className={classNames(
          'flex justify-center m-auto w-3/4 h-3  bg-primaryBlue/60 blur-md z-0',
          missionPlan ? 'hidden' : 'block',
        )}
      />
    </div>
  );
};

export default PremiumBanner;
