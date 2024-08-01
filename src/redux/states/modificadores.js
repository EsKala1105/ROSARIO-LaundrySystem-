import { createSlice } from '@reduxjs/toolkit';
import { GetImpuesto, updateImpuesto, updatePuntos, GetPuntos } from '../actions/aModificadores';

const modificadores = createSlice({
  name: 'modificadores',
  initialState: {
    InfoImpuesto: {},
    InfoPuntos: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    LS_updateImpuestos: (state, action) => {
      state.InfoImpuesto = action.payload;
    },
    LS_updatePuntos: (state, action) => {
      state.InfoPuntos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // -- IMPUESTO --
      // Update
      .addCase(updateImpuesto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateImpuesto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.InfoImpuesto = action.payload;
      })
      .addCase(updateImpuesto.rejected, (state) => {
        state.isLoading = false;
      })
      // List
      .addCase(GetImpuesto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetImpuesto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.InfoImpuesto = action.payload;
      })
      .addCase(GetImpuesto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // -- PUNTOS --
      // Update
      .addCase(updatePuntos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePuntos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.InfoPuntos = action.payload;
      })
      .addCase(updatePuntos.rejected, (state) => {
        state.isLoading = false;
      })
      // List
      .addCase(GetPuntos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetPuntos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.InfoPuntos = action.payload;
      })
      .addCase(GetPuntos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { LS_updatePuntos, LS_updateImpuestos } = modificadores.actions;
export default modificadores.reducer;
