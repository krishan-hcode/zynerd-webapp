import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const ToolsPage = () => {
  return (
    <>
      <Head>
        <title>Tools – Cerebellum Academy</title>
      </Head>
      <Header
        title="Tools"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Tools" />
      </div>
    </>
  );
};

export default withAuth(ToolsPage);
