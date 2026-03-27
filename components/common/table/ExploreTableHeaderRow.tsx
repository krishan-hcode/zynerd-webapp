import { classNames } from '@/utils/utils';

type HeaderTone = 'primary' | 'muted';

interface IExploreTableHeaderRowProps {
  headers: string[];
  tone?: HeaderTone;
}

const toneClasses: Record<HeaderTone, string> = {
  primary: 'bg-primary-blue text-white',
  muted: 'bg-customGray-3/60 text-customGray-60',
};

const ExploreTableHeaderRow = ({ headers, tone = 'muted' }: IExploreTableHeaderRowProps) => {
  return (
    <tr className={classNames('text-left', toneClasses[tone])}>
      {headers.map(header => (
        <th
          key={header}
          className="px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-interMedium">
          {header}
        </th>
      ))}
    </tr>
  );
};

export default ExploreTableHeaderRow;
