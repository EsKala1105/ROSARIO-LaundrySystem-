import { createSlice } from "@reduxjs/toolkit";
import { AddPago, UpdatePago, DeletePago } from "../actions/aPago";

const pago = createSlice({
  name: "pago",
  initialState: {
    infoPago: [],
    listPagoByDate: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // AddPago
      .addCase(AddPago.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddPago.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listPagoByDate.push(action.payload);
      })
      .addCase(AddPago.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // UpdatePago
      .addCase(UpdatePago.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPago = action.payload;
        const indexPago = state.listPagoByDate.findIndex(
          (pago) => pago?._id === updatedPago?._id
        );
        if (indexPago !== -1) {
          state.listPagoByDate[indexPago] = updatedPago;
        } else {
          console.error("No se encontró el pago a actualizar");
        }
      })
      .addCase(UpdatePago.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // DeletePago
      .addCase(DeletePago.fulfilled, (state, action) => {
        state.isLoading = false;
        const idPagoToDelete = action.payload;
        state.listPagoByDate = state.listPagoByDate.filter(
          (pago) => pago?._id !== idPagoToDelete
        );
      })
      .addCase(DeletePago.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default pago.reducer;
