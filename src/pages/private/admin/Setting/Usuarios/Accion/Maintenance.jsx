/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { modals } from "@mantine/modals";

import { Button, Select, Text, TextInput } from "@mantine/core";
import ValidIco from "../../../../../../components/ValidIco/ValidIco";
import "./maintenance.scss";
import LoaderSpiner from "../../../../../../components/LoaderSpinner/LoaderSpiner";
import axios from "axios";
import { socket } from "../../../../../../utils/socket/connect";
import { Notify } from "../../../../../../utils/notify/Notify";
import { Roles } from "../../../../../../models";
import { useSelector } from "react-redux";
import { allowedRoles } from "../../../../../../services/global";

// eslint-disable-next-line react/prop-types
const Maintenance = ({ info, onClose, setListUsuarios }) => {
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);

  const [warningDuplicated, setWarningDuplicated] = useState([]);
  const [onLoading, setOnLoading] = useState(false);

  const isEdit = info != null;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    phone: Yup.string().required("Campo obligatorio"),
    email: Yup.string()
      .required("Campo obligatorio")
      .email("Debe ser un correo electrónico válido"),
    rol: Yup.string().required("Campo obligatorio"),
    usuario: Yup.string().required("Campo obligatorio"),
    password: isEdit
      ? ""
      : Yup.string()
          .required("Campo obligatorio")
          .matches(
            /^[a-zA-Z0-9]{5,}$/,
            "Debe contener al menos 5 caracteres (solo letras y números)"
          ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: "",
      name: "",
      phone: "",
      email: "",
      rol: "",
      usuario: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      validProcess(values);
    },
  });

  // Valid Editar o Registrar
  const validProcess = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: `${isEdit ? "Actualizacion de Usuario" : "Registro de Usuario"}`,
      centered: true,
      children: (
        <Text size="sm">
          {isEdit
            ? "¿ Estas seguro de EDITAR este USUARIO ?"
            : "¿ Estas seguro de AGREGAR este nuevo USUARIO ?"}
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          setOnLoading(true);
          if (isEdit === true) {
            handleEditUser({ ...data, estado: "update" });
          } else {
            handleRegisterUser({ ...data, estado: "new" });
          }
        }
      },
    });
  };

  const handleEditUser = async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/edit-user/${data._id}`,
        data
      );

      socket.emit("client:onChangeUser", response.data._id);
      socket.emit("client:onUpdateUser", response.data);

      formik.resetForm();
      setOnLoading(false);

      setListUsuarios((prevList) => {
        const newInfo = prevList.map((user) =>
          user._id === response.data._id ? response.data : user
        );
        return newInfo;
      });
      Notify("Actualizacion", "Usuario Actualizado correctamente", "success");
      onClose();
    } catch (error) {
      const { data, status } = error.response;
      console.log(data.mensaje);
      setOnLoading(false);
      if (status === 401) {
        setWarningDuplicated(data.duplicados);
        Notify("Error", "No se puedo editar por informacion Duplicada", "fail");
      } else {
        Notify("Error", "No se pudo editar los datos del usuario", "fail");
      }
    }
  };

  const handleRegisterUser = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/register`,
        data
      );

      socket.emit("client:onNewUser", response.data);

      formik.resetForm();
      setOnLoading(false);

      setListUsuarios((prevList) => [...prevList, response.data]);

      Notify(
        "Usuario Agregado Exitosamente",
        "Inicia Session para activar su cuenta, con el codigo enviado al correo",
        "success"
      );

      onClose();
    } catch (error) {
      const { data, status } = error.response;
      setOnLoading(false);
      if (status === 401) {
        setWarningDuplicated(data.duplicados);
        Notify("Error", "informacion Duplicada", "fail");
      } else {
        onClose();
        Notify("Error", "No se pudo registrar usuario", "fail");
      }
    }
  };

  const isRoleDisabled = (role) => {
    let estado;
    if (role === "admin") {
      estado = true;
    }
    if (role === "gerente") {
      estado = InfoUsuario.rol === Roles.ADMIN ? false : true;
    }
    if (role === "coord") {
      estado =
        InfoUsuario.rol === Roles.ADMIN || InfoUsuario.rol === Roles.GERENTE
          ? false
          : true;
    }
    if (role === "pers") {
      estado = false;
    }
  };

  useEffect(() => {
    if (isEdit) {
      formik.setValues({
        _id: info?._id,
        name: info?.name,
        phone: info?.phone,
        email: info?.email,
        rol: info?.rol,
        usuario: info?.usuario,
        password: "",
      });
    }
  }, [info]);

  return (
    <form onSubmit={formik.handleSubmit} className="form-usuarios">
      {onLoading === true ? (
        <LoaderSpiner />
      ) : (
        <>
          <div className="h-title">
            <h1>{isEdit ? "Editar Usuario" : "Registrar Usuario"}</h1>
          </div>
          <div className="parallel-bars">
            <div className="lateral">
              <div className="input-item">
                <TextInput
                  name="name"
                  label="Nombre :"
                  value={formik.values.name}
                  placeholder="Ingrese nombre"
                  autoComplete="off"
                  onChange={formik.handleChange}
                />
                {formik.errors.name &&
                  formik.touched.name &&
                  ValidIco({ mensaje: formik.errors.name })}
              </div>
              <div className="input-item">
                <TextInput
                  name="phone"
                  label="Numero Telefonico :"
                  value={formik.values.phone}
                  placeholder="Ingrese numero"
                  autoComplete="off"
                  onChange={formik.handleChange}
                />
                {formik.errors.phone &&
                  formik.touched.phone &&
                  ValidIco({ mensaje: formik.errors.phone })}
              </div>
              <div className="input-item">
                <TextInput
                  name="email"
                  label="Correo Electronico :"
                  error={
                    warningDuplicated.includes("correo")
                      ? "correo ya esta siendo usado"
                      : false
                  }
                  value={formik.values.email}
                  placeholder="Ingrese correo"
                  autoComplete="off"
                  onChange={(e) => {
                    formik.setFieldValue("email", e.target.value);
                  }}
                />
                {formik.errors.email &&
                  formik.touched.email &&
                  ValidIco({ mensaje: formik.errors.email })}
              </div>
            </div>
            <div className="lateral">
              <div className="input-item">
                <Select
                  name="rol"
                  label="Rol"
                  value={formik.values.rol}
                  onChange={(e) => {
                    formik.setFieldValue("rol", e);
                  }}
                  placeholder="Escoge el rol"
                  clearable={
                    formik.values.rol === Roles.ADMIN ||
                    formik.values.rol === Roles.GERENTE
                      ? false
                      : true
                  }
                  searchable
                  readOnly={
                    InfoUsuario.rol === Roles.GERENTE ||
                    formik.values.rol === Roles.ADMIN
                  }
                  data={allowedRoles.map((item) => ({
                    ...item,
                    disabled: isRoleDisabled(item.value),
                  }))}
                />
                {formik.errors.rol &&
                  formik.touched.rol &&
                  ValidIco({ mensaje: formik.errors.rol })}
              </div>
              <div className="account">
                <div className="input-item">
                  <TextInput
                    name="usuario"
                    label="Usuario :"
                    value={formik.values.usuario}
                    error={
                      warningDuplicated.includes("usuario")
                        ? "usuario ya existe"
                        : false
                    }
                    placeholder="Ingrese usuario"
                    autoComplete="off"
                    onChange={(e) => {
                      formik.setFieldValue("usuario", e.target.value);
                    }}
                  />
                  {formik.errors.usuario &&
                    formik.touched.usuario &&
                    ValidIco({ mensaje: formik.errors.usuario })}
                </div>
                <div className="input-item">
                  <TextInput
                    name="password"
                    label="Contraseña :"
                    description={
                      isEdit
                        ? "el campo vacio, mantiene la contraseña anterior"
                        : true
                    }
                    value={formik.values.password}
                    placeholder="Ingrese contraseña"
                    autoComplete="off"
                    onChange={formik.handleChange}
                  />

                  {isEdit
                    ? null
                    : formik.errors.password &&
                      formik.touched.password &&
                      ValidIco({ mensaje: formik.errors.password })}
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            variant="gradient"
            gradient={
              isEdit
                ? { from: "rgba(255, 178, 46, 1)", to: "red", deg: 90 }
                : { from: "indigo", to: "cyan" }
            }
          >
            {isEdit ? "Editar Usuario" : "Registrar Usuario"}
          </Button>
        </>
      )}
    </form>
  );
};

export default Maintenance;
