import Modal from '@/common/Modal';
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
          <div className="border-b border-customGray-10 bg-customGray-3/40 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-60">
                {crLabel || 'Selected Rank'}
              </p>
              <p className="text-xs font-inter text-customGray-60">
                1 - {Math.min(visibleValues.length, totalRecords)} of {totalRecords} Records
              </p>
            </div>
          </div>

          <div className="px-4 py-4">
            {visibleValues.length === 0 ? (
              <div className="text-xs text-customGray-60 font-inter">—</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left font-inter text-sm rounded-lg">
                  <thead className="sticky top-0 bg-gradient-to-r from-primary-blue/90 to-primary-blue/95 rounded-t-lg ">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap rounded-tl-md">
                        ROUND
                      </th>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap">
                        STATE
                      </th>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap">
                        INSTITUTE
                      </th>
                      <th className="px-3 py-2 font-semibold text-white  text-xs whitespace-nowrap">
                        COURSE
                      </th>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap">
                        QUOTA
                      </th>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap">
                        CATEGORY
                      </th>
                      <th className="px-3 py-2 font-semibold text-white text-xs whitespace-nowrap rounded-tr-lg">
                        {isStateCrKey ? 'STATE RANK' : 'AI RANK'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleValues.map((v, idx) => (
                      <tr
                        key={`${String(clickedCrKey)}-${idx}`}
                        className="border-b border-customGray-10 hover:bg-customGray-5 transition-colors"
                      >
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.round}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.state}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.institute}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.course}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.quota}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {record.category}
                        </td>
                        <td className="px-3 py-2 text-primary-dark whitespace-nowrap text-xs">
                          {String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <InsightsLockedSection />
        </div>
      </div>
    </Modal>
  );
}

