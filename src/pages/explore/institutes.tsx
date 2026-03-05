import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const InstitutesPage = () => {
  return (
    <>
      <Head>
        <title>Institutes – Cerebellum Academy</title>
      </Head>
      <Header
        title="Institutes"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Institutes" />
      </div>
    </>
  );
};

export default withAuth(InstitutesPage);
