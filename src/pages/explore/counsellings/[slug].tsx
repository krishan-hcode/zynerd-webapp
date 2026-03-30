import type { ICounselling } from '@/types/counsellings.types';
import counsellingsData from '@/data/counsellingsData.json';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/utils/utils';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import type { ChoiceListState } from '@/insights/choiceList.types';
import ChoiceListManagerModal from '@/insights/ChoiceListManagerModal';
import {
  createChoiceList,
  DEFAULT_CHOICE_LIST_STATE,
  localChoiceListRepository,
} from '@/insights/choiceList.service';
import {
  BookOpenIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import CounsellingTimeline, {
  type CounsellingTimelineStep,
} from '@/counsellings/CounsellingTimeline';

const { ALL_COUNSELLINGS } = counsellingsData as {
  ALL_COUNSELLINGS: ICounselling[];
};

const formatChoiceCounts = (state: ChoiceListState) => {
  const listCount = state.lists.length;
  const choiceCount = state.lists.reduce((acc, list) => acc + list.itemIds.length, 0);
  return { listCount, choiceCount };
};

export default withAuth(function CounsellingDetailPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : '';

  const counselling = useMemo(
    () => ALL_COUNSELLINGS.find(item => item.slug === slug) ?? null,
    [slug],
  );

  const scopeKey = counselling?.id != null ? String(counselling.id) : undefined;

  const [choiceListState, setChoiceListState] = useState<ChoiceListState>(
    DEFAULT_CHOICE_LIST_STATE,
  );
  const [isChoiceListManagerOpen, setIsChoiceListManagerOpen] = useState(false);

  useEffect(() => {
    if (!scopeKey) return;
    setChoiceListState(localChoiceListRepository.loadChoiceLists(scopeKey));
  }, [scopeKey]);

  useEffect(() => {
    if (!scopeKey) return;
    localChoiceListRepository.saveChoiceLists(scopeKey, choiceListState);
  }, [choiceListState, scopeKey]);

  const { listCount, choiceCount } = useMemo(
    () => formatChoiceCounts(choiceListState),
    [choiceListState],
  );

  const handleCreateChoiceList = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setChoiceListState(prevState => {
      const exists = prevState.lists.some(
        list => list.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exists) return prevState;

      return {
        ...prevState,
        lists: [...prevState.lists, createChoiceList(trimmed)],
      };
    });
  }, []);

  const handleSelectList = useCallback((listId: string) => {
    setChoiceListState(prevState => ({
      ...prevState,
      activeChoiceListId: listId,
    }));
  }, []);

  const handleSelectAskEverytime = useCallback(() => {
    setChoiceListState(prevState => ({
      ...prevState,
      activeChoiceListId: undefined,
    }));
  }, []);

  const timelineSteps = useMemo<CounsellingTimelineStep[]>(() => {
    // Static placeholders to match the screenshot layout.
    // If you provide real timeline data, this can be replaced.
    return [
      {
        date: 'Feb 23, 2026',
        title: 'Stray Vacancy Round Result',
        status: 'done',
      },
      {
        date: 'Feb 23, 2026',
        title: 'Stray Vacancy Round Joining Starts',
        status: 'done',
      },
      {
        date: 'Feb 28, 2026, 11:55 PM',
        title: 'Stray Vacancy Round Joining Ends',
        status: 'current',
      },
      {
        date: 'Mar 2, 2026',
        title: 'Stray Vacancy Round Result',
        status: 'upcoming',
      },
      {
        date: 'Mar 5, 2026',
        title: 'Document Verification Ends',
        status: 'upcoming',
      },
    ];
  }, []);

  const gotoInsights = useCallback(
    (path: string) => {
      if (!counselling) return;
      router.push({
        pathname: path,
        query: { counselling: String(counselling.id) },
      });
    },
    [counselling, router],
  );

  const title = counselling?.name ?? 'Counselling';

  return (
    <>
      <Head>
        <title>{title} – Cerebellum Academy</title>
      </Head>
      <Header title="Counselling Details" isBackNav={true} />

      <div className="bg-white min-h-[calc(100vh-77px)] px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {!counselling ? (
            <div className="rounded-2xl border border-customGray-10 bg-white p-6 text-center">
              <p className="text-sm font-inter text-customGray-50">Counselling not found.</p>
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-customGray-10 bg-gradient-to-br from-lightPink to-white overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 relative">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm font-inter text-customGray-60">
                      Counsellings <span className="mx-1 text-customGray-40">{'>'}</span>{' '}
                      <span className="text-primary-dark font-interMedium">{counselling.name}</span>
                    </p>
                    <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-customGray-10 bg-white/60 px-3 py-1.5 text-[11px] font-inter text-customGray-60">
                      <AcademicCapIcon className="h-4 w-4 text-primary-blue" />
                      Central • {counselling.subtitle}
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <h1 className="text-2xl sm:text-3xl font-besley text-primary-dark leading-tight">
                      {counselling.name}
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm font-inter text-customGray-60">
                      Central • {counselling.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-customGray-10 bg-white/70 px-4 py-2 text-xs font-inter text-primary-dark hover:bg-customGray-3 transition-colors">
                      <GlobeAltIcon className="h-4 w-4 text-primary-blue" />
                      Website
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-customGray-10 bg-white/70 px-4 py-2 text-xs font-inter text-primary-dark hover:bg-customGray-3 transition-colors">
                      <DocumentTextIcon className="h-4 w-4 text-primary-blue" />
                      Quotas
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-customGray-10 bg-white/70 px-4 py-2 text-xs font-inter text-primary-dark hover:bg-customGray-3 transition-colors">
                      <AcademicCapIcon className="h-4 w-4 text-primary-blue" />
                      Registration
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-customGray-10 bg-white/70 px-4 py-2 text-xs font-inter text-primary-dark hover:bg-customGray-3 transition-colors">
                      <BookOpenIcon className="h-4 w-4 text-primary-blue" />
                      Prospectus
                    </button>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      className="rounded-full border border-customGray-10 bg-white px-5 py-2.5 text-xs font-inter text-primary-dark hover:bg-customGray-3 transition-colors">
                      Announcements &amp; Events
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                    <button
                      type="button"
                      onClick={() => gotoInsights('/insights/allotments')}
                      className="rounded-2xl border border-customGray-10 bg-white p-4 text-left shadow-sm hover:border-primary-blue/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/15 p-2">
                          <Squares2X2Icon className="h-5 w-5 text-primary-blue" />
                        </div>
                        <span className="text-[11px] font-inter font-medium text-customGray-60">2022-2025</span>
                      </div>
                      <p className="mt-3 text-sm font-inter font-semibold text-primary-dark">
                        Allotments
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => gotoInsights('/insights/closing-ranks')}
                      className="rounded-2xl border border-customGray-10 bg-white p-4 text-left shadow-sm hover:border-primary-blue/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-secondary-periwinkleBlue/10 border border-secondary-periwinkleBlue/20 p-2">
                          <ListBulletIcon className="h-5 w-5 text-secondary-periwinkleBlue" />
                        </div>
                        <span className="text-[11px] font-inter font-medium text-customGray-60">2022-2026</span>
                      </div>
                      <p className="mt-3 text-sm font-inter font-semibold text-primary-dark">
                        Closing Ranks
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => gotoInsights('/insights/seat-matrix')}
                      className="rounded-2xl border border-customGray-10 bg-white p-4 text-left shadow-sm hover:border-primary-blue/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/15 p-2">
                          <Squares2X2Icon className="h-5 w-5 text-primary-blue" />
                        </div>
                        <span className="text-[11px] font-inter font-medium text-customGray-60">2022-2026</span>
                      </div>
                      <p className="mt-3 text-sm font-inter font-semibold text-primary-dark">
                        Seat Matrix
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => gotoInsights('/insights/fee-stipend-bond')}
                      className="rounded-2xl border border-customGray-10 bg-white p-4 text-left shadow-sm hover:border-primary-blue/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/15 p-2">
                          <BookOpenIcon className="h-5 w-5 text-primary-blue" />
                        </div>
                        <span className="text-[11px] font-inter font-medium text-customGray-60">2025-2024</span>
                      </div>
                      <p className="mt-3 text-sm font-inter font-semibold text-primary-dark">
                        Fee, Stipend &amp; Bond
                      </p>
                    </button>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <section className="xl:col-span-2 rounded-2xl border border-customGray-10 bg-white overflow-hidden">
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-semibold font-besley text-primary-dark">
                      Counselling Timeline
                    </h2>

                    <CounsellingTimeline steps={timelineSteps} showHeader={false} />
                  </div>
                </section>

                <aside className="xl:col-span-1 rounded-2xl border border-customGray-10 bg-white overflow-hidden">
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-semibold font-besley text-primary-dark">
                      Your Choice Lists
                    </h2>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="h-5 w-5 text-secondary-lightRed" />
                        <p className="text-sm font-inter font-semibold text-primary-dark">
                          {listCount} choice lists
                        </p>
                      </div>
                      <div className="text-xs font-inter text-customGray-60">{choiceCount} choices</div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setIsChoiceListManagerOpen(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-customGray-10 bg-white px-3 py-3 text-sm font-inter font-semibold text-primary-blue shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        <PlusIcon className="h-5 w-5" />
                        Create Choice list
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl bg-customGray-3/40 border border-customGray-10 p-4 min-h-[180px]">
                      {choiceListState.lists.length === 0 ? (
                        <p className="text-center text-sm font-inter text-customGray-60">
                          No lists yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {choiceListState.lists.slice(0, 6).map(list => (
                            <button
                              key={list.id}
                              type="button"
                              onClick={() => handleSelectList(list.id)}
                              className={classNames(
                                'w-full rounded-xl border px-3 py-2 text-left transition-colors',
                                list.id === choiceListState.activeChoiceListId
                                  ? 'border-primary-blue/30 bg-primary-blue/5'
                                  : 'border-customGray-10 bg-white hover:border-primary-blue/20 hover:bg-customGray-3/40',
                              )}>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-inter font-semibold text-primary-dark truncate">
                                  {list.name}
                                </p>
                                <span className="text-[11px] font-inter text-customGray-60">
                                  {list.itemIds.length} choices
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>

      <ChoiceListManagerModal
        isOpen={isChoiceListManagerOpen}
        onClose={() => setIsChoiceListManagerOpen(false)}
        counsellingName={counselling?.name}
        mode={choiceListState.preferences.mode}
        lists={choiceListState.lists.map(list => ({
          id: list.id,
          name: list.name,
          itemCount: list.itemIds.length,
        }))}
        onCreateList={handleCreateChoiceList}
        activeChoiceListId={choiceListState.activeChoiceListId}
        onSelectList={handleSelectList}
        onSelectAskEverytime={handleSelectAskEverytime}
      />
    </>
  );
});

