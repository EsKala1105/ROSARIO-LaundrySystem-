import { useNavigate, useParams } from "react-router-dom";
import OrdenServicio from "../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";

import { useDispatch, useSelector } from "react-redux";

import {
  UpdateDetalleOrdenServices,
  // UpdateOrdenServices,
} from "../../../../../redux/actions/aOrdenServices";

import { PrivateRoutes } from "../../../../../models";
import "./edit.scss";
import moment from "moment";
import { useState } from "react";

const Editar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const ordenToUpdate = useSelector((state) =>
    state.orden.registered.find((item) => item._id === id)
  );
  const iUsuario = useSelector((state) => state.user.infoUsuario);
  const [redirect, setRedirect] = useState(false);

  const handleEditarDetalle = async (updateData) => {
    setRedirect(true);
    const { infoOrden, infoPago, rol } = updateData;
    const { Items } = infoOrden;

    await dispatch(
      UpdateDetalleOrdenServices({
        id,
        infoOrden: {
          Items,
          lastEdit: [
            ...ordenToUpdate.lastEdit,
            {
              name: iUsuario.name,
              date: moment().format("YYYY-MM-DD HH:mm"),
            },
          ],
        },
        infoPago,
        rol,
      })
    );

    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  return (
    <>
      {ordenToUpdate && !redirect ? (
        <div className="edit-orden-service">
          <OrdenServicio
            titleMode="ACTUALIZAR"
            mode="UPDATE"
            onAction={handleEditarDetalle}
            infoDefault={ordenToUpdate}
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

export default Editar;
