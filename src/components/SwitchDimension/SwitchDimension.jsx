/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

const SwitchStyle = styled.div`
  width: max-content;
  fieldset {
    margin: 0;
    padding: ${(props) => (props.$title ? "7px 0" : "0")};
    padding-bottom: ${(props) => (props.$title ? "17px" : "0")};
    display: grid;
    border: none;
    background-color: #fff;

    legend {
      margin-bottom: 5px;
      width: 100%;
      float: left;
      font-size: 18px;
      font-weight: 500;
      color: #535252;
    }

    .toggle {
      box-sizing: border-box;
      font-size: 0;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: stretch;

      input {
        display: none; // Ocultar los inputs para que no sean clickeables
      }

      label {
        margin: 0;
        // padding: 0.75rem 2rem;
        padding: 0.75rem 1.3rem;
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        border: solid 1px #ddd;
        background-color: #fff;
        font-size: 1rem;
        line-height: 140%;
        font-weight: 600;
        text-align: center;
        cursor: pointer; // Cambiar el cursor a pointer para indicar que es clickeable
        &:first-of-type {
          border-radius: 6px 0 0 6px;
          border-right: none;
        }
        &:last-of-type {
          border-radius: 0 6px 6px 0;
          border-left: none;
        }
      }

      input:checked + label {
        // Cambiar el estilo del label cuando el input está seleccionado
        background-color: ${(props) => props.$color_on};
        color: #fff;
        box-shadow: 0 0 10px ${(props) => `${props.$color_on}80`};
        border-color: ${(props) => props.$color_on};
        z-index: 1;
      }
    }
  }
`;

const SwtichDimension = ({
  title,
  onSwitch,
  offSwitch,
  name,
  defaultValue,
  colorOn,
  colorOff,
  disabled,
  handleChange,
}) => {
  const cOn = colorOn ? colorOn : "#5b81ea";
  const cOff = colorOff ? colorOff : "#fff";

  const [isChecked, setIsChecked] = useState(defaultValue);

  // Utiliza useEffect para observar cambios en defaultValue
  useEffect(() => {
    // Cuando defaultValue cambie, actualiza el estado isChecked
    setIsChecked(defaultValue);
  }, [defaultValue]);

  return (
    <SwitchStyle
      $color_on={cOn}
      $color_off={cOff}
      $title={title ? true : false}
    >
      <fieldset>
        {title ? <legend>{title}</legend> : null}
        <div className="toggle">
          <input
            type="radio"
            name={name}
            value={onSwitch}
            id={`${name}-on`}
            checked={isChecked === true}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
          />
          <label htmlFor={`${name}-on`}>{onSwitch}</label>
          <input
            type="radio"
            name={name}
            value={offSwitch}
            id={`${name}-off`}
            checked={isChecked === false}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
          />
          <label htmlFor={`${name}-off`}>{offSwitch}</label>
        </div>
      </fieldset>
    </SwitchStyle>
  );
};

export default SwtichDimension;
