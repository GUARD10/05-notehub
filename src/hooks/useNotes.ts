import { useCallback, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { createNote, deleteNote, fetchNotes } from "../services/noteService";
import type { NewNote } from "../types/note";

export function useNotes() {
  const [searchInput, setSearchInput] = useState("");
  const [search] = useDebounce(searchInput, 300);
  const [pagination, setPagination] = useState({ search: "", page: 1 });
  const page = pagination.search === search ? pagination.page : 1;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["notes", search, page],
    queryFn: ({ signal }) => fetchNotes(page, search, signal),
    placeholderData: keepPreviousData,
    retry: 1,
  });
  const creation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setPagination({ search, page: 1 });
      await client.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });
  const deletion = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (query.data?.notes.length === 1 && page > 1) {
        setPagination({ search, page: page - 1 });
      }
      await client.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const notes = query.data?.notes ?? [];

  return {
    page,
    searchInput,
    debouncedSearch: search,
    isModalOpen,
    notes,
    totalPages: query.data?.totalPages ?? 0,
    hasNotes: notes.length > 0,
    isInitialLoading: query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isFetchingMore: query.isFetching && !query.isPending,
    isError: query.isError,
    mutationError: creation.isError || deletion.isError,
    isEmpty: query.isSuccess && notes.length === 0,
    isDeleting: deletion.isPending,
    handleSearchChange: (value: string) => {
      setSearchInput(value);
      setPagination({ search: value, page: 1 });
    },
    handlePageChange: (nextPage: number) =>
      setPagination({ search, page: nextPage }),
    handleCreateNote: async (values: NewNote) => {
      await creation.mutateAsync(values);
    },
    handleDeleteNote: (id: string) => deletion.mutate(id),
    handleOpenModal: () => {
      creation.reset();
      setIsModalOpen(true);
    },
    handleCloseModal,
  };
}
