import { classNames } from '@/utils/utils';
import type { ReactNode } from 'react';

interface IExploreTableShellProps {
  children: ReactNode;
  minWidthClassName?: string;
  emptyState?: ReactNode;
  className?: string;
}

const ExploreTableShell = ({
  children,
  minWidthClassName,
  emptyState,
  className,
}: IExploreTableShellProps) => {
  return (
    <div className={classNames('rounded-2xl border border-customGray-10 bg-white overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <div className={classNames(minWidthClassName)}>{children}</div>
      </div>
      {emptyState}
    </div>
  );
};

export default ExploreTableShell;
