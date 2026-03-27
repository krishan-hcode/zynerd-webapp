import { LockClosedIcon } from '@heroicons/react/24/outline';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function InsightsLockedSection() {
  const { isPremiumPurchased } = usePremiumStatus();

  if (isPremiumPurchased) return null;

  return (
    <div className="rounded-2xl border border-customGray-10 bg-gradient-to-b from-customGray-3/40 to-white">
      <div className="border-b border-customGray-10 px-4 py-3">
        <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
          More Records
        </p>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary-blue/20 to-[#4469B3]/10 p-[1px]">
          <div className="rounded-2xl border border-customGray-5 bg-white p-4 shadow-sm">
            <LockClosedIcon className="h-6 w-6 text-customGray-50" aria-hidden />
          </div>
        </div>
        <p className="mb-1 text-lg font-semibold text-primary-dark font-besley">
          Content Locked
        </p>
        <p className="mb-6 text-xs text-customGray-60 font-interMedium">
          Please purchase a package to view more
        </p>
        <button
          type="button"
          className="rounded-xl bg-gradient-to-r from-primary-blue/85 to-primary-blue px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
        >
          View Packages →
        </button>
      </div>
    </div>
  );
}
