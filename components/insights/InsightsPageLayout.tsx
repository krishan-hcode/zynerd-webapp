import type { ICounselling } from '@/types/counsellings.types';
import type { IInsightRecord } from '@/types/insights.types';
import quotaData from '@/data/quotaData.json';
import categoryData from '@/data/categoryData.json';
import courseTypeData from '@/data/courseTypeData.json';
import degreeData from '@/data/degreeData.json';
import InsightsCounsellingSelector from '@/insights/InsightsCounsellingSelector';
import FiltersModal from '@/insights/FiltersModal';
import { applyInsightFilters } from '@/insights/insightsFilterUtils';
import {
  DEFAULT_DISPLAYED_FIELDS,
  DEFAULT_FILTERS,
  type DisplayedFields,
  type InsightFilters,
} from '@/insights/insightsFilter.types';
import { type SortDirection, sortInsightRecords } from '@/insights/insightsSortUtils';
import InsightsLockedSection from '@/insights/InsightsLockedSection';
import InsightsPageHeader from '@/insights/InsightsPageHeader';
import InsightsRecordsTable from '@/insights/InsightsRecordsTable';
import type { SortByOption } from '@/insights/SortByModal';
import InsightsToolbar, { type RankView } from '@/insights/InsightsToolbar';
import { useMemo, useState } from 'react';

export type { RankView };

const STATIC_QUOTA_OPTIONS: string[] = (quotaData as { options: string[] }).options;
const STATIC_CATEGORY_OPTIONS: string[] = (categoryData as { options: string[] }).options;
const STATIC_COURSE_TYPE_OPTIONS: string[] = (courseTypeData as { options: string[] }).options;
const STATIC_DEGREE_OPTIONS: string[] = (degreeData as { options: string[] }).options;

function getUniqueOptions(records: IInsightRecord[], key: keyof IInsightRecord): string[] {
  const set = new Set<string>();
  records.forEach(r => {
    const v = r[key];
    if (typeof v === 'string' && v) set.add(v);
  });
  return Array.from(set).sort();
}

function mergeWithStaticOptions(recordOptions: string[], staticOptions: string[]): string[] {
  const set = new Set([...staticOptions, ...recordOptions]);
  return Array.from(set).sort();
}

interface InsightsPageLayoutProps {
  pageTitle: string;
  selectedCounselling: ICounselling | null;
  onOpenCounsellingModal: () => void;
  records: IInsightRecord[];
  sessionYear?: string;
  whatsThisTitle?: string;
  whatsThisBody?: string;
}

export default function InsightsPageLayout({
  pageTitle,
  selectedCounselling,
  onOpenCounsellingModal,
  records,
  sessionYear = '2025',
  whatsThisTitle,
  whatsThisBody,
}: InsightsPageLayoutProps) {
  const [rankView, setRankView] = useState<RankView>('stateRank');
  const [sortBy, setSortBy] = useState<SortByOption>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filters, setFilters] = useState<InsightFilters>(DEFAULT_FILTERS);
  const [displayedFields, setDisplayedFields] = useState<DisplayedFields>(DEFAULT_DISPLAYED_FIELDS);

  const filteredSortedRecords = useMemo(() => {
    const filtered = applyInsightFilters(records, filters);
    return sortInsightRecords(filtered, sortBy, sortDirection);
  }, [records, filters, sortBy, sortDirection]);

  const handleColumnHeaderClick = (columnKey: string) => {
    const key = columnKey as SortByOption;
    if (key === 'default') return;
    if (sortBy === key) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filterOptions = useMemo(
    () => {
      const stateFilteredRecords =
        filters.states.length > 0
          ? records.filter(r => filters.states.includes(r.state))
          : records;
      return {
        quotaOptions: mergeWithStaticOptions(
          getUniqueOptions(records, 'quota'),
          STATIC_QUOTA_OPTIONS,
        ),
        categoryOptions: mergeWithStaticOptions(
          getUniqueOptions(records, 'category'),
          STATIC_CATEGORY_OPTIONS,
        ),
        stateOptions: getUniqueOptions(records, 'state'),
        instituteOptions: getUniqueOptions(stateFilteredRecords, 'institute'),
        courseOptions: getUniqueOptions(records, 'course'),
        courseTypeOptions: mergeWithStaticOptions(
          getUniqueOptions(records, 'courseType'),
          STATIC_COURSE_TYPE_OPTIONS,
        ),
        degreeOptions: mergeWithStaticOptions(
          getUniqueOptions(records, 'degree'),
          STATIC_DEGREE_OPTIONS,
        ),
      };
    },
    [records, filters.states],
  );



  return (
    <div className="bg-white rounded-xl border border-customGray-10 shadow-sm mx-4 mt-4 p-4 md:p-6 min-h-[60vh]">
      <InsightsPageHeader
        pageTitle={pageTitle}
        whatsThisTitle={whatsThisTitle}
        whatsThisBody={whatsThisBody}
      />

      <InsightsCounsellingSelector
        selectedCounselling={selectedCounselling}
        onOpenModal={onOpenCounsellingModal}
      />

      <InsightsToolbar
        rankView={rankView}
        onRankViewChange={setRankView}
        sortBy={sortBy}
        onSortChange={option => {
          setSortBy(option);
          setSortDirection('asc');
        }}
        onOpenFiltersModal={() => setIsFiltersModalOpen(true)}
      />



      <InsightsRecordsTable
        selectedCounselling={selectedCounselling}
        records={filteredSortedRecords}
        displayedFields={displayedFields}
        sessionYear={sessionYear}
        rankView={rankView}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onColumnHeaderClick={handleColumnHeaderClick}
      />

      <InsightsLockedSection />

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        displayedFields={displayedFields}
        onDisplayedFieldsChange={setDisplayedFields}
        onViewResults={() => setIsFiltersModalOpen(false)}
        quotaOptions={filterOptions.quotaOptions}
        categoryOptions={filterOptions.categoryOptions}
        stateOptions={filterOptions.stateOptions}
        instituteOptions={filterOptions.instituteOptions}
        courseOptions={filterOptions.courseOptions}
        courseTypeOptions={filterOptions.courseTypeOptions}
        degreeOptions={filterOptions.degreeOptions}
      />
    </div>
  );
}
