import CounsellingSelectModal from '@/common/CounsellingSelectModal';
import InsightsPageLayout from '@/insights/InsightsPageLayout';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import type {ICounselling} from '@/types/counsellings.types';
import type {IInsightRecord} from '@/types/insights.types';
import counsellingsData from '@/data/counsellingsData.json';
import insightsData from '@/data/insightsData.json';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useRef, useState} from 'react';

const {records: allRecords} = insightsData as {records: IInsightRecord[]};
const {ALL_COUNSELLINGS} = counsellingsData as {ALL_COUNSELLINGS: ICounselling[]};

const AllotmentsPage = () => {
  const router = useRouter();
  const closedDueToSelectionRef = useRef(false);
  const [isCounsellingModalOpen, setIsCounsellingModalOpen] = useState(false);
  const [selectedCounselling, setSelectedCounselling] = useState<
    ICounselling | null
  >(null);

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.counselling;
    const id = typeof raw === 'string' ? parseInt(raw, 10) : Number.NaN;
    if (Number.isInteger(id)) {
      const c = ALL_COUNSELLINGS.find(x => x.id === id) ?? null;
      if (c) setSelectedCounselling(c);
    }
  }, [router.isReady, router.query.counselling]);

  const records = useMemo(() => {
    if (!selectedCounselling) return [];
    return allRecords.filter(
      r => r.counsellingSlug === selectedCounselling.slug,
    );
  }, [selectedCounselling]);

  const isModalOpen = !selectedCounselling || isCounsellingModalOpen;

  const handleCloseModal = () => {
    if (closedDueToSelectionRef.current) {
      closedDueToSelectionRef.current = false;
      setIsCounsellingModalOpen(false);
      return;
    }
    if (!selectedCounselling) {
      router.back();
      return;
    }
    setIsCounsellingModalOpen(false);
  };

  const handleSelectCounselling = (c: ICounselling) => {
    closedDueToSelectionRef.current = true;
    setSelectedCounselling(c);
    setIsCounsellingModalOpen(false);
    router.replace(
      {pathname: router.pathname, query: {...router.query, counselling: String(c.id)}},
      undefined,
      {shallow: true},
    );
  };

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
      {selectedCounselling ? (
        <div className=" min-h-[calc(100vh-77px)] pb-6">
          <InsightsPageLayout
            pageTitle="Allotments"
            selectedCounselling={selectedCounselling}
            onOpenCounsellingModal={() => setIsCounsellingModalOpen(true)}
            records={records}
            whatsThisTitle="What are Allotments?"
            whatsThisBody="The Allotments list contains all the allotments in the counselling for the specific round that is selected. This will help the candidate in knowing the allotments of all candidates who attended the Counselling (from Rank 1 till the last Rank) along with the seat quota, and seat category. If a particular rank is missing, that would mean that the candidate is not allotted."
          />
        </div>
      ) : null}
      <CounsellingSelectModal
        title="Allotments"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectCounselling={handleSelectCounselling}
      />
    </>
  );
};

export default withAuth(AllotmentsPage);
