import { createSlice } from "@reduxjs/toolkit";
import {
  getListClientes,
  addCliente,
  updateCliente,
  deleteCliente,
} from "../actions/aClientes";

const clientes = createSlice({
  name: "clientes",
  initialState: {
    listClientes: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    LS_changeCliente: (state, action) => {
      const { tipoAction, data } = action.payload;
      if (tipoAction === "add") {
        const existingCliente = state.listClientes.find(
          (cliente) => cliente._id === data._id
        );
        if (!existingCliente) {
          state.listClientes.push(data);
        }
      } else if (tipoAction === "update") {
        const updatedClienteIndex = state.listClientes.findIndex(
          (cliente) => cliente._id === data._id
        );
        if (updatedClienteIndex !== -1) {
          state.listClientes[updatedClienteIndex] = data;
        }
      } else if (tipoAction === "delete") {
        state.listClientes = state.listClientes.filter(
          (cliente) => cliente._id !== data._id
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Agregar un cliente
      .addCase(addCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCliente.fulfilled, (state, action) => {
        state.listClientes.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Obtener la lista de clientes
      .addCase(getListClientes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListClientes.fulfilled, (state, action) => {
        state.listClientes = action.payload;
        state.isLoading = false;
      })
      .addCase(getListClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizar un cliente
      .addCase(updateCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCliente.fulfilled, (state, action) => {
        const updatedClienteIndex = state.listClientes.findIndex(
          (cliente) => cliente._id === action.payload._id
        );
        if (updatedClienteIndex !== -1) {
          state.listClientes[updatedClienteIndex] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Eliminar un cliente
      .addCase(deleteCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.listClientes = state.listClientes.filter(
          (cliente) => cliente._id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { LS_changeCliente } = clientes.actions;
export default clientes.reducer;
