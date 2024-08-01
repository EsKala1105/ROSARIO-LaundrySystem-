import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { socket } from "../../utils/socket/connect";
import { DateCurrent } from "../../utils/functions";

// export const GetCuadre = createAsyncThunk('cuadreDiario/GetCuadre', async ({ dateCuadre, userID }) => {
export const GetCuadre = createAsyncThunk(
  "cuadreDiario/GetCuadre",
  async ({ date, id }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-cuadre/${id}/${date}`
      );

      return response.data;
    } catch (error) {
      console.log(error);
      // Manejo de errores
      throw new Error("No se pudieron obtener los datos");
    }
  }
);

export const SaveCuadre = createAsyncThunk(
  "cuadreDiario/SaveCuadre",
  async (infoCuadreDiario) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/save-cuadre`,
        infoCuadreDiario
      );
      socket.emit("client:changeCuadre", "");
      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      throw new Error(
        `No se Registro la Orden - ${error.response.data.mensaje}`
      );
    }
  }
);

export const UpdateCuadre = createAsyncThunk(
  "cuadreDiario/UpdateCuadre",
  async ({ idCuadre, infoCuadreDiario }) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-cuadre/${idCuadre}`,
        infoCuadreDiario
      );

      socket.emit("client:changeCuadre", "");
      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      throw new Error(
        `No se Registro la Orden - ${error.response.data.mensaje}`
      );
    }
  }
);

export const GetPagos_OnCuadreToday = createAsyncThunk(
  "cuadreDiario/GetPagos_OnCuadreToday",
  async () => {
    try {
      const currentDate = DateCurrent().format4;
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-pagos/cuadre/${currentDate}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      // Manejo de errores
      throw new Error("No se pudieron obtener los datos");
    }
  }
);
