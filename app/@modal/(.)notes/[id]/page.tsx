import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreview.client";
import ModalClient from "./Modal.client";

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
      <ModalClient>
        <NotePreviewClient id={id} />
      </ModalClient>
    </HydrateClient>
  );
}