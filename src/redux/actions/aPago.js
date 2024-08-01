import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";
import { LS_changePagoOnOrden } from "../states/service_order";

export const AddPago = createAsyncThunk(
  "pago/AddPago",
  async ({ newPago, extraInfo }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-pago`,
        newPago
      );

      const infoRes = response.data;

      const { orden, infoUser } = extraInfo;

      const info = { ...infoRes, ...orden, infoUser };
      const infoAdd = {
        tipo: "added",
        info: info,
      };
      dispatch(LS_changePagoOnOrden(infoAdd));
      socket.emit("client:cPago", infoAdd);
      Notify("Registro Exitoso", "", "success");
      return info;
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudo agregar Pago", "fail");
      throw new Error(error);
    }
  }
);

export const UpdatePago = createAsyncThunk(
  "gastos/UpdatePago",
  async ({ idPago, pagoUpdated, extraInfo }, { dispatch }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/edit-pago/${idPago}`,
        pagoUpdated
      );

      const infoRes = response.data;

      const { orden, infoUser } = extraInfo;

      const info = { ...infoRes, ...orden, infoUser };
      const infoUpdate = {
        tipo: "updated",
        info: info,
      };

      dispatch(LS_changePagoOnOrden(infoUpdate));
      socket.emit("client:cPago", infoUpdate);
      return info;
    } catch (error) {
      // Puedes manejar los errores aquí
      Notify("Error", "No se pudo actualizar el pago -", "fail");
      throw new Error(error);
    }
  }
);

export const DeletePago = createAsyncThunk(
  "gastos/DeletePago",
  async (idPago, { dispatch }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/delete-pago/${idPago}`
      );

      const infoRes = response.data;
      const { _id: idPagoToDelete } = infoRes;

      const infoDelete = {
        tipo: "deleted",
        info: infoRes,
      };

      dispatch(LS_changePagoOnOrden(infoDelete));
      socket.emit("client:cPago", infoDelete);
      return idPagoToDelete;
    } catch (error) {
      // Maneja los errores según tu lógica de aplicación
      Notify("Error", "No se pudo eliminar el pago", "fail");
      throw new Error(error);
    }
  }
);
