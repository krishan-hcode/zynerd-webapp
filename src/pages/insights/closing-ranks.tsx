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

const ClosingRanksPage = () => {
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
        <title>Closing Ranks – Cerebellum Academy</title>
      </Head>
      <Header
        title="Closing Ranks"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      {selectedCounselling ? (
        <div className=" min-h-[calc(100vh-77px)] pb-6">
          <InsightsPageLayout
            pageTitle="Closing Ranks"
            selectedCounselling={selectedCounselling}
            onOpenCounsellingModal={() => setIsCounsellingModalOpen(true)}
            records={records}
            whatsThisTitle="What are Closing Ranks?"
            whatsThisBody="The Closing Ranks list contains the last allotted rank in the Counselling for a particular seat in a specific quota/category. Any candidate below this rank would not have been allotted the seat (in the quota/category) in the specific round. Usually this is termed as the Cut Off Rank."
          />
        </div>
      ) : null}
      <CounsellingSelectModal
        title="Closing Ranks"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectCounselling={handleSelectCounselling}
      />
    </>
  );
};

export default withAuth(ClosingRanksPage);
