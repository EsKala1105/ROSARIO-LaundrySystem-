import { createSlice } from "@reduxjs/toolkit";
import {
  AddTipoGasto,
  DeleteTipoGastos,
  GetTipoGastos,
  UpdateTipoGastos,
} from "../actions/aTipoGasto";

const tipoGastoSlice = createSlice({
  name: "tipoGasto",
  initialState: {
    infoTipoGasto: [],
    iDeliveryEnvio: null,
    iDeliveryRecojo: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Aquí puedes definir tus propias acciones si es necesario
  },
  extraReducers: (builder) => {
    builder
      // Agregar
      .addCase(AddTipoGasto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddTipoGasto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoTipoGasto.push(action.payload);
      })
      .addCase(AddTipoGasto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Obtener lista
      .addCase(GetTipoGastos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetTipoGastos.fulfilled, (state, action) => {
        const { listGastos, deliveryEnvio, deliveryRecojo } = action.payload;

        const existingGastosSet = new Set(
          state.infoTipoGasto.map((gasto) => gasto._id)
        );

        const newGastos = listGastos.filter(
          (gasto) => !existingGastosSet.has(gasto._id)
        );

        state.infoTipoGasto.push(...newGastos);
        state.iDeliveryEnvio = deliveryEnvio;
        state.iDeliveryRecojo = deliveryRecojo;
      })
      .addCase(GetTipoGastos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizar
      .addCase(UpdateTipoGastos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateTipoGastos.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedIndex = state.infoTipoGasto.findIndex(
          (item) => item._id === action.payload._id
        );
        if (updatedIndex !== -1) {
          state.infoTipoGasto[updatedIndex] = action.payload;
        }
      })
      .addCase(UpdateTipoGastos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Eliminar
      .addCase(DeleteTipoGastos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(DeleteTipoGastos.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload; // Suponiendo que el payload sea el ID del tipo de gasto eliminado
        state.infoTipoGasto = state.infoTipoGasto.filter(
          (item) => item._id !== deletedId
        );
      })
      .addCase(DeleteTipoGastos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default tipoGastoSlice.reducer;
