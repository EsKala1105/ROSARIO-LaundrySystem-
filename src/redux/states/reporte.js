import { createSlice } from '@reduxjs/toolkit';
import { GetReporte } from '../actions/aReporte';

const reporte = createSlice({
  name: 'reporte',
  initialState: {
    stateReporte: false,
    infoReporte_xMes: [],
    infoReporte_xDias: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearReport_xMes: (state) => {
      state.reportMes = [];
    },
    clearReport_xDia: (state) => {
      state.reportDia = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(GetReporte.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetReporte.fulfilled, (state, action) => {
        state.isLoading = false;
        const { type, reporte } = action.payload;
        if (type === 'daily') state.infoReporte_xDias = reporte;
        if (type === 'monthly') state.infoReporte_xMes = reporte;
      })
      .addCase(GetReporte.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearReport_xMes, clearReport_xDia } = reporte.actions;

export default reporte.reducer;
