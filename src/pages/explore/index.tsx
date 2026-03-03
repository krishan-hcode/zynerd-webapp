import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const ExplorePage = () => {
  return (
    <>
      <Head>
        <title>Explore – Cerebellum Academy</title>
      </Head>
      <Header
        title="Explore"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Explore" />
      </div>
    </>
  );
};

export default withAuth(ExplorePage);
