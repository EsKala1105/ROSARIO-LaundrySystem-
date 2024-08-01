/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./infoPromociones.scss";
import { TextInput } from "@mantine/core";
import { formatThousandsSeparator } from "../../../../utils/functions";

const InfoPromociones = ({ values, changeValue }) => {
  return (
    <div className="info-promocion">
      <div className="head-title">
        <h1>Promociones en Uso</h1>
      </div>
      <hr />
      <div className="list-promociones">
        {values.descuento.info ? (
          <div className="card-promo">
            <button
              className="delete-promo"
              type="button"
              onClick={() => {
                changeValue("descuento.info", null);
                changeValue("descuento.monto", 0);
                changeValue("descuento", {
                  estado: false,
                  modoDescuento: "Ninguno",
                  info: null,
                  monto: 0,
                });
              }}
            >
              X
            </button>
            <span>Promocion :</span>
            <p>{values.descuento.info.descripcion}</p>
            <div className="extra-info">
              <TextInput
                className="input-info"
                label="Codigo :"
                value={values.descuento.info.codigoCupon}
                readOnly
              />
              <TextInput
                className="input-info"
                label="Descuento :"
                value={formatThousandsSeparator(values.descuento.monto)}
                readOnly
              />
            </div>
          </div>
        ) : null}
      </div>
      {/* <hr />
      <div className="footer-promo">
        <div className="total-point">
          <label htmlFor="">Total de Descuento</label>
          <span>{formatThousandsSeparator(infoPromocion.descuento, true)}</span>
        </div>
      </div> */}
    </div>
  );
};

export default InfoPromociones;
