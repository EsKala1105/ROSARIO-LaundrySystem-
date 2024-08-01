import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

export const AddTipoGasto = createAsyncThunk(
  "tipoGasto/AddTipoGasto",
  async (infoGasto) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-tipo-gasto`,
        infoGasto
      );
      socket.emit("client:cGasto", response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo agregar Gasto", "sfail");
      throw new Error(error);
    }
  }
);

export const GetTipoGastos = createAsyncThunk(
  "tipoGasto/GetTipoGastos",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-tipo-gastos`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      throw new Error(
        `No se pudieron obtener los datos del usuario - ${error}`
      );
    }
  }
);

export const UpdateTipoGastos = createAsyncThunk(
  "tipoGasto/UpdateTipoGastos",
  async (tipoGasto) => {
    const { id, infoTipoGasto } = tipoGasto;
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-tipo-gasto/${id}`,
        infoTipoGasto
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      throw new Error(`No se pudo actualizar el tipo de gasto - ${error}`);
    }
  }
);

export const DeleteTipoGastos = createAsyncThunk(
  "tipoGasto/DeleteTipoGastos",
  async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/delete-tipo-gasto/${id}`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      throw new Error(`No se pudo eliminar el tipo de gasto - ${error}`);
    }
  }
);
