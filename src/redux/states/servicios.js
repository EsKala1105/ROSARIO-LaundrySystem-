import { createSlice } from "@reduxjs/toolkit";
import {
  getServicios,
  addServicio,
  updateServicio,
  deleteServicio,
} from "../actions/aServicios";

const servicios = createSlice({
  name: "servicios",
  initialState: {
    listServicios: [],
    serviceDelivery: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    LS_changeService: (state, action) => {
      const { tipoAction, data } = action.payload;

      let indexService;
      if (tipoAction !== "added") {
        // Buscar el servicio dentro de listServicios por su _id
        indexService = state.listServicios.findIndex(
          (service) => service._id === data._id
        );

        // Verificar si se encontró el servicio
        if (indexService === -1) {
          console.error("Servicio no encontrado");
          return;
        }
      }

      // Realizar la acción según el tipoAction
      switch (tipoAction) {
        case "deleted":
          // Eliminar el servicio del array listServicios
          state.listServicios = state.listServicios.filter(
            (service) => service._id !== data._id
          );
          break;
        case "updated":
          // Actualizar el servicio con la nueva información
          state.listServicios[indexService] = data;
          break;
        case "added":
          // Verificar si el servicio ya existe en listServicios
          if (
            !state.listServicios.some((service) => service._id === data._id)
          ) {
            // Agregar el nuevo servicio a listServicios solo si no existe
            state.listServicios.push(data);
          }
          break;
        default:
          console.error("Tipo de acción desconocido");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Obteniendo la lista de servicios
      .addCase(getServicios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServicios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listServicios = action.payload.servicios;
        state.serviceDelivery = action.payload.servicioDelivery;
      })
      .addCase(getServicios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Agregando un nuevo servicio
      .addCase(addServicio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addServicio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listServicios.push(action.payload);
      })
      .addCase(addServicio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizando un servicio existente
      .addCase(updateServicio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateServicio.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedServicio = action.payload;
        const index = state.listServicios.findIndex(
          (servicio) => servicio._id === updatedServicio._id
        );
        if (index !== -1) {
          state.listServicios[index] = updatedServicio;
        }
      })
      .addCase(updateServicio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Eliminando un servicio
      .addCase(deleteServicio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteServicio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listServicios = state.listServicios.filter(
          (servicio) => servicio._id !== action.payload._id
        );
      })
      .addCase(deleteServicio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { LS_changeService } = servicios.actions;
export default servicios.reducer;
