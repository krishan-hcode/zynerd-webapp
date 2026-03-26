import { LockClosedIcon } from '@heroicons/react/24/outline';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function InsightsLockedSection() {
  const { isPremiumPurchased } = usePremiumStatus();

  if (isPremiumPurchased) return null;

  return (
    <div className="bg-customGray-3">
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="mb-4 rounded-xl bg-gradient-to-br from-primary-blue/20 to-[#4469B3]/10 p-[1px]">
          <div className="rounded-xl bg-white border border-customGray-5 p-4">
            <LockClosedIcon className="h-6 w-6 text-customGray-50" aria-hidden />
          </div>
        </div>
        <p className="text-lg font-semibold text-primary-dark font-besley mb-1">
          Content Locked
        </p>
        <p className="text-xs text-customGray-60 font-interMedium mb-6">
          Please purchase a package to view more
        </p>
        <button
          type="button"
          className="rounded-lg bg-gradient-to-r from-primary-blue/80 to-primary-blue px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          View Packages →
        </button>
      </div>
    </div>
  );
}
