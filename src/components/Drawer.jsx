import { useEffect, useRef } from "react";
import Tabs from "./Tabs.jsx";

// Panel lateral izquierdo con Snacks, Reemplazos y Tu objetivo
export default function Drawer({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  return (
    <>
      <div className={"drawer-bg" + (open ? " on" : "")} onClick={onClose} aria-hidden="true"></div>
      <aside className={"drawer" + (open ? " on" : "")} aria-label="Snacks, reemplazos y objetivo" aria-hidden={!open} inert={!open}>
        <div className="drawer-head">
          <button ref={closeRef} className="icon-btn" type="button" aria-label="Cerrar" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <Tabs />
      </aside>
    </>
  );
}

export function MenuButton({ open, onClick }) {
  return (
    <button className="icon-btn menu-btn" type="button" aria-label="Snacks, reemplazos y objetivo" aria-expanded={open} onClick={onClick}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
    </button>
  );
}
