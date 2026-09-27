import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NewNote, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

const NOTE_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string().oneOf(NOTE_TAGS, "Invalid tag").required("Tag is required"),
});

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onSubmit: (values: NewNote) => Promise<void>;
  onCancel: () => void;
}

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const handleSubmit = async (
    values: NewNote,
    helpers: FormikHelpers<NewNote>,
  ): Promise<void> => {
    try {
      await onSubmit(values);
      helpers.resetForm();
    } catch {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
              placeholder="My new note"
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              placeholder="Write something useful…"
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {NOTE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
