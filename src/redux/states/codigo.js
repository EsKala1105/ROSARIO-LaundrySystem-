import { createSlice } from "@reduxjs/toolkit";
import { GetCodigos, UpdateNextCodigo } from "../actions/aCodigo";

const codigo = createSlice({
  name: "codigo",
  initialState: {
    infoCodigo: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    LS_nextCodigo: (state, action) => {
      state.infoCodigo.codActual = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(GetCodigos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetCodigos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoCodigo = action.payload;
      })
      .addCase(GetCodigos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(UpdateNextCodigo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateNextCodigo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoCodigo = action.payload;
      })
      .addCase(UpdateNextCodigo.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { LS_nextCodigo } = codigo.actions;
export default codigo.reducer;
