/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import OrdenServicio from "../../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AddOrdenServices } from "../../../../../../redux/actions/aOrdenServices";
import LoaderSpiner from "../../../../../../components/LoaderSpinner/LoaderSpiner";
import { setLastRegister } from "../../../../../../redux/states/service_order";

import "./tienda.scss";
import { PrivateRoutes } from "../../../../../../models";

const Tienda = () => {
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lastRegister } = useSelector((state) => state.orden);
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);

  const handleRegistrar = async (data) => {
    const { infoOrden, infoPago, rol } = data;

    // Crear la nueva orden con los datos necesarios
    const nuevaOrden = {
      infoOrden: {
        ...infoOrden,
        estado: "registrado",
        typeRegistro: "normal",
      },
      infoPago,
      rol,
      infoUser: {
        _id: InfoUsuario._id,
        name: InfoUsuario.name,
        usuario: InfoUsuario.usuario,
        rol: InfoUsuario.rol,
      },
    };
    setRedirect(true);

    await dispatch(AddOrdenServices(nuevaOrden)).then((res) => {
      if (res.error) {
        console.error(
          "Error en el servicio al agregar la orden:",
          res.error.message
        );
        navigate(
          `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
        );
      }
    });
  };

  useEffect(() => {
    if (lastRegister !== null) {
      const getId = lastRegister._id;
      dispatch(setLastRegister());
      navigate(
        `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/${getId}`
      );
    }
  }, [lastRegister]);

  return (
    <>
      {redirect === false ? (
        <div className="content-tienda">
          <OrdenServicio
            titleMode="REGISTRAR"
            mode={"NEW"}
            onAction={handleRegistrar}
            infoDefault={null}
          />
        </div>
      ) : (
        <div className="loading-general">
          <LoaderSpiner />
        </div>
      )}
    </>
  );
};

export default Tienda;
