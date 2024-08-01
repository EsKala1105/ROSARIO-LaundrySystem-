/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import moment from "moment";
import React from "react";
import Pet from "../../../utils/img/Promocion/pet.jpg";
import "./cupon.scss";

const Cupon = ({ infoPromo }) => {
  const calcularFechaFutura = (numeroDeDias) => {
    const fechaActual = moment();
    const nuevaFecha = fechaActual.clone().add(numeroDeDias, "days");
    return nuevaFecha.format("D [de] MMMM[, del] YYYY");
  };

  return (
    <div className="cupon-body">
      <div className="info-promo">
        <div>
          <h1>PROMOCION:</h1>
          <h2 style={{ fontSize: "0.8em", textAlign: "justify" }}>
            {infoPromo?.descripcion}
          </h2>
          <h2 className="cod-i">codigo: {infoPromo?.codigoCupon}</h2>
        </div>
        <div>
          <img src={Pet} alt="" />
        </div>
      </div>
      <div className="notice">
        <span>CANGEALO EN TU PROXIMA ORDEN</span>
      </div>
      <h2 className="vigencia" style={{ float: "right", fontSize: "0.9em" }}>
        Vencimiento : {calcularFechaFutura(infoPromo?.vigencia)}
      </h2>
    </div>
  );
};

export default Cupon;
