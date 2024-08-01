import React, { useState } from 'react';
import './botonModel.scss';

const BotonModel = ({ name, listenClick, activator, tabI, disabled }) => {
  const [buttonState, setButtonState] = useState(false);

  const handleStateDelivery = (state) => {
    setButtonState(state);
    listenClick(state);
  };

  return activator === true ? (
    <button
      type="button"
      tabIndex={tabI}
      className={`btn-model ${buttonState ? 'clicked' : 'unclicked'}`}
      disabled={disabled}
      onClick={() => handleStateDelivery(!buttonState)}
    >
      {buttonState === true ? name : `No ${name}`}
    </button>
  ) : (
    <button tabIndex={tabI} type="button" disabled={disabled} className="btn-model" onClick={listenClick}>
      {name}
    </button>
  );
};

export default BotonModel;
