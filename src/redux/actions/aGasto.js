import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

export const AddGasto = createAsyncThunk(
  "gasto/AddGasto",
  async (infoGasto) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-gasto`,
        infoGasto
      );

      const infoRes = response.data;
      const { info } = infoRes;
      socket.emit("client:cGasto", infoRes);
      Notify("Gasto Agregado", "", "success");
      return info;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo agregar Gasto", "fail");
      throw new Error(error);
    }
  }
);

export const GetGastosByDate = createAsyncThunk(
  "gastos/GetGastosDate",
  async (fecha) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-gastos/${fecha}`
      );

      return response.data;
    } catch (error) {
      // Maneja los errores aquí
      throw new Error(`No se pudo eliminar el gasto - ${error}`);
    }
  }
);

export const DeleteGasto = createAsyncThunk(
  "gasto/DeleteGasto",
  async ({ id, rol }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/delete-gasto/${id}`,
        { data: { rol } }
      );

      const infoRes = response.data;
      const { info } = infoRes;
      socket.emit("client:cGasto", infoRes);
      Notify("Gasto Eliminado", "", "success");
      return info;
    } catch (error) {
      // Maneja los errores aquí
      throw new Error(`No se pudo eliminar el gasto - ${error}`);
    }
  }
);
