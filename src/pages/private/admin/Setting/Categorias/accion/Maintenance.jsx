/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./maintenance.scss";
import { Button, Select, TextInput, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  addCategoria,
  updateCategoria,
} from "../../../../../../redux/actions/aCategorias";
import ValidIco from "../../../../../../components/ValidIco/ValidIco";
import { Notify } from "../../../../../../utils/notify/Notify";

const Maintenance = ({ info, cancelarEdit }) => {
  const dispatch = useDispatch();
  const isEdit = info != null;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    tipo: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      tipo: "Servicio",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!isEdit) {
        handleNewServicio(values);
      } else {
        handleUpdateServicio(values);
      }
    },
  });

  const handleNewServicio = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Registro de Categoria",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de agregar esta nueva Categoria ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(addCategoria(data));
          formik.resetForm();
          Notify("Categoria Agregado Exitosamente", "", "success");
        }
      },
    });
  };

  const handleUpdateServicio = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Actualizacion de Categoria",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Actualizar esta Categoria ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(
            updateCategoria({ idCategoria: info._id, categoriaData: data })
          );
          formik.resetForm();
          cancelarEdit();
        }
      },
    });
  };

  useEffect(() => {
    if (isEdit) {
      formik.setValues({
        name: info.name,
        tipo: info.tipo,
      });
    } else {
      formik.resetForm();
    }
  }, [info]);

  return (
    <div
      className="action-category"
      style={{ boxShadow: `0 0 10px ${isEdit ? "#e68422" : "#3e7ddd"}` }}
    >
      <h1>{isEdit ? "Actualizando" : "Agregando Nuevo"} Categoria</h1>
      {/* <h1>Agregando Nuevo Categoria</h1> */}
      <form onSubmit={formik.handleSubmit} className="info-c">
        <div className="body-c">
          <div className="col-c">
            <div className="inp-c">
              <TextInput
                name="name"
                label="Nombre :"
                size="xs"
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue("name", e.target.value);
                }}
                autoComplete="off"
              />
              {formik.errors.name &&
                formik.touched.name &&
                ValidIco({ mensaje: formik.errors.name })}
            </div>
            <div className="inp-c">
              <Select
                name="tipo"
                size="sm"
                label="Tipo"
                readOnly
                defaultValue={formik.values.tipo}
                onChange={(e) => {
                  formik.setFieldValue("tipo", e);
                }}
                placeholder="Escoge categoría"
                clearable
                searchable
                data={["Producto", "Servicio"]}
                maxDropdownHeight={150}
                max={200}
              />
              {formik.errors.tipo &&
                formik.touched.tipo &&
                ValidIco({ mensaje: formik.errors.tipo })}
            </div>
          </div>
        </div>
        <Button
          className={`b-action ${isEdit ? "a-edit" : "a-add"}`}
          type="submit"
        >
          {isEdit ? "Actualizar" : "Agregar"} Categoria
        </Button>
        {isEdit ? (
          <Button
            className="b-action a-cancelar"
            type="button"
            onClick={() => {
              formik.resetForm();
              cancelarEdit();
            }}
          >
            Cancelar
          </Button>
        ) : null}
      </form>
    </div>
  );
};

export default Maintenance;
