import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import EducationLeft from '@/user-profile/EducationLeft';
import EducationRight from '@/user-profile/EducationRight';
import type React from 'react';
const EducationDetailsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header isBackNav={true} showBookmark={false} />
      <div className="flex-1 min-h-0 relative">
        <div className="md:min-h-screen xl:min-h-0 xl:h-full flex flex-col lg:flex-row gap-2">
          <div className="flex-shrink-0 lg:w-2/5 w-full lg:max-w-md border-r border-gray-200">
            <EducationLeft />
          </div>
          <div className="flex-1">
            <div className="h-full lg:overflow-y-auto scrollbar-hide">
              <EducationRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withAuth(EducationDetailsPage);
