import {IUserData} from '@/global/UserContext';
import {useMemo} from 'react';

// export interface ISubscriptionInfo {
//     duration: number;
//     plan__id: string;
//     plan__type: string;
//     start_at: string;
//     plan__collection__id: number;
//     plan__collection__name: string;
//     plan__collection__is_complete_course: boolean;
//   }

// export interface IUserInfo {
//   subscription_info?: ISubscriptionInfo[];
//   purchased_complete_course?: string | null;
//   active_qbank_subscription?: boolean;
// }

export function useUserSubscription(userInfo?: IUserData) {
  const {
    subscription_info = [],
    purchased_complete_course = null,
    active_qbank_subscription = false,
    restrict_qbank_analytics = false,
  } = userInfo ?? {};
  const userSubscription = useMemo(
    () => ({
      isPremium: subscription_info.length !== 0,
      isBTRUser: restrict_qbank_analytics,
      isNonMissionPlan:
        subscription_info.length !== 0 &&
        purchased_complete_course === 'complete_subject',
      isMissionPlan:
        subscription_info.length !== 0 &&
        purchased_complete_course === 'complete_course',
      hasQbankAccess: active_qbank_subscription,
    }),
    [
      subscription_info,
      purchased_complete_course,
      active_qbank_subscription,
      restrict_qbank_analytics,
    ],
  );

  return userSubscription;
}
