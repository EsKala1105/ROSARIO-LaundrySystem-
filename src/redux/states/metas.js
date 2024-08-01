import { createSlice } from '@reduxjs/toolkit';
import { GetMetas, UpdateMetas } from '../actions/aMetas';

const gasto = createSlice({
  name: 'metas',
  initialState: {
    infoMetas: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(GetMetas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetMetas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoMetas = action.payload;
      })
      .addCase(GetMetas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(UpdateMetas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateMetas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoMetas = action.payload;
      })
      .addCase(UpdateMetas.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default gasto.reducer;
