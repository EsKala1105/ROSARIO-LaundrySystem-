/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, TextInput, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import { useState, useEffect } from "react";
import { documento } from "../../../../../services/global";

const ActionCliente = ({ info, onAction }) => {
  const [onLoading, setOnLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      dni: "",
      nombre: "",
      direccion: "",
      phone: "",
      scoreTotal: 0,
      infoScore: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setOnLoading(true);
      onAction({
        dni: values.dni,
        nombre: values.nombre,
        direccion: values.direccion,
        phone: values.phone,
      });
    },
  });

  useEffect(() => {
    if (info) {
      formik.setFieldValue("dni", info.dni);
      formik.setFieldValue("nombre", info.nombre);
      formik.setFieldValue("direccion", info.direccion);
      formik.setFieldValue("phone", info.phone);
      formik.setFieldValue("scoreTotal", info.scoreTotal);
      formik.setFieldValue("infoScore", info.infoScore);
    } else {
      formik.resetForm();
    }
  }, [info]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {onLoading ? (
        <div className="loading-space">
          <LoaderSpiner />
        </div>
      ) : null}
      <div
        className="form-cliente"
        style={{ visibility: onLoading ? "hidden" : "visible" }}
      >
        <TextInput
          name="nombre"
          label="Nombre :"
          value={formik.values.nombre}
          onChange={(e) => {
            formik.setFieldValue("nombre", e.target.value);
          }}
          required
          autoComplete="off"
        />
        <TextInput
          name="dni"
          label={`${documento} : `}
          value={formik.values.dni}
          onChange={(e) => {
            formik.setFieldValue("dni", e.target.value);
          }}
          autoComplete="off"
        />
        <Textarea
          name="direccion"
          label="Direccion"
          placeholder="Ingrese Direccion"
          onChange={(e) => {
            formik.setFieldValue("direccion", e.target.value);
          }}
          value={formik.values.direccion}
        />
        <TextInput
          name="phone"
          onChange={formik.handleChange}
          label="Numero :"
          autoComplete="off"
          value={formik.values.phone}
        />
        {info ? (
          <div className="info-puntaje">
            <span>Total de Puntos : </span>
            <span>{formik.values.scoreTotal}</span>
          </div>
        ) : null}

        <Button type="submit" className="btn-save" color="blue">
          {info ? "ACTUALIZAR" : "REGISTRAR"}
        </Button>
        <div />
      </div>
    </form>
  );
};

export default ActionCliente;
