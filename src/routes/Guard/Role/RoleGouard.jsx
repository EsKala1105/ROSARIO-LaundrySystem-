/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { PrivateRoutes, Roles } from "../../../models";

function RoleGuard({ rol }) {
  const userState = useSelector((store) => store.user.infoUsuario);

  // Verifica si el usuario tiene el rol de ADMIN o el rol proporcionado
  const hasPermission = [Roles.ADMIN, Roles.GERENTE, rol].includes(
    userState.rol
  );

  return hasPermission ? (
    <Outlet />
  ) : (
    <Navigate replace to={PrivateRoutes.LIST_ORDER_SERVICE} />
  );
}

export default RoleGuard;
