import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const AllotmentMappingPage = () => {
  return (
    <>
      <Head>
        <title>Allotment Mapping – Cerebellum Academy</title>
      </Head>
      <Header
        title="Allotment Mapping"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Allotment Mapping" />
      </div>
    </>
  );
};

export default withAuth(AllotmentMappingPage);
