/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./metodoPago.scss";
import * as Yup from "yup";
import { ingresoDigital } from "../../../services/global";
import { Button, NumberInput } from "@mantine/core";
import { useFormik } from "formik";
import { formatThousandsSeparator } from "../../../utils/functions";
import { useEffect } from "react";

const MetodoPago = ({
  currentPago,
  onConfirm,
  onCancel,
  onClose,
  totalToPay,
}) => {
  const validationSchema = Yup.object().shape({
    metodoPago: Yup.string().required("Campo obligatorio"),
    total: Yup.string().required("Campo obligatorio"),
  });

  const formMetodoPago = useFormik({
    initialValues: {
      metodoPago: "",
      total: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onConfirm(values);
      onClose();
    },
  });

  const handleOptionChange = (event) => {
    const mPago = event.target.value;
    formMetodoPago.setFieldValue("metodoPago", mPago);
  };

  const validIco = (mensaje) => {
    return (
      <div className="ico-req">
        <i className="fa-solid fa-circle-exclamation ">
          <div className="info-req" style={{ pointerEvents: "none" }}>
            <span>{mensaje}</span>
          </div>
        </i>
      </div>
    );
  };

  useEffect(() => {
    if (currentPago) {
      formMetodoPago.setFieldValue("metodoPago", currentPago.metodoPago);
      formMetodoPago.setFieldValue("total", currentPago.total);
    }
  }, [currentPago, totalToPay]);

  return (
    <form onSubmit={formMetodoPago.handleSubmit} className="content-metdo-pago">
      <fieldset className="checkbox-group">
        <legend className="checkbox-group-legend">Escoja Metodo de Pago</legend>
        <div className="checkbox">
          <label className="checkbox-wrapper">
            <input
              type="radio"
              className="checkbox-input"
              name="metodoPago"
              value="Efectivo"
              checked={formMetodoPago.values.metodoPago === "Efectivo"}
              onChange={(e) => handleOptionChange(e)}
            />
            <span className="checkbox-tile">
              <span className="checkbox-icon"></span>
              <span className="checkbox-label">Efectivo</span>
            </span>
          </label>
        </div>
        {ingresoDigital.map((metodo) => (
          <div key={metodo} className="checkbox">
            <label className="checkbox-wrapper">
              <input
                type="radio"
                className="checkbox-input"
                name="metodoPago"
                value={metodo}
                checked={formMetodoPago.values.metodoPago === metodo}
                onChange={(e) => handleOptionChange(e)}
              />
              <span className="checkbox-tile">
                <span className="checkbox-icon">
                  {/* <Moto className="custom-icon" /> */}
                </span>
                <span className="checkbox-label">{metodo}</span>
              </span>
            </label>
          </div>
        ))}
        <div className="checkbox">
          <label className="checkbox-wrapper">
            <input
              type="radio"
              className="checkbox-input"
              name="metodoPago"
              value="Tarjeta"
              checked={formMetodoPago.values.metodoPago === "Tarjeta"}
              onChange={(e) => handleOptionChange(e)}
            />
            <span className="checkbox-tile">
              <span className="checkbox-icon"></span>
              <span className="checkbox-label">Tarjeta</span>
            </span>
          </label>
        </div>
        {formMetodoPago.errors.metodoPago &&
          formMetodoPago.touched.metodoPago &&
          validIco(formMetodoPago.errors.metodoPago)}
      </fieldset>
      <div className="info-pay">
        <div className="input-monto">
          <NumberInput
            name="total"
            className="montoToPay"
            label={`Monto de Pago : Max(${formatThousandsSeparator(
              totalToPay
            )})`}
            placeholder="Ingrese Monto"
            precision={2}
            value={formMetodoPago.values.total}
            formatter={(value) => formatThousandsSeparator(value)}
            onChange={(value) => formMetodoPago.setFieldValue("total", value)}
            min={0}
            step={1}
            max={+totalToPay}
            hideControls
            autoComplete="off"
          />
          {formMetodoPago.errors.total &&
            formMetodoPago.touched.total &&
            validIco(formMetodoPago.errors.total)}
        </div>
        <div className="action">
          <Button
            type="submit"
            className="btn-save"
            variant="gradient"
            gradient={
              currentPago
                ? { from: "#11998e", to: "#38ef7d" }
                : { from: "indigo", to: "cyan" }
            }
          >
            {totalToPay === 0 ? "Guardar" : currentPago ? "Cambiar" : "Guardar"}
          </Button>

          {currentPago ? (
            <Button
              type="button"
              onClick={() => {
                onCancel();
                onClose();
              }}
              className="btn-save"
              variant="gradient"
              gradient={{ from: "#ED213A", to: "#93291E" }}
            >
              No Pagar
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default MetodoPago;
