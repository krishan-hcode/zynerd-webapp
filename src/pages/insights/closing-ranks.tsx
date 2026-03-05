import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const ClosingRanksPage = () => {
  return (
    <>
      <Head>
        <title>Closing Ranks – Cerebellum Academy</title>
      </Head>
      <Header
        title="Closing Ranks"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Closing Ranks" />
      </div>
    </>
  );
};

export default withAuth(ClosingRanksPage);
