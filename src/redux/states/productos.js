import { createSlice } from '@reduxjs/toolkit';
import { getProductos, addProducto, updateProducto, updateInventario, deleteProducto } from '../actions/aProductos';

const productos = createSlice({
  name: 'productos',
  initialState: {
    listProductos: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener la lista de productos
      .addCase(getProductos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductos.fulfilled, (state, action) => {
        state.listProductos = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Agregar un nuevo producto
      .addCase(addProducto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProducto.fulfilled, (state, action) => {
        state.listProductos.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addProducto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizar un producto
      .addCase(updateProducto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProducto.fulfilled, (state, action) => {
        // Actualizar el producto en la lista
        const updatedIndex = state.listProductos.findIndex((producto) => producto._id === action.payload._id);
        if (updatedIndex !== -1) {
          state.listProductos[updatedIndex] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateProducto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Actualizar el inventario de un producto
      .addCase(updateInventario.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInventario.fulfilled, (state, action) => {
        // Actualizar el producto en la lista
        const updatedIndex = state.listProductos.findIndex((producto) => producto._id === action.payload._id);
        if (updatedIndex !== -1) {
          state.listProductos[updatedIndex] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateInventario.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Eliminar un producto
      .addCase(deleteProducto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProducto.fulfilled, (state, action) => {
        state.listProductos = state.listProductos.filter((producto) => producto._id !== action.payload.idProducto);
        state.isLoading = false;
      })
      .addCase(deleteProducto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default productos.reducer;
