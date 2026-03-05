import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const AllotmentsPage = () => {
  return (
    <>
      <Head>
        <title>Allotments – Cerebellum Academy</title>
      </Head>
      <Header
        title="Allotments"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Allotments" />
      </div>
    </>
  );
};

export default withAuth(AllotmentsPage);
