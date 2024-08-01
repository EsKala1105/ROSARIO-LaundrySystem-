import { createSlice } from "@reduxjs/toolkit";
import {
  getListCategorias,
  addCategoria,
  updateCategoria,
  deleteCategoria,
} from "../actions/aCategorias";

const categorias = createSlice({
  name: "categorias",
  initialState: {
    listCategorias: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    LS_changeCategoria: (state, action) => {
      const { tipoAction, data } = action.payload;

      let indexCategoria;
      if (tipoAction !== "added") {
        // Buscar el servicio dentro de listCategorias por su _id
        indexCategoria = state.listCategorias.findIndex(
          (categoria) => categoria._id === data._id
        );

        // Verificar si se encontró el servicio
        if (indexCategoria === -1) {
          console.error("Servicio no encontrado");
          return;
        }
      }

      // Realizar la acción según el tipoAction
      switch (tipoAction) {
        case "deleted":
          // Eliminar el servicio del array listCategorias
          state.listCategorias = state.listCategorias.filter(
            (categoria) => categoria._id !== data._id
          );
          break;
        case "updated":
          // Actualizar el servicio con la nueva información
          state.listCategorias[indexCategoria] = data;
          break;
        case "added":
          // Verificar si el servicio ya existe en listCategorias
          if (
            !state.listCategorias.some(
              (categoria) => categoria._id === data._id
            )
          ) {
            // Agregar el nuevo servicio a listCategorias solo si no existe
            state.listCategorias.push(data);
          }
          break;
        default:
          console.error("Tipo de acción desconocido");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Agregar una categoría
      .addCase(addCategoria.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCategoria.fulfilled, (state, action) => {
        state.listCategorias.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Obtener la lista de categorías
      .addCase(getListCategorias.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListCategorias.fulfilled, (state, action) => {
        state.listCategorias = action.payload;
        state.isLoading = false;
      })
      .addCase(getListCategorias.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizar una categoría
      .addCase(updateCategoria.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoria.fulfilled, (state, action) => {
        const updatedCategoriaIndex = state.listCategorias.findIndex(
          (categoria) => categoria._id === action.payload._id
        );
        if (updatedCategoriaIndex !== -1) {
          state.listCategorias[updatedCategoriaIndex] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Eliminar una categoría
      .addCase(deleteCategoria.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoria.fulfilled, (state, action) => {
        state.listCategorias = state.listCategorias.filter(
          (categoria) => categoria._id !== action.payload._id
        );
        state.isLoading = false;
      })
      .addCase(deleteCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { LS_changeCategoria } = categorias.actions;
export default categorias.reducer;
