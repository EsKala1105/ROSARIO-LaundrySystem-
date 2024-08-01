/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./maintenance.scss";
import { Button, TextInput, Text, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import ValidIco from "../../../../../../components/ValidIco/ValidIco";
import { Notify } from "../../../../../../utils/notify/Notify";
import {
  AddTipoGasto,
  UpdateTipoGastos,
} from "../../../../../../redux/actions/aTipoGasto";

const Maintenance = ({ info, cancelarEdit }) => {
  const dispatch = useDispatch();
  const isEdit = info != null;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    detalle: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      detalle: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!isEdit) {
        handleNewTipoGasto(values);
      } else {
        handleUpdateTipoGasto(values);
      }
    },
  });

  const handleNewTipoGasto = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Registrando tipo de Gasto",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Estas seguro de agregar este nuevo tipo de Gasto ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(AddTipoGasto(data));
          formik.resetForm();
          Notify("Tipo de Gasto Agregado Exitosamente", "", "success");
        }
      },
    });
  };

  const handleUpdateTipoGasto = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Actualizando tipo de Gasto",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Actualizar este tipo de Gasto ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(UpdateTipoGastos({ id: info._id, infoTipoGasto: data }));
          Notify("Tipo de Gasto Actualizado Exitosamente", "", "success");
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
        detalle: info.detalle,
      });
    } else {
      formik.resetForm();
    }
  }, [info]);

  return (
    <div
      className="action-tipo-gasto"
      style={{ boxShadow: `0 0 10px ${isEdit ? "#e68422" : "#3e7ddd"}` }}
    >
      <h1>{isEdit ? "Actualizando" : "Agregando Nuevo"} Tipo de Gasto</h1>
      {/* <h1>Agregando Nuevo Categoria</h1> */}
      <form onSubmit={formik.handleSubmit} className="info-tg">
        <div className="body-tg">
          <div className="col-tg">
            <div className="inp-tg">
              <TextInput
                name="name"
                label="Nombre :"
                disabled={isEdit && info?.nivel === "primario"}
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
            <div className="inp-tg">
              <Textarea
                name="detalle"
                size="xs"
                label="Detalle"
                value={formik.values.detalle}
                onChange={(e) => {
                  formik.setFieldValue("detalle", e.target.value);
                }}
                placeholder="¿Que abarca este gasto?"
              />
              {formik.errors.detalle &&
                formik.touched.detalle &&
                ValidIco({ mensaje: formik.errors.detalle })}
            </div>
          </div>
        </div>
        <Button
          className={`b-action ${isEdit ? "a-edit" : "a-add"}`}
          type="submit"
        >
          {isEdit ? "Actualizar" : "Agregar Nuevo"} Gasto
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
