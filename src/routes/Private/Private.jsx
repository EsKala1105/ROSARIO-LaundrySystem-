/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Route } from "react-router-dom";
import { PrivateRoutes, Roles } from "../../models/index";

import {
  AnularReplace,
  EditOrdenService,
  FinishReserva,
  ListOrdenService,
} from "../../pages/private/coord/index";

import {
  AddOrderService_RDelivery,
  AddOrderService_R,
} from "../../pages/private/coord/OrdenServicio/Add/index";

import Imprimir from "../../pages/private/coord/OrdenServicio/Actions/Imprimir/Imprimir";

import ReporteMesual from "../../pages/private/coord/Reporte/Mesual/ReporteMesual";

import { PrivateMainLayout } from "../../_MainLayout/indexLayout";
import { RoleGuard } from "../Guard/index";
import RoutesWithNotFound from "../NotFound/RoutesWithNotFound";
import CuadreCaja from "../../pages/private/coord/CuadreCaja/CuadreCaja";
import AddOld from "../../pages/private/admin/OrdenServicio/AddOld/AddOld";

import Preliminar from "../../pages/private/coord/OrdenServicio/Preliminar/Preliminar";
import { default as EditOrdenRecojo_Preliminar } from "../../pages/private/coord/OrdenServicio/Preliminar/Edit/Edit";

// import Graficos from '../../pages/private/admin/Graficos/Graficos';
import Promociones from "../../pages/private/admin/Promociones/Promociones";

import Reportes from "../../pages/private/admin/Reportes/Reportes";
import ROrdenes from "../../pages/private/admin/Reportes/Ordenes/Ordenes";
import RPendientes from "../../pages/private/admin/Reportes/Pendientes/Pendientes";
import RAlmacen from "../../pages/private/admin/Reportes/Almacen/Almacen";
import RGasto from "../../pages/private/admin/Reportes/Gastos/Gasto";
import RCuadreCaja from "../../pages/private/admin/Reportes/CuadreCaja/CuadreCaja";
import RItems from "../../pages/private/admin/Reportes/Items/Items";
import RAnulados from "../../pages/private/admin/Reportes/Anulados/Anulados";

import Setting from "../../pages/private/admin/Setting/Setting";
import SUsuarios from "../../pages/private/admin/Setting/Usuarios/Usuarios";
import SNegocio from "../../pages/private/admin/Setting/Negocio/Negocio";
import SPoints from "../../pages/private/admin/Setting/Points/Points";
import SImpuestos from "../../pages/private/admin/Setting/Impuestos/Impuestos";
import SMetas from "../../pages/private/admin/Setting/Metas/Metas";
import SProductos from "../../pages/private/admin/Setting/Portafolio/Productos/Productos";
import SServicios from "../../pages/private/admin/Setting/Portafolio/Servicios/Servicios";
import STipoGastos from "../../pages/private/admin/Setting/TipoGastos/TipoGastos";
import SCategorias from "../../pages/private/admin/Setting/Categorias/Categorias";
import Personal from "../../pages/private/coord/Personal/Personal";
import Asistencia from "../../pages/private/coord/Personal/Asistencia/Asistencia";
import Clientes from "../../pages/private/admin/Clientes/Clientes";

const Private = () => {
  return (
    <PrivateMainLayout>
      <RoutesWithNotFound>
        <Route
          path="/"
          element={<Navigate to={PrivateRoutes.LIST_ORDER_SERVICE} />}
        />
        {/* PAGES DEL PERSONAL */}
        <Route
          path={PrivateRoutes.LIST_ORDER_SERVICE}
          element={<ListOrdenService />}
        />
        {/* PAGES ADMINISTRADOR O PAGES GERENTE */}
        <Route element={<RoleGuard rol={Roles.GERENTE} />}>
          <Route path={PrivateRoutes.PROMOCIONES} element={<Promociones />} />
          <Route path={PrivateRoutes.CLIENTES} element={<Clientes />} />
          <Route
            path={`${PrivateRoutes.ASISTENCIA}/:id`}
            element={<Asistencia />}
          />
          <Route path={`${PrivateRoutes.PERSONAL}`} element={<Personal />} />
          <Route path={PrivateRoutes.SETTING} element={<Setting />} />
          <Route path={PrivateRoutes.SETTING_USERS} element={<SUsuarios />} />
          <Route path={PrivateRoutes.SETTING_BUSINESS} element={<SNegocio />} />
          <Route path={PrivateRoutes.SETTING_POINT} element={<SPoints />} />
          <Route path={PrivateRoutes.SETTING_TAXES} element={<SImpuestos />} />
          <Route path={PrivateRoutes.SETTING_GOALS} element={<SMetas />} />
          <Route
            path={PrivateRoutes.SETTING_PRODUCTOS}
            element={<SProductos />}
          />
          <Route
            path={PrivateRoutes.SETTING_SERVICIOS}
            element={<SServicios />}
          />
          <Route
            path={PrivateRoutes.SETTING_TIPO_GASTOS}
            element={<STipoGastos />}
          />
          <Route
            path={PrivateRoutes.SETTING_CATEGORIAS}
            element={<SCategorias />}
          />

          <Route path={PrivateRoutes.REGISTER_OLDS} element={<AddOld />} />
          <Route path={PrivateRoutes.REPORTES} element={<Reportes />} />
          <Route path={PrivateRoutes.REPORTE_ORDENES} element={<ROrdenes />} />
          <Route
            path={PrivateRoutes.REPORTE_PENDIENTES}
            element={<RPendientes />}
          />
          <Route path={PrivateRoutes.REPORTE_ALMACEN} element={<RAlmacen />} />
          <Route path={PrivateRoutes.REPORTE_GASTO} element={<RGasto />} />
          <Route
            path={PrivateRoutes.REPORTE_CUADRE_CAJA}
            element={<RCuadreCaja />}
          />
          <Route path={PrivateRoutes.REPORTE_PRODUCTOS} element={<RItems />} />
          <Route
            path={PrivateRoutes.REPORTE_ANULADOS}
            element={<RAnulados />}
          />
        </Route>
        {/* PAGES COORDINADOR */}
        <Route element={<RoleGuard rol={Roles.COORD} />}>
          <Route
            path={`${PrivateRoutes.EDIT_ORDER_SERVICE}/:id`}
            element={<EditOrdenService />}
          />
          <Route
            path={PrivateRoutes.REGISTER}
            element={<AddOrderService_R />}
          />
          <Route
            path={PrivateRoutes.REGISTER_DELIVERY}
            element={<AddOrderService_RDelivery />}
          />
          <Route
            path={`${PrivateRoutes.FINISH_ORDEN_SERVICE_PENDING}/:id`}
            element={<FinishReserva />}
          />
          <Route
            path={`${PrivateRoutes.ANULAR_REMPLAZAR}/:id`}
            element={<AnularReplace />}
          />
          <Route
            path={`${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/:id`}
            element={<Imprimir />}
          />
          <Route
            path={PrivateRoutes.REPORTE_ORDER_SERVICE}
            element={<ReporteMesual />}
          />
          <Route path={PrivateRoutes.CUADRE_CAJA} element={<CuadreCaja />} />
          {/* --------------- PRELIMINAR --------------- */}
          <Route
            path={PrivateRoutes.REGISTER_PRELIMINAR}
            element={<Preliminar />}
          />
          <Route
            path={`${PrivateRoutes.EDIT_ORDER_RECOJO}/:id`}
            element={<EditOrdenRecojo_Preliminar />}
          />
        </Route>
      </RoutesWithNotFound>
    </PrivateMainLayout>
  );
};

export default Private;
