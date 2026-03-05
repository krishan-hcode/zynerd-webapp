import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import ProfileEditLeft from '@/user-profile/ProfileEditLeft';
import ProfileEditRight from '@/user-profile/ProfileEditRight';
import type React from 'react';
const EditProfile: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header isBackNav={true} showBookmark={false} />
      {/* Main Content */}
      <div className="flex-1 min-h-0 relative">
        <div className="md:min-h-screen xl:min-h-0 xl:h-full flex flex-col lg:flex-row gap-2 ">
          {/* Profile Edit Left - Form fields */}
          <div className="flex-shrink-0 lg:w-2/5 w-full lg:max-w-md border-r border-gray-200">
            <ProfileEditLeft />
          </div>
          {/* Profile Edit Right - Additional settings */}
          <div className="flex-1">
            <div className="h-full lg:overflow-y-auto scrollbar-hide">
              <ProfileEditRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withAuth(EditProfile);
