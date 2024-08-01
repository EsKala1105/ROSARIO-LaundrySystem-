/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./infoPago.scss";
import ButtonSwitch from "../../MetodoPago/ButtonSwitch/ButtonSwitch";
import { ingresoDigital, simboloMoneda } from "../../../../services/global";

import Tranferencia from "../../../../utils/img/OrdenServicio/Transferencia.png";
import Efectivo from "../../../../utils/img/OrdenServicio/dinero.png";
import Tarjeta from "../../../../utils/img/OrdenServicio/card.png";
import { useEffect } from "react";
import { handleGetInfoPago } from "../../../../utils/functions";

const InfoPago = ({
  currentPago,
  openModalMetodoPago,
  paso,
  descripcion,
  values,
}) => {
  const [estadoPago, setEstadoPago] = useState();

  useEffect(() => {
    const listPago = currentPago ? [currentPago] : [];
    const iPago = handleGetInfoPago(listPago, values.totalNeto);
    setEstadoPago(iPago);
  }, [currentPago]);

  return (
    <div className="info-pago">
      <div className="title">
        <h1>PASO {paso}</h1>
        <h2>{descripcion}</h2>
      </div>
      <div className="body">
        <div className="f-Pay">
          <div className="content-sb">
            <div className="input-pay ">
              <label htmlFor="">Pago :</label>
              <button
                className="btn-switch"
                type="button"
                onClick={() => openModalMetodoPago()}
              >
                <ButtonSwitch pago={estadoPago?.estado} />
              </button>
            </div>
            {currentPago ? (
              <img
                tabIndex="-1"
                className={
                  currentPago.metodoPago === "Efectivo"
                    ? "ico-efect"
                    : ingresoDigital.includes(currentPago?.metodoPago)
                    ? "ico-tranf"
                    : "ico-card"
                }
                src={
                  currentPago.metodoPago === "Efectivo"
                    ? Efectivo
                    : ingresoDigital.includes(currentPago?.metodoPago)
                    ? Tranferencia
                    : Tarjeta
                }
                alt=""
              />
            ) : null}
          </div>
          {currentPago ? (
            <div className="estado-pago">{`${currentPago.metodoPago} ${simboloMoneda}${currentPago.total} : ${estadoPago?.estado}`}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfoPago;
