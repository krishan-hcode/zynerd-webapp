import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import ProfileLeft from '@/user-profile/ProfileLeft';
import ProfileSettings from '@/user-profile/ProfileSettings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const UserProfileUpdate = () => {
  // Main profile view
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header title="Profile" isBackNav={true} showBookmark={false} />

      {/* Main Content */}
      <div className="flex-1 min-h-0 relative">
        {/* Full height border - positioned outside padding to touch top/bottom */}
        <div
          className="hidden lg:block absolute top-0 bottom-0 w-px bg-gray-200 z-20"
          style={{left: 'calc(40% + 1.5rem)'}}></div>

        <div className="h-full px-4 pt-4 md:pt-6 lg:px-8 bg-white">
          <div className="h-full flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Profile Left - No scrolling unless content exceeds height */}
            <div className="flex-shrink-0 lg:w-2/5">
              <ProfileLeft />
            </div>

            {/* Profile Settings - Independently scrollable */}
            <div className="flex-1 min-h-0 lg:w-3/5">
              <div className="lg:h-full pb-4 lg:overflow-y-auto scrollbar-hide">
                <ProfileSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(UserProfileUpdate);
