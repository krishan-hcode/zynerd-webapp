import ExploreTableShell from '@/common/table/ExploreTableShell';
import { classNames } from '@/utils/utils';
import type { KeyboardEvent, ReactNode } from 'react';

export type ExploreDataTableHeaderVariant = 'exploreMuted' | 'explorePrimary' | 'insights';

export interface ExploreDataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  thClassName?: string;
  tdClassName?: string;
}

const headerRowClasses: Record<ExploreDataTableHeaderVariant, string> = {
  exploreMuted: 'text-left bg-customGray-3/60 text-customGray-60',
  explorePrimary: 'text-left bg-primary-blue text-white',
  insights: 'text-left',
};

const defaultThClasses: Record<ExploreDataTableHeaderVariant, string> = {
  exploreMuted:
    'px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-interMedium text-left',
  explorePrimary:
    'px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-interMedium text-left',
  insights: 'px-3 py-2 font-semibold text-white text-xs whitespace-nowrap text-left',
};

const defaultTdByVariant: Record<ExploreDataTableHeaderVariant, string> = {
  exploreMuted: 'px-4 py-3 text-sm font-inter text-primary-dark',
  explorePrimary: 'px-4 py-3 text-sm font-inter text-primary-dark',
  insights: 'px-3 py-2 text-primary-dark whitespace-nowrap text-xs font-inter',
};

export interface IExploreDataTableProps<T> {
  data: T[];
  columns: ExploreDataTableColumn<T>[];
  getRowKey: (row: T) => string;
  minWidthClassName?: string;
  emptyState?: ReactNode;
  shellClassName?: string;
  headerVariant?: ExploreDataTableHeaderVariant;
  tableClassName?: string;
  theadClassName?: string;
  rowClassName?: string | ((row: T) => string);
  useShell?: boolean;
  /** When `useShell` is false, wraps the table (e.g. `overflow-x-auto`). */
  outerClassName?: string;
  onRowClick?: (row: T) => void;
}

function ExploreDataTable<T>({
  data,
  columns,
  getRowKey,
  minWidthClassName,
  emptyState,
  shellClassName,
  headerVariant = 'exploreMuted',
  tableClassName,
  theadClassName,
  rowClassName,
  useShell = true,
  outerClassName,
  onRowClick,
}: IExploreDataTableProps<T>) {
  const baseTh = defaultThClasses[headerVariant];
  const baseTd = defaultTdByVariant[headerVariant];
  const trHeaderClass = classNames(headerRowClasses[headerVariant]);

  const insightsTheadDefault =
    headerVariant === 'insights'
      ? 'sticky top-0 z-10 bg-gradient-to-r from-primary-blue/90 to-primary-blue/95 rounded-t-lg'
      : undefined;

  const tableInner = (
    <table className={classNames('w-full text-left', tableClassName)}>
      <thead className={classNames(insightsTheadDefault, theadClassName)}>
        <tr className={trHeaderClass}>
          {columns.map(col => (
            <th
              key={col.id}
              scope="col"
              className={classNames(baseTh, col.thClassName)}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => {
          const resolvedRowClass =
            typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
          const interactiveClass = onRowClick
            ? 'cursor-pointer hover:bg-customGray-3/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-blue/60'
            : '';
          return (
            <tr
              key={getRowKey(row)}
              className={classNames(
                headerVariant === 'insights'
                  ? 'border-b border-customGray-10 hover:bg-customGray-5 transition-colors'
                  : 'border-t border-customGray-10',
                resolvedRowClass,
                interactiveClass,
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e: KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
            >
              {columns.map(col => (
                <td
                  key={col.id}
                  className={classNames(baseTd, col.tdClassName)}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const wrappedTable = useShell ? (
    <ExploreTableShell
      minWidthClassName={minWidthClassName}
      emptyState={emptyState}
      className={shellClassName}
    >
      {tableInner}
    </ExploreTableShell>
  ) : (
    <div className={classNames('overflow-x-auto', outerClassName)}>{tableInner}</div>
  );

  return wrappedTable;
}

export default ExploreDataTable;
