import { createSlice } from "@reduxjs/toolkit";
import { AddGasto, DeleteGasto, GetGastosByDate } from "../actions/aGasto";

const gasto = createSlice({
  name: "gasto",
  initialState: {
    infoGasto: [],
    listGastoByDate: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // LS_changeListGastoByDate: (state, action) => {
    //   const { tipo, info } = action.payload;
    //   // Realizar la acción según el tipo
    //   if (tipo === "deleted") {
    //     // Eliminar el gasto del array ListGasto
    //     state.listGastoByDate = state.listGastoByDate.filter(
    //       (gasto) => gasto?._id !== info?._id
    //     );
    //   } else if (tipo === "updated") {
    //     // Actualizar el gasto con la nueva información
    //     const indexGasto = state.listGastoByDate.findIndex(
    //       (gasto) => gasto?._id === info?._id
    //     );
    //     if (indexGasto !== -1) {
    //       state.listGastoByDate[indexGasto] = info;
    //     } else {
    //       console.error("No se encontró el gasto a actualizar");
    //     }
    //   } else if (tipo === "added") {
    //     // Agregar el nuevo gasto a ListGasto
    //     if (!state.listGastoByDate.some((gasto) => gasto?._id === info?._id)) {
    //       state.listGastoByDate.push(info);
    //     }
    //   } else {
    //     console.error("Tipo de acción no válido");
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(AddGasto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddGasto.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.infoGasto.findIndex(
          (item) => item._id === action.payload._id
        );
        if (exists === -1) {
          state.infoGasto.push(action.payload);
        }
      })
      .addCase(AddGasto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Delete
      .addCase(DeleteGasto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(DeleteGasto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoGasto = state.infoGasto.filter(
          (gasto) => gasto._id !== action.payload._id
        );
      })
      .addCase(DeleteGasto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // List x Date
      .addCase(GetGastosByDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetGastosByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listGastoByDate = action.payload;
      })
      .addCase(GetGastosByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// export const { LS_changeListGastoByDate } = gasto.actions;
export default gasto.reducer;
