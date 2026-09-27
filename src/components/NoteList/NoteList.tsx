import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  isDeleting?: boolean;
}

export default function NoteList({
  notes,
  onDelete,
  isDeleting = false,
}: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              className={css.button}
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
