import withAuth from '@/global/WithAuth';
import ExploreFilterSelect from '@/common/ExploreFilterSelect';
import ExploreDataTable, {
  type ExploreDataTableColumn,
} from '@/common/table/ExploreDataTable';
import Header from '@/qbank/QBankHeader';
import { localExploreDataRepository } from '@/services/exploreData.repository';
import type { IInstitute } from '@/types/institutes.types';
import { classNames } from '@/utils/utils';
import { deriveUniversities } from '@/utils/universities';
import {
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  ListBulletIcon,
  MapPinIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type InstituteDetailTab = 'overview' | 'closing-ranks' | 'fee-and-more';

interface IClosingRankRow {
  id: string;
  course: string;
  quota: 'AIQ' | 'State Quota';
  category: 'GN' | 'EWS' | 'OBC' | 'SC' | 'ST';
  round1: number;
  round2: number;
  round3: number;
}

interface IFeeRow {
  id: string;
  course: string;
  annualTuition: number;
  hostel: number;
  stipend: number;
  bondYears: number;
  bondPenalty: number;
}

const formatCurrency = (amount: number): string =>
  `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const STICKY_TOP_OFFSET = 77;
const STICKY_PIN_TOP = STICKY_TOP_OFFSET - 75;

const InstituteDetailsPage = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
  const [allInstitutes, setAllInstitutes] = useState<IInstitute[]>([]);
  const [activeTab, setActiveTab] = useState<InstituteDetailTab>('overview');
  const [selectedSessionYear, setSelectedSessionYear] = useState('2025');
  const [selectedQuota, setSelectedQuota] = useState<'All' | 'AIQ' | 'State Quota'>('All');
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'GN' | 'EWS' | 'OBC' | 'SC' | 'ST'
  >('All');
  const [feeSearch, setFeeSearch] = useState('');
  const [feeCourseGroup, setFeeCourseGroup] = useState<
    'All' | 'Clinical' | 'Pre-Clinical' | 'Para-Clinical' | 'Non-Clinical'
  >('All');
  const [closingRanksOpenFilter, setClosingRanksOpenFilter] = useState<
    'year' | 'quota' | 'category' | null
  >(null);
  const tabWrapperRef = useRef<HTMLDivElement | null>(null);
  const tabRailRef = useRef<HTMLDivElement | null>(null);
  const [isFixedTabs, setIsFixedTabs] = useState(false);
  const [fixedRailLeft, setFixedRailLeft] = useState(0);
  const [fixedRailWidth, setFixedRailWidth] = useState(0);
  const [tabRailHeight, setTabRailHeight] = useState(0);
  const overviewRef = useRef<HTMLElement | null>(null);
  const closingRanksRef = useRef<HTMLElement | null>(null);
  const feeAndMoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    localExploreDataRepository.getInstitutes().then(setAllInstitutes);
  }, []);

  const institute = useMemo(
    () => allInstitutes.find(item => item.slug === slug) ?? null,
    [allInstitutes, slug],
  );

  const linkedUniversity = useMemo(() => {
    if (!institute) return null;
    return deriveUniversities(allInstitutes).find(item => item.name === institute.university) ?? null;
  }, [allInstitutes, institute]);

  const title = institute?.name ?? 'Institute';

  const closingRanksRows = useMemo<IClosingRankRow[]>(() => {
    if (!institute) return [];
    const courses = [
      'MD General Medicine',
      'MS General Surgery',
      'MD Paediatrics',
      'MS Orthopaedics',
      'MD Radiodiagnosis',
      'MD Anaesthesiology',
    ];
    const quotas: Array<'AIQ' | 'State Quota'> = ['AIQ', 'State Quota'];
    const categories: Array<'GN' | 'EWS' | 'OBC' | 'SC' | 'ST'> = ['GN', 'EWS', 'OBC', 'SC', 'ST'];

    return courses.map((course, index) => {
      const base = institute.id * 37 + index * 211;
      const round1 = 120 + (base % 2200);
      const round2 = round1 + 90 + (index % 4) * 30;
      const round3 = round2 + 110 + (index % 3) * 25;
      return {
        id: `${institute.id}-${index}`,
        course,
        quota: quotas[index % quotas.length],
        category: categories[(index + institute.id) % categories.length],
        round1,
        round2,
        round3,
      };
    });
  }, [institute]);

  const filteredClosingRanks = useMemo(() => {
    return closingRanksRows.filter(row => {
      const quotaMatches = selectedQuota === 'All' || row.quota === selectedQuota;
      const categoryMatches = selectedCategory === 'All' || row.category === selectedCategory;
      return quotaMatches && categoryMatches;
    });
  }, [closingRanksRows, selectedCategory, selectedQuota]);

  const feeRows = useMemo<IFeeRow[]>(() => {
    if (!institute) return [];
    const rows = [
      { course: 'MBBS', group: 'Clinical' as const },
      { course: 'MD General Medicine', group: 'Clinical' as const },
      { course: 'MS General Surgery', group: 'Clinical' as const },
      { course: 'MD Physiology', group: 'Pre-Clinical' as const },
      { course: 'MD Pharmacology', group: 'Para-Clinical' as const },
      { course: 'MHA', group: 'Non-Clinical' as const },
    ];

    return rows.map((item, index) => {
      const seed = institute.id * 71 + index * 53;
      return {
        id: `${institute.id}-fee-${index}`,
        course: item.course,
        annualTuition: 750000 + (seed % 8) * 85000,
        hostel: 90000 + (seed % 6) * 11000,
        stipend: 65000 + (seed % 5) * 7000,
        bondYears: 1 + (seed % 4),
        bondPenalty: 500000 + (seed % 6) * 150000,
      };
    });
  }, [institute]);

  const feeGroupLookup = useMemo(
    () =>
      new Map<string, 'Clinical' | 'Pre-Clinical' | 'Para-Clinical' | 'Non-Clinical'>([
        ['MBBS', 'Clinical'],
        ['MD General Medicine', 'Clinical'],
        ['MS General Surgery', 'Clinical'],
        ['MD Physiology', 'Pre-Clinical'],
        ['MD Pharmacology', 'Para-Clinical'],
        ['MHA', 'Non-Clinical'],
      ]),
    [],
  );

  const filteredFeeRows = useMemo(() => {
    const query = feeSearch.trim().toLowerCase();
    return feeRows.filter(row => {
      const searchMatches = !query || row.course.toLowerCase().includes(query);
      const group = feeGroupLookup.get(row.course) ?? 'Clinical';
      const groupMatches = feeCourseGroup === 'All' || group === feeCourseGroup;
      return searchMatches && groupMatches;
    });
  }, [feeCourseGroup, feeRows, feeSearch, feeGroupLookup]);

  const handleScrollToTab = useCallback((tab: InstituteDetailTab) => {
    const sectionMap: Record<InstituteDetailTab, HTMLElement | null> = {
      overview: overviewRef.current,
      'closing-ranks': closingRanksRef.current,
      'fee-and-more': feeAndMoreRef.current,
    };
    const target = sectionMap[tab];
    if (!target || typeof window === 'undefined') return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateTabRailMetrics = () => {
      if (!tabWrapperRef.current || !tabRailRef.current) return;
      const wrapperRect = tabWrapperRef.current.getBoundingClientRect();
      const railRect = tabRailRef.current.getBoundingClientRect();
      setFixedRailLeft(wrapperRect.left);
      setFixedRailWidth(wrapperRect.width);
      setTabRailHeight(railRect.height);
    };

    const handleTabsStickyState = () => {
      if (!tabWrapperRef.current) return;

      const { top } = tabWrapperRef.current.getBoundingClientRect();

      // Stick only when it actually reaches header bottom
      const shouldFix = top <= STICKY_PIN_TOP;

      setIsFixedTabs(shouldFix);

      if (shouldFix) {
        updateTabRailMetrics();
      }
    };

    const handleResize = () => {
      updateTabRailMetrics();
      handleTabsStickyState();
    };

    updateTabRailMetrics();
    handleTabsStickyState();
    window.addEventListener('scroll', handleTabsStickyState, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleTabsStickyState);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sections: Array<{ id: InstituteDetailTab; element: HTMLElement | null }> = [
      { id: 'overview', element: overviewRef.current },
      { id: 'closing-ranks', element: closingRanksRef.current },
      { id: 'fee-and-more', element: feeAndMoreRef.current },
    ];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const first = visible[0];
        if (!first) return;
        const matched = sections.find(section => section.element === first.target);
        if (matched) setActiveTab(matched.id);
      },
      { root: null, rootMargin: '-140px 0px -45% 0px', threshold: [0.2, 0.4, 0.6] },
    );

    sections.forEach(section => {
      if (section.element) observer.observe(section.element);
    });
    return () => observer.disconnect();
  }, [institute?.id]);

  return (
    <>
      <Head>
        <title>{title} – Cerebellum Academy</title>
      </Head>
      <Header title="Institute Details" isBackNav={true} />
      <div className="bg-white min-h-[calc(100vh-77px)] px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-4 overflow-visible">
          {!institute ? (
            <div className="rounded-2xl border border-customGray-10 bg-white p-6 text-center">
              <p className="text-sm font-inter text-customGray-50">Institute not found.</p>
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-customGray-10 bg-white overflow-visible shadow-sm">
                <div className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-inter text-customGray-60">
                    Institutes <span className="mx-1 text-customGray-40">{'>'}</span>
                    <span className="text-primary-dark font-interMedium">{institute.name}</span>
                  </p>
                </div>
                <div className="h-44 sm:h-52 border-y border-customGray-10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
                    alt="College campus placeholder"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="relative z-10 px-3 sm:px-4 pb-4 sm:pb-5">
                  <div className="-mt-12 sm:-mt-14 rounded-2xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3 p-4 sm:p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex rounded-2xl border border-primary-dark/10 bg-primary-dark/5 p-2.5">
                        <BuildingLibraryIcon className="h-6 w-6 text-primary-dark" />
                      </span>
                      <div className="min-w-0">
                        <p className="inline-flex rounded-md bg-customGray-3 border border-customGray-10 px-2 py-1 text-xxs font-inter text-customGray-70">
                          {institute.instituteType}
                        </p>
                        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-customGray-90 font-besley leading-tight">
                          {institute.name}
                        </h1>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-customGray-10 pt-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        {linkedUniversity ? (
                          <Link
                            href={`/explore/universities/${linkedUniversity.slug}`}
                            className="inline-flex text-sm font-interMedium text-primary-blue underline underline-offset-2 hover:text-primary-blue/80 transition-colors">
                            {institute.university}
                          </Link>
                        ) : (
                          <p className="text-sm font-interMedium text-primary-blue">{institute.university}</p>
                        )}
                        <p className="inline-flex items-center gap-1.5 text-xs text-customGray-60 font-inter">
                          <MapPinIcon className="h-4 w-4" />
                          {institute.city}, {institute.state}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 xl:grid-cols-4 gap-2">
                      <div className="rounded-lg border border-customGray-10 bg-white px-3 py-2">
                        <p className="text-[11px] font-interMedium uppercase tracking-[0.06em] text-customGray-50">
                          Authority
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-inter text-primary-dark">
                          <ShieldCheckIcon className="h-3.5 w-3.5 text-customGray-60" />
                          {institute.authority}
                        </p>
                      </div>
                      <div className="rounded-lg border border-customGray-10 bg-white px-3 py-2">
                        <p className="text-[11px] font-interMedium uppercase tracking-[0.06em] text-customGray-50">
                          Counselling
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-inter text-primary-dark">
                          <BuildingOffice2Icon className="h-3.5 w-3.5 text-customGray-60" />
                          {institute.counsellingBody}
                        </p>
                      </div>
                      <div className="rounded-lg border border-customGray-10 bg-white px-3 py-2">
                        <p className="text-[11px] font-interMedium uppercase tracking-[0.06em] text-customGray-50">
                          Capacity
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-inter text-primary-dark">
                          <UserGroupIcon className="h-3.5 w-3.5 text-customGray-60" />
                          Beds: {institute.beds}
                        </p>
                      </div>
                      <div className="rounded-lg border border-customGray-10 bg-white px-3 py-2">
                        <p className="text-[11px] font-interMedium uppercase tracking-[0.06em] text-customGray-50">
                          Local Distinction
                        </p>
                        <p className="mt-1 text-xs font-inter text-primary-dark">{institute.localDistinction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div ref={tabWrapperRef}>
                <div
                  ref={tabRailRef}
                  className={classNames(
                    'z-50 transition-all',
                    isFixedTabs ? 'fixed' : 'relative',
                  )}
                  style={
                    isFixedTabs
                      ? {
                        top: `${STICKY_PIN_TOP}px`,
                        left: `${fixedRailLeft}px`,
                        width: `${fixedRailWidth}px`,
                      }
                      : undefined
                  }>
                  <nav className="  border-customGray-10 bg-white  py-2 -mt-1">
                    <div className=" border-customGray-10  pt-3">
                      <div className="flex items-center gap-2.5 overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => handleScrollToTab('overview')}
                          className={classNames(
                            'inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-inter transition-colors',
                            activeTab === 'overview'
                              ? 'border-primary-blue text-primary-dark font-interMedium'
                              : 'border-transparent text-customGray-50 hover:text-primary-dark',
                          )}>
                          <Squares2X2Icon className="h-4 w-4" />
                          Overview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScrollToTab('closing-ranks')}
                          className={classNames(
                            'inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-inter transition-colors',
                            activeTab === 'closing-ranks'
                              ? 'border-primary-blue text-primary-dark font-interMedium'
                              : 'border-transparent text-customGray-50 hover:text-primary-dark',
                          )}>
                          <ListBulletIcon className="h-4 w-4" />
                          Closing Ranks
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScrollToTab('fee-and-more')}
                          className={classNames(
                            'inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-inter transition-colors',
                            activeTab === 'fee-and-more'
                              ? 'border-primary-blue text-primary-dark font-interMedium'
                              : 'border-transparent text-customGray-50 hover:text-primary-dark',
                          )}>
                          <BuildingOffice2Icon className="h-4 w-4" />
                          Fee & More
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>
                {isFixedTabs && <div style={{ height: `${tabRailHeight}px` }} aria-hidden />}
              </div>

              <section
                ref={overviewRef}
                className="scroll-mt-[150px] rounded-2xl border border-customGray-10 bg-white overflow-hidden">
                <div className="p-4 sm:p-5">
                  <h2 className="text-lg sm:text-xl font-semibold font-besley text-primary-dark">Overview</h2>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {[
                      { label: 'Institute Type', value: institute.instituteType },
                      { label: 'Authority', value: institute.authority },
                      { label: 'Counselling Body', value: institute.counsellingBody },
                      { label: 'Local Distinction', value: institute.localDistinction },
                    ].map(item => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/60 p-3.5">
                        <p className="text-[11px] uppercase tracking-[0.08em] font-interMedium text-customGray-50">
                          {item.label}
                        </p>
                        <p className="mt-1.5 text-sm font-inter text-primary-dark">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                ref={closingRanksRef}
                className="scroll-mt-[150px] rounded-2xl bg-white overflow-hidden">
                <div className=" sm:py-5">
                  <h2 className="text-lg sm:text-xl font-semibold font-besley text-primary-dark">Closing Ranks</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:max-w-3xl">
                    <ExploreFilterSelect
                      label="Session year"
                      selectedValue={selectedSessionYear}
                      options={['2025', '2024']}
                      allLabel="All years"
                      isOpen={closingRanksOpenFilter === 'year'}
                      onToggle={() =>
                        setClosingRanksOpenFilter(current =>
                          current === 'year' ? null : 'year',
                        )
                      }
                      onClose={() => setClosingRanksOpenFilter(null)}
                      onSelect={setSelectedSessionYear}
                    />
                    <ExploreFilterSelect
                      label="Quota"
                      selectedValue={selectedQuota === 'All' ? '' : selectedQuota}
                      options={['AIQ', 'State Quota']}
                      allLabel="All quotas"
                      isOpen={closingRanksOpenFilter === 'quota'}
                      onToggle={() =>
                        setClosingRanksOpenFilter(current =>
                          current === 'quota' ? null : 'quota',
                        )
                      }
                      onClose={() => setClosingRanksOpenFilter(null)}
                      onSelect={value =>
                        setSelectedQuota((value || 'All') as 'All' | 'AIQ' | 'State Quota')
                      }
                    />
                    <ExploreFilterSelect
                      label="Category"
                      selectedValue={selectedCategory === 'All' ? '' : selectedCategory}
                      options={['GN', 'EWS', 'OBC', 'SC', 'ST']}
                      allLabel="All categories"
                      isOpen={closingRanksOpenFilter === 'category'}
                      onToggle={() =>
                        setClosingRanksOpenFilter(current =>
                          current === 'category' ? null : 'category',
                        )
                      }
                      onClose={() => setClosingRanksOpenFilter(null)}
                      onSelect={value =>
                        setSelectedCategory(
                          (value || 'All') as 'All' | 'GN' | 'EWS' | 'OBC' | 'SC' | 'ST',
                        )
                      }
                    />
                  </div>
                </div>
                <ExploreDataTable<IClosingRankRow>
                  data={filteredClosingRanks}
                  getRowKey={row => row.id}
                  minWidthClassName="min-w-[880px]"
                  headerVariant="exploreMuted"
                  emptyState={
                    filteredClosingRanks.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm font-inter text-customGray-50">
                        No records match selected filters.
                      </div>
                    ) : undefined
                  }
                  columns={
                    [
                      {
                        id: 'course',
                        header: 'Course',
                        cell: row => row.course,
                      },
                      {
                        id: 'quota',
                        header: 'Quota',
                        cell: row => (
                          <span className="inline-flex rounded-md bg-customGray-5 px-2 py-1 text-xs font-inter text-customGray-70">
                            {row.quota}
                          </span>
                        ),
                      },
                      {
                        id: 'category',
                        header: 'Category',
                        cell: row => (
                          <span className="text-xs font-inter text-customGray-70">{row.category}</span>
                        ),
                      },
                      {
                        id: 'r1',
                        header: 'Round 1',
                        cell: row => row.round1.toLocaleString('en-IN'),
                      },
                      {
                        id: 'r2',
                        header: 'Round 2',
                        cell: row => row.round2.toLocaleString('en-IN'),
                      },
                      {
                        id: 'r3',
                        header: 'Round 3',
                        cell: row => row.round3.toLocaleString('en-IN'),
                      },
                    ] satisfies ExploreDataTableColumn<IClosingRankRow>[]
                  }
                />
              </section>

              <section
                ref={feeAndMoreRef}
                className="scroll-mt-[150px] rounded-2xl  bg-white overflow-hidden">
                <div className="py-4 ">
                  <h2 className="text-lg sm:text-xl font-semibold font-besley text-primary-dark">Fee & More</h2>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {(['All', 'Clinical', 'Pre-Clinical', 'Para-Clinical', 'Non-Clinical'] as const).map(
                        group => (
                          <button
                            key={group}
                            type="button"
                            onClick={() => setFeeCourseGroup(group)}
                            className={classNames(
                              'rounded-full px-3 py-1.5 text-xs font-inter border transition-colors',
                              feeCourseGroup === group
                                ? 'bg-primary-blue text-white border-primary-blue'
                                : 'bg-white text-customGray-60 border-customGray-10 hover:bg-customGray-3',
                            )}>
                            {group}
                          </button>
                        ),
                      )}
                    </div>
                    <input
                      value={feeSearch}
                      onChange={event => setFeeSearch(event.target.value)}
                      placeholder="Search courses"
                      className="w-full sm:w-64 rounded-xl border border-customGray-10 px-3 py-2 text-sm font-inter text-primary-dark placeholder:text-customGray-40 focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
                    />
                  </div>
                </div>
                <ExploreDataTable<IFeeRow>
                  data={filteredFeeRows}
                  getRowKey={row => row.id}
                  minWidthClassName="min-w-[980px]"
                  headerVariant="exploreMuted"
                  emptyState={
                    filteredFeeRows.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm font-inter text-customGray-50">
                        No fee rows match your search or filters.
                      </div>
                    ) : undefined
                  }
                  columns={
                    [
                      { id: 'course', header: 'Course', cell: row => row.course },
                      {
                        id: 'tuition',
                        header: 'Annual Tuition',
                        cell: row => formatCurrency(row.annualTuition),
                      },
                      {
                        id: 'hostel',
                        header: 'Hostel',
                        cell: row => formatCurrency(row.hostel),
                      },
                      {
                        id: 'stipend',
                        header: 'Monthly Stipend',
                        cell: row => formatCurrency(row.stipend),
                      },
                      { id: 'bondYears', header: 'Bond Years', cell: row => row.bondYears },
                      {
                        id: 'bondPenalty',
                        header: 'Bond Penalty',
                        cell: row => formatCurrency(row.bondPenalty),
                      },
                    ] satisfies ExploreDataTableColumn<IFeeRow>[]
                  }
                />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(InstituteDetailsPage);
