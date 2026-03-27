interface IExploreTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ExploreTablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IExploreTablePaginationProps) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-xs rounded-lg border border-customGray-10 bg-white text-primary-dark disabled:opacity-50">
        Prev
      </button>
      <span className="text-xs font-inter text-customGray-60">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-xs rounded-lg border border-customGray-10 bg-white text-primary-dark disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default ExploreTablePagination;
