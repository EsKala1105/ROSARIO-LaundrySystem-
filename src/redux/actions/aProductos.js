import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Obtener la lista de productos
export const getProductos = createAsyncThunk('productos/getProductos', async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-productos`);
    return response.data;
  } catch (error) {
    throw new Error(`No se pudieron obtener los productos - ${error}`);
  }
});

// Agregar un nuevo producto
export const addProducto = createAsyncThunk('productos/addProducto', async (productoData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-producto`, productoData);
    return response.data;
  } catch (error) {
    throw new Error(`No se pudo agregar el producto - ${error}`);
  }
});

// Actualizar un producto
export const updateProducto = createAsyncThunk('productos/updateProducto', async ({ idProducto, productoData }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/update-producto/${idProducto}`,
      productoData
    );
    return response.data;
  } catch (error) {
    throw new Error(`No se pudo actualizar el producto - ${error}`);
  }
});

// Actualizar el inventario de un producto
export const updateInventario = createAsyncThunk(
  'productos/updateInventario',
  async ({ idProducto, inventarioData }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/update-inventario/${idProducto}`,
        inventarioData
      );
      return response.data;
    } catch (error) {
      throw new Error(`No se pudo actualizar el inventario del producto - ${error}`);
    }
  }
);

// Eliminar un producto
export const deleteProducto = createAsyncThunk('productos/deleteProducto', async (idProducto) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/delete-producto/${idProducto}`
    );
    // Verificar la respuesta del servidor
    if (response.status === 200) {
      return { idProducto };
    }
  } catch (error) {
    throw new Error(`No se pudo eliminar el producto - ${error}`);
  }
});
