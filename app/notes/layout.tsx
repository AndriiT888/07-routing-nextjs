import type { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return <div className={css.container}>{children}</div>;
}