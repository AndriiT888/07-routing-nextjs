"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import { useDebounce } from "@/components/hooks/useDebounce";

import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

const PER_PAGE = 12;
const DEBOUNCE_MS = 400;

export default function NotesClient({ initialQuery }: { initialQuery: string }) {
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const queryKey = useMemo(
    () => ["notes", { page, perPage: PER_PAGE, search: debouncedSearch }],
    [page, debouncedSearch]
  );

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData, //  щоб не мерехтіло при пагінації
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className={css.container}>
      <h1 className={css.title}>Notes</h1>

      <div className={css.controls}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <button
          className={css.button}
          type="button"
          onClick={() => setIsCreateOpen(true)}
        >
          Create note
        </button>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {error && <p>Something went wrong.</p>}

      {!error && (
        <>
          <NoteList notes={notes} />

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}

      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)}>
          <NoteForm onCancel={() => setIsCreateOpen(false)} />
        </Modal>
      )}
    </main>
  );
}
