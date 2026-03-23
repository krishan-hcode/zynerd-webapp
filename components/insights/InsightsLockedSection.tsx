import {LockClosedIcon} from '@heroicons/react/24/outline';

export default function InsightsLockedSection() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-12 text-customGray-50">
      <LockClosedIcon className="h-12 w-12 mb-2 opacity-60" aria-hidden />
      <p className="text-sm font-inter">More content available with premium</p>
    </div>
  );
}
