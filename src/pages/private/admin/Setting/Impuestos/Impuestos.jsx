/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./impuesto.scss";
import { useFormik } from "formik";

import { modals } from "@mantine/modals";
import { NumberInput, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models";

import { updateImpuesto } from "../../../../../redux/actions/aModificadores";
import { useDispatch, useSelector } from "react-redux";
import { nameImpuesto } from "../../../../../services/global";

const Impuestos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const InfoImpuesto = useSelector((state) => state.modificadores.InfoImpuesto);

  const formik = useFormik({
    initialValues: {
      IGV: InfoImpuesto.IGV,
    },
    //validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      openModal(values);
      setSubmitting(false);
    },
  });

  const openModal = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Actualizacion de Impuestos",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Estas seguro de realizar cambios en el valor de los puntos ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleUpdateImpuesto(data);
        }
      },
    });
  };

  const handleUpdateImpuesto = async (info) => {
    dispatch(updateImpuesto(info));
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  useEffect(() => {
    formik.setFieldValue("IGV", InfoImpuesto.IGV);
  }, [InfoImpuesto]);

  return (
    <div className="content-setting-impuesto">
      {InfoImpuesto && Object.keys(InfoImpuesto).length > 0 ? (
        <form className="form-impuesto" onSubmit={formik.handleSubmit}>
          <h1>Monto de Impuesto</h1>
          <NumberInput
            name={nameImpuesto}
            label={`${nameImpuesto} :`}
            value={formik.values.IGV}
            precision={2}
            onChange={(e) => {
              formik.setFieldValue("IGV", !Number.isNaN(e) ? e : 0);
            }}
            min={0.01}
            max={1}
            step={1}
            hideControls
            autoComplete="off"
          />
          <button type="type">Actualizar Impuesto</button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Impuestos;
