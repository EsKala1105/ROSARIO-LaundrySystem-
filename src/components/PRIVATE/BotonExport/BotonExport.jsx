/* eslint-disable react/prop-types */
import { useState } from "react";
import "./botonExport.scss";

const BotonExport = ({ onExport }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onExport();
      }, 2400);
    }
  };
  return (
    <button
      className={`button_wrapper ${loading ? "loading" : ""}`}
      onClick={handleExport}
    >
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.75"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
          />
        </svg>
      </div>
    </button>
  );
};

export default BotonExport;
