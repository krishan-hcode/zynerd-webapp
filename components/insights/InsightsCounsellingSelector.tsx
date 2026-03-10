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
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <button
        type="button"
        onClick={onOpenModal}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-customGray-10 shadow-sm text-primary-dark font-inter text-sm font-medium hover:bg-customGray-5 transition-colors min-w-[200px] justify-between"
      >
        <span className="truncate text-left text-primary-blue">
          {selectedCounselling?.name ?? 'Select counselling'}
        </span>
        <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-customGray-50" />
      </button>
      {selectedCounselling && (
        <Link
          href="/explore/counsellings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-customGray-10 shadow-sm text-primary-dark font-inter text-sm font-medium hover:bg-customGray-5 transition-colors"
        >
          Go to counselling
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
