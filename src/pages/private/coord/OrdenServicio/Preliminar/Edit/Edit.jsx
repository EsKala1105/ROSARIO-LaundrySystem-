/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import OrdenServicio from "../../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";

import { useDispatch, useSelector } from "react-redux";

import { UpdateOrdenServices } from "../../../../../../redux/actions/aOrdenServices";

import { PrivateRoutes } from "../../../../../../models";
import "./edit.scss";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";

const Editar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const ordenToUpdate = useSelector((state) =>
    state.orden.preliminary.find((item) => item._id === id)
  );
  const iUsuario = useSelector((state) => state.user.infoUsuario);
  const [redirect, setRedirect] = useState(false);

  const handleEditar = async (updateData) => {
    setRedirect(true);
    const { infoOrden, infoPago, rol } = updateData;

    await dispatch(
      UpdateOrdenServices({
        id,
        infoOrden: {
          ...infoOrden,
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
        ListPago: ordenToUpdate.ListPago,
      })
    );

    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REGISTER_PRELIMINAR}`);
  };

  useEffect(() => {
    if (!ordenToUpdate) {
      navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
    }
  }, [ordenToUpdate]);

  return (
    <>
      {ordenToUpdate && !redirect ? (
        <div className="edit-orden-service">
          <OrdenServicio
            titleMode="ACTUALIZAR"
            mode="PRELIMINARY"
            onAction={handleEditar}
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
