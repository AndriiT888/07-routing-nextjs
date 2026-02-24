"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./ModalCloseButton.module.css";

export interface ModalClientProps {
  children: React.ReactNode;
}

export default function ModalClient({ children }: ModalClientProps) {
  const router = useRouter();

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <div className={css.wrap}>
        <button type="button" className={css.closeButton} onClick={handleClose}>
          Close
        </button>
        {children}
      </div>
    </Modal>
  );
}