import { configureStore } from "@reduxjs/toolkit";
import codigo from "./states/codigo";
import service_order from "./states/service_order";
import user from "./states/user";
import reporte from "./states/reporte";
import cuadre from "./states/cuadre";
import gasto from "./states/gasto";
import metas from "./states/metas";
import modificadores from "./states/modificadores";
import promocion from "./states/promociones";
import negocio from "./states/negocio";
import categorias from "./states/categorias";
import productos from "./states/productos";
import servicios from "./states/servicios";
import pago from "./states/pago";
import tipoGasto from "./states/tipoGasto";
import clientes from "./states/clientes";

const store = configureStore({
  reducer: {
    user: user,
    orden: service_order,
    codigo: codigo,
    reporte: reporte,
    cuadre: cuadre,
    gasto: gasto,
    metas: metas,
    modificadores: modificadores,
    promocion: promocion,
    negocio: negocio,
    categorias: categorias,
    productos: productos,
    servicios: servicios,
    pago: pago,
    tipoGasto: tipoGasto,
    clientes: clientes,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
