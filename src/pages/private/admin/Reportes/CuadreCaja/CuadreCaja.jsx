/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./cuadreCaja.scss";
import axios from "axios";
import Portal from "../../../../../components/PRIVATE/Portal/Portal";
import { Fragment } from "react";
import { formatThousandsSeparator } from "../../../../../utils/functions/formatNumber/formatNumber";
import { ingresoDigital, simboloMoneda } from "../../../../../services/global";
import ExcelJS from "exceljs";
import { cLetter } from "../../../../../utils/functions";
import moment from "moment";
import { Button } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import { useSelector } from "react-redux";
import { Roles } from "../../../../../models";

const CuadreCaja = () => {
  const [infoCuadres, setInfoCuadres] = useState([]);
  const [pMontosNS, setPMontosNS] = useState(false);
  const [pJustificacion, setPJustificacion] = useState(false);
  const [fSelected, setFSelected] = useState();
  const [fSJustificacion, setFSJustificacion] = useState([]);

  const [valueFinalINS, setValueFinalINS] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [datePrincipal, setDatePrincipal] = useState(new Date());

  const [onLoading, setOnLoading] = useState(true);

  const InfoUsuario = useSelector((store) => store.user.infoUsuario);

  const colorBorder = "#14c697";

  useEffect(() => {
    setInfoCuadres([]);
    const fechaFormateada = moment(datePrincipal).format("YYYY-MM-DD");
    handleGetReporteCuadres(fechaFormateada);
    setOnLoading(true);
  }, [datePrincipal]);

  const handleGetReporteCuadres = async (date) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-list-cuadre/mensual/${date}`
      );
      setInfoCuadres(response.data);
      setOnLoading(false);
    } catch (error) {
      console.error(`Error al obtener los cuadres: ${error.message}`);
    }
  };

  const sumarTotales = (items, key) => {
    const total = items.reduce((acc, item) => acc + Number(item[key]), 0);
    return total ? total.toFixed(2) : "";
  };

  const handleShowInfoDate = (infoFecha) => {
    const { fecha, paysNCuadrados, gastoGeneral } = infoFecha;

    let MontosNC = [];
    paysNCuadrados.map((pay) => {
      MontosNC.push({
        _id: pay._id,
        user: pay.infoUser?.name,
        monto: pay.total,
        decripcion: `Orden N° ${pay.orden} de ${pay.nombre}, (${pay.Modalidad})`,
        tipo: "ingreso",
        hora: pay.date.hora,
      });
    });

    gastoGeneral.map((spend) => {
      MontosNC.push({
        _id: spend._id,
        user: spend.infoUser?.name,
        monto: spend.monto,
        decripcion: `Motivo : ${spend.motivo}`,
        tipo: "gasto",
        hora: spend.date.hora,
      });
    });

    handleTotalMontosNoSaved(MontosNC);
    setFSelected({ fecha, MontosNC });
    setPMontosNS(true);
  };

  const handleTotalMontosNoSaved = (info) => {
    // Inicializamos el total como 0
    let total = 0;

    // Recorremos la información para calcular el total
    info.forEach((item) => {
      // Convertimos el monto a número
      const monto = parseFloat(item.monto);

      // Sumamos al total si es un ingreso
      // Restamos al total si es un gasto
      total += item.tipo === "ingreso" ? monto : -monto;
    });

    // Determinamos el tipo de transacción
    const tipo = total >= 0 ? "ingreso" : "gasto";

    // Tomamos el valor absoluto del total para obtener el monto
    const montoAbsoluto = Math.abs(total);

    // Creamos el objeto de respuesta
    const respuesta = {
      tipo: tipo,
      total: montoAbsoluto,
    };

    setValueFinalINS(respuesta);
  };

  const handleMouseOver = (fecha) => {
    document
      .querySelectorAll(`tr[data-fecha="${fecha}"]`)
      .forEach((element) => {
        element.classList.add("highlighted-row");
      });
  };

  const handleMouseOut = (fecha) => {
    document
      .querySelectorAll(`tr[data-fecha="${fecha}"]`)
      .forEach((element) => {
        element.classList.remove("highlighted-row");
      });
  };

  function sumarValores(objeto) {
    console.log(objeto);
    let suma = 0;
    Object.keys(objeto).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(objeto, key)) {
        suma += parseFloat(objeto[key]);
      }
    });
    return suma;
  }

  const exportToExcel = async () => {
    console.log("exportado");
    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet("Prueba");

    // // Establecer estilo de celda para la cabecera
    // const headerStyle = {
    //   font: { bold: true, size: 16 },
    //   fill: { type: "pattern", pattern: "solid", fgColor: { argb: "CCCCCC" } },
    // };

    // // Definir las columnas
    // worksheet.columns = [
    //   { header: "Nombre", key: "nombre", width: 15 },
    //   { header: "Efectivo", key: "efectivo", width: 30 },
    //   { header: "Descripción", key: "descripcion", width: 30 },
    //   { header: "Monto", key: "monto", width: 15 },
    // ];

    // // Combinar celdas para la cabecera
    // worksheet.mergeCells("B1:C1");
    // worksheet.getCell("B1").value = "Efectivo";
    // worksheet.getCell("B1").style = headerStyle;

    // // Agregar datos
    // PruebaData.forEach((persona) => {
    //   const nombre = persona.nombre;
    //   persona.Efectivo.forEach((pago, index) => {
    //     const row = {
    //       nombre: index === 0 ? nombre : "",
    //       descripcion: pago.descripcion,
    //       monto: pago.monto,
    //     };
    //     worksheet.addRow(row);
    //   });
    //   persona.Yape.forEach((pago) => {
    //     const row = {
    //       nombre: "",
    //       descripcion: pago.descripcion,
    //       monto: pago.monto,
    //     };
    //     worksheet.addRow(row);
    //   });
    //   persona.Tarjeta.forEach((pago) => {
    //     const row = {
    //       nombre: "",
    //       descripcion: pago.descripcion,
    //       monto: pago.monto,
    //     };
    //     worksheet.addRow(row);
    //   });
    // });

    // // Generar el archivo Excel
    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], {
    //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // });
    // const url = window.URL.createObjectURL(blob);

    // // Crear un enlace temporal y simular clic para descargar
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "prueba.xlsx";
    // link.click();

    // // Liberar el objeto URL creado
    // window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        exportToExcel();
      }, 2400);
    }
  };

  return (
    <div className="report-container">
      <div className="title-h">
        <h1>Reporte de Cuadres Diarios</h1>
        {/* {InfoUsuario.rol === Roles.ADMIN && infoCuadres.length > 0 ? (
          <button
            className={`button_wrapper ${loading ? "loading" : ""}`}
            onClick={handleExport}
          >
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                />
              </svg>
            </div>
          </button>
        ) : null} */}
      </div>

      <div className="action-h">
        <MonthPickerInput
          style={{ position: "relative" }}
          label="Ingrese Fecha"
          placeholder="Escoge Fecha"
          value={datePrincipal}
          onChange={(date) => {
            setDatePrincipal(date);
            console.log(date);
          }}
        />
        {InfoUsuario.rol === Roles.ADMIN && infoCuadres.length > 0 ? (
          <Button
            type="button"
            className="btn-save"
            onClick={() => setShowMore(!showMore)}
          >
            Mostrar {showMore ? "Menos" : "Mas"}
          </Button>
        ) : null}
      </div>
      {!onLoading ? (
        <table className="combined-table">
          <thead>
            <tr>
              <th
                colSpan={
                  InfoUsuario.rol === Roles.ADMIN && showMore ? "13" : "5"
                }
                style={{
                  border: `solid 1px ${colorBorder}`,
                }}
                className="header-cuadres"
              >
                Lista de Cuadres por Fecha
              </th>
              <th colSpan="1" className="space"></th>
              <th colSpan="3" className="header-pagos">
                Montos no Cuadrados
              </th>
            </tr>
            <tr>
              <th
                style={{
                  border: `solid 1px ${colorBorder}`,
                }}
              >
                Fecha
              </th>
              <th
                style={{
                  borderTop: `solid 1px ${colorBorder}`,
                }}
              >
                Usuario
              </th>
              {InfoUsuario.rol === Roles.ADMIN && showMore ? (
                <>
                  <th
                    style={{
                      borderTop: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Caja Inicial
                  </th>
                  <th
                    style={{
                      border: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Ingresos
                    <br />
                    (efectivo)
                  </th>
                  <th
                    style={{
                      borderTop: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Egresos
                  </th>
                  <th
                    style={{
                      borderTop: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Monto en Caja
                  </th>
                  <th
                    style={{
                      borderTop: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Corte
                  </th>
                  <th
                    style={{
                      borderTop: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Caja Final
                  </th>
                </>
              ) : null}

              <th
                style={{
                  borderTop: `solid 1px ${colorBorder}`,
                }}
              >
                Estado
              </th>
              <th
                style={{
                  borderTop: `solid 1px ${colorBorder}`,
                }}
              >
                Margen Error
              </th>
              <th
                style={{
                  borderTop: `solid 1px ${colorBorder}`,
                }}
              >
                Nota
              </th>
              {InfoUsuario.rol === Roles.ADMIN && showMore ? (
                <>
                  <th
                    style={{
                      border: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Ingresos
                    <br />
                    (TRANSFERENCIA MOVIL)
                  </th>
                  <th
                    style={{
                      border: `solid 1px ${colorBorder}`,
                    }}
                  >
                    Ingresos
                    <br />
                    (Tarjeta)
                  </th>
                </>
              ) : null}
              <th
                className="space"
                style={{
                  borderLeft: `solid 1px ${colorBorder}`,
                }}
              ></th>
              <th
                style={{
                  border: `solid 1px ${colorBorder}`,
                }}
              >
                Ingresos
              </th>
              <th
                style={{
                  border: `solid 1px ${colorBorder}`,
                }}
              >
                Egresos
              </th>
              <th
                style={{
                  border: `solid 1px ${colorBorder}`,
                }}
              >
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {infoCuadres?.map((infoFecha, index) => {
              const {
                fecha,
                cuadresTransformados,
                paysNCuadrados,
                gastoGeneral,
              } = infoFecha;

              const ingresosTotales = sumarTotales(paysNCuadrados, "total");
              const egresosTotales = sumarTotales(gastoGeneral, "monto");
              const numFilas =
                cuadresTransformados.length > 0
                  ? cuadresTransformados.length
                  : 1; // Determinar el número de filas para esta fecha

              return (
                <Fragment key={index}>
                  {[...Array(numFilas)].map(
                    (
                      _,
                      rowIndex // Mapear sobre un arreglo de tamaño numFilas
                    ) => (
                      <tr
                        key={rowIndex}
                        data-fecha={fecha} // Atributo de data para identificar las filas de la misma fecha
                        className={rowIndex === 0 ? "first-of-date" : ""}
                        onMouseOver={() => handleMouseOver(fecha)}
                        onMouseOut={() => handleMouseOut(fecha)}
                      >
                        {rowIndex === 0 && ( // Solo mostrar la fecha en la primera fila
                          <td
                            className="fila"
                            rowSpan={numFilas}
                            style={{ border: `solid 1px ${colorBorder}` }}
                          >
                            {fecha}
                          </td>
                        )}
                        {cuadresTransformados.length > 0 && ( // Solo mostrar información si hay cuadres transformados
                          <>
                            <td
                              style={{
                                borderTop:
                                  rowIndex === 0
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                                borderBottom:
                                  rowIndex === numFilas - 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                              }}
                              className="fila"
                            >
                              {cuadresTransformados[rowIndex]?.infoUser?.name}{" "}
                            </td>
                            {InfoUsuario.rol === Roles.ADMIN && showMore ? (
                              <>
                                <td
                                  style={{
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.cajaInicial
                                  )}
                                </td>
                                <td
                                  style={{
                                    border: `solid 1px ${colorBorder}`,
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.ingresos
                                      .efectivo
                                  )}
                                </td>
                                <td
                                  style={{
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.egresos
                                  )}
                                </td>
                                <td
                                  style={{
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.montoCaja
                                  )}
                                </td>
                                <td
                                  style={{
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.corte
                                  )}
                                </td>
                                <td
                                  style={{
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.cajaFinal
                                  )}
                                </td>
                              </>
                            ) : null}

                            <td
                              style={{
                                borderTop:
                                  rowIndex === 0
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                                borderBottom:
                                  rowIndex === numFilas - 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                              }}
                              className="fila"
                            >
                              {cuadresTransformados[rowIndex]?.estado}
                            </td>
                            <td
                              style={{
                                borderTop:
                                  rowIndex === 0
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                                borderBottom:
                                  rowIndex === numFilas - 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                              }}
                              className="fila"
                            >
                              {formatThousandsSeparator(
                                Math.abs(
                                  cuadresTransformados[rowIndex]?.margenError
                                ),
                                true
                              )}
                            </td>
                            <td
                              style={{
                                borderTop:
                                  rowIndex === 0
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                                borderBottom:
                                  rowIndex === numFilas - 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none",
                              }}
                              className="fila"
                            >
                              {cuadresTransformados[rowIndex]?.notas.length >
                              0 ? (
                                <button
                                  onClick={() => {
                                    setPJustificacion(true);
                                    setFSJustificacion(
                                      cuadresTransformados[rowIndex]
                                    );
                                  }}
                                >
                                  <i className="fa-solid fa-question"></i>
                                </button>
                              ) : null}
                            </td>
                            {InfoUsuario.rol === Roles.ADMIN && showMore ? (
                              <>
                                <td
                                  style={{
                                    border: `solid 1px ${colorBorder}`,
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.ingresos
                                      .transferencia
                                  )}
                                </td>
                                <td
                                  style={{
                                    border: `solid 1px ${colorBorder}`,
                                    borderTop:
                                      rowIndex === 0
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                    borderBottom:
                                      rowIndex === numFilas - 1
                                        ? `solid 1px ${colorBorder}`
                                        : "none",
                                  }}
                                  className="fila"
                                >
                                  {formatThousandsSeparator(
                                    cuadresTransformados[rowIndex]?.ingresos
                                      .tarjeta
                                  )}
                                </td>
                              </>
                            ) : null}
                          </>
                        )}
                        {!cuadresTransformados.length && ( // Si no hay cuadres transformados, mostrar celdas vacías
                          <>
                            <td
                              style={{
                                borderBottom: `${
                                  infoCuadres.length === index + 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none"
                                }`,
                                borderTop: `${
                                  index + 1 === 1
                                    ? `solid 1px ${colorBorder}`
                                    : "none"
                                }`,
                              }}
                              colSpan={showMore ? 12 : 4}
                            >
                              Sin Informacion
                            </td>
                          </>
                        )}
                        {rowIndex === 0 && ( // Solo mostrar la fecha y las tres últimas columnas en la primera fila
                          <>
                            <td
                              className="space"
                              style={{
                                borderLeft: `solid 1px ${colorBorder}`,
                              }}
                              rowSpan={numFilas}
                            ></td>
                            <td
                              style={{
                                border: `solid 1px ${colorBorder}`,
                              }}
                              className="fila"
                              rowSpan={numFilas}
                            >
                              {ingresosTotales
                                ? formatThousandsSeparator(ingresosTotales)
                                : ""}
                            </td>
                            <td
                              style={{
                                border: `solid 1px ${colorBorder}`,
                              }}
                              className="fila"
                              rowSpan={numFilas}
                            >
                              {egresosTotales
                                ? formatThousandsSeparator(egresosTotales)
                                : ""}
                            </td>
                            <td
                              style={{
                                border: `solid 1px ${colorBorder}`,
                              }}
                              className="fila"
                              rowSpan={numFilas}
                            >
                              {ingresosTotales || egresosTotales ? (
                                <button
                                  onClick={() => handleShowInfoDate(infoFecha)}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                              ) : null}
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <LoaderSpiner />
      )}
      {pMontosNS ? (
        <Portal
          onClose={() => {
            setPMontosNS(false);
          }}
        >
          <div className="detalle-mov">
            <div className="list-movimientos-ns">
              <div className="title">Movimientos no Gardados</div>
              <ul>
                {fSelected.MontosNC.map((ins, index) => (
                  <li className="i-mov" key={index}>
                    <span>{cLetter(ins.tipo)}</span>
                    <span className="_monto">
                      {simboloMoneda} {ins.monto}
                    </span>
                    <span className="_desc">{ins.decripcion}</span>
                    <span className="_fecha">
                      {moment(ins.hora, "HH:mm").format("h:mm A")}
                    </span>
                    <span className="_user">{ins.user}</span>
                    <span className="_ico">
                      {ins.tipo === "ingreso" ? (
                        <i className="fa-solid fa-money-bill-trend-up ingreso" />
                      ) : (
                        <i className="fa-solid fa-hand-holding-dollar egreso" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="i-final">
                <span>
                  {cLetter(valueFinalINS?.tipo)} : &nbsp;&nbsp; {simboloMoneda}{" "}
                  {formatThousandsSeparator(valueFinalINS?.total)}
                </span>
              </div>
            </div>
          </div>
        </Portal>
      ) : null}
      {pJustificacion ? (
        <Portal
          onClose={() => {
            setPJustificacion(false);
          }}
        >
          <div className="notas-xc">
            <h1>Justificacion {fSJustificacion.infoUser.name}</h1>
            {fSJustificacion.notas.map((js, index) => (
              <div className="nota" key={index}>
                <p>
                  {index + 1}. {js.text}
                </p>
              </div>
            ))}
          </div>
        </Portal>
      ) : null}
    </div>
  );
};

export default CuadreCaja;
