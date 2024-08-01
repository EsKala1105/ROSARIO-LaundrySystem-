import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

export const addPromocion = createAsyncThunk(
  "promocion/addPromocion",
  async (promocionData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-promocion`,
        promocionData
      );
      const { info } = response.data;
      socket.emit("client:cPromotions", response.data);
      Notify("Registro Exitoso", "", "success");
      return info;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo agregar Promocion", "fail");
      throw new Error(error);
    }
  }
);
export const updatePromocion = createAsyncThunk(
  "promocion/updatePromocion",
  async ({ id, infoPromo }) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-promocion/${id}`,
        infoPromo
      );
      const { info } = response.data;
      socket.emit("client:cPromotions", response.data);
      Notify("Actualizacion Exitosa", "", "success");
      return info;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo actualizar la promoción", "fail");
      throw new Error(error);
    }
  }
);

export const GetPromocion = createAsyncThunk(
  "promocion/GetPromocion ",
  async () => {
    try {
      const respuesta = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-promociones`
      );
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.mensaje);
      throw new Error(`No obtener promociones - ${error}`);
    }
  }
);

export const DeletePromocion = createAsyncThunk(
  "promocion/DeletePromocion ",
  async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/eliminar-promocion/${id}`
      );

      const data = response.data;
      const { info } = data;

      socket.emit("client:cPromotions", data);
      Notify("Elimnacion Exitosa", "", "success");
      return info;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo eliminar Promocion", "fail");
      throw new Error(error);
    }
  }
);
