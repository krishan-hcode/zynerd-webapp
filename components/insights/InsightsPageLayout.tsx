import type { ICounselling } from '@/types/counsellings.types';
import type { IInsightRecord } from '@/types/insights.types';
import quotaData from '@/data/quotaData.json';
import categoryData from '@/data/categoryData.json';
import courseTypeData from '@/data/courseTypeData.json';
import degreeData from '@/data/degreeData.json';
import InsightsCounsellingSelector from '@/insights/InsightsCounsellingSelector';
import InsightsFactorsDetailsModal from './InsightsFactorsDetailsModal';
import InsightsCrDetailsModal from '@/insights/InsightsCrDetailsModal';
import FiltersModal from '@/insights/FiltersModal';
import { applyInsightFilters } from '@/insights/insightsFilterUtils';
import {
  ALL_DYNAMIC_CR_FIELDS,
  DEFAULT_DISPLAYED_FIELDS,
  DEFAULT_FILTERS,
  PAGE_FIELD_CONFIG,
  type DisplayedFieldKey,
  type DisplayedFields,
  type InsightFilters,
  type InsightsPageType,
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
  const [isCrDetailsModalOpen, setIsCrDetailsModalOpen] = useState(false);
  const [selectedCrRecord, setSelectedCrRecord] = useState<IInsightRecord | null>(null);
  const [selectedCrKey, setSelectedCrKey] = useState<string | null>(null);
  const [returnToDetailsAfterCrClose, setReturnToDetailsAfterCrClose] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailsRecord, setSelectedDetailsRecord] = useState<IInsightRecord | null>(null);
  const [filters, setFilters] = useState<InsightFilters>(DEFAULT_FILTERS);
  const [displayedFields, setDisplayedFields] = useState<DisplayedFields>(DEFAULT_DISPLAYED_FIELDS);
  const pageConfig = PAGE_FIELD_CONFIG[pageTitle as InsightsPageType] ?? PAGE_FIELD_CONFIG.Allotments;
  const dynamicCrFields = pageConfig.includeDynamicCr ? ALL_DYNAMIC_CR_FIELDS : [];
  const allowedFieldKeys: DisplayedFieldKey[] = [...pageConfig.staticFields, ...dynamicCrFields];
  const canToggleRanks =
    allowedFieldKeys.includes('stateRank') && allowedFieldKeys.includes('aiRank');

  const normalizedDisplayedFields = useMemo<DisplayedFields>(
    () =>
      allowedFieldKeys.reduce(
        (acc, key) => {
          acc[key] = displayedFields[key] ?? true;
          return acc;
        },
        {} as DisplayedFields,
      ),
    [allowedFieldKeys, displayedFields],
  );

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



  const handleCrDetailsClose = () => {
    setIsCrDetailsModalOpen(false);
    if (returnToDetailsAfterCrClose) {
      setReturnToDetailsAfterCrClose(false);
      setIsDetailsModalOpen(true);
    }
  };

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
        onRankViewChange={view => {
          setRankView(view);
          setSortBy('default');
          setSortDirection('asc');
        }}
        pageTitle={pageTitle}
        showRankToggle={canToggleRanks}
        sortBy={sortBy}
        allowedFieldKeys={allowedFieldKeys}
        onSortChange={option => {
          setSortBy(option);
          setSortDirection('asc');
        }}
        onOpenFiltersModal={() => setIsFiltersModalOpen(true)}
      />



      <InsightsRecordsTable
        selectedCounselling={selectedCounselling}
        records={filteredSortedRecords}
        displayedFields={normalizedDisplayedFields}
        allowedFieldKeys={allowedFieldKeys}
        sessionYear={sessionYear}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onColumnHeaderClick={handleColumnHeaderClick}
        rankView={rankView}
        onCellClick={(record, fieldKey) => {
          if (/^cr_\d{4}_\d+$/.test(String(fieldKey))) {
            const mappedFieldKey =
              rankView === 'stateRank'
                ? (`crState_${String(fieldKey).replace(/^cr_/, '')}` as keyof IInsightRecord)
                : (fieldKey as keyof IInsightRecord);
            const rawValue = record[mappedFieldKey];

            // If the CR cell is effectively empty (shown as `—`), do nothing.
            if (Array.isArray(rawValue)) {
              if (rawValue.length === 0) return;
              const last = rawValue[rawValue.length - 1];
              if (
                last === undefined ||
                last === null ||
                last === '' ||
                last === '—' ||
                last === '-'
              ) {
                return;
              }
            } else if (
              rawValue === undefined ||
              rawValue === null ||
              rawValue === '' ||
              rawValue === '—' ||
              rawValue === '-'
            ) {
              return;
            }

            setSelectedCrRecord(record);
            setSelectedCrKey(String(mappedFieldKey));
            setReturnToDetailsAfterCrClose(false);
            setIsCrDetailsModalOpen(true);
            setIsDetailsModalOpen(false);
          } else {
            setSelectedDetailsRecord(record);
            setSelectedCrKey(null);
            setReturnToDetailsAfterCrClose(false);
            setIsDetailsModalOpen(true);
            setIsCrDetailsModalOpen(false);
          }
        }}
      />

      <InsightsLockedSection />

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        displayedFields={normalizedDisplayedFields}
        allowedFieldKeys={allowedFieldKeys}
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

      <InsightsFactorsDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        record={selectedDetailsRecord}
        showAirStateRankCards={pageTitle === 'Allotments' && canToggleRanks}
        showAirAndStateCrValues={pageTitle === 'Closing Ranks'}
        onOpenCrDetails={crKey => {
          if (!selectedDetailsRecord) return;
          setSelectedCrRecord(selectedDetailsRecord);
          setSelectedCrKey(crKey);
          setReturnToDetailsAfterCrClose(true);
          setIsCrDetailsModalOpen(true);
          setIsDetailsModalOpen(false);
        }}
      />

      <InsightsCrDetailsModal
        isOpen={isCrDetailsModalOpen}
        onClose={handleCrDetailsClose}
        record={selectedCrRecord}
        clickedCrKey={selectedCrKey}
      />
    </div>
  );
}
