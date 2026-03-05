import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const SeatMatrixPage = () => {
  return (
    <>
      <Head>
        <title>Seat Matrix – Cerebellum Academy</title>
      </Head>
      <Header
        title="Seat Matrix"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Seat Matrix" />
      </div>
    </>
  );
};

export default withAuth(SeatMatrixPage);
