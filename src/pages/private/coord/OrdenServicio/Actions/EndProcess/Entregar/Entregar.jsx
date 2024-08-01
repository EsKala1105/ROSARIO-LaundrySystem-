/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";

import { NumberInput } from "@mantine/core";

import { ReactComponent as DeliveryPropio } from "../../../../../../../utils/img/Delivery/delivery-propio.svg";
import { ReactComponent as DeliveryPrivado } from "../../../../../../../utils/img/Delivery/delivery-privado.svg";

const Entregar = ({ setFieldValue, errors, touched, values }) => {
  const inputRef = useRef(null);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  useEffect(() => {
    if (shouldFocusInput) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  return (
    <>
      <fieldset className="content-movilidad">
        <legend className="legend-c-movilidad">
          &nbsp;&nbsp;
          <span className="accion">&nbsp;(GASTO POR ENVIO)</span>
          &nbsp;&nbsp;
        </legend>
        <div className="group-fieldset">
          <fieldset className="checkbox-sub-group">
            <legend className="checkbox-group-legend">
              &nbsp;&nbsp;PAGADO&nbsp;&nbsp;
            </legend>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input
                  type="radio"
                  className="checkbox-input"
                  name="tipoTrasporte"
                  value="Privado"
                  onClick={(e) => {
                    setFieldValue("tipoTrasporte", e.target.value);
                    setFieldValue("mDevolucion", "");
                    setShouldFocusInput(true);
                  }}
                />
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                    <DeliveryPrivado className="custom-icon" />
                  </span>
                  <span className="checkbox-label">Privado</span>
                </span>
              </label>
            </div>
          </fieldset>
          <fieldset className="checkbox-sub-group">
            <legend className="checkbox-group-legend">
              &nbsp;&nbsp;GRATIS&nbsp;&nbsp;
            </legend>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input
                  type="radio"
                  className="checkbox-input"
                  name="tipoTrasporte"
                  value="Propio"
                  onClick={(e) => {
                    setFieldValue("tipoTrasporte", e.target.value);
                    setFieldValue("mDevolucion", 0);
                    setShouldFocusInput(true);
                  }}
                />
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                    <DeliveryPropio className="custom-icon" />
                  </span>
                  <span className="checkbox-label">Propio</span>
                </span>
              </label>
            </div>
          </fieldset>
        </div>
        {errors.tipoDelivery && touched.tipoDelivery && (
          <div className="ico-req">
            <i className="fa-solid fa-circle-exclamation ">
              <div className="info-req" style={{ pointerEvents: "none" }}>
                <span>{errors.tipoDelivery}</span>
              </div>
            </i>
          </div>
        )}
      </fieldset>
      <div className="input-info-required">
        <NumberInput
          name="mDevolucion"
          value={values.mDevolucion}
          ref={inputRef}
          disabled={values.tipoTrasporte === "Propio" ? true : false}
          formatter={(value) =>
            `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
          }
          placeholder="Ingrese Monto"
          precision={2}
          step={0.05}
          min={0}
          hideControls={true}
          autoComplete="off"
          onChange={(value) => setFieldValue("mDevolucion", value)}
        />
        {errors.mDevolucion && touched.mDevolucion && (
          <div className="ico-req">
            <i className="fa-solid fa-circle-exclamation ">
              <div className="info-req" style={{ pointerEvents: "none" }}>
                <span>{errors.mDevolucion}</span>
              </div>
            </i>
          </div>
        )}
      </div>
    </>
  );
};

export default Entregar;
