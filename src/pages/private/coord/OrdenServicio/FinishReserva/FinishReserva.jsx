import { useNavigate, useParams } from "react-router-dom";
import OrdenServicio from "../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";

import { useDispatch, useSelector } from "react-redux";

import { FinalzarReservaOrdenService } from "../../../../../redux/actions/aOrdenServices";

import { PrivateRoutes } from "../../../../../models";
import "./finishReserva.scss";
import { useState } from "react";

const FinishReserva = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [redirect, setRedirect] = useState(false);

  const ordenReservada = useSelector((state) =>
    state.orden.reserved.find((item) => item._id === id)
  );
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);

  const handleFinishReserva = async (updateData) => {
    setRedirect(true);
    const { infoOrden, infoPago, rol } = updateData;

    const {
      dateRecepcion,
      Modalidad,
      Nombre,
      idCliente,
      Items,
      celular,
      direccion,
      datePrevista,
      descuento,
      dni,
      subTotal,
      totalNeto,
      cargosExtras,
      gift_promo,
      attendedBy,
    } = infoOrden;

    await dispatch(
      FinalzarReservaOrdenService({
        id,
        infoOrden: {
          codRecibo: ordenReservada.codRecibo,
          dateRecepcion,
          Modalidad,
          Nombre,
          idCliente,
          Items,
          celular,
          direccion,
          datePrevista,
          descuento,
          dni,
          subTotal,
          totalNeto,
          cargosExtras,
          gift_promo,
          attendedBy,
        },
        infoPago,
        rol,
        infoUser: {
          _id: InfoUsuario._id,
          name: InfoUsuario.name,
          usuario: InfoUsuario.usuario,
          rol: InfoUsuario.rol,
        },
      })
    ).then((res) => {
      if (res.error) {
        navigate(
          `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
        );
      }
      if (res.payload) {
        navigate(
          `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/${id}`
        );
      }
    });
  };

  return (
    <>
      {ordenReservada && redirect === false ? (
        <div className="edit-orden-service">
          <OrdenServicio
            titleMode="REGISTRAR"
            mode="FINISH_RESERVA"
            onAction={handleFinishReserva}
            infoDefault={ordenReservada}
          />
        </div>
      ) : (
        <>
          <div>Loading...</div>
        </>
      )}
    </>
  );
};

export default FinishReserva;
