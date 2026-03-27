import type { ICounselling } from '@/types/counsellings.types';
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface InsightsCounsellingSelectorProps {
  selectedCounselling: ICounselling | null;
  onOpenModal: () => void;
}

export default function InsightsCounsellingSelector({
  selectedCounselling,
  onOpenModal,
}: InsightsCounsellingSelectorProps) {
  return (
    <div className="mb-4 rounded-2xl border border-customGray-10 bg-white p-3">
      <p className="mb-2 text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
        Counselling
      </p>
      <button
        type="button"
        onClick={onOpenModal}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-customGray-10 bg-customGray-3/40 px-4 py-2.5 text-sm font-medium text-primary-dark transition-all hover:border-primary-blue/30"
      >
        <span className="truncate text-left text-primary-dark">
          {selectedCounselling?.name ?? 'Select counselling'}
        </span>
        <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-customGray-60" />
      </button>
      {selectedCounselling && (
        <Link
          href="/explore/counsellings"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-customGray-10 bg-white px-4 py-2.5 text-sm font-medium text-primary-dark transition-all hover:border-primary-blue/30"
        >
          Go to counselling
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
