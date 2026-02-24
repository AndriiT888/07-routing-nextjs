import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import NoteDetailsClient from "./NoteDetails.client";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrateClient>
  );
}