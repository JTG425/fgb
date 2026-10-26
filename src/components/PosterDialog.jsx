import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { FiX } from "react-icons/fi";

export default function PosterDialog({ children, onClose, labelledBy, className = "" }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  return createPortal(
    <dialog ref={ref} className={`poster-dialog ${className}`} aria-labelledby={labelledBy}
      onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
      onClick={(event) => { if (event.target === ref.current) closeRef.current(); }}>
      <div className="poster-dialog-inner">
        <button type="button" className="poster-dialog-close" aria-label="Close dialog" onClick={onClose}><FiX /></button>
        {children}
      </div>
    </dialog>, document.body,
  );
}
PosterDialog.propTypes = { children: PropTypes.node, onClose: PropTypes.func.isRequired, labelledBy: PropTypes.string.isRequired, className: PropTypes.string };
