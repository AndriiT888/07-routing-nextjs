import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreview.client";

export default async function NoteModalPage({
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
      <NotePreviewClient id={id} />
    </HydrateClient>
  );
}