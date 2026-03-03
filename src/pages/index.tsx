import PremiumModal from '@/common/PremiumModal';
import {
  ATTEMPT_HOMEPAGE_MCQ,
  BASE_URL,
  EXTERNAL_MEDIA,
  GET_TEACHER_LIST,
  INTRO_VIDEO,
  SUGGESTED_CONTENT,
} from '@/constants';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import StickyBanner from '@/StickyBanner';
import {
  IAnnouncements,
  ISuggestedContent,
  ITeacherItem,
} from '@/types/pages.types';
import {fetchHelper, showToast} from '@/utils/helpers';
import {classNames, triggerAnalyticsEvent} from '@/utils/utils';
import dayjs from 'dayjs';
import {useAppSelector} from 'lib/redux/hooks/appHooks';
import {RootState} from 'lib/redux/store';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import CachedImage from '@/common/CachedImage';
import YouTubeCarousel from '@/common/YouTubeCarousel';
import Footer from '@/Footer';
import {useUserSubscription} from '@/hooks/useUserSubscription';
import InviteFriends from '@/InviteFriends';
import Image from 'next/image';

const Home = () => {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const lastBannerDate =
    useSelector((state: RootState) => state.user.userInfo?.lastBannerDate) ||
    '';
  const {has_extension: hasExtension, duration_left: daysLeft = 0} =
    userData?.subscription_status || {};

  const userInfo = useAppSelector(state => state.user.userInfo);
  const {isMissionPlan, isNonMissionPlan} = useUserSubscription(
    userInfo ?? undefined,
  );

  // TODO: Moivng this data from redux to index db in next release
  const projectConfig = useAppSelector(state => state.projectConfig);

  const [suggestedContent, setSuggestedContent] = useState<
    ISuggestedContent | null | undefined
  >(undefined);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState<boolean>(false);
  const [previouslyAttemptedChoice, setPreviouslyAttemptedChoice] = useState<
    ISuggestedContent['previously_attempted_choice'] | null
  >(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [teacherList, setTeacherList] = useState<ITeacherItem[]>([]);

  const [announcements, setAnnouncements] = useState<IAnnouncements | null>(
    null,
  );
  const [introVideo, setIntroVideo] = useState([]);

  const purchasedCompleteCourse =
    userData?.purchased_complete_course === 'complete_course' || false;

  const isEligibleForExtensionBanner = (): boolean => {
    if (!lastBannerDate) {
      return !!userData?.subscription_status;
    }
    return !!(
      userData?.subscription_status && dayjs().diff(lastBannerDate, 'day') >= 1
    );
  };

  const bannerMessage = () => {
    if (!userData?.subscription_status) {
      return '';
    }
    const isExpiring = daysLeft >= 0;
    if (hasExtension) {
      return isExpiring
        ? projectConfig?.subscription_renewal_reminder_messages
            ?.extension_expiring_message
        : projectConfig?.subscription_renewal_reminder_messages
            ?.extension_expired_message;
    }
    return isExpiring
      ? projectConfig?.subscription_renewal_reminder_messages
          ?.upgrade_expiring_message
      : projectConfig?.subscription_renewal_reminder_messages
          ?.upgrade_expired_message;
  };

  const getSuggestedContent = async () => {
    try {
      const response = await fetchHelper(BASE_URL + SUGGESTED_CONTENT, 'GET');
      if (response.status === 200 && response.data) {
        setSuggestedContent(response.data.question_of_the_day || null);
        if (response.data.question_of_the_day) {
          triggerAnalyticsEvent('mcq_of_day_viewed', {});
        }
        setPreviouslyAttemptedChoice(
          response.data?.question_of_the_day?.previously_attempted_choice ||
            null,
        );
      }
    } catch (error) {}
  };

  const submitQuestionResponse = async (questionChoiceId: number) => {
    try {
      const question_id = suggestedContent?.id;
      const url = ATTEMPT_HOMEPAGE_MCQ;

      const payload = {
        question_id,
        question_choice_id: questionChoiceId,
      };
      const attemptResponse: any = await fetchHelper(url, 'POST', payload);
      if (attemptResponse.status === 201 && attemptResponse.data) {
        const {correct_choice, question_choice_id: attemptedQuestionChoiceId} =
          attemptResponse.data || {};

        triggerAnalyticsEvent('mcq_of_day_attempted', {
          is_correct: correct_choice === attemptedQuestionChoiceId,
          view_type: 'attempt',
        });
        setSuggestedContent((prevState: any) => {
          return {
            ...prevState,
            previously_attempted_choice: {
              ...attemptResponse.data,
              question_choice: attemptedQuestionChoiceId,
              correct_choice_id: correct_choice,
            },
          };
        });

        setPreviouslyAttemptedChoice({
          ...attemptResponse.data,
          question_choice: attemptedQuestionChoiceId,
          correct_choice_id: correct_choice,
        });
      }
    } catch (error: any) {
      showToast('error', 'Unable to submit. Please try again later');
    }
  };

  const getAnnouncements = async () => {
    const response = await fetchHelper(BASE_URL + EXTERNAL_MEDIA, 'GET');
    if (response.status === 200 && response.data) {
      setAnnouncements(response.data);
    }
  };

  useEffect(() => {
    triggerAnalyticsEvent('home_page_viewed', {});
    getSuggestedContent();
    getAnnouncements();
  }, []);

  // Cache key and TTL constants for teacher list caching
  const TEACHER_LIST_CACHE_KEY = 'teacherListCache';
  const TEACHER_LIST_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Generate a simple hash for cache invalidation based on data content
  const generateTeacherListHash = (data: ITeacherItem[]): string => {
    if (!data || data.length === 0) return '';
    // Hash based on length and first/last item IDs for quick change detection
    const firstId = data[0]?.id ?? '';
    const lastId = data[data.length - 1]?.id ?? '';
    return `${data.length}-${firstId}-${lastId}`;
  };

  const getTeacherList = useCallback(async () => {
    try {
      // Check if we have valid cached data
      const cachedData = localStorage.getItem(TEACHER_LIST_CACHE_KEY);

      if (cachedData) {
        const {data, timestamp, hash} = JSON.parse(cachedData);
        const now = Date.now();
        const isExpired = now - timestamp > TEACHER_LIST_CACHE_TTL;

        if (!isExpired && data && Array.isArray(data)) {
          // Use cached data
          setTeacherList(data);

          // Background refresh: Check if data has changed on the server
          // This is a "stale-while-revalidate" approach
          fetchHelper(BASE_URL + GET_TEACHER_LIST, 'GET')
            .then(response => {
              if (response.status === 200 && response.data) {
                const newHash = generateTeacherListHash(response.data);
                // Update cache only if data has changed
                if (newHash !== hash) {
                  setTeacherList(response.data);
                  localStorage.setItem(
                    TEACHER_LIST_CACHE_KEY,
                    JSON.stringify({
                      data: response.data,
                      timestamp: Date.now(),
                      hash: newHash,
                    }),
                  );
                }
              }
            })
            .catch(() => {
              // Silent fail for background refresh
            });

          return; // Exit early since we're using cached data
        }
      }

      // No valid cache, fetch from server
      const response = await fetchHelper(BASE_URL + GET_TEACHER_LIST, 'GET');
      if (response.status === 200 && response.data) {
        setTeacherList(response.data);
        // Store in cache with timestamp and hash
        const hash = generateTeacherListHash(response.data);
        localStorage.setItem(
          TEACHER_LIST_CACHE_KEY,
          JSON.stringify({
            data: response.data,
            timestamp: Date.now(),
            hash,
          }),
        );
      }
    } catch {}
  }, []);

  const handleRenew = () => {
    hasExtension
      ? router.push('/plan-extension')
      : router.push('/plans/premium-packages');
  };

  const getIntroVideos = async () => {
    try {
      const response = await fetchHelper(BASE_URL + INTRO_VIDEO, 'GET');
      if (response.status === 200 && response.data) {
        setIntroVideo(response.data);
      }
    } catch (error) {
      // Fetch failed silently
    }
  };

  useEffect(() => {
    // Fetch teachers list
    getTeacherList();
    getIntroVideos();
  }, [getTeacherList]);

  return (
    <div className=" thin-scrollbar  max-h-[100svh] mx-auto border-x font-times-new-roman ">
      <div className="capitalize">
        <Header
          title={`Hi, ${userData?.first_name + '!' || ''}`}
          searchPlaceholder={'Search'}
          // onSearch={handleSearch}
          showSearch={true}
          showBookmark={true}
          onBookmarkClick={() => router.push('/bookmark-collection')}
        />
      </div>
      {isEligibleForExtensionBanner() && (
        <StickyBanner
          stickMessage={bannerMessage() || ''}
          handleRenew={handleRenew}
        />
      )}

      {/* Premium Modal for subscription */}
      <PremiumModal
        isOpen={isBuyModalVisible}
        onClose={() => setIsBuyModalVisible(false)}
        onBuyNow={() => router.push('/plans')}
      />
      <div>
        {/* Fixed the grid layout and height constraints */}
        <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-8 h-[calc(100vh-77px)] bg-lightBlue-300 w-full ">
          {/* Left column - QBankOverview */}
          <div
            className={classNames(
              'col-span-4 lg:col-span-3 bg-gradient-to-b from-white to-lightBlue-500 h-full xl:max-h-full xl:overflow-y-auto xl:scrollbar-hide ',
              isMissionPlan ? 'hidden' : 'block',
            )}>
            <div className="relative font-sauce h-full overflow-hidden p-6">
              <Image
                className="absolute bottom-0 right-0"
                src="/assets/StatsBack.svg"
                alt="live"
                width={200}
                height={200}
              />

              {/* <CampProgressTracker isTabletAndLandscape={true} /> */}
            </div>
          </div>

          {/* Right column - Test listing */}
          <div
            className={classNames(
              ' bg-white h-full xl:max-h-full lg:overflow-y-auto lg:scrollbar-hide ',
              isMissionPlan ? 'col-span-12' : 'col-span-4 lg:col-span-5',
            )}>
            {!isMissionPlan && (
              <div className="px-6 py-6">
                <YouTubeCarousel videos={introVideo || []} />
              </div>
            )}

            {/* Content Container */}
            <div className="px-6 pb-8 pt-4">
              <h2 className="pb-6 font-openSauceOneMedium text-xl text-primary-dark">
                Meet Your Mentors
              </h2>
              <div className="flex flex-row gap-6 overflow-x-scroll overflow-y-hidden thin-scrollbar scrollbar-hide">
                {teacherList.map(teacher => (
                  <div
                    key={teacher.id}
                    className=" border  border-customGray-15 rounded-xl flex flex-col items-center p-2 min-w-[150px]">
                    <div className="w-24 h-24 flex items-center justify-center">
                      <CachedImage
                        className="rounded-full object-cover"
                        src={teacher.image_file || ''}
                        alt={teacher.name}
                        width={72}
                        height={72}
                      />
                    </div>
                    <p className="text-xs my-2 font-interSemibold text-customGray-80 truncate w-full text-center">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-center font-interMedium text-customGray-40 line-clamp-2">
                      {teacher.subject_name || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex flex-col xl:flex-row  xl:gap-4 px-4 pb-6 `}>
              <InviteFriends referralCode={userData?.referral_code || ''} />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Home);
