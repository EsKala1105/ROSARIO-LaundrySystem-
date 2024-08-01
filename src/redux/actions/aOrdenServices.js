import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Notify } from "../../utils/notify/Notify";
import { socket } from "../../utils/socket/connect";

export const GetOrdenServices_DateRange = createAsyncThunk(
  "service_order/GetOrdenServices_DateRange",
  async ({ dateInicio, dateFin }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-factura/date-range/${dateInicio}/${dateFin}`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      //Notify('Error', 'No se ontemer la lista de Ordenes de Servicio', 'fail');
      console.log(error.response.data.mensaje);
      throw new Error(`No se pudo actualizar el cliente - ${error}`);
    }
  }
);

export const GetOrdenServices_Last = createAsyncThunk(
  "service_order/GetOrdenServices_Last",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-order/last`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      //Notify('Error', 'No se ontemer la lista de Ordenes de Servicio', 'fail');
      console.log(error.response.data.mensaje);
      throw new Error(`No se obtener ordenes de servicio - ${error}`);
    }
  }
);

export const GetOrdenServices_Preliminar = createAsyncThunk(
  "service_order/GetOrdenServices_Preliminar",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-order/preliminar`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      //Notify('Error', 'No se ontemer la lista de Ordenes de Servicio', 'fail');
      console.log(error.response.data.mensaje);
      throw new Error(`No se obtener ordenes de servicio- ${error}`);
    }
  }
);

export const GetOrdenServices_Date = createAsyncThunk(
  "service_order/GetOrdenServices_Date",
  async (date) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-factura/date/${date}`
      );

      return response.data;
    } catch (error) {
      // Puedes manejar los errores aquí
      //Notify('Error', 'No se ontemer la lista de Ordenes de Servicio', 'fail');
      console.log(error.response.data.mensaje);
      throw new Error(`No se pudo actualizar el cliente - ${error}`);
    }
  }
);

export const AddOrdenServices = createAsyncThunk(
  "service_order/AddOrdenServices",
  async ({ infoOrden, infoPago, infoGastoByDelivery, rol, infoUser }) => {
    try {
      const dataSend = {
        infoOrden,
        ...(infoPago && { infoPago }),
        rol,
        ...(infoOrden.Modalidad === "Delivery" && { infoGastoByDelivery }),
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/add-factura`,
        dataSend
      );

      Notify("Registro de Orden Exitoso", "", "success");

      const res = response.data;
      const { newOrder } = res;

      if ("newPago" in res) {
        const { newPago } = res;
        const pago = {
          tipo: "added",
          info: {
            ...newPago,
            infoUser,
          },
        };
        socket.emit("client:cPago", pago);
      }

      if ("newGasto" in res) {
        const { newGasto } = res;
        socket.emit("client:cGasto", newGasto);
      }

      if ("changeCliente" in res) {
        const { changeCliente } = res;
        socket.emit("client:cClientes", changeCliente);
      }

      if ("newCodigo" in res) {
        const { newCodigo } = res;
        socket.emit("client:updateCodigo", newCodigo);
      }

      socket.emit("client:changeOrder", {
        tipo: "add",
        info: newOrder,
      });

      return {
        ...newOrder,
        ListPago: newOrder.ListPago.map((pago) => ({ ...pago, infoUser })),
      };
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se registro la Orden de Servicio", "fail");
      throw new Error(error);
    }
  }
);

export const UpdateDetalleOrdenServices = createAsyncThunk(
  "service_order/UpdateDetalleOrdenServices",
  async ({ id, infoOrden, rol }) => {
    try {
      const data = {
        infoOrden,
        rol,
      };

      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/detalle/${id}`,
        data
      );

      Notify("Actualziacion de Orden Exitosa", "", "success");

      const res = response.data;
      socket.emit("client:updateOrder(ITEMS)", res);

      return res;
    } catch (error) {
      // Puedes manejar los errores aquí
      console.log(error.response.data.mensaje);
      Notify("Error", "No se actualizo la Orden de Servicio", "fail");
      throw new Error(error);
    }
  }
);

