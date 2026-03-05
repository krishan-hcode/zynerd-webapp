import ComingSoon from '@/common/ComingSoon';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';

const CoursesPage = () => {
  return (
    <>
      <Head>
        <title>Courses – Cerebellum Academy</title>
      </Head>
      <Header
        title="Courses"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-77px)]">
        <ComingSoon title="Courses" />
      </div>
    </>
  );
};

export default withAuth(CoursesPage);
