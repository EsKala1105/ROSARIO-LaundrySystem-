/* eslint-disable no-unreachable */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

// Obtener la lista de servicios
export const getServicios = createAsyncThunk(
  "servicios/getServicios",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-servicios`
      );

      return response.data;
    } catch (error) {
      throw new Error(`No se pudieron obtener los servicios - ${error}`);
    }
  }
);

// Agregar un nuevo servicio
export const addServicio = createAsyncThunk(
  "servicios/addServicio",
  async (nuevoServicio) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-servicio`,
        nuevoServicio
      );

      const info = response.data;
      const { data } = info;

      socket.emit("client:cService", info);
      Notify("Registro de Servicio Exitoso", "", "success");

      return data;
    } catch (error) {
      Notify("Error: No se pudo Registrar Servicio", "", "fail");
      throw new Error(`No se pudo agregar el servicio - ${error}`);
    }
  }
);

// Actualizar un servicio existente
export const updateServicio = createAsyncThunk(
  "servicios/updateServicio",
  async (infoToUpdated) => {
    const { idServicio, servicioActualizado } = infoToUpdated;

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-servicio/${idServicio}`,
        servicioActualizado
      );

      const info = response.data;
      const { data } = info;
      socket.emit("client:cService", info);

      Notify("Actualizacion de Servicio Exitosa", "", "success");
      return data;
    } catch (error) {
      Notify("Error: No se pudo Actualizar Servicio", "", "fail");
      throw new Error(`No se pudo actualizar el servicio - ${error}`);
    }
  }
);

// Eliminar un servicio
export const deleteServicio = createAsyncThunk(
  "servicios/deleteServicio",
  async (idServicio, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/delete-servicio/${idServicio}`
      );

      const info = response.data;
      const { data } = info;
      socket.emit("client:cService", info);

      Notify("Servicio eliminado con éxito", "", "success");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
