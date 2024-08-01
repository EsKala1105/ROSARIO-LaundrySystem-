/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./reportes.scss";
import { PrivateRoutes, Roles } from "../../../../models";
import Ordenes from "./Ordenes/Ordenes";
import Portal from "../../../../components/PRIVATE/Portal/Portal";
import Target from "../../../../components/Target/Target";

import Iconos from "../../../../utils/img/Icono/index";

const {
  iRCuadreCaja,
  iRGastos,
  iRPendiente,
  iRPortafolio,
  iRMensual,
  iRAlmacen,
  iRAanulado,
} = Iconos;

import Backgrounds from "../../../../utils/img/Background/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Anulados from "./Anulados/Anulados";
const {
  rBCuadredCaja,
  rBGastos,
  rBPendiente,
  rBPortafolio,
  rBMensual,
  rBAlmacen,
  rBAnulado,
} = Backgrounds;

const Reportes = () => {
  const [mAnulado, setMAnulado] = useState(false);
  const [mMensual, setMMensual] = useState(false);
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);
  const navigate = useNavigate();

  const handleValidarAcceso = (type, page, accesos) => {
    const hasPermission = accesos.includes(InfoUsuario.rol);

    if (hasPermission) {
      if (type === "modal") {
        if (page === "Ordenes") {
          setMMensual(true);
        } else if (page === "Anulado") {
          setMAnulado(true);
        }
      } else {
        navigate(page);
      }
    } else {
      alert("No tienes Acceso a estos reportes");
    }
  };

  const listReports = [
    {
      imgIco: iRPendiente,
      imgBack: rBPendiente,
      type_show: "page",
      acceso: [Roles.ADMIN, Roles.GERENTE],
      title: "Ordenes Pendientes",
      descripcion:
        "Listado Ordenes pendiente, tiempo en custodia, reenviar Almacen",
      page: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_PENDIENTES}`,
    },
    {
      imgIco: iRGastos,
      imgBack: rBGastos,
      type_show: "page",
      acceso: [Roles.ADMIN, Roles.GERENTE],
      title: "Gastos",
      descripcion:
        "Lista de Gasto segun Tipo, exportacion excel, segun cantidad y monto gastado",
      page: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_GASTO}`,
    },
    {
      imgIco: iRPortafolio,
      imgBack: rBPortafolio,
      type_show: "page",
      acceso: [Roles.ADMIN],
      title: "Servicios",
      descripcion:
        "Listado Servicions, (servicios +/- rentables) por precio y cantidad, exportacion a excel",
      page: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_PRODUCTOS}`,
    },
    {
      imgIco: iRCuadreCaja,
      imgBack: rBCuadredCaja,
      type_show: "page",
      acceso: [Roles.ADMIN, Roles.GERENTE],
      title: "Cuadres de Caja",
      descripcion:
        "Listado Cuadres Diarios y Movimientos no Guardados o Cuadrados, exportar a excel",
      page: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_CUADRE_CAJA}`,
    },
    {
      imgIco: iRMensual,
      imgBack: rBMensual,
      type_show: "modal",
      acceso: [Roles.ADMIN],
      title: "Ordenes Mensual",
      descripcion:
        "Listado Ordenes mensual, exportacion en excel, montos pagados y facturados",
      page: "Ordenes",
    },
    {
      imgIco: iRAlmacen,
      imgBack: rBAlmacen,
      type_show: "page",
      acceso: [Roles.ADMIN, Roles.GERENTE],
      title: "Almacen",
      descripcion:
        "Listado Ordenes en Almacen, tiempo en custodia, Enviar a DONACION",
      page: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_ALMACEN}`,
    },
    {
      imgIco: iRAanulado,
      imgBack: rBAnulado,
      type_show: "modal",
      acceso: [Roles.ADMIN, Roles.GERENTE],
      title: "Anulados",
      descripcion:
        "Listado Anulacion mensuales, responsable, motivos, montos. exportado en excel",
      page: "Anulado",
    },
  ];

  const items = listReports.map((report, index) => {
    const modelTarg = (
      <Target
        title={report.title}
        descripcion={report.descripcion}
        imgIco={report.imgIco}
        imgBack={report.imgBack}
      />
    );

    return (
      <li key={index}>
        <button
          className="card-report"
          onClick={() =>
            handleValidarAcceso(report.type_show, report.page, report.acceso)
          }
        >
          {modelTarg}
        </button>
      </li>
    );
  });

  return (
    <div className="content-reportes">
      <ul className="cards">
        {items}
        {mMensual && (
          <Portal
            onClose={() => {
              setMMensual(false);
            }}
          >
            <Ordenes onClose={() => setMMensual(false)} />
          </Portal>
        )}
        {mAnulado && (
          <Portal
            onClose={() => {
              setMAnulado(false);
            }}
          >
            <Anulados onClose={() => setMAnulado(false)} />
          </Portal>
        )}
      </ul>
    </div>
  );
};

export default Reportes;
