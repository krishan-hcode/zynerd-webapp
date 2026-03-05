import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const CounsellingsPage = () => {
  return (
    <>
      <Head>
        <title>Counsellings – Cerebellum Academy</title>
      </Head>
      <Header
        title="Counsellings"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Counsellings" />
      </div>
    </>
  );
};

export default withAuth(CounsellingsPage);
