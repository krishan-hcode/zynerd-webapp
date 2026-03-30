import type { CounsellingTimelineStep } from '@/counsellings/CounsellingTimeline';
import CounsellingTimeline from '@/counsellings/CounsellingTimeline';

const defaultSteps: CounsellingTimelineStep[] = [
  { title: 'Registration Starts', date: '15 July', status: 'done' },
  { title: 'Choice Filling', date: '22 July', status: 'done' },
  { title: 'Round 1 Result', date: '30 July', status: 'current' },
  { title: 'Reporting to College', date: '05 Aug', status: 'upcoming' },
  { title: 'Round 2 Schedule', date: '12 Aug', status: 'upcoming' },
];

export default function CounsellingTimelinePage() {
  return (
    <div className="w-full bg-white p-6 rounded-[24px] border border-customGray-10 shadow-sm overflow-hidden">
      <CounsellingTimeline steps={defaultSteps} showHeader={true} />
    </div>
  );
}