import Modal from '@/common/Modal';
import ExploreDataTable, {
  type ExploreDataTableColumn,
} from '@/common/table/ExploreDataTable';
import type { IInsightRecord } from '@/types/insights.types';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { getDynamicCrLabel } from '@/insights/insightsFilter.types';
import InsightsLockedSection from './InsightsLockedSection';

export default function InsightsCrDetailsModal({
  isOpen,
  onClose,
  record,
  clickedCrKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  record: IInsightRecord | null;
  clickedCrKey?: string | null;
}) {
  if (!record) return null;

  const crValues = (() => {
    if (!clickedCrKey) return [];
    const raw = record[clickedCrKey as keyof IInsightRecord];

    if (Array.isArray(raw)) {
      return (raw as Array<number | string>).filter(v => v !== '' && v !== '—');
    }

    if (raw === undefined || raw === null || raw === '' || raw === '—') return [];
    return [raw as number | string];
  })();

  const crLabel = clickedCrKey ? getDynamicCrLabel(clickedCrKey) : '';
  const isStateCrKey =
    clickedCrKey != null && /^crState_\d{4}_\d+$/.test(clickedCrKey);
  const totalRecords = crValues.length;
  const { isPremiumPurchased } = usePremiumStatus();
  const visibleValues = isPremiumPurchased ? crValues : crValues.slice(0, 3);

  type ICrDetailRow = { rowKey: string; rankValue: number | string };
  const crTableRows: ICrDetailRow[] = visibleValues.map((v, idx) => ({
    rowKey: `${String(clickedCrKey)}-${idx}`,
    rankValue: v,
  }));

  const crColumns: ExploreDataTableColumn<ICrDetailRow>[] = [
    {
      id: 'round',
      header: 'ROUND',
      thClassName: 'rounded-tl-md',
      cell: () => record.round,
    },
    {
      id: 'state',
      header: 'STATE',
      cell: () => record.state,
    },
    {
      id: 'institute',
      header: 'INSTITUTE',
      cell: () => record.institute,
    },
    {
      id: 'course',
      header: 'COURSE',
      cell: () => record.course,
    },
    {
      id: 'quota',
      header: 'QUOTA',
      cell: () => record.quota,
    },
    {
      id: 'category',
      header: 'CATEGORY',
      cell: () => record.category,
    },
    {
      id: 'rank',
      header: isStateCrKey ? 'STATE RANK' : 'AI RANK',
      thClassName: 'rounded-tr-lg',
      cell: row => String(row.rankValue),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon
      containerAdditionalClasses="max-w-5xl rounded-2xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
            Rank History Workspace
          </p>
          <h2 className="text-lg font-semibold text-primary-dark font-besley">
            Allotment
          </h2>
        </div>

        <div className="rounded-xl border border-customGray-10 bg-white overflow-hidden">


          <div className="">
            {visibleValues.length === 0 ? (
              <div className="text-xs text-customGray-60 font-inter">—</div>
            ) : (
              <ExploreDataTable<ICrDetailRow>
                useShell={false}
                headerVariant="insights"
                data={crTableRows}
                getRowKey={row => row.rowKey}
                tableClassName="min-w-[900px] font-inter text-sm rounded-lg"
                columns={crColumns}
              />
            )}
          </div>

          <InsightsLockedSection />
        </div>
      </div>
    </Modal>
  );
}

