import Modal from '@/common/Modal';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import type { IInsightRecord } from '@/types/insights.types';
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  HomeIcon,
  MinusCircleIcon,
  MapPinIcon,
  TagIcon,
  WalletIcon,
  Square3Stack3DIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type CrKey = `cr_${number}_${number}`;
type StateCrKey = `crState_${number}_${number}`;

const YEARS = [2022, 2023, 2024, 2025] as const;
const ROUNDS = [1, 2, 3, 4, 5] as const;

function getCrLabel(year: number, round: number) {
  return `CR ${year} ${round}`;
}

function getPresentCrKeys(record: IInsightRecord): CrKey[] {
  const keys: CrKey[] = [];
  for (const y of YEARS) {
    for (const r of ROUNDS) {
      const key = `cr_${y}_${r}` as CrKey;
      const v = record[key];
      if (v === undefined || v === null || v === '') continue;
      if (v === '—') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      keys.push(key);
    }
  }
  return keys;
}

function formatCrValue(raw: unknown, round: number) {
  if (raw === undefined || raw === null || raw === '' || raw === '—') return '—';
  if (Array.isArray(raw)) {
    if (raw.length === 0) return '—';
    const last = raw[raw.length - 1];
    if (last === undefined || last === null || last === '' || last === '—') return '—';
    return `${last}(${raw.length})`;
  }
  return `${raw}`;
}

function isPresentCrValue(raw: unknown) {
  if (raw === undefined || raw === null || raw === '' || raw === '—') return false;
  if (Array.isArray(raw) && raw.length === 0) return false;
  return true;
}

interface InsightsFactorsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: IInsightRecord | null;
  onOpenCrDetails?: (crKey: CrKey | StateCrKey) => void;
  showAirStateRankCards?: boolean;
  showAirAndStateCrValues?: boolean;
}

