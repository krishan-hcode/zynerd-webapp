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
import ChoiceListAssignmentModal from '@/insights/ChoiceListAssignmentModal';
import ChoiceListManagerModal from '@/insights/ChoiceListManagerModal';
import {
  createChoiceList,
  DEFAULT_CHOICE_LIST_STATE,
  getRecordChoiceListCount,
  isRecordInActiveChoiceList,
  localChoiceListRepository,
  toggleRecordInList,
} from '@/insights/choiceList.service';
import type { ChoiceListState } from '@/insights/choiceList.types';
import type { SortByOption } from '@/insights/SortByModal';
import InsightsToolbar, { type RankView } from '@/insights/InsightsToolbar';
import { classNames } from '@/utils/utils';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import SpottedErrorModal from '@/common/SpottedErrorModal';

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
  pageTitle: InsightsPageType;
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
  const [choiceListState, setChoiceListState] = useState<ChoiceListState>({
    lists: [],
    preferences: { mode: 'askEveryTime' },
    activeChoiceListId: undefined,
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isChoiceListManagerOpen, setIsChoiceListManagerOpen] = useState(false);
  const [isChoiceListAssignmentOpen, setIsChoiceListAssignmentOpen] = useState(false);
  const [selectedChoiceListRecord, setSelectedChoiceListRecord] = useState<IInsightRecord | null>(null);
  const [hasHydratedChoiceLists, setHasHydratedChoiceLists] = useState(false);
  const [isRecordsExpanded, setIsRecordsExpanded] = useState(false);
  const choiceListScopeKey =
    selectedCounselling?.id != null ? String(selectedCounselling.id) : undefined;
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

  useEffect(() => {
    if (!choiceListScopeKey) {
      setChoiceListState(DEFAULT_CHOICE_LIST_STATE);
      setHasHydratedChoiceLists(true);
      return;
    }
    const savedState = localChoiceListRepository.loadChoiceLists(choiceListScopeKey);
    setChoiceListState(savedState);
    setHasHydratedChoiceLists(true);
  }, [choiceListScopeKey]);

  useEffect(() => {
    if (!hasHydratedChoiceLists || !choiceListScopeKey) return;
    localChoiceListRepository.saveChoiceLists(choiceListScopeKey, choiceListState);
  }, [choiceListState, hasHydratedChoiceLists, choiceListScopeKey]);

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

  const handleCreateChoiceList = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const alreadyExists = choiceListState.lists.some(
      list => list.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (alreadyExists) return;

    setChoiceListState(prevState => ({
      ...prevState,
      lists: [...prevState.lists, createChoiceList(trimmedName)],
    }));
  };

  const handleChoiceListToggleForSelectedRecord = (listId: string) => {
    if (!selectedChoiceListRecord) return;
    setChoiceListState(prevState => toggleRecordInList(prevState, selectedChoiceListRecord.id, listId));
  };

  const activeChoiceListName = useMemo(() => {
    if (!choiceListState.activeChoiceListId) return 'Ask every time';
    const activeList = choiceListState.lists.find(list => list.id === choiceListState.activeChoiceListId);
    return activeList?.name ?? 'Ask every time';
  }, [choiceListState.activeChoiceListId, choiceListState.lists]);

  const selectedChoiceListMapByRecordId = useMemo(() => {
    const selectionMap = new Map<string, boolean>();
    records.forEach(record => {
      selectionMap.set(record.id, isRecordInActiveChoiceList(choiceListState, record.id));
    });
    return selectionMap;
  }, [choiceListState, records]);

  const choiceListCountMapByRecordId = useMemo(() => {
    const countMap = new Map<string, number>();
    records.forEach(record => {
      countMap.set(record.id, getRecordChoiceListCount(choiceListState, record.id));
    });
    return countMap;
  }, [choiceListState, records]);

  const layoutGridStyle = {
    '--insights-layout-cols': isRecordsExpanded
      ? '0px minmax(0, 1fr)'
      : '320px minmax(0, 1fr)',
  } as CSSProperties;

  return (
    <div className="mx-4 mt-4 min-h-[60vh] p-3 shadow-sm md:p-4">
      <div
        className={classNames(
          'grid grid-cols-1 gap-4 lg:[grid-template-columns:var(--insights-layout-cols)] lg:transition-[grid-template-columns] lg:duration-300 lg:ease-in-out',
        )}
        style={layoutGridStyle}
      >
        <aside
          className={classNames(
            'overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-in-out',
            isRecordsExpanded
              ? 'pointer-events-none -translate-x-3 border-transparent p-0 opacity-0'
              : 'translate-x-0 border-customGray-10 p-4 opacity-100',
          )}
        >
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
            onOpenChoiceListModal={() => setIsChoiceListManagerOpen(true)}
            choiceListModeLabel={activeChoiceListName}
          />
        </aside>

        <section className="rounded-2xl border border-customGray-10 bg-white p-4 shadow-sm">
          <div className="mb-4 border-b border-customGray-10 pb-3">
            <div className="flex flex-row items-center justify-between">
              <h3 className="mt-1 text-base font-interMedium text-primary-blue">
                {selectedCounselling?.name}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsRecordsExpanded(prev => !prev)}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg border border-customGray-10 bg-white text-customGray-70 transition-colors hover:border-primary-blue/30 hover:text-primary-blue lg:inline-flex"
                  aria-label={isRecordsExpanded ? 'Exit expanded view' : 'Expand table'}
                  title={isRecordsExpanded ? 'Exit expanded view' : 'Expand table'}
                >
                  {isRecordsExpanded ? (
                    <ArrowsPointingInIcon className="h-4 w-4" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                  )}
                </button>

              </div>
            </div>
            <p className="mt-1 text-xs font-inter text-customGray-60">
              Click on the record for detailed information and factors.
            </p>
            <SpottedErrorModal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
            />

          </div>

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
            isChoiceListSelected={recordId => selectedChoiceListMapByRecordId.get(recordId) ?? false}
            getChoiceListCount={recordId => choiceListCountMapByRecordId.get(recordId) ?? 0}
            showChoiceListCountBadge={!choiceListState.activeChoiceListId}
            onChoiceListClick={record => {
              const activeChoiceListId = choiceListState.activeChoiceListId;
              if (activeChoiceListId) {
                setChoiceListState(prevState =>
                  toggleRecordInList(prevState, record.id, activeChoiceListId),
                );
                return;
              }
              setSelectedChoiceListRecord(record);
              setIsChoiceListAssignmentOpen(true);
            }}
          />
          <div className='mt-4 flex flex-row items-end justify-end'>
            <button
              type="button"
              onClick={() => setIsErrorModalOpen(true)}
              className="inline-flex text-xxs   items-end justify-end  gap-1.5 rounded-lg border border-customGray-10 bg-white px-3 py-1.5 text-customGray-70 transition-colors hover:border-primary-blue/30 hover:text-primary-blue"
            >
              Spotted an error? Let us know
            </button>
          </div>
          <div className="mt-6">
            <InsightsLockedSection />
          </div>
        </section>
      </div>

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

      <ChoiceListManagerModal
        isOpen={isChoiceListManagerOpen}
        onClose={() => setIsChoiceListManagerOpen(false)}
        counsellingName={selectedCounselling?.name}
        mode={choiceListState.preferences.mode}
        lists={choiceListState.lists.map(list => ({
          id: list.id,
          name: list.name,
          itemCount: list.itemIds.length,
        }))}
        onCreateList={handleCreateChoiceList}
        activeChoiceListId={choiceListState.activeChoiceListId}
        onSelectList={listId =>
          setChoiceListState(prevState => ({
            ...prevState,
            activeChoiceListId: listId,
          }))
        }
        onSelectAskEverytime={() =>
          setChoiceListState(prevState => ({
            ...prevState,
            activeChoiceListId: undefined,
          }))
        }
      />

      <ChoiceListAssignmentModal
        isOpen={isChoiceListAssignmentOpen}
        onClose={() => setIsChoiceListAssignmentOpen(false)}
        counsellingName={selectedCounselling?.name}
        lists={choiceListState.lists.map(list => ({
          id: list.id,
          name: list.name,
          itemCount: list.itemIds.length,
          isSelected: selectedChoiceListRecord ? list.itemIds.includes(selectedChoiceListRecord.id) : false,
        }))}
        onToggleList={handleChoiceListToggleForSelectedRecord}
      />
    </div>
  );
}
