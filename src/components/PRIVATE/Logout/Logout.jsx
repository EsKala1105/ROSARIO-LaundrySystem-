/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Text, Popover, Button } from "@mantine/core";
import { modals } from "@mantine/modals";

import { PublicRoutes } from "../../../models/Routes-M/Routes";
import "./logout.scss";
// import { LogoutUser } from '../../../services/default.services';
import IcoClose from "./logout.png";
import IcoUsuario from "./usuario.png";
import { useSelector } from "react-redux";

const Logout = () => {
  const navigate = useNavigate();
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);

  const openModal = () =>
    modals.openConfirmModal({
      title: "CERRAR SESION",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro que quieres CERRAR SESION ?</Text>
      ),
      labels: { confirm: "Cerrar Sesion", cancel: "No" },
      confirmProps: { color: "red" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => handleLogout(),
    });

  const handleLogout = async () => {
    //clearLocalStorage(userKey);

    // const persistenceInfo = JSON.parse(localStorage.getItem("user"));
    // if (persistenceInfo) {
    //   await LogoutUser(persistenceInfo.token);
    // }

    //dispatch(resetUser());
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  };

  return (
    <Popover
      width={"auto"}
      arrowPosition="center"
      position="top"
      offset={8}
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <div className="content-account">
          <div className="btn-account">
            <img
              className="ico-account"
              src={IcoUsuario}
              alt="cerrar_session"
            />
          </div>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="space-data">
          <div className="menu-login">
            <div className="avatar-space">
              <img
                className="ico-avatar"
                src={IcoUsuario}
                alt="cerrar_session"
              />
            </div>
            <div className="info-user">
              <span className="d-primary">{InfoUsuario.name}</span>
              <span className="d-extra">{InfoUsuario.rol}</span>
              <span className="d-secundary">{InfoUsuario.email}</span>
            </div>
          </div>
          <Button className="btn-logout" color="red" onClick={openModal}>
            Cerrar Session
          </Button>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Logout;
