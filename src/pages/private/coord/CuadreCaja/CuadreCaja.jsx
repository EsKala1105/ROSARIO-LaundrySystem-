﻿/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  DateCurrent,
  cLetter,
  formatThousandsSeparator,
} from "../../../../utils/functions/index";
import { DatePickerInput } from "@mantine/dates";

import {
  GetCuadre,
  SaveCuadre,
  UpdateCuadre,
} from "../../../../redux/actions/aCuadre";

import { modals } from "@mantine/modals";
import { Button, Text } from "@mantine/core";
import "./cuadreCaja.scss";

import { jsPDF } from "jspdf";
import { PrivateRoutes } from "../../../../models";

import LoaderSpiner from "../../../../components/LoaderSpinner/LoaderSpiner";
import { socket } from "../../../../utils/socket/connect";
import { Notify } from "../../../../utils/notify/Notify";
import { ingresoDigital, simboloMoneda } from "../../../../services/global";
import CashCounter from "./CashCounter/CashCounter";
import InfoCuadre from "./InfoCuadre/InfoCuadre";
import FinalBalance from "./FinalBalance/FinalBalance";
import ListPagos from "./ListPagos/ListPagos";
import Portal from "../../../../components/PRIVATE/Portal/Portal";

const CuadreCaja = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const certificateTemplateRef = useRef(null);
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);
  const {
    infoCuadre,
    lastCuadre,
    cuadrePrincipal,
    cuadreActual,
    registroNoCuadrados,
  } = useSelector((state) => state.cuadre);

  const infoRegistroNC = useSelector(
    (state) => state.cuadre.registroNoCuadrados
  );

  const [datePrincipal, setDatePrincipal] = useState({
    fecha: DateCurrent().format4,
    hora: DateCurrent().format3,
  });

  const [onLoading, setOnLoading] = useState(true);

  const [iState, setIState] = useState();
  const [totalCaja, setTotalCaja] = useState(0);

  const [gastos, setGastos] = useState(0);
  const [pedidosPagadosEfectivo, setPedidosPagadosEfectivo] = useState(0);
  const [pedidosPagadosTransferencia, setPedidosPagadosTransferencia] =
    useState(0);
  const [pedidosPagadosTarjeta, setPedidosPedidosPagadosTarjeta] = useState(0);
  // --------------------------------------------------------- //
  const [pagosByTipoTransferencia, setPagosByTipoTransferencia] = useState();
  // --------------------------------------------------------- //

  const [iClienteEfectivo, setIClienteEfectivo] = useState();
  const [iClienteTransferencia, setIClienteTransferencia] = useState();
  const [iClienteTarjeta, setIClienteTarjeta] = useState();

  const [iGastosFinal, setIGastosFinal] = useState([]);
  const [montoPrevisto, setMontoPrevisto] = useState(0);

  const [stateCuadre, setStateCuadre] = useState();

  const [savedActivated, setSavedActivated] = useState(false);

  const [cajaFinal, setCajaFinal] = useState(0);

  const [showPortalCuadres, setShowPortalCuadres] = useState(false);

  const [filteredPagos, setFilteredPagos] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);

  const [posCuadre, setPosCuadre] = useState(-1);
  const [sButtonLeft, setSButtonLeft] = useState(false);
  const [sButtonRight, setSButtonRight] = useState(false);

  const [infoNoSaved, setInfoNoSaved] = useState([]);
  const [valueFinalINS, setValueFinalINS] = useState(null);

  ////////////////////////////////////////////////////////////////////////

  const handleShowInfoNoSaved = (infoNS) => {
    const { pagos, gastos } = infoNS;

    let MontosNC = [];
    pagos.map((pay) => {
      MontosNC.push({
        _id: pay._id,
        user: pay.infoUser?.name,
        monto: pay.total,
        decripcion: `Orden N° ${pay.codRecibo} de ${pay.Nombre}, (${pay.Modalidad})`,
        tipo: "ingreso",
        hora: pay.date?.hora,
      });
    });

    gastos.map((spend) => {
      MontosNC.push({
        _id: spend._id,
        user: spend.infoUser?.name,
        monto: spend.monto,
        decripcion: `Motivo : ${spend.motivo}`,
        tipo: "gasto",
        hora: spend.date?.hora,
      });
    });

    if (MontosNC.length > 0) {
      handleTotalMontosNoSaved(MontosNC);
    }
    setInfoNoSaved(MontosNC);
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

  const handleChangeMontos = (newMonto) => {
    setIState((prevState) => ({
      ...prevState,
      Montos: newMonto,
    }));
    if (datePrincipal.fecha === DateCurrent().format4) {
      const updatedState = {
        ...iState,
        Montos: newMonto,
      };

      localStorage.setItem("cuadreCaja", JSON.stringify(updatedState));
    }
  };

  const handleChangeTotalCaja = (finalMonto) => {
    setTotalCaja(finalMonto);
  };

  const handleSavedActivated = (value) => {
    setSavedActivated(value);
  };

  const handleChangeCorte = (newCorte) => {
    const boxFinal = parseFloat(totalCaja - newCorte).toFixed(2);

    setIState((prevState) => {
      const updatedState = {
        ...prevState,
        corte: newCorte,
        cajaFinal: boxFinal,
      };

      if (datePrincipal.fecha === DateCurrent().format4) {
        localStorage.setItem("cuadreCaja", JSON.stringify(updatedState));
      }

      return updatedState;
    });

    setCajaFinal(boxFinal);
  };

  const handleChangeNotas = (newNota) => {
    setIState((prevState) => {
      const updatedState = {
        ...prevState,
        notas: newNota,
      };

      // Comprueba la condición y actualiza el localStorage después de establecer el estado
      if (datePrincipal.fecha === DateCurrent().format4) {
        localStorage.setItem("cuadreCaja", JSON.stringify(updatedState));
      }

      return updatedState;
    });
  };

  const MontoPrevisto = () => {
    const MontoInicial = parseFloat(
      datePrincipal.fecha === DateCurrent().format4 &&
        lastCuadre &&
        lastCuadre.date.fecha !== DateCurrent().format4
        ? lastCuadre.cajaFinal
        : iState?.cajaInicial
    );

    setMontoPrevisto(
      (
        parseFloat(MontoInicial) +
        parseFloat(pedidosPagadosEfectivo) -
        parseFloat(gastos)
      ).toFixed(2)
    );
  };

  const openModal = (value) => {
    let confirmationEnabled = true;
    const clonedElement = certificateTemplateRef.current.cloneNode(true);

    modals.openConfirmModal({
      title: value === true ? "Guardar y Generar PDF" : "Generar PDF",
      centered: true,
      children: (
        <Text size="sm">{`${
          value === true
            ? "¿ Estas seguro que quieres quieres guardar y generar el PDF ?"
            : "¿ Estas seguro que quieres generar el PDF ?"
        }`}</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => {
        setSavedActivated(false);
        setOnLoading(false);
      },
      closeOnEscape: false,
      withCloseButton: false,
      closeOnClickOutside: false,
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          setOnLoading(true);
          setTimeout(() => {
            value === true
              ? handleSaved(clonedElement)
              : handleGeneratePdf(clonedElement);
          }, 500);
        }
      },
    });
  };

  const handleSaved = (clonedElement) => {
    setOnLoading(true);
    const { enable, type, saved, ...infoCuadre } = iState;

    const iCuadre = {
      infoCuadre: {
        ...infoCuadre,
        date: {
          ...infoCuadre.date,
          hora: DateCurrent().format3,
        },
        cajaFinal: cajaFinal,
        egresos: gastos,
        ingresos: {
          efectivo: pedidosPagadosEfectivo,
          tarjeta: pedidosPagadosTarjeta,
          transferencia: pedidosPagadosTransferencia,
        },
        estado:
          stateCuadre > 0 ? "Sobra" : stateCuadre < 0 ? "Falta" : "Cuadro",
        margenError: stateCuadre,
        totalCaja: totalCaja,
        userID: InfoUsuario._id,
        Pagos: filteredPagos,
        Gastos: filteredGastos,
      },
      rol: InfoUsuario.rol,
    };

    dispatch(
      type === "update"
        ? UpdateCuadre({
            idCuadre: infoCuadre._id,
            infoCuadreDiario: iCuadre,
          })
        : SaveCuadre(iCuadre)
    ).then(async (res) => {
      if (res.payload) {
        await handleGeneratePdf(clonedElement);
        localStorage.removeItem("cuadreCaja");
      }
    });
  };

  const handleGeneratePdf = (clonedElement) => {
    clonedElement.style.transform = "scale(0.338)";
    clonedElement.style.transformOrigin = "left top";

    // Establecer altura máxima y márgenes
    clonedElement.style.maxHeight = "842px"; // Altura máxima del tamaño A4

    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(clonedElement, {
      callback: function (pdf) {
        pdf.save(`Informe (${datePrincipal.fecha}).pdf`);
        setTimeout(() => {
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
          );
        }, 1000);
      },
    });
  };

  const sumaMontos = (clientes) => {
    return clientes
      .reduce((sum, cliente) => sum + (parseFloat(cliente.total) || 0), 0)
      .toFixed(2);
  };

  const chageInfo = (info) => {
    setIState(info);
  };

  useEffect(() => {
    const handleGetInfoCuadre = async () => {
      setOnLoading(true);
      await dispatch(
        GetCuadre({ date: datePrincipal.fecha, id: InfoUsuario._id })
      );
      setOnLoading(false);
    };
    handleGetInfoCuadre();
  }, [datePrincipal]);

  useEffect(() => {
    const procesarData = async () => {
      const { gastos, pagos } = infoRegistroNC;
      const ListPaysByDate = pagos;
      const ListSpenseByDate = gastos;

      let ListPagos = [];
      let ListGastos = [];

      if (iState) {
        if (iState.type === "update") {
          // update = ultimo cuadre
          // Filtrar PAGOS y GASTOS para obtener solo los elementos con idUser correspondiente
          const filteredPaysByUser = ListPaysByDate.filter(
            (pago) => pago.idUser === iState.infoUser._id
          );

          const filteredSpenseByUser = ListSpenseByDate.filter(
            (gasto) => gasto.idUser === iState.infoUser._id
          );

          // Función para obtener elementos únicos basados en _id
          const getUniqueItems = (listA) => {
            const uniqueItems = new Set();
            const uniqueArray = [];
            listA.forEach((item) => {
              if (item && item._id && !uniqueItems.has(item._id)) {
                uniqueItems.add(item._id);
                uniqueArray.push(item);
              }
            });
            return uniqueArray;
          };

          // Obtener elementos únicos para pagos y gastos
          ListPagos = getUniqueItems([...filteredPaysByUser, ...iState.Pagos]);
          ListGastos = getUniqueItems([
            ...filteredSpenseByUser,
            ...iState.Gastos,
          ]);
        } else if (iState.type === "view") {
          //  usar los pagos y gasto del cuadre y los pagos
          ListPagos = iState.Pagos;
          ListGastos = iState.Gastos;
        } else {
          // type === "new"
          // consultar Pagos hechos la fecha principal y _id del  usuario
          ListPagos = ListPaysByDate.filter(
            (pago) => pago?.idUser === iState?.infoUser._id
          );

          ListGastos = ListSpenseByDate.filter(
            (gasto) => gasto?.idUser === iState?.infoUser._id
          );
        }
      }

      const cEfectivo = ListPagos?.filter((d) => d.metodoPago === "Efectivo");
      const cTransferencia = ListPagos?.filter(
        (d) => !["Efectivo", "Tarjeta"].includes(d.metodoPago)
      );
      const cTarjeta = ListPagos?.filter((d) => d.metodoPago === "Tarjeta");

      setPedidosPagadosEfectivo(sumaMontos(cEfectivo));
      setPedidosPagadosTransferencia(sumaMontos(cTransferencia));
      setPedidosPedidosPagadosTarjeta(sumaMontos(cTarjeta));
      // -------------------------------------------------------------- //

      const transferenciasByTipo = cTransferencia?.reduce((acc, curr) => {
        const { metodoPago } = curr;
        if (!acc[metodoPago]) {
          acc[metodoPago] = [];
        }
        acc[metodoPago].push(curr);
        return acc;
      }, {});

      const sumaByTipoTransferencia = Object.keys(transferenciasByTipo).reduce(
        (result, metodo) => {
          const clientes = transferenciasByTipo[metodo] || [];
          result[metodo] = parseFloat(sumaMontos(clientes));
          return result;
        },
        {}
      );

      setPagosByTipoTransferencia(sumaByTipoTransferencia);
      // -------------------------------------------------------------- //

      setIClienteEfectivo(cEfectivo);
      setIClienteTransferencia(transferenciasByTipo);
      setIClienteTarjeta(cTarjeta);

      setFilteredGastos(ListGastos.map((g) => g._id));
      setFilteredPagos(ListPagos.map((p) => p._id));

      setIGastosFinal(ListGastos);

      const sumaMontosGastos = (lista) => {
        return lista
          .reduce((sum, gastos) => {
            return sum + (gastos.monto ? parseFloat(gastos.monto) : 0);
          }, 0)
          .toFixed(2);
      };

      const sumaGastos = sumaMontosGastos(ListGastos);

      setGastos(sumaGastos);
    };

    procesarData();
  }, [infoRegistroNC, datePrincipal, iState]);

  useEffect(() => {
    if (infoCuadre?.length > 0) {
      setPosCuadre(infoCuadre.length);
      setSButtonLeft(true);
    }
  }, [infoCuadre]);

  useEffect(() => {
    if (infoCuadre?.length === 0 || posCuadre === 0) {
      setSButtonLeft(false);
    } else {
      setSButtonLeft(true);
    }

    if (posCuadre >= 0 && posCuadre < infoCuadre?.length) {
      setSButtonRight(true);
    }

    if (posCuadre === infoCuadre?.length) {
      setSButtonRight(false);
    }
  }, [posCuadre, infoCuadre]);

  useEffect(() => {
    const cuadreLS = JSON.parse(localStorage.getItem("cuadreCaja"));
    if (
      cuadreLS?.date.fecha === datePrincipal.fecha &&
      cuadreLS.infoUser._id === InfoUsuario._id
    ) {
      chageInfo(cuadreLS);
    } else {
      chageInfo(cuadreActual);
    }
  }, [datePrincipal, cuadrePrincipal, cuadreActual]);

  useEffect(() => {
    MontoPrevisto();
  }, [pedidosPagadosEfectivo, gastos, totalCaja, datePrincipal, iState]);

  useEffect(() => {
    setCajaFinal(parseFloat(totalCaja - iState?.corte).toFixed(2));
  }, [iState, totalCaja]);

  useEffect(() => {
    setStateCuadre((totalCaja - montoPrevisto).toFixed(2));
  }, [iState, totalCaja, montoPrevisto]);

  useEffect(() => {
    socket.on("server:changeCuadre:child", (data) => {
      Notify(
        "CUADRE DE CAJA A SIDO ACTUALIZADO",
        "vuelve a ingresar",
        "warning"
      );
      navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
    });

    return () => {
      socket.off("server:changeCuadre:child");
      socket.off("cAnular");
    };
  }, []);

  useEffect(() => {
    if (registroNoCuadrados !== null) {
      handleShowInfoNoSaved(registroNoCuadrados);
    }
  }, [registroNoCuadrados]);

  return (
    <div className="content-cuadre">
      {iState ? (
        <div
          style={{
            display: onLoading === false ? "block" : "none",
          }}
        >
          {registroNoCuadrados !== null && infoNoSaved.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowPortalCuadres(true)}
              className="info-nsaved"
            >
              <i className="fa-solid fa-circle-exclamation" />
            </button>
          ) : null}
          <div
            className="state-cuadre"
            style={{ background: iState.saved ? "#53d895" : "#ed7b72" }}
          >
            <h1>
              {iState.saved
                ? lastCuadre.date.fecha === datePrincipal.fecha &&
                  lastCuadre?.infoUser._id === iState?.infoUser._id
                  ? "Ultimo Cuadre Guardado"
                  : "Cuadre Guardado"
                : "Cuadre No guardado"}
            </h1>
          </div>
          <ContainerCC id="cuadreStructure" ref={certificateTemplateRef}>
            <BodyContainerCC>
              <HeaderCC>
                <div className="h-superior">
                  <h1 className="title">CUADRE&nbsp;DIARIO</h1>
                  <h1 className="title">
                    "{iState?.infoUser?.name.toUpperCase()}"
                  </h1>
                </div>
                <div className="h-inferior">
                  <div className="previous">
                    {sButtonLeft && !savedActivated ? (
                      <Button
                        type="button"
                        onClick={() => {
                          chageInfo(infoCuadre[posCuadre - 1]);
                          setPosCuadre(posCuadre - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="date-filter">
                    <DatePickerInput
                      clearable={false}
                      value={moment(datePrincipal.fecha).toDate()}
                      maxDate={new Date()}
                      minDate={moment("2023-08-22").toDate()}
                      onChange={(date) => {
                        setDatePrincipal((prevState) => ({
                          ...prevState,
                          fecha: moment(date).format("YYYY-MM-DD"),
                        }));
                      }}
                      mx="auto"
                      maw={200}
                    />
                  </div>
                  <div className="next">
                    {sButtonRight && !savedActivated ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (posCuadre + 1 === infoCuadre.length) {
                            const cuadreLS = JSON.parse(
                              localStorage.getItem("cuadreCaja")
                            );
                            if (
                              cuadreLS?.date.fecha === datePrincipal.fecha &&
                              cuadreLS.infoUser._id === InfoUsuario._id
                            ) {
                              chageInfo(cuadreLS);
                            } else {
                              chageInfo(cuadreActual);
                            }
                          } else {
                            chageInfo(infoCuadre[posCuadre + 1]);
                          }
                          setPosCuadre(posCuadre + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </HeaderCC>
              <BodyCC>
                <div className="info-top">
                  <CashCounter
                    ListMontos={iState?.Montos}
                    handleChangeMontos={handleChangeMontos}
                    totalCaja={totalCaja}
                    handleChangeTotalCaja={handleChangeTotalCaja}
                    datePrincipal={datePrincipal}
                    sDisabledCuadre={iState?.enable}
                  />
                  <InfoCuadre
                    cajaInicial={iState?.cajaInicial}
                    gastos={gastos}
                    pedidosPagadosEfectivo={pedidosPagadosEfectivo}
                    pedidosPagadosTransferencia={pedidosPagadosTransferencia}
                    pedidosPagadosTarjeta={pedidosPagadosTarjeta}
                    montoPrevisto={montoPrevisto}
                    stateCuadre={stateCuadre}
                    pagosByTipoTransferencia={pagosByTipoTransferencia}
                  />
                  <FinalBalance
                    totalCaja={totalCaja}
                    infoState={iState}
                    sDisabledCuadre={iState?.enable}
                    openModal={openModal}
                    handleSavedActivated={handleSavedActivated}
                    savedActivated={savedActivated}
                    handleChangeCorte={handleChangeCorte}
                    handleChangeNotas={handleChangeNotas}
                    cajaFinal={cajaFinal}
                    datePrincipal={datePrincipal}
                  />
                </div>
                <ListPagos
                  type={iState?.type}
                  iGastos={iGastosFinal}
                  iClienteEfectivo={iClienteEfectivo}
                  iClienteTarjeta={iClienteTarjeta}
                  iClienteTransferencia={iClienteTransferencia}
                  savedActivated={savedActivated}
                  handleSavedActivated={handleSavedActivated}
                />
              </BodyCC>
            </BodyContainerCC>
          </ContainerCC>
        </div>
      ) : null}
      {onLoading ? (
        <div className="content-loading ">
          <div
            className="loading-general"
            style={{
              display: onLoading === false ? "none" : "flex",
            }}
          >
            <LoaderSpiner />
          </div>
        </div>
      ) : null}

      {showPortalCuadres ? (
        <Portal
          onClose={() => {
            setShowPortalCuadres(false);
          }}
        >
          <div className="cuadres-preview">
            <div className="list-movimientos-ns">
              <div className="title">Movimientos no Gardados</div>
              <ul>
                {infoNoSaved.map((ins, index) => (
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
    </div>
  );
};

export const ContainerCC = styled.div`
  position: relative;
  width: 100%;
  max-width: 1350px;
  //border: 1px solid #ccc;
  //border-radius: 4px;
  margin: auto;
  padding-top: 20px;
`;

export const BodyContainerCC = styled.div`
  position: relative;
  padding: 5px;
  background-color: #fff;
  display: grid;
  grid-template-rows: max-content auto;
`;

export const HeaderCC = styled.div`
  display: grid;
  place-items: center;
  padding: 5px 25px;
  border-bottom: solid 1px silver;
  border-top: solid 1px silver;

  .h-superior {
    text-align: center;
    .title {
      margin-bottom: 0;
      margin-bottom: 0;
      word-spacing: 10px;
    }
  }

  .h-inferior {
    width: 100%;
    display: flex;
    justify-content: space-between;
    place-items: center;
    padding: 10px;
  }

  .date-filter {
    width: 300px;
    button {
      text-align: center !important;
    }
  }
`;

const BodyCC = styled.div`
  max-width: 1350px;
  display: grid;

  .info-top {
    width: 100%;
    display: grid;
    grid-template-columns: 450px 1fr 1fr;

    .info-cuadre {
      display: grid;
      grid-template-rows: 305px auto;
      padding: 20px 10%;

      .form-ic {
        max-width: 300px;
        display: grid;
        gap: 10px;
      }

      .response-ic {
        .bloques-states {
          margin: 25px 0;
          display: grid;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 10px;

          .sb {
            background: #afffa8;
          }

          .cd {
            background: #f9ffa8;
          }

          .fl {
            background: #ffa8a8;
          }

          .states {
            width: max-content;
            text-align: center;
            color: #6c757d;
            font-weight: bold;
            display: grid;
            grid-template-columns: 125px max-content;

            .bloque {
              padding: 10px 20px;
              line-height: 2;
            }

            .title {
              border: solid 1px silver;
              border-radius: 15px 1px 1px 15px;
              border-right: none;
            }

            .res {
              border: solid 1px silver;
              border-radius: 1px 15px 15px 1px;
              border-left: solid 0.5px silver;
              min-width: 125px;
            }
          }
        }
      }
    }
  }
  }
`;

export default CuadreCaja;
