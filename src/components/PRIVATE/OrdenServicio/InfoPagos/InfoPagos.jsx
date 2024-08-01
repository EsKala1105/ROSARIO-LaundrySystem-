/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./infoPagos.scss";
import moment from "moment";
import { DateCurrent } from "../../../../utils/functions";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { PrivateRoutes } from "../../../../models";
import { useDispatch, useSelector } from "react-redux";
import { Text, ScrollArea, Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { DeletePago, UpdatePago } from "../../../../redux/actions/aPago";
import MetodoPago from "../../MetodoPago/MetodoPago";
import { useState } from "react";

const InfoPagos = ({ values, infoPagos, iUsuario, descripcion, codRecibo }) => {
  const [
    mMetodoPago,
    { open: openModalMetodoPago, close: closeModalMetodoPago },
  ] = useDisclosure(false);

  const payCuadrados = useSelector((state) => state.cuadre.paysToDay);

  const [currentPago, setCurrentPago] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEliminarPago = (id) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Elimiancion de Pago",
      centered: true,
      children: <Text size="sm">¿Estás seguro de Eliminar este Pago?</Text>,
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("cancelar"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(DeletePago(id));
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
          );
        }
      },
    });
  };

  const handleEditarPago = (pago) => {
    const id = currentPago._id;
    const iPago = {
      ...pago,
      isCounted: true,
      idUser: iUsuario._id,
      date: {
        fecha: moment().format("YYYY-MM-DD"),
        hora: moment().format("HH:mm"),
      },
    };

    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Actualizacion de Pago",
      centered: true,
      children: <Text size="sm">¿Estás seguro de Actualizar este Pago?</Text>,
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "orange" },
      onCancel: () => console.log("cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;

          const extraInfo = {
            orden: {
              codRecibo: codRecibo,
              Nombre: values.name,
              Modalidad: values.Modalidad,
            },
            infoUser: {
              _id: iUsuario._id,
              name: iUsuario.name,
              usuario: iUsuario.usuario,
              rol: iUsuario.rol,
            },
          };

          dispatch(
            UpdatePago({
              idPago: id,
              pagoUpdated: iPago,
              extraInfo,
            })
          );
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
          );
        }
      },
    });
  };

  return (
    <div className="info-pagos">
      <div className="title">
        <h1>{descripcion}</h1>
      </div>
      <div className="body">
        {infoPagos.length > 0 ? (
          infoPagos.map((pago, index) => (
            <div className="card-pago" key={index}>
              {pago.idUser === iUsuario._id &&
              !payCuadrados.includes(pago._id) &&
              ((pago.isCounted === false &&
                DateCurrent().format4 === pago.ordenDateCreation) ||
                DateCurrent().format4 === pago.date.fecha) ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPago(pago);
                      openModalMetodoPago();
                    }}
                    className="btn-action btn-edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPago(pago);
                      handleEliminarPago(pago._id);
                    }}
                    className="btn-action btn-delete"
                  >
                    <i className="fa-solid fa-delete-left"></i>
                  </button>
                </>
              ) : null}
              {pago.isCounted === false ? (
                <span className="sn-sm">PAGO ANTIGUO</span>
              ) : null}

              <div className="mm-pago">
                <div className="monto-p">{pago.total}</div>
                <span className="metodo-p">{pago.metodoPago}</span>
              </div>
              <hr />
              <div className="date-p">
                {moment(pago.date.fecha).format("dddd DD [de] MMMM [del] YYYY")}
              </div>
            </div>
          ))
        ) : (
          <span>NINGUNO (PAGO PENDIENTE)</span>
        )}
      </div>
      <Modal
        opened={mMetodoPago}
        onClose={() => {
          closeModalMetodoPago();
          setCurrentPago();
        }}
        size="auto"
        scrollAreaComponent={ScrollArea.Autosize}
        // title=""
        centered
      >
        <MetodoPago
          currentPago={currentPago}
          onConfirm={handleEditarPago}
          onCancel={() => {
            handleEliminarPago(currentPago._id);
          }}
          onClose={closeModalMetodoPago}
          totalToPay={
            parseFloat(values.totalNeto) -
            (infoPagos.reduce(
              (total, pago) => total + parseFloat(pago.total),
              0
            ) -
              (currentPago ? parseFloat(currentPago.total) : 0))
          }
        />
      </Modal>
    </div>
  );
};

export default InfoPagos;
