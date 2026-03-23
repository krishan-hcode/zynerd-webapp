import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const InsightsPage = () => {
  return (
    <>
      <Head>
        <title>Insights – Cerebellum Academy</title>
      </Head>
      <Header
        title="Insights"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="min-h-[calc(100vh-77px)]">
        <ComingSoon title="Insights" />
      </div>
    </>
  );
};

export default withAuth(InsightsPage);
