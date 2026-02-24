import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void; // 1-based
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      className={css.pagination}
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
    />
  );
}
