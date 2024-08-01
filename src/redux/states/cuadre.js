import { createSlice } from "@reduxjs/toolkit";
import { GetCuadre, GetPagos_OnCuadreToday } from "../actions/aCuadre";
import { MONTOS_BASE } from "../../services/global";

// Función auxiliar para actualizar un registro en un array
const updateRegistro = (registros, nuevoRegistro) => {
  const indexToUpdate = registros.findIndex(
    (registro) => registro._id === nuevoRegistro._id
  );
  if (indexToUpdate !== -1) {
    registros[indexToUpdate] = nuevoRegistro;
  }
};

const cuadre = createSlice({
  name: "cuadre",
  initialState: {
    infoCuadre: null,
    lastCuadre: null,
    infoBase: null,
    cuadreActual: null,
    registroNoCuadrados: { gastos: [], pagos: [] },
    paysToDay: [],
    spendToDay: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    updateRegistrosNCuadrados: (state, action) => {
      const { tipoMovimiento, data } = action.payload;
      const { tipo, info } = data;

      // Determina qué array de registros actualizar
      const registrosToUpdate =
        tipoMovimiento === "gastos"
          ? state.registroNoCuadrados.gastos
          : state.registroNoCuadrados.pagos;

      switch (tipo) {
        case "added":
          registrosToUpdate.push(info);
          break;
        case "updated":
          updateRegistro(registrosToUpdate, info);
          break;
        case "deleted":
          state.registroNoCuadrados = {
            ...state.registroNoCuadrados,
            [tipoMovimiento]: registrosToUpdate.filter(
              (item) => item._id !== info._id
            ),
          };
          break;
        default:
          break;
      }
    },
    clearInfoCuadre: (state) => {
      state.infoCuadre = null;
      state.lastCuadre = null;
      state.infoBase = null;
      state.cuadreActual = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List Cuadres
      .addCase(GetCuadre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetCuadre.fulfilled, (state, action) => {
        state.isLoading = false;
        const lastCuadre = action.payload.lastCuadre;
        const cuadreActual = action.payload.cuadreActual;
        const infoBase = {
          ...action.payload.infoBase,
          Montos: MONTOS_BASE,
        };

        const listCuadres = action.payload.listCuadres;
        const newListCuadres =
          listCuadres?.length > 0
            ? listCuadres.filter((c) => c._id !== cuadreActual._id)
            : [];
        state.infoCuadre = newListCuadres;
        state.lastCuadre = lastCuadre;
        state.lastCuadre = lastCuadre;
        state.infoBase = infoBase;
        state.registroNoCuadrados = action.payload.registroNoCuadrados;

        if (!cuadreActual.saved) {
          state.cuadreActual = { ...cuadreActual, Montos: MONTOS_BASE };
        } else {
          state.cuadreActual = cuadreActual;
        }

        const IdsPagos = lastCuadre
          ? lastCuadre.Pagos.map((order) => order._id)
          : [];

        const IdsGastos = lastCuadre
          ? lastCuadre.Gastos.map((order) => order._id)
          : [];

        state.paysToDay = [...new Set([...state.paysToDay, ...IdsPagos])];
        state.spendToDay = [...new Set([...state.spendToDay, ...IdsGastos])];
      })
      .addCase(GetCuadre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Get Pagos del Cuadre del Hoy
      .addCase(GetPagos_OnCuadreToday.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetPagos_OnCuadreToday.fulfilled, (state, action) => {
        state.isLoading = false;
        const { Pagos, Gastos } = action.payload;
        state.paysToDay = Pagos;
        state.spendToDay = Gastos;
      })
      .addCase(GetPagos_OnCuadreToday.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearInfoCuadre, updateRegistrosNCuadrados } = cuadre.actions;
export default cuadre.reducer;
