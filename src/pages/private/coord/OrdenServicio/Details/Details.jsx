/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  GetAnuladoId,
  GetDonadoId,
} from "../../../../../services/default.services";

import Nota from "./Nota/Nota";

import { PrivateRoutes, Roles } from "../../../../../models";
import "./details.scss";
import { useState } from "react";
import moment from "moment";
import { DateDetail_Hora } from "../../../../../utils/functions/dateCurrent/dateCurrent";
import {
  cLetter,
  formatThousandsSeparator,
  handleGetInfoPago,
} from "../../../../../utils/functions";

const Details = ({ IdCliente }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotas, setShowNotas] = useState(false);
  const [infoAnulado, setInfoAnulado] = useState();
  const [dateDonated, setDateDonated] = useState();
  const [statePago, setStatePago] = useState();

  const infoCliente = useSelector((state) =>
    state.orden.registered.find((item) => item._id === IdCliente)
  );
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);

  const handleDateLarge = (fecha) => {
    const fechaObjeto = moment(fecha);
    const fechaFormateada = fechaObjeto.format("dddd D [de] MMMM, YYYY");
    return fechaFormateada;
  };

  const handleHour = (hora) => {
    const hora12 = moment(hora, "HH:mm").format("h:mm A");
    return hora12;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (infoCliente.estadoPrenda === "anulado") {
        const infoAnulado = await GetAnuladoId(IdCliente);
        setInfoAnulado(infoAnulado);
      }
      if (infoCliente.estadoPrenda === "donado") {
        const fDonacion = await GetDonadoId(IdCliente);
        setDateDonated(fDonacion);
      }
    };
    fetchData();
  }, [infoCliente.Modalidad, infoCliente.estadoPrenda, IdCliente]);

  useEffect(() => {
    if (infoCliente) {
      setStatePago(
        handleGetInfoPago(infoCliente.ListPago, infoCliente.totalNeto)
      );
    }
  }, [infoCliente]);

  return (
    <div className="content-detail">
      <h1>Detalle - "{infoCliente.Nombre}"</h1>
      {showNotas === false ? (
        <div className="body-detail">
          {infoCliente.estadoPrenda === "anulado" && infoAnulado ? (
            <div className="anulado-mt">
              <h1>Anulado</h1>
              <textarea
                rows={5}
                value={`Motivo : ${infoAnulado.motivo}`}
                readOnly={true}
              />
              <span>
                {infoAnulado.fecha} - {infoAnulado.hora}
              </span>
            </div>
          ) : null}
          {infoCliente.estadoPrenda === "donado" && dateDonated ? (
            <div className="date-donacion">
              <div className="title">
                <span>Donado</span>
              </div>
              <div className="date">
                <span>
                  {handleDateLarge(dateDonated.fecha)} /{" "}
                  {handleHour(dateDonated.hora)}
                </span>
              </div>
            </div>
          ) : null}
          <table
            className={`tabla-service ${
              infoCliente?.descuento.modoDescuento === "Manual"
                ? ""
                : "show-dsc-m"
            }`}
          >
            <thead>
              <tr>
                <th>Cantidad</th>

                {infoCliente?.descuento.modoDescuento === "Manual" ? (
                  <th>Item + Descripcion</th>
                ) : (
                  <>
                    <th>Item</th>
                    <th> Descripcion</th>
                  </>
                )}

                {infoCliente?.descuento.modoDescuento === "Manual" ? (
                  <>
                    <th>Monto</th>
                    <th>Dsct</th>
                  </>
                ) : null}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {infoCliente?.Items.map((p, index) => (
                <tr key={`${p._id}${index}`}>
                  <td>{formatThousandsSeparator(p.cantidad)}</td>

                  {infoCliente?.descuento.modoDescuento === "Manual" ? (
                    <td>
                      <div className="cell-produc-descrip">
                        <span>{p.item}</span>
                        <div className="tADescription">
                          <div className="contentDes">
                            <div
                              id={`${index}-dsp`}
                              className="textarea-container"
                            >
                              <textarea
                                className="hide"
                                rows={5}
                                placeholder="..."
                                value={p.descripcion}
                                readOnly={true}
                              />
                              <button
                                type="button"
                                className="expand-button"
                                onClick={() => {
                                  const element = document.getElementById(
                                    `${index}-dsp`
                                  );

                                  if (element) {
                                    const hideElement =
                                      element.querySelector(".hide");
                                    const showElement =
                                      element.querySelector(".show");
                                    const iconElement =
                                      element.querySelector("#ico-action");

                                    if (hideElement) {
                                      hideElement.classList.replace(
                                        "hide",
                                        "show"
                                      );
                                      iconElement.classList.replace(
                                        "fa-chevron-down",
                                        "fa-chevron-up"
                                      );
                                    } else if (showElement) {
                                      showElement.classList.replace(
                                        "show",
                                        "hide"
                                      );
                                      iconElement.classList.replace(
                                        "fa-chevron-up",
                                        "fa-chevron-down"
                                      );
                                    }
                                  }
                                }}
                              >
                                <i
                                  id="ico-action"
                                  className="fa-solid fa-chevron-down"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td>{p.item}</td>
                      <td className="tADescription space-dsc">
                        <div className="contentDes">
                          <div
                            id={`${index}-dsp`}
                            className="textarea-container"
                          >
                            <textarea
                              className="hide"
                              rows={5}
                              placeholder="..."
                              value={p.descripcion}
                              readOnly={true}
                            />
                            <button
                              type="button"
                              className="expand-button"
                              onClick={() => {
                                const element = document.getElementById(
                                  `${index}-dsp`
                                );

                                if (element) {
                                  const hideElement =
                                    element.querySelector(".hide");
                                  const showElement =
                                    element.querySelector(".show");
                                  const iconElement =
                                    element.querySelector("#ico-action");

                                  if (hideElement) {
                                    hideElement.classList.replace(
                                      "hide",
                                      "show"
                                    );
                                    iconElement.classList.replace(
                                      "fa-chevron-down",
                                      "fa-chevron-up"
                                    );
                                  } else if (showElement) {
                                    showElement.classList.replace(
                                      "show",
                                      "hide"
                                    );
                                    iconElement.classList.replace(
                                      "fa-chevron-up",
                                      "fa-chevron-down"
                                    );
                                  }
                                }
                              }}
                            >
                              <i
                                id="ico-action"
                                className="fa-solid fa-chevron-down"
                              />
                            </button>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  {infoCliente?.descuento.modoDescuento === "Manual" ? (
                    <>
                      <td>{formatThousandsSeparator(p.monto)}</td>
                      <td>{formatThousandsSeparator(p.descuentoManual)}</td>
                      <td>{formatThousandsSeparator(p.total)}</td>
                    </>
                  ) : (
                    <td>{formatThousandsSeparator(p.monto)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="extras">
            {InfoUsuario.rol !== Roles.PERS &&
              infoCliente.estado === "registrado" &&
              infoCliente.estadoPrenda !== "anulado" &&
              infoCliente.estadoPrenda !== "donado" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/${infoCliente._id}`
                      );
                    }}
                  >
                    Imprimir Comprobante
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotas(true);
                    }}
                  >
                    Notas
                  </button>
                </>
              )}

            <table className="info-table">
              <tbody>
                {infoCliente.cargosExtras.impuesto.estado ? (
                  <tr>
                    <td>Factura :</td>
                    <td>
                      {formatThousandsSeparator(
                        infoCliente.cargosExtras.impuesto.importe
                      )}
                    </td>
                  </tr>
                ) : null}
                {infoCliente.descuento.estado &&
                infoCliente.descuento.monto > 0 ? (
                  <tr>
                    <td>Decuento :</td>
                    <td>
                      {formatThousandsSeparator(infoCliente.descuento.monto)}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td>Atendido Por :</td>
                  <td>{infoCliente.attendedBy.name.split(" ")[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="more-a">
            <h2>
              Total - {formatThousandsSeparator(infoCliente.totalNeto, true)}
            </h2>{" "}
          </div>
          <div className="list-pagos">
            <div className="title">Lista de Pagos</div>
            <ul>
              {infoCliente.ListPago.map((p, index) => (
                <li className="i-pago" key={index}>
                  {/* <span className="_id">{index + 1}</span> */}
                  <span className="_fecha">
                    {DateDetail_Hora(p.date.fecha, p.date.hora)}
                  </span>
                  <span className="_monto">
                    {formatThousandsSeparator(p.total, true)}
                  </span>
                  <span className="_metodopago">{cLetter(p.metodoPago)}</span>
                  <span>{p.infoUser.name}</span>
                  <span className="_ico">
                    {p.metodoPago === "Tarjeta" ? (
                      <i className="fa-solid fa-credit-card" />
                    ) : p.metodoPago === "Efectivo" ? (
                      <i className="fa-solid fa-sack-dollar" />
                    ) : (
                      <i className="fa-solid fa-money-bill-transfer" />
                    )}
                  </span>
                </li>
              ))}
              <div className="i-final">
                <span></span>
                <span className="if-estado"></span>
                <span className="if-monto">
                  <div>
                    <div className="l-info">
                      <span>Subtotal :</span>
                    </div>
                    <div>{formatThousandsSeparator(statePago?.pago, true)}</div>
                  </div>
                  <div>
                    <div className="l-info">
                      <span>Pago :</span>
                    </div>
                    <div> {statePago?.estado}</div>
                  </div>
                  {statePago?.estado !== "Completo" ? (
                    <div>
                      <div className="l-info">
                        <span>Falta :</span>
                      </div>
                      <div>
                        {formatThousandsSeparator(statePago?.falta, true)}
                      </div>
                    </div>
                  ) : null}
                </span>
                <span></span>
              </div>
            </ul>
          </div>
          <table className="info-table">
            <tbody>
              <tr>
                <td>Fecha Recepcion:</td>
                <td>
                  {infoCliente.dateRecepcion.fecha} /{" "}
                  {infoCliente.dateRecepcion.hora}
                </td>
              </tr>
              <tr>
                <td>Fecha Prevista:</td>
                <td>
                  {infoCliente.datePrevista.fecha} /{" "}
                  {infoCliente.datePrevista.hora}
                </td>
              </tr>

              {infoCliente.estadoPrenda !== "donado" ? (
                <tr>
                  <td>Fecha Entrega:</td>
                  <td>
                    {infoCliente.estadoPrenda === "entregado"
                      ? `${infoCliente.dateEntrega.fecha} / ${infoCliente.dateEntrega.hora}`
                      : "ENTREGA PENDIENTE"}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : (
        <Nota onReturn={() => setShowNotas(false)} infOrden={infoCliente} />
      )}
    </div>
  );
};

export default Details;
