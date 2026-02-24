import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import { fetchNotes } from "@/lib/api";
import NotesByTagClient from "./NotesByTag.client";

const PER_PAGE = 12;

export default async function NotesByTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag?: string[] }>;
  searchParams?: { q?: string; page?: string };
}) {
  const { tag } = await params;

  const activeTag = tag?.[0] ?? "all";
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
        tag: activeTag === "all" ? undefined : (activeTag as any), // нижче покажу як без any
      }),
  });

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NotesByTagClient initialQuery={q} initialPage={page} tag={activeTag} />
    </HydrateClient>
  );
}