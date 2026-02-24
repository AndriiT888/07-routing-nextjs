import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesByTagClient from "./NotesByTag.client";

const PER_PAGE = 12;

type TagParam = NoteTag | "all";

export default async function NotesByTagPage({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: { q?: string; page?: string };
}) {
  const activeTag = (params.slug?.[0] ?? "all") as TagParam;

  const q = searchParams?.q ?? "";
  const page = Number(searchParams?.page ?? "1");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, perPage: PER_PAGE, search: q, tag: activeTag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: q || undefined,
        tag: activeTag === "all" ? undefined : activeTag,
      }),
  });

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NotesByTagClient
        initialQuery={q}
        initialPage={page}
        tag={activeTag}
      />
    </HydrateClient>
  );
}