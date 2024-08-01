/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./buttonSwitch.scss";
import { useState, useEffect } from "react";
const ButtonSwitch = ({ pago }) => {
  const [lastAnimation, setLastAnimation] = useState("LefToCenter");

  const getAnimationName = () => {
    if (pago === "Completo") {
      setLastAnimation("RightToCenter");
    } else if (pago === "Pendiente") {
      setLastAnimation("LefToCenter");
    } else {
      setLastAnimation(lastAnimation);
    }
  };

  useEffect(() => {
    getAnimationName();
  }, [pago]);

  return (
    <div className="switch-triple">
      <div className="radio-wrapper">
        <p className="correct">
          <i className="ion-checkmark-round"></i>
        </p>
        <p className="neutral-icon">
          <i className="ion-record"></i>
        </p>
        <p className="wrong">
          <i className="ion-close-round"></i>
        </p>
        <input
          type="radio"
          name="event"
          className="yes"
          checked={pago === "Pendiente"}
          readOnly
          id="radio-yes"
        />

        <label onClick={(e) => e.stopPropagation()} htmlFor="radio-yes"></label>

        <input
          type="radio"
          name="event"
          className={`neutral ${
            lastAnimation === "RightToCenter" ? "DC" : "IC"
          }`}
          checked={pago === "Incompleto"}
          readOnly
          id="radio-neutral"
        />
        <label
          onClick={(e) => e.stopPropagation()}
          htmlFor="radio-neutral"
        ></label>

        <input
          type="radio"
          name="event"
          className="no"
          checked={pago === "Completo"}
          readOnly
          id="radio-no"
        />
        <label onClick={(e) => e.stopPropagation()} htmlFor="radio-no"></label>
      </div>
    </div>
  );
};

export default ButtonSwitch;
