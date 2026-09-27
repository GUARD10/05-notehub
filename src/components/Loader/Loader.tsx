import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.wrap} role="status" aria-live="polite">
      <span className={css.spinner} aria-hidden="true" />
      <p className={css.text}>Loading notes…</p>
    </div>
  );
}
