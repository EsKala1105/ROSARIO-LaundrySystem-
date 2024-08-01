import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

export const addCliente = createAsyncThunk(
  "clientes/addCliente",
  async (newCliente) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-cliente`,
        newCliente
      );

      const data = response.data;

      Notify("Cliente Registrado Correctamente", "", "success");
      socket.emit("client:cClientes", {
        tipoAction: "add",
        data,
      });
      return data;
    } catch (error) {
      throw new Error(`No se pudo registrar  cliente - ${error}`);
    }
  }
);

export const getListClientes = createAsyncThunk(
  "clientes/getListClientes",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-info-clientes`
      );
      return response.data;
    } catch (error) {
      throw new Error(`No se pudo obtener la lista de clientes - ${error}`);
    }
  }
);

export const updateCliente = createAsyncThunk(
  "clientes/updateCliente",
  async ({ id, datosCliente }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/edit-cliente/${id}`,
        datosCliente
      );

      const data = response.data;

      Notify("Actualizado Correctamente", "", "success");
      socket.emit("client:cClientes", {
        tipoAction: "update",
        data,
      });

      return data;
    } catch (error) {
      throw new Error(`Error al Actualizar el cliente: - ${error}`);
    }
  }
);

// Eliminar una categoría
export const deleteCliente = createAsyncThunk(
  "clientes/deleteCliente",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/delete-cliente/${id}`
      );

      const data = response.data;

      Notify("Cliente Eliminado Exitosamente", "", "success");
      socket.emit("client:cClientes", {
        tipoAction: "delete",
        data,
      });

      return data;
    } catch (error) {
      throw new Error(`No se pudo Eliminar cliente - ${error}`);
    }
  }
);