export const UpdateOrdenServices = createAsyncThunk(
  "service_order/UpdateOrdenServices",
  async ({ id, infoOrden, rol, ListPago }) => {
    try {
      const data = {
        infoOrden,
        rol,
      };

      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/completa/${id}`,
        data
      );

      const res = response.data;
      const { infoUpdated } = res;
      let infoUpdateWPay = {
        ...infoUpdated,
        ListPago,
      };

      if ("changeCliente" in res) {
        const { changeCliente } = res;
        socket.emit("client:cClientes", changeCliente);
      }

      socket.emit("client:changeOrder", {
        tipo: "update",
        info: infoUpdateWPay,
      });

      Notify("Actualziacion de Orden Exitosa", "", "success");

      return infoUpdateWPay;
    } catch (error) {
      // Puedes manejar los errores aquí
      console.log(error.response.data.mensaje);
      Notify("Error", "No se actualizo la Orden de Servicio", "fail");
      throw new Error(error);
    }
  }
);

export const FinalzarReservaOrdenService = createAsyncThunk(
  "service_order/FinalzarReservaOrdenService",
  async ({ id, infoOrden, infoPago, rol, infoUser }) => {
    try {
      const dataSend = {
        infoOrden,
        rol,
        ...(infoPago && { infoPago }),
      };
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/finalizar-reserva/${id}`,
        dataSend
      );

      Notify("Registro Éxito", "", "success");

      const res = response.data;
      const { orderUpdated } = res;

      socket.emit("client:updateOrder(FINISH_RESERVA)", orderUpdated);

      if ("newPago" in res) {
        const { newPago } = res;
        const pago = {
          tipo: "added",
          info: {
            ...newPago,
            infoUser,
          },
        };
        socket.emit("client:cPago", pago);
      }

      if ("changeCliente" in res) {
        const { changeCliente } = res;
        socket.emit("client:cClientes", changeCliente);
      }

      return {
        ...orderUpdated,
        ListPago: orderUpdated.ListPago.map((pago) => ({ ...pago, infoUser })),
      };
    } catch (error) {
      // Puedes manejar los errores aquí
      console.log(error.response.data.mensaje);
      Notify("Error", "No se actualizo la Orden de Servicio", "fail");
      throw new Error(error);
    }
  }
);

export const Entregar_OrdenService = createAsyncThunk(
  "service_order/Entregar_OrdenService",
  async ({ id, rol, infoGastoByDelivery, location }) => {
    try {
      const dataSend = {
        rol,
        location,
        ...(infoGastoByDelivery && { infoGastoByDelivery }),
      };
      // Lógica para cancelar entrega en el backend
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/entregar/${id}`,
        dataSend
      );

      const res = response.data;
      const { orderUpdated } = res;

      socket.emit("client:updateOrder(ENTREGA)", orderUpdated);

      if ("newGasto" in res) {
        const { newGasto } = res;
        socket.emit("client:cGasto", newGasto);
      }

      if ("changeCliente" in res) {
        const { changeCliente } = res;
        socket.emit("client:cClientes", changeCliente);
      }

      socket.emit("client:onRemoveOrderReporteAE", id);

      return orderUpdated;
    } catch (error) {
      console.error("Error al cancelar entrega:", error);
      Notify(
        "Error",
        "No se pudo realizar la entrega de la Orden de Servicio",
        "fail"
      );
      throw new Error(error);
    }
  }
);

export const CancelEntrega_OrdenService = createAsyncThunk(
  "service_order/CancelEntrega_OrdenService",
  async (idOrden) => {
    try {
      // Lógica para cancelar entrega en el backend
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/cancelar-entregar/${idOrden}`
      );

      const res = response.data;
      const { orderUpdated } = res;

      socket.emit("client:updateOrder(CANCELAR_ENTREGA)", orderUpdated);
      Notify("Éxito", "Entrega cancelada correctamente", "success");

      if ("changeCliente" in res) {
        const { changeCliente } = res;
        socket.emit("client:cClientes", changeCliente);
      }

      return orderUpdated;
    } catch (error) {
      console.error("Error al cancelar entrega:", error);
      Notify(
        "Error",
        "No se pudo realizar la cancelación de la Orden de Servicio",
        "fail"
      );
      throw new Error(error);
    }
  }
);

