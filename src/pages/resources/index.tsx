import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const ResourcesPage = () => {
  return (
    <>
      <Head>
        <title>Resources – Cerebellum Academy</title>
      </Head>
      <Header
        title="Resources"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Resources" />
      </div>
    </>
  );
};

export default withAuth(ResourcesPage);
