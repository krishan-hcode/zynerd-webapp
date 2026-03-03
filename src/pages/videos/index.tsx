import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const VideosPage = () => {
  return (
    <>
      <Head>
        <title>Videos – Cerebellum Academy</title>
      </Head>
      <Header
        title="Videos"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Videos" />
      </div>
    </>
  );
};

export default withAuth(VideosPage);
