import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const UniversitiesPage = () => {
  return (
    <>
      <Head>
        <title>Universities – Cerebellum Academy</title>
      </Head>
      <Header
        title="Universities"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Universities" />
      </div>
    </>
  );
};

export default withAuth(UniversitiesPage);
