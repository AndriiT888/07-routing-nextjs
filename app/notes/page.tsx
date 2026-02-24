import { dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/quryClient";
import { fetchNotes } from "@/lib/api";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import NotesClient from "./Notes.client";

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q ?? "";

  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
  queryKey: ["notes", { page: 1, perPage: 12, search: q }],
  queryFn: () => fetchNotes({ page: 1, perPage: 12, search: q || undefined }),
});


  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NotesClient initialQuery={q} />
    </HydrateClient>
  );
}
