/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  position: relative;
  margin: 10px 0;
  display: grid;
  gap: 5px;

  .title-switch {
    display: inline-block;
    font-weight: 500;
    word-break: break-word;
    cursor: default;
    -webkit-tap-highlight-color: transparent;
    font-size: 17px;
    color: #646464;
    padding: 0 10px;
  }

  .switches-body {
    position: relative;
    display: flex;
    padding: 5px 0;
    position: relative;
    background: ${(props) => props.$color_off};
    line-height: 2rem;
    border-radius: 3rem;
    width: max-content;

    input {
      visibility: hidden;
      position: absolute;
      top: 0;
    }

    label {
      //width: 50%;
      padding: 0 20px;
      margin: 0;
      font-size: 1em;
      text-align: center;
      cursor: pointer;
      color: ${(props) => props.$color_on};
    }

    .switch-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      z-index: 3;
      transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);

      .switch {
        border-radius: 3rem;
        background: ${(props) => props.$color_on};
        height: 100%;
        margin: auto;
        width: 101%;
        border: solid 1px silver;

        div {
          width: 100%;
          opacity: 0;
          color: ${(props) => props.$color_off};
          transition: opacity 0.2s cubic-bezier(0.77, 0, 0.175, 1) 0.125s;
          will-change: opacity;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    input:nth-of-type(1):checked ~ .switch-wrapper {
      transform: translateX(0%);
    }

    input:nth-of-type(2):checked ~ .switch-wrapper {
      transform: translateX(100%);
    }

    input:nth-of-type(1):checked ~ .switch-wrapper .switch div:nth-of-type(1) {
      opacity: 1;
    }

    input:nth-of-type(2):checked ~ .switch-wrapper .switch div:nth-of-type(2) {
      opacity: 1;
    }
  }
`;

const SwitchModel = ({
  title,
  onSwitch,
  offSwitch,
  name,
  defaultValue,
  onChange,
  colorBackground,
  colorSelected,
  disabled,
}) => {
  const cOn = colorSelected ? colorSelected : '#fff';
  const cOff = colorBackground ? colorBackground : '#5b81ea';

  const [isChecked, setIsChecked] = useState(defaultValue);

  // Utiliza useEffect para observar cambios en defaultValue
  useEffect(() => {
    // Cuando defaultValue cambie, actualiza el estado isChecked
    setIsChecked(defaultValue);
  }, [defaultValue]);

  const handleChange = () => {
    if (!disabled) {
      const state = !isChecked;
      setIsChecked(state);
      onChange(state);
    }
  };

  return (
    <SwitchContainer $color_on={cOn} $color_off={cOff}>
      <label className="title-switch">{title}</label>
      <div className="switches-body">
        <input
          type="radio"
          id={`${name}-off`}
          name={name}
          value={offSwitch}
          checked={isChecked === false}
          onChange={handleChange}
          disabled={disabled}
        />
        <label id={`${name}-off`} htmlFor={`${name}-off`} style={{ minWidth: `${offSwitch.length}ch` }}>
          {offSwitch}
        </label>
        <input
          type="radio"
          id={`${name}-on`}
          name={name}
          value={onSwitch}
          checked={isChecked === true}
          onChange={handleChange}
          disabled={disabled}
        />
        <label id={`${name}-on`} htmlFor={`${name}-on`} style={{ minWidth: `${onSwitch.length}ch` }}>
          {onSwitch}
        </label>
        <div className="switch-wrapper" style={{ minWidth: `${Math.max(offSwitch.length, onSwitch.length) + 1}ch` }}>
          <div className="switch">
            <div>{offSwitch}</div>
            <div>{onSwitch}</div>
          </div>
        </div>
      </div>
    </SwitchContainer>
  );
};

export default SwitchModel;
