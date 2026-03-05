import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const RankScanPage = () => {
  return (
    <>
      <Head>
        <title>Rank Scan – Cerebellum Academy</title>
      </Head>
      <Header
        title="Rank Scan"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Rank Scan" />
      </div>
    </>
  );
};

export default withAuth(RankScanPage);
