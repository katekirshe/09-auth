import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Tag } from "@/types/note";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag =
    slug[0] === "all"
      ? undefined
      : ["Meeting", "Personal", "Shopping", "Todo", "Work"].includes(slug[0])
        ? (slug[0] as Tag)
        : undefined;
  return {
    title: `${tag} Notes`,
    description: `Filtered ${tag} Notes`,
    openGraph: {
      title: `${tag} Notes`,
      description: `${tag} Notes - filtered by name`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag} Notes`,
        },
      ],
    },
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const tag =
    slug[0] === "all"
      ? undefined
      : ["Meeting", "Personal", "Shopping", "Todo", "Work"].includes(slug[0])
        ? (slug[0] as Tag)
        : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, search: "", tag: tag as Tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
