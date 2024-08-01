import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notify } from '../../utils/notify/Notify';

export const GetReporte = createAsyncThunk('reporte/GetReporte', async ({ type, filter }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-report/date-prevista/${type}`,
      filter
    );

    return { type, reporte: response.data };
  } catch (error) {
    // Puedes manejar los errores aquí
    console.log(error.response.data.mensaje);
    Notify('Error', 'No se pudieron obtener los datos de REPORTE DIARIO', 'fail');
    throw new Error('No se pudieron obtener los datos de REPORTE DIARIO');
  }
});
