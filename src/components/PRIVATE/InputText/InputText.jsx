/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './inputText.scss';

const InputText = ({ handleChange, handleBlur, valueName, name, text, tabI, aFoc, disabled, valid }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!valueName;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlurInternal = (e) => {
    setIsFocused(hasValue);
    handleBlur(e);
  };

  const handleInputChange = (e) => {
    handleChange(e);
  };

  return (
    <div className={`input-text-my ${isFocused ? 'active' : ''}`}>
      <input
        name={name}
        type="text"
        tabIndex={tabI}
        autoComplete="off"
        autoFocus={aFoc}
        onChange={handleInputChange}
        onBlur={handleBlurInternal}
        onFocus={handleFocus}
        value={valueName}
        className={`input ${hasValue ? 'has-value' : ''}`}
        disabled={disabled}
      />
      {valid?.errors ? (
        <div className="ico-req">
          <i className="fa-solid fa-circle-exclamation ">
            <div className="info-req" style={{ pointerEvents: 'none' }}>
              <span>{valid.req}</span>
            </div>
          </i>
        </div>
      ) : null}
      <div className="underline" />
      <label htmlFor={name} className={`lbl-nombre ${hasValue ? 'active' : ''}`}>
        {text}
      </label>
    </div>
  );
};

export default InputText;
