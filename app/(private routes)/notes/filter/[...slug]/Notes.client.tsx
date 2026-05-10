"use client";
import { useState } from "react";
import css from "./Notes.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { Tag } from "@/types/note";
import { useRouter } from "next/navigation";

interface NotesClientProps {
  tag?: Tag;
}

function NotesClient({ tag }: NotesClientProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["Notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleChange = useDebouncedCallback((value) => {
    setSearch(value);
    setPage(1);
  }, 300);

  function onBtnClick() {
    router.push("/notes/action/create");
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} setSearch={handleChange} />
        {(data?.totalPages || 0) > 1 && (
          <Pagination
            totalPages={data?.totalPages || 0}
            setPage={setPage}
            page={page}
          />
        )}
        {
          <button className={css.button} onClick={onBtnClick}>
            Create note +
          </button>
        }
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
  );
}

export default NotesClient;
