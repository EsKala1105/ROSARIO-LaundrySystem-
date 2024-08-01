/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../../../models/index";
import { resetUser } from "../../../redux/states/user";

import { useDisclosure } from "@mantine/hooks";
import { Text, ScrollArea, TextInput } from "@mantine/core";
import { Modal } from "@mantine/core";
import { modals } from "@mantine/modals";

import { persistLocalStorage } from "../../../utils/persistence.local-storage/localStorage.util";
import "./login.scss";
import axios from "axios";

import { GetInfoUser } from "../../../redux/actions/aUser";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Notify } from "../../../utils/notify/Notify";
import { socket } from "../../../utils/socket/connect";
import { clearInfoCuadre } from "../../../redux/states/cuadre";

import { ReactComponent as Logo } from "../../../utils/img/Logo/logo.svg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [firstLogin, setFirstLogin] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    //clearLocalStorage(userKey);
    dispatch(resetUser());
    dispatch(clearInfoCuadre());
    //navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  }, [dispatch]);

  const handleResendCode = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/resend-code/${
          firstLogin?.id
        }`
      );
      if (response.data) {
        Notify(
          "Reenvio de Codigo",
          "Verifica tu codigo en el apartado de SPAM",
          "success"
        );
      }
    } catch (error) {
      console.log(error);
      Notify("Error al Reenviar Codigo", error.response.data.mensaje, "fail");
    }
  };

  const handleFirstLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/first-login`,
        firstLogin
      );
      if (response.status === 200) {
        socket.emit("client:onFirtLogin", response.data.id);
        close();
        handleGetInfoUser(response.data.token);
      }
    } catch (error) {
      Notify(error.response.data.mensaje, "", "fail");
      if (error.response.status !== 500) {
        setError(error.response.data.mensaje);
      }
    }
  };

  const openModal = async () => {
    modals.openConfirmModal({
      title: "Reenvio de Codigo",
      centered: true,
      children: (
        <>
          <Text size="sm">
            Procura revisar el envio de codigo en el apartado de SPAM en el
            correo eletronico que registro el ADMINISTRADOR y de digitar el
            ultimo codigo enviado.
          </Text>
          <Text size="sm">¿Estas seguro de Reenviar un nuevo codigo?</Text>
        </>
      ),
      styles: { border: "3px solid #000" },
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Envio de codigo cancelado"),
      onConfirm: () => handleResendCode(),
    });
  };

  const handleGetInfoUser = async (token) => {
    const headers = {
      Authorization: `${token}`,
    };
    await dispatch(GetInfoUser({ headers })).then((response) => {
      if (response.payload) {
        const res = response.payload;
        persistLocalStorage("user", {
          usuario: res.usuario,
          token: token,
        });
        navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const usuario = formData.get("user");
    const contraseña = formData.get("password");

    try {
      // Iniciar sesión y obtener el token
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/login`,
        {
          usuario,
          contraseña,
        }
      );

      if (res.status === 200) {
        socket.emit("client:onLogin", res.data.id);
        if (res.data.type === "token") {
          const token = res.data.info;
          handleGetInfoUser(token);
        } else {
          setFirstLogin({ id: res.data.info, usuario, contraseña });
          open();
        }
      }
    } catch (error) {
      Notify("Error al Iniciar Sesion", error.response.data.mensaje, "fail");
    }
  };

  return (
    <>
      <div className="container-login">
        <div className="full-height">
          <div className="card-3d-wrap">
            <div className="card-3d-wrapper">
              <div className="card-front">
                <div className="center-wrap">
                  <Logo className="logo" />
                  <form onSubmit={handleLogin} className="section">
                    <h4>Iniciar Sesion</h4>
                    <div className="form-group">
                      <input
                        type="text"
                        name="user"
                        className="form-style"
                        placeholder="Usuario"
                        id="user"
                        autoFocus
                        autoComplete="off"
                      />
                      <i className="input-icon fa-solid fa-user"></i>
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        className="form-style"
                        placeholder="Contraseña"
                        id="password"
                        autoComplete="off"
                      />
                      <i className="input-icon fa-solid fa-lock"></i>
                    </div>
                    <button type="submit" className="btn">
                      Ingresar
                    </button>
                    <p>
                      <Link to={`${PublicRoutes.IDENTIFY}`} className="link">
                        Olvidaste tu contraseña?
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          opened={opened}
          onClose={close}
          size={550}
          scrollAreaComponent={ScrollArea.Autosize}
          title="Primer Inicio de Sesion"
          centered
        >
          <form onSubmit={handleFirstLogin} className="content-validation">
            <div className="header-v">
              <h2>Ingrese codigo de validacion</h2>
              <p>
                codigo de validacion enviado al correo electronico registrado
              </p>
            </div>
            <TextInput
              radius="md"
              error={error ? error : false}
              defaultValue={firstLogin?.codigo}
              onChange={(e) => {
                const value = e.target.value;
                setFirstLogin({ ...firstLogin, codigo: value });
              }}
              required
              placeholder="Ingrese codigo de validacion"
              autoComplete="off"
            />
            <div className="actions">
              <button className="btn-login" type="submit">
                Iniciar
              </button>
              <button className="btn-resend" type="button" onClick={openModal}>
                Reenviar Codigo
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Login;
