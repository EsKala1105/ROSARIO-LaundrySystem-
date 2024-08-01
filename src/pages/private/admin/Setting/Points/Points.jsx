/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./points.scss";
import { useFormik } from "formik";

import { modals } from "@mantine/modals";
import { Button, NumberInput, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models";
import { updatePuntos } from "../../../../../redux/actions/aModificadores";
import { useDispatch, useSelector } from "react-redux";
import { nameMoneda } from "../../../../../services/global";
import { formatThousandsSeparator } from "../../../../../utils/functions";

const Points = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const InfoPuntos = useSelector((state) => state.modificadores.InfoPuntos);

  const formik = useFormik({
    initialValues: {
      score: parseInt(InfoPuntos.score),
      valor: parseInt(InfoPuntos.valor),
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
      title: "Actualizacion de Puntos",
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
          handleUpdatePuntos(data);
        }
      },
    });
  };

  const handleUpdatePuntos = async (info) => {
    dispatch(updatePuntos(info));
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  useEffect(() => {
    formik.setFieldValue("score", parseInt(InfoPuntos.score));
    formik.setFieldValue("valor", parseInt(InfoPuntos.valor));
  }, [InfoPuntos]);

  return (
    <div className="content-setting-point">
      {InfoPuntos && Object.keys(InfoPuntos).length > 0 ? (
        <form className="form-point" onSubmit={formik.handleSubmit}>
          <h1>Valor de Puntos</h1>
          <NumberInput
            name="valor"
            label={`Valor en ${nameMoneda} :`}
            value={formik.values.valor}
            formatter={(value) => formatThousandsSeparator(value)}
            precision={2}
            onChange={(e) => {
              formik.setFieldValue("valor", !Number.isNaN(e) ? e : 0);
            }}
            min={0.01}
            step={1}
            hideControls
            autoComplete="off"
          />
          <NumberInput
            name="score"
            label="Puntos :"
            value={formik.values.score}
            formatter={(value) => formatThousandsSeparator(value)}
            precision={0}
            onChange={(e) => {
              formik.setFieldValue("score", !Number.isNaN(e) ? e : 0);
            }}
            min={1}
            step={1}
            hideControls
            autoComplete="off"
          />

          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Actualizar Valor
          </Button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Points;
