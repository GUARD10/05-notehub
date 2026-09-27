import { useNotes } from "../../hooks/useNotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";

export default function App() {
  const {
    page,
    searchInput,
    debouncedSearch,
    isModalOpen,
    notes,
    totalPages,
    hasNotes,
    isInitialLoading,
    isRefreshing,
    isFetchingMore,
    isError,
    mutationError,
    isEmpty,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleCreateNote,
    handleDeleteNote,
    handleOpenModal,
    handleCloseModal,
  } = useNotes();

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.brand}>
          <span className={css.brandMark} aria-hidden="true" />
          <div>
            <p className={css.brandEyebrow}>Personal workspace</p>
            <h1 className={css.brandTitle}>NoteHub</h1>
          </div>
        </div>

        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 ? (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        ) : null}

        <button type="button" className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {mutationError && !isModalOpen ? (
          <ErrorMessage message="Could not save the change. Please try again." />
        ) : null}
        {isInitialLoading ? <Loader /> : null}
        {isError ? (
          <ErrorMessage message="Failed to load notes. Check your token and try again." />
        ) : null}
        {isEmpty ? (
          <section className={css.empty} aria-live="polite">
            <p className={css.emptyEyebrow}>No matches</p>
            <h2 className={css.emptyTitle}>Nothing here yet</h2>
            <p className={css.emptyText}>
              {debouncedSearch
                ? `No notes found for “${debouncedSearch}”. Try another keyword.`
                : "Create your first note to start filling this space."}
            </p>
          </section>
        ) : null}
        {hasNotes ? (
          <div className={isRefreshing ? css.listRefreshing : undefined}>
            <NoteList
              notes={notes}
              onDelete={handleDeleteNote}
              isDeleting={isDeleting}
            />
          </div>
        ) : null}
        {isFetchingMore ? (
          <p className={css.subtleStatus} aria-live="polite">
            Updating…
          </p>
        ) : null}
      </main>

      {isModalOpen ? (
        <Modal onClose={handleCloseModal}>
          <div className={css.modalHeader}>
            <p className={css.modalEyebrow}>New entry</p>
            <h2 className={css.modalTitle}>Create note</h2>
          </div>
          <NoteForm onSubmit={handleCreateNote} onCancel={handleCloseModal} />
          {mutationError ? (
            <ErrorMessage message="Could not create the note. Please try again." />
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}
