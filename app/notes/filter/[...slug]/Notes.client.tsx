"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import { useDebounce } from "@/components/hooks/useDebounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";


import css from "./NotesPage.module.css";

const PER_PAGE = 12;
const DEBOUNCE_MS = 400;

type TagParam = NoteTag | "all";

export interface NotesClientProps {
  initialQuery: string;
  initialPage: number;
  tag: TagParam;
}

export default function NotesClient({
  initialQuery,
  initialPage,
  tag,
}: NotesClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState<string>(initialQuery);
  const [page, setPage] = useState<number>(initialPage);

  const debouncedSearch = useDebounce<string>(search, DEBOUNCE_MS);

  const queryKey = useMemo(
    () => ["notes", { page, perPage: PER_PAGE, search: debouncedSearch, tag }],
    [page, debouncedSearch, tag]
  );

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
        tag: tag === "all" ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className={css.container}>
     <div className={css.controls}>
  <SearchBox
    value={search}
    onChange={(value) => {
      setSearch(value);
      setPage(1);
    }}
  />

  <button
    type="button"
    className={css.button}
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
            
          )}
          {isCreateOpen && (
  <Modal onClose={() => setIsCreateOpen(false)}>
    <NoteForm onCancel={() => setIsCreateOpen(false)} />
  </Modal>
)}
        </>
      )}
    </main>
  );
}