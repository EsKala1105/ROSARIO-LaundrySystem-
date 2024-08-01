import {
  clearLocalStorage,
  persistLocalStorage,
} from "../../utils/persistence.local-storage/localStorage.util";
import { createSlice } from "@reduxjs/toolkit";
import { GetInfoUser } from "../actions/aUser";
import { notifications } from "@mantine/notifications";
export const userKey = "user";

const user = createSlice({
  name: "user",
  initialState: {
    infoUsuario: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    setInfoUser: (state, action) => {
      state.infoUsuario = action.payload;
    },
    loginUser: (action) => {
      persistLocalStorage(userKey, action.payload);
    },
    resetUser: (state) => {
      clearLocalStorage(userKey);
      notifications.clean();
      state.infoUsuario = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener info de Usuario Logueado
      .addCase(GetInfoUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetInfoUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoUsuario = action.payload;
      })
      .addCase(GetInfoUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setInfoUser, loginUser, resetUser } = user.actions;
export default user.reducer;
