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

const FeeStipendBondPage = () => {
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
        <title>Fee, Stipend and Bond – Cerebellum Academy</title>
      </Head>
      <Header
        title="Fee, Stipend and Bond"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      {selectedCounselling ? (
        <div className=" min-h-[calc(100vh-77px)] pb-6">
          <InsightsPageLayout
            pageTitle="Fee, Stipend and Bond"
            selectedCounselling={selectedCounselling}
            onOpenCounsellingModal={() => setIsCounsellingModalOpen(true)}
            records={records}
            whatsThisTitle="What is Fee, Stipend and Bond?"
            whatsThisBody="The Annual tuition fee of the institute is a major factor in decisions on MBBS. Some institutes have a bond (Service bond) after completion of the MBBS Courses. The Fee / Service Bond, along with the Stipend received during the Internship period are important factors that help you decide or compare one institute against another."
          />
        </div>
      ) : null}
      <CounsellingSelectModal
        title="Fee, Stipend and Bond"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectCounselling={handleSelectCounselling}
      />
    </>
  );
};

export default withAuth(FeeStipendBondPage);