export default function InsightsFactorsDetailsModal({
  isOpen,
  onClose,
  record,
  onOpenCrDetails,
  showAirStateRankCards = true,
  showAirAndStateCrValues = false,
}: InsightsFactorsDetailsModalProps) {
  const { isPremiumPurchased } = usePremiumStatus();
  const presentCrKeys = record ? getPresentCrKeys(record) : [];

  if (!record) return null;

  const isAllIndiaRankMode = record.aiRank != null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon
      containerAdditionalClasses="max-w-5xl "
    >
      <div className="flex flex-col gap-6 ">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          Factors &amp; Details
        </h2>

        <div className="relative overflow-hidden  bg-white">
          <div className="absolute inset-0  pointer-events-none" />

          <div className="relative flex items-start gap-4">
            <div className="rounded-lg border border-primary-blue/20 p-3 bg-white/70">
              <BuildingOfficeIcon className="h-6 w-6 text-primary-blue" aria-hidden />
            </div>

            <div className="flex-1">
              <p className="text-base font-semibold text-primary-dark font-besley">
                {record.institute}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-customGray-70 font-inter">
                  <MapPinIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                  <span className='text-xs text-customGray-60 font-interMedium'>Location: <span className="font-interSemiBold text-primary-blue">{record.state}</span></span>
                </div>
                <div className="flex items-center gap-1 text-sm text-customGray-70 font-inter">
                  <Square3Stack3DIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                  <span className='text-xs text-customGray-60 font-interMedium'>Beds: <span className="font-interSemiBold text-primary-blue">{record.beds}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
          <div className="border border-primary-blue/20 rounded-xl p-3.5 bg-white shadow-md shadow-primary-blue/5 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              <p className="text-xs font-semibold text-primary-blue font-inter">COURSE</p>
            </div>
            <p className="text-xs font-interMedium  text-primary-dark mt-1">{record.course}</p>
          </div>
          <div className="border border-primary-blue/20 rounded-xl p-3.5 bg-white shadow-md shadow-primary-blue/5 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10">
            <div className="flex items-center gap-2">
              <DocumentTextIcon
                className="h-4 w-4 text-primary-blue"
                aria-hidden
              />
              <p className="text-xs font-semibold text-primary-blue font-inter">QUOTA</p>
            </div>
            <p className="text-xs font-interMedium  text-primary-dark mt-1">{record.quota}</p>
          </div>
          <div className="border border-primary-blue/20 rounded-xl p-3.5 bg-white shadow-md shadow-primary-blue/5 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              <p className="text-xs font-semibold text-primary-blue font-inter">CATEGORY</p>
            </div>
            <p className="text-xs font-interMedium text-primary-dark mt-1">{record.category}</p>
          </div>
        </div>
        {showAirStateRankCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 ">
            <div className="rounded-xl border border-primary-blue/20 bg-white p-3.5 shadow-sm shadow-primary-blue/5 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                <p className="text-xs font-semibold text-primary-blue font-inter">
                  AIR RANK
                </p>
              </div>
              <p className="text-xs font-interMedium text-primary-dark  mt-2">
                {record.aiRank ?? '—'}
              </p>
            </div>

            <div className="rounded-xl border border-primary-blue/20 bg-white p-3.5 shadow-sm shadow-primary-blue/5 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 text-primary-blue" aria-hidden />
                <p className="text-xs font-semibold text-primary-blue font-inter">
                  STATE RANK
                </p>
              </div>
              <p className="text-xs font-interMedium text-primary-dark  mt-2">
                {record.stateRank ?? '—'}
              </p>
            </div>
          </div>
        )}
        {!showAirStateRankCards && presentCrKeys.length !== 0 &&
          <div className="border border-primary-blue/20 rounded-xl bg-gradient-to-r from-primary-blue/5 to-primary-blue/5 p-4 shadow-md shadow-primary-blue/5">
            <p className="text-xs font-semibold text-primary-blue font-inter mb-4">All India Rank</p>
            <div
              className={`overflow-x-auto scrollbar-hide pt-4`}
            >

              <div className="flex gap-3 min-w-max">
                {YEARS.map(year => {
                  const roundValues = ROUNDS.map(round => {
                    const airKey = `cr_${year}_${round}` as CrKey;
                    const stateKey = `crState_${year}_${round}` as StateCrKey;
                    const airRaw = record[airKey];

                    if (!showAirAndStateCrValues) {
                      if (
                        airRaw === undefined ||
                        airRaw === null ||
                        airRaw === '' ||
                        airRaw === '—'
                      )
                        return null;
                      if (Array.isArray(airRaw) && airRaw.length === 0) return null;
                      return { round, airKey, stateKey, airRaw, stateRaw: undefined as unknown };
                    }

                    const stateRaw = record[stateKey];

                    if (!isPresentCrValue(airRaw) && !isPresentCrValue(stateRaw)) {
                      return null;
                    }

                    return {
                      round,
                      airKey,
                      stateKey,
                      airRaw,
                      stateRaw,
                    };
                  }).filter(Boolean) as Array<{
                    round: number;
                    airKey: CrKey;
                    stateKey: StateCrKey;
                    airRaw: unknown;
                    stateRaw: unknown | undefined;
                  }>;

                  if (roundValues.length === 0) return null;

                  return (
                    <div
                      key={year}
                      className="flex-none min-w-[220px] border border-customGray-10 rounded-xl bg-white p-3.5 shadow-sm relative pt-4"
                    >
                      <div className="text-center mb-2 absolute -top-4 left-4">
                        <span className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary-blue/70 to-primary-blue/90 px-2 py-1 text-xs font-semibold  font-inter text-white">
                          {year}
                        </span>
                      </div>
                      {showAirAndStateCrValues ? (
                        <div className="overflow-x-auto pt-1">

                          <table className="w-full min-w-[200px] border-collapse text-left">
                            <thead>
                              <tr>
                                <th className="w-24 p-1 align-bottom text-xxs font-medium text-customGray-60 font-inter" />
                                {roundValues.map(({ round: r }) => (
                                  <th
                                    key={`h-${r}`}
                                    className="p-1 pb-2 text-center text-xxs font-semibold text-customGray-60 font-inter whitespace-nowrap "
                                  >
                                    Round {r}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="align-middle py-2 pr-2 text-xxs font-semibold text-primary-blue font-inter whitespace-nowrap">
                                  ALL INDIA RANK
                                </td>
                                {roundValues.map(({ round: r, airKey, airRaw }) => (
                                  <td key={`air-${r}`} className="px-1 py-2 text-center align-middle">
                                    {isAllIndiaRankMode &&
                                      onOpenCrDetails &&
                                      isPresentCrValue(airRaw) ? (
                                      <button
                                        type="button"
                                        onClick={() => onOpenCrDetails(airKey)}
                                        className="text-xxs font-interMedium text-primary-blue underline decoration-primary-blue underline-offset-2 hover:opacity-80"
                                      >
                                        {formatCrValue(airRaw, r)}
                                      </button>
                                    ) : (
                                      <span className="text-xxs font-interMedium text-primary-blue">
                                        {formatCrValue(airRaw, r)}
                                      </span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                              <tr className="border-t border-customGray-10">
                                <td className="align-middle py-2 pr-2 text-xxs font-semibold text-secondary-purple font-inter whitespace-nowrap">
                                  STATE RANK
                                </td>
                                {roundValues.map(({ round: r, stateKey, stateRaw }) => (
                                  <td key={`state-${r}`} className="px-1 py-2 text-center align-middle">
                                    {onOpenCrDetails && isPresentCrValue(stateRaw) ? (
                                      <button
                                        type="button"
                                        onClick={() => onOpenCrDetails(stateKey)}
                                        className="text-xxs font-interMedium text-secondary-purple underline decoration-secondary-purple underline-offset-2 hover:opacity-80"
                                      >
                                        {formatCrValue(stateRaw, r)}
                                      </button>
                                    ) : (
                                      <span className="text-xxs font-interMedium text-secondary-purple">
                                        {formatCrValue(stateRaw, r)}
                                      </span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {roundValues.map(({ round, airKey, airRaw, stateRaw }) => {
                            const content = (
                              <>
                                <div className="text-xs font-semibold text-primary-dark font-inter">
                                  Round {round}
                                </div>
                                <div className="text-xxs font-medium text-primary-blue font-inter">
                                  {formatCrValue(airRaw, round)}
                                </div>
                              </>
                            );

                            if (isAllIndiaRankMode && onOpenCrDetails) {
                              return (
                                <button
                                  key={round}
                                  type="button"
                                  onClick={() => onOpenCrDetails?.(airKey)}
                                  className="flex flex-col items-start justify-start rounded-lg px-2 py-1 text-center bg-white  cursor-pointer hover:bg-customGray-5 transition-colors"
                                >
                                  {content}
                                </button>
                              );
                            }

                            return (
                              <div
                                key={round}
                                className="border border-customGray-10 rounded-lg px-2 py-1 text-center bg-white"
                              >
                                {content}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-customGray-10 rounded-xl bg-white  shadow-sm">
            <div className="text-xs font-semibold text-primary-blue font-inter px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 rounded-t-lg ">
              <BanknotesIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              FEE DETAILS
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Fee</span>
                <span className="text-xs font-interMedium text-primary-dark">{record.fee}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Hostel Fee</span>
                <span className="text-xs font-interMedium text-primary-dark">—</span>
              </div>
              {record.feeRemarks && (
                <div className="pt-3 mt-2 border-t border-customGray-10">
                  <div className="text-xs font-inter text-primary-dark font-semibold">
                    Remarks
                  </div>
                  <div className="text-xxs text-customGray-60 font-inter mt-1">
                    {record.feeRemarks}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-customGray-10 rounded-xl bg-white  shadow-sm">
            <div className="text-xs font-semibold text-primary-blue font-inter px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 rounded-t-lg ">
              <ShieldCheckIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              BOND DETAILS
            </div>
            <div className="space-y-2 p-4 ">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Bond Years</span>
                <span className="text-xs font-interMedium text-primary-dark">
                  {record.bondYears}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Bond Penalty</span>
                <span className="text-xs font-interMedium text-primary-dark">
                  {record.bondPenalty}
                </span>
              </div>

              {record.bondPenaltyRemarks && (
                <div className="pt-3 mt-2 border-t border-customGray-10">
                  <div className="text-xs font-inter text-primary-dark font-semibold">
                    Remarks
                  </div>
                  <div className="text-xxs text-customGray-60 font-inter mt-1">
                    {record.bondPenaltyRemarks}
                    sadkl
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-customGray-10 rounded-xl bg-white  shadow-sm">
            <div className="text-xs font-semibold text-primary-blue font-inter px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 rounded-t-lg ">
              <WalletIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              STIPEND DETAILS
            </div>
            <div className="space-y-2 p-4 ">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Stipend Year 1</span>
                <span className="text-xs font-interMedium text-primary-dark">
                  {record.stipendYear1}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Stipend Year 2</span>
                <span className="text-xs font-interMedium text-primary-dark">{record.stipendYear2 ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">Stipend Year 3</span>
                <span className="text-xs font-interMedium text-primary-dark">{record.stipendYear3 ?? '-'}</span>
              </div>

              {record.stipendYear1Remarks && (
                <div className="pt-3 mt-2 border-t border-customGray-10">
                  <div className="text-xs font-inter text-primary-dark font-semibold">
                    Remarks
                  </div>
                  <div className="text-xxs text-customGray-60 font-inter mt-1">
                    {record.stipendYear1Remarks}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-customGray-10 rounded-xl bg-white  shadow-sm">
            <div className="text-xs font-semibold text-primary-blue font-inter px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 rounded-t-lg ">
              <MinusCircleIcon className="h-4 w-4 text-primary-blue" aria-hidden />
              DEDUCTION DETAILS
            </div>
            <div className="space-y-2 p-4 ">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-customGray-60 font-interMedium">
                  Seat Leaving Penalty
                  (Course discontinuation)
                </span>
                <span className="text-xs font-interMedium text-end text-primary-dark">{record.seatLeavingPenalty ?? '-'}</span>
              </div>



              {(record.seatLeavingPenaltyRemarks ||
                record.courseDiscontinuationPenaltyRemarks) && (
                  <div className="pt-3 mt-2 border-t border-customGray-10">
                    <div className="text-xs font-inter text-primary-dark font-semibold">
                      Remarks
                    </div>
                    {record.seatLeavingPenaltyRemarks && (
                      <div className="text-xxs text-customGray-60 font-inter mt-1">
                        {record.seatLeavingPenaltyRemarks}
                      </div>
                    )}

                  </div>
                )}
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}

