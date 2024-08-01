import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notify } from '../../utils/notify/Notify';
import { socket } from '../../utils/socket/connect';

export const GetInfoNegocio = createAsyncThunk('negocio/GetInfoNegocio', async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-info-negocio`);
    return response.data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    throw new Error(`No se pudo obtener informacion del Negocio - ${error}`);
  }
});

export const UpdateInfoNegocio = createAsyncThunk('negocio/UpdateInfoNegocio', async (info) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/update-info-negocio`, info);
    const data = response.data;

    socket.emit('client:cNegocio', data);
    return data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    Notify('Error', 'No se pudo actualizar informacion del Negocio', 'fail');
    throw new Error(error);
  }
});
