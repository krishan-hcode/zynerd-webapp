import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const FeeStipendBondPage = () => {
  return (
    <>
      <Head>
        <title>Fee, Stipend and Bond – Cerebellum Academy</title>
      </Head>
      <Header
        title="Fee, Stipend and Bond"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Fee, Stipend and Bond" />
      </div>
    </>
  );
};

export default withAuth(FeeStipendBondPage);
