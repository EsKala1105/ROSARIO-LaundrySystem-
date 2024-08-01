import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notify } from '../../utils/notify/Notify';
import { nameImpuesto } from '../../services/global';
import { socket } from '../../utils/socket/connect';
const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya`;

export const updateImpuesto = createAsyncThunk('modificadores/updateImpuesto', async (info) => {
  try {
    const response = await axios.post(`${baseURL}/update-impuesto`, info);
    const data = response.data;
    socket.emit('client:cImpuesto', response.data);
    return data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    Notify('Error', `No se pudo actualiza ${nameImpuesto}`, 'fail');
    throw new Error(error);
  }
});

export const GetImpuesto = createAsyncThunk('modificadores/GetImpuesto ', async () => {
  try {
    const response = await axios.get(`${baseURL}/get-impuesto`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    throw new Error(`Error al Obtener info de Impuestos - ${error}`);
  }
});

export const updatePuntos = createAsyncThunk('modificadores/updatePuntos', async (info) => {
  try {
    const response = await axios.post(`${baseURL}/update-point-value`, info);
    const data = response.data;
    socket.emit('client:cPuntos', data);
    return data;
    // if (data) {
    //   navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
    // }
  } catch (error) {
    console.log(error.response.data.mensaje);
    Notify('Error', 'No se pudo actualiza valor de Puntos', 'fail');
    throw new Error(error);
  }
});

export const GetPuntos = createAsyncThunk('modificadores/GetPuntos ', async () => {
  try {
    const response = await axios.get(`${baseURL}/get-point-value`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    throw new Error(`Error al Obtener info de Puntaje - ${error}`);
  }
});
