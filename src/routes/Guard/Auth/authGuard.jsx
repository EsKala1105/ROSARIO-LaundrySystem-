/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PrivateRoutes } from '../../../models/Routes-M/Routes';
import { userKey } from '../../../redux/states/user';

import { GetInfoUser } from '../../../redux/actions/aUser';

const PrivateComponent = () => <Outlet />;
const PublicComponent = () => <Navigate replace={true} to={PrivateRoutes.PRIVATE} />;

const AuthGuard = ({ isPrivate }) => {
  const dispatch = useDispatch();
  const userState = useSelector((store) => store.user.infoUsuario);
  let persistenceInfo = JSON.parse(localStorage.getItem(userKey));

  const handleLogin = async (headers) => {
    try {
      await dispatch(GetInfoUser({ headers }));
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const _onRedirect = () => {
    if (userState?.usuario) {
      return isPrivate ? <PrivateComponent /> : <PublicComponent />;
    } else if (persistenceInfo) {
      const headers = {
        Authorization: `${persistenceInfo.token}`,
      };
      handleLogin(headers);
    } else {
      return <Navigate replace={true} to="/" />;
    }
  };

  useEffect(() => {
    _onRedirect();
    persistenceInfo = JSON.parse(localStorage.getItem(userKey));
  }, [userState]);

  return _onRedirect(); // Asegurémonos de devolver el resultado de _onRedirect
};

export default AuthGuard;