export const Anular_OrdenService = createAsyncThunk(
  "service_order/Anular_OrdenService",
  async ({ id, infoAnulacion }) => {
    try {
      // Lógica para cancelar entrega en el backend
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/anular/${id}`,
        { infoAnulacion }
      );

      const orderUpdated = response.data;
      const { orderAnulado } = orderUpdated;

      socket.emit("client:updateOrder(ANULACION)", orderAnulado);
      Notify("Éxito", "Orden de Servicio Anulado", "success");

      if ("changeCliente" in orderUpdated) {
        const { changeCliente } = orderUpdated;
        socket.emit("client:cClientes", changeCliente);
      }

      socket.emit("client:onRemoveOrderReporteAE", id);

      return orderAnulado;
    } catch (error) {
      console.error("Error al ANULACION Oden de Servicio:", error);
      Notify(
        "Error",
        "No se pudo realizar la ANULACION la Orden de Servicio",
        "fail"
      );
      throw new Error(error);
    }
  }
);

export const Nota_OrdenService = createAsyncThunk(
  "service_order/Nota_OrdenService",
  async ({ id, infoNotas }) => {
    try {
      // Lógica para cancelar entrega en el backend
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/nota/${id}`,
        { infoNotas }
      );

      const orderUpdated = response.data;

      socket.emit("client:updateOrder(NOTA)", orderUpdated);
      Notify("Éxito", "Nota acttualizada en Orden de Servicio", "success");

      return orderUpdated;
    } catch (error) {
      console.error("Error al actualizar Nota en Orden de Servicio:", error);
      Notify(
        "Error",
        "No se pudo realizar la actualizacion en la NOTA en la Orden de Servicio",
        "fail"
      );
      throw new Error(error);
    }
  }
);

export const FinalzarRegistroPreliminar = createAsyncThunk(
  "service_order/FinalzarRegistroPreliminar",
  async (id) => {
    try {
      // Lógica para cancelar entrega en el backend
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/update-factura/finalizar/orden-preliminar/${id}`
      );

      const data = response.data;

      Notify(
        "Éxito",
        "Orden de Preliminar, Finalizado Correctamente",
        "success"
      );

      socket.emit("client:updateOrder(FINISH_REGISTRO_PRELIMINAR)", data);

      return data;
    } catch (error) {
      console.error(
        "Error al Finalizar Registro de Orden de Preliminar:",
        error
      );
      Notify(
        "Error",
        "No se pudo Finalizar Registro de Orden de Preliminar",
        "fail"
      );
      throw new Error(error);
    }
  }
);

export const AnularRemplazar_OrdensService = createAsyncThunk(
  "service_order/AnularRemplazar_OrdensService",
  async ({ dataToNewOrden, dataToAnular }) => {
    try {
      const { infoOrden, infoPago, infoGastoByDelivery } = dataToNewOrden;
      const dataSend = {
        dataToNewOrden: {
          infoOrden,
          ...(infoPago && { infoPago }),
          ...(infoOrden.Modalidad === "Delivery" &&
            infoGastoByDelivery && { infoGastoByDelivery }),
        },
        dataToAnular,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/anular-to-replace`,
        dataSend
      );

      const res = response.data;
      const { newOrder, orderAnulado } = res;

      if ("listNewsPagos" in res) {
        const { listNewsPagos } = res;
        listNewsPagos.map((p) => {
          const pago = {
            tipo: "added",
            info: p,
          };
          socket.emit("client:cPago", pago);
        });
      }

      if ("newGasto" in res) {
        const { newGasto } = res;
        socket.emit("client:cGasto", newGasto);
      }

      if ("listChangeCliente" in res) {
        const { listChangeCliente } = res;
        listChangeCliente.map((changeCliente) => {
          socket.emit("client:cClientes", changeCliente);
        });
      }

      if ("newCodigo" in res) {
        const { newCodigo } = res;
        socket.emit("client:updateCodigo", newCodigo);
      }

      socket.emit("client:updateOrder(ANULACION)", orderAnulado);
      socket.emit("client:changeOrder", {
        tipo: "add",
        info: newOrder,
      });

      Notify("Exitoso", "Anulacion y Remplazo Exitoso", "success");

      return {
        newOrder,
        orderAnulado,
      };
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se registro la Orden de Servicio", "fail");
      throw new Error(error);
    }
  }
);
