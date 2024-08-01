/* eslint-disable no-case-declarations */
import { createSlice } from "@reduxjs/toolkit";
import {
  AddOrdenServices,
  AnularRemplazar_OrdensService,
  Anular_OrdenService,
  CancelEntrega_OrdenService,
  Entregar_OrdenService,
  FinalzarRegistroPreliminar,
  FinalzarReservaOrdenService,
  GetOrdenServices_Date,
  GetOrdenServices_DateRange,
  GetOrdenServices_Last,
  GetOrdenServices_Preliminar,
  Nota_OrdenService,
  UpdateDetalleOrdenServices,
  UpdateOrdenServices,
} from "../actions/aOrdenServices";
import { handleGetInfoPago } from "../../utils/functions";
import moment from "moment";

const service_order = createSlice({
  name: "service_order",
  initialState: {
    infoServiceOrder: false,
    registered: [],
    preliminary: [],
    reserved: [],
    lastRegister: null,
    orderServiceId: false,
    // filtros
    filterBy: "pendiente",
    searhOptionByOthers: "date",
    selectedMonth: moment().toDate(),
    // ----------------- //
    isLoading: false,
    error: null,
  },
  reducers: {
    // Filtros
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setSearchOptionByOthers: (state, action) => {
      state.searhOptionByOthers = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    // ----------------------------------------- //
    updateLastRegister: (state, action) => {
      state.lastRegister = {
        ...state.lastRegister,
        promotions: action.payload,
      };
    },
    setLastRegister: (state) => {
      state.lastRegister = null;
    },
    // UPDATE INFO ORDEN
    updateDetalleOrden: (state, action) => {
      const index = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );
      state.registered[index].Items = action.payload.Items;
    },
    updateFinishReserva: (state, action) => {
      // Quitar Orden de Reserva
      state.reserved = state.reserved.filter(
        (item) => item._id !== action.payload._id
      );

      const index = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        // si existe acutaliza
        state.registered[index] = action.payload;
      } else {
        // si no y agregalo
        if (action.payload.estado === "registrado") {
          state.registered.push(action.payload);
        }
      }
    },
    updateEntregaOrden: (state, action) => {
      const index = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index !== -1) {
        const updatedOrder = state.registered[index];
        updatedOrder.estadoPrenda = action.payload.estadoPrenda;
        updatedOrder.location = action.payload.location;
        updatedOrder.dateEntrega = action.payload.dateEntrega;
      }
    },
    updateCancelarEntregaOrden: (state, action) => {
      const index = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index !== -1) {
        const updatedOrder = state.registered[index];
        updatedOrder.estadoPrenda = action.payload.estadoPrenda;
        updatedOrder.dateEntrega = action.payload.dateEntrega;
      }
    },
    updateAnulacionOrden: (state, action) => {
      const indexOnRegistered = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );

      if (indexOnRegistered !== -1) {
        const updatedOrder = state.registered[indexOnRegistered];
        updatedOrder.estadoPrenda = action.payload.estadoPrenda;
      } else {
        const indexOnPreliminar = state.preliminary.findIndex(
          (item) => item._id === action.payload._id
        );

        if (indexOnPreliminar !== -1) {
          // Actualiza directamente el array usando splice
          state.preliminary.splice(indexOnPreliminar, 1);
        }
      }
    },
    updateNotaOrden: (state, action) => {
      const index = state.registered.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index !== -1) {
        const updatedOrder = state.registered[index];
        updatedOrder.notas = action.payload.notas;
      }
    },
    updateLocationOrden: (state, action) => {
      action.payload.map((orden) => {
        const index = state.registered.findIndex(
          (item) => item._id === orden._id
        );

        if (index !== -1) {
          const updatedOrder = state.registered[index];
          updatedOrder.location = orden.location;
          updatedOrder.estadoPrenda = orden.estadoPrenda;
        }
      });
    },
    updateFinishRegistroPreliminar: (state, action) => {
      const { _id, dateRecepcion, estado } = action.payload;

      const infoPreliminar = state.preliminary.find((item) => item._id === _id);

      infoPreliminar.dateRecepcion = dateRecepcion;
      infoPreliminar.estado = estado;

      state.registered.push(infoPreliminar);

      // ELIMINAR ORDEN DE RECOJO DE PRELIMINAR

      const indexOnPreliminar = state.preliminary.findIndex(
        (item) => item._id === action.payload._id
      );

      if (indexOnPreliminar !== -1) {
        // Actualiza directamente el array usando splice
        state.preliminary.splice(indexOnPreliminar, 1);
      }
    },
    // ---------------------- //
    changeOrder: (state, action) => {
      const { tipo, info } = action.payload;
      const stateMap = {
        reservado: state.reserved,
        registrado: state.registered,
        preliminar: state.preliminary,
      };

      const stateArray = stateMap[info.estado];
      if (!stateArray) {
        console.log("Estado no reconocido:", info.estado);
        return;
      }

      const findIndexById = (arr, id) =>
        arr.findIndex((item) => item._id === id);

      switch (tipo) {
        case "add":
          stateArray.push(info);
          break;
        case "update":
          const updateIndex = findIndexById(stateArray, info._id);
          if (updateIndex !== -1) {
            stateArray[updateIndex] = info;
          } else {
            console.log("Orden no encontrada para actualizar:", info._id);
          }
          break;
        case "delete":
          const deleteIndex = findIndexById(stateArray, info._id);
          if (deleteIndex !== -1) {
            stateArray.splice(deleteIndex, 1);
          } else {
            console.log("Orden no encontrada para eliminar:", info._id);
          }
          break;
        default:
          console.log("Acción no reconocida:", tipo);
      }
    },
    LS_changePagoOnOrden: (state, action) => {
      const { tipo, info } = action.payload;

      // Buscar la orden por su _id
      const orderToUpdateIndex = state.registered.findIndex(
        (order) => order._id === info.idOrden
      );

      // Verificar si se encontró la orden
      if (orderToUpdateIndex === -1) {
        console.error("Orden no encontrada");
        return;
      }

      // Clonar la orden para no mutar el estado directamente
      const orderToUpdate = { ...state.registered[orderToUpdateIndex] };

      let indexPago;
      if (tipo !== "added") {
        // Buscar el pago dentro de ListPago por su _id
        indexPago = orderToUpdate.ListPago.findIndex(
          (pago) => pago._id === info._id
        );

        // Verificar si se encontró el pago
        if (indexPago === -1) {
          console.error("Pago no encontrado");
          return;
        }
      }

      // Realizar la acción según el tipo
      if (tipo === "deleted") {
        // Eliminar el pago del array ListPago
        orderToUpdate.ListPago.splice(indexPago, 1);
      } else if (tipo === "updated") {
        // Actualizar el pago con la nueva información
        orderToUpdate.ListPago[indexPago] = info;
      } else if (tipo === "added") {
        // Verificar si el pago ya existe en ListPago
        if (!orderToUpdate.ListPago.some((pago) => pago._id === info._id)) {
          // Agregar el nuevo pago a ListPago solo si no existe
          orderToUpdate.ListPago.push(info);
        }
      }

      orderToUpdate.Pago = handleGetInfoPago(
        orderToUpdate.ListPago,
        orderToUpdate.totalNeto
      ).estado.toUpperCase();

      // Actualizar la orden en state.registered
      state.registered[orderToUpdateIndex] = orderToUpdate;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(AddOrdenServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddOrdenServices.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.estado === "reservado") {
          state.reserved.push(action.payload);
        }

        if (action.payload.estado === "registrado") {
          state.registered.push(action.payload);
        }

        if (action.payload.estado === "preliminar") {
          state.preliminary.push(action.payload);
        }

        state.lastRegister = action.payload;
      })
      .addCase(AddOrdenServices.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Items
      .addCase(UpdateDetalleOrdenServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateDetalleOrdenServices.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.registered.findIndex(
          (item) => item._id === action.payload._id
        );
        state.registered[index].Items = action.payload.Items;
      })
      .addCase(UpdateDetalleOrdenServices.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Orden Completo - PRELIMINAR
      .addCase(UpdateOrdenServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateOrdenServices.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.preliminary.findIndex(
          (item) => item._id === action.payload._id
        );

        state.preliminary[index] = action.payload;
      })
      .addCase(UpdateOrdenServices.rejected, (state) => {
        state.isLoading = false;
      })
      // Finalizar Reserva
      .addCase(FinalzarReservaOrdenService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(FinalzarReservaOrdenService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reserved = state.reserved.filter(
          (item) => item._id !== action.payload._id
        );
        state.registered.push(action.payload);
      })
      .addCase(FinalzarReservaOrdenService.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Entregar
      .addCase(Entregar_OrdenService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Entregar_OrdenService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.registered.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          const updatedOrder = state.registered[index];
          updatedOrder.estadoPrenda = action.payload.estadoPrenda;
          updatedOrder.location = action.payload.location;
          updatedOrder.dateEntrega = action.payload.dateEntrega;
        }
      })
      .addCase(Entregar_OrdenService.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Cancelar Entrega
      .addCase(CancelEntrega_OrdenService.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(CancelEntrega_OrdenService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.registered.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          const updatedOrder = state.registered[index];
          updatedOrder.estadoPrenda = action.payload.estadoPrenda;
          updatedOrder.dateEntrega = action.payload.dateEntrega;
        }
      })
      .addCase(CancelEntrega_OrdenService.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // Update Anulacion
      .addCase(Anular_OrdenService.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(Anular_OrdenService.fulfilled, (state, action) => {
        state.isLoading = false;
        const indexOnRegistered = state.registered.findIndex(
          (item) => item._id === action.payload._id
        );

        if (indexOnRegistered !== -1) {
          const updatedOrder = state.registered[indexOnRegistered];
          updatedOrder.estadoPrenda = action.payload.estadoPrenda;
        } else {
          const indexOnPreliminar = state.preliminary.findIndex(
            (item) => item._id === action.payload._id
          );

          if (indexOnPreliminar !== -1) {
            // Actualiza directamente el array usando splice
            state.preliminary.splice(indexOnPreliminar, 1);
          }
        }
      })
      .addCase(Anular_OrdenService.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // Update Nota
      .addCase(Nota_OrdenService.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(Nota_OrdenService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.registered.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          const updatedOrder = state.registered[index];
          updatedOrder.notas = action.payload.notas;
        }
      })
      .addCase(Nota_OrdenService.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // Finalizar Registro Preliminar
      .addCase(FinalzarRegistroPreliminar.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(FinalzarRegistroPreliminar.fulfilled, (state, action) => {
        state.isLoading = false;

        const { _id, dateRecepcion, estado } = action.payload;

        const infoPreliminar = state.preliminary.find(
          (item) => item._id === _id
        );

        infoPreliminar.dateRecepcion = dateRecepcion;
        infoPreliminar.estado = estado;

        state.registered.push(infoPreliminar);

        // ELIMINAR ORDEN DE RECOJO DE PRELIMINAR

        const indexOnPreliminar = state.preliminary.findIndex(
          (item) => item._id === action.payload._id
        );

        if (indexOnPreliminar !== -1) {
          // Actualiza directamente el array usando splice
          state.preliminary.splice(indexOnPreliminar, 1);
        }
      })
      .addCase(FinalzarRegistroPreliminar.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // Anular y Remplazar
      .addCase(AnularRemplazar_OrdensService.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(AnularRemplazar_OrdensService.fulfilled, (state, action) => {
        state.isLoading = false;
        const { newOrder, orderAnulado } = action.payload;
        const indexOrderToAnular = state.registered.findIndex(
          (item) => item._id === orderAnulado._id
        );

        if (indexOrderToAnular !== -1) {
          const updatedOrder = state.registered[indexOrderToAnular];
          updatedOrder.estadoPrenda = orderAnulado.estadoPrenda;
        }

        state.registered.push(newOrder);

        state.lastRegister = newOrder;
      })
      .addCase(AnularRemplazar_OrdensService.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // List for Date Range
      .addCase(GetOrdenServices_DateRange.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(GetOrdenServices_DateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = action.payload.length > 0;
        state.reserved = action.payload.filter(
          (item) => item.estado === "reservado"
        );
        state.registered = action.payload.filter(
          (item) => item.estado === "registrado"
        );
      })
      .addCase(GetOrdenServices_DateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // List Last
      .addCase(GetOrdenServices_Last.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(GetOrdenServices_Last.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = action.payload.length > 0;
        state.reserved = action.payload.filter(
          (item) => item.estado === "reservado"
        );
        state.registered = action.payload.filter(
          (item) => item.estado === "registrado"
        );
      })
      .addCase(GetOrdenServices_Last.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      })
      // List Preliminar
      .addCase(GetOrdenServices_Preliminar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetOrdenServices_Preliminar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preliminary = action.payload;
      })
      .addCase(GetOrdenServices_Preliminar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // List for Date
      .addCase(GetOrdenServices_Date.pending, (state) => {
        state.isLoading = true;
        state.infoServiceOrder = false;
        state.error = null;
      })
      .addCase(GetOrdenServices_Date.fulfilled, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = action.payload.length > 0;
        state.reserved = action.payload.filter(
          (item) => item.estado === "reservado"
        );
        state.registered = action.payload.filter(
          (item) => item.estado === "registrado"
        );
        state.preliminary = action.payload.filter(
          (item) => item.estado === "preliminar"
        );
      })
      .addCase(GetOrdenServices_Date.rejected, (state, action) => {
        state.isLoading = false;
        state.infoServiceOrder = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setLastRegister,
  updateNotaOrden,
  updateLocationOrden,
  updateDetalleOrden,
  updateFinishReserva,
  updateEntregaOrden,
  updateCancelarEntregaOrden,
  updateAnulacionOrden,
  updateFinishRegistroPreliminar,
  updateLastRegister,
  changeOrder,
  LS_changePagoOnOrden,
  // Filter
  setFilterBy,
  setSearchOptionByOthers,
  setSelectedMonth,
} = service_order.actions;
export default service_order.reducer;
