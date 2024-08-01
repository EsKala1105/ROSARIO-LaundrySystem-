/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./infoPuntos.scss";
import Coins from "../../../../utils/img/Puntos/coins.png";
import moment from "moment";
import { formatThousandsSeparator } from "../../../../utils/functions";

const InfoPuntos = ({ iCliente }) => {
  return (
    <div className="info-puntos">
      <div className="head-title">
        <div className="title">
          <div className="img-insignia">
            <img src={Coins} alt="" />
          </div>
          <h1 className="title">Puntos Acumulados</h1>
        </div>
        <div className="bt-cli">
          <div className="data">
            <table className="info-table">
              <tbody>
                <tr>
                  <td>DOCUMENTO :</td>
                  <td>{iCliente?.dni}</td>
                </tr>
              </tbody>
            </table>
            <div className="info-extensa">
              <span className="input">NOMBRE</span>
              <span className="dato">{iCliente?.nombre}</span>
            </div>
            <div className="info-extensa">
              <span className="input">DIRECCION</span>
              <span className="dato">{iCliente?.direccion}</span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="list-puntos">
        {iCliente?.infoScore.map((row, index) => (
          <div
            key={index}
            className="card-puntos"
            style={{
              border: `1px solid  ${row.score > 0 ? "#59b78a" : "#ff8383"}`,
            }}
          >
            <div className="num-date">
              <div
                className="num"
                style={{
                  background: `${row.score > 0 ? "#59b78a" : "#ff8383"}`,
                }}
              >
                {index + 1}
              </div>
              <div className="date">
                {moment(row.dateService.fecha).format("DD [de] MMMM, YYYY")}
              </div>
            </div>
            <div className="line-data">
              <span
                style={{
                  color: `${row.score > 0 ? "#59b78a" : "#ff8383"}`,
                }}
              >
                Orden de Servicio :
              </span>
              <span>N° {row.codigo}</span>
            </div>
            <div className="line-data">
              <span
                style={{
                  color: `${row.score > 0 ? "#59b78a" : "#ff8383"}`,
                }}
              >
                Puntos {row.score >= 0 ? "Ganados" : "Usados"} :
              </span>
              <span
                style={{
                  color: `${row.score > 0 ? "#59b78a" : "#ff8383"}`,
                }}
              >
                {formatThousandsSeparator(row.score)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="footer-promo">
        <div className="total-point">
          <label htmlFor="">Total de Puntos</label>
          <span>{formatThousandsSeparator(iCliente?.scoreTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoPuntos;
