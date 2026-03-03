'use client';

import Header from '@/qbank/QBankHeader';
import FaqLeft from '@/user-profile/FaqLeft';
import FaqRight from '@/user-profile/FaqRight';
import Head from 'next/head';

const FAQsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#f3f8ff]">
      <Head>
        <title>FAQs – Cerebellum Academy</title>
      </Head>
      <Header isBackNav={true} showBookmark={false} />
      <div className="flex-1 min-h-0 relative">
        <div className="h-full flex flex-col lg:flex-row ">
          <div className="flex-shrink-0 lg:w-2/5 w-full lg:max-w-md border-r border-gray-200">
            <FaqLeft />
          </div>
          <div className="flex-1">
            <FaqRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
