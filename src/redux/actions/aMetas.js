import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notify } from '../../utils/notify/Notify';

export const GetMetas = createAsyncThunk('metas/GetMetas', async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-metas`);

    return response.data;
  } catch (error) {
    // Puedes manejar los errores aquí
    console.log(error.response.data.mensaje);
    throw new Error(`No se pudieron obtener las metas - ${error}`);
  }
});

export const UpdateMetas = createAsyncThunk('metas/UpdateMetas', async (info) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/update-metas`, info);
    const data = response.data;

    return data;
  } catch (error) {
    console.log(error.response.data.mensaje);
    Notify('Error', 'Actualizacion de informacion en Metas no se pudo realizar', 'fail');
    throw new Error(error);
  }
});
