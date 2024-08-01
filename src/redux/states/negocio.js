import { createSlice } from '@reduxjs/toolkit';
import { UpdateInfoNegocio, GetInfoNegocio } from '../actions/aNegocio';

const negocio = createSlice({
  name: 'negocio',
  initialState: {
    infoNegocio: {},
    isLoading: false,
    messageGeneral: {},
    error: null,
  },
  reducers: {
    LS_updateNegocio: (state, action) => {
      state.infoNegocio = action.payload;
    },
    messageGeneral: (state, action) => {
      state.messageGeneral = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(GetInfoNegocio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetInfoNegocio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoNegocio = action.payload;
      })
      .addCase(GetInfoNegocio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(UpdateInfoNegocio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateInfoNegocio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoNegocio = action.payload;
      })
      .addCase(UpdateInfoNegocio.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { LS_updateNegocio, messageGeneral } = negocio.actions;

export default negocio.reducer;
