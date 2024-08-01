/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent as Close } from "./Cruzar.svg";

import "./portal.scss";

const Portal = ({ children, onClose }) => {
  const portalRoot = document.getElementById("portal-root");
  const [mounted, setMounted] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        startClosing();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      setMounted(true);
      setTimeout(() => {
        setIsAppearing(true); // Inicia la transición de aparición después de montar
      }, 0);
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const startClosing = () => {
    setIsAppearing(false); // Inicia la transición de salida
    setTimeout(() => {
      setMounted(false);
      onClose(false);
    }, 500); // Asegúrate de que este tiempo coincida con la duración de la transición en tu CSS
  };

  if (mounted && portalRoot) {
    const handleClose = () => {
      startClosing();
    };

    const backdropClass = isAppearing
      ? "portal-backdrop portal-enter-active"
      : "portal-backdrop";

    return ReactDOM.createPortal(
      <div className={backdropClass}>
        <div className="portal-container">
          <Close className="close-button" onClick={handleClose} />
          {children}
        </div>
      </div>,
      portalRoot
    );
  } else {
    return null;
  }
};

export default Portal;
