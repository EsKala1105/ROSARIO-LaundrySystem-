/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./metas.scss";
import { useFormik } from "formik";

import { modals } from "@mantine/modals";
import { Button, NumberInput, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models";
import { useDispatch, useSelector } from "react-redux";
import { UpdateMetas } from "../../../../../redux/actions/aMetas";
import { formatThousandsSeparator } from "../../../../../utils/functions";

const Metas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const infoMetas = useSelector((state) => state.metas.infoMetas);

  const formik = useFormik({
    initialValues: {
      Tienda: parseInt(infoMetas.Tienda),
      Delivery: parseInt(infoMetas.Delivery),
      Total: parseInt(infoMetas.Total),
    },
    onSubmit: async (values, { setSubmitting }) => {
      openModal(values);
      setSubmitting(false);
    },
  });

  const openModal = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Actualizacion de Metas",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de realizar cambios en las Metas ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleUpdateMetas(data);
        }
      },
    });
  };

  const handleUpdateMetas = async (info) => {
    dispatch(UpdateMetas(info));
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  useEffect(() => {
    formik.setFieldValue("Tienda", parseInt(infoMetas.Tienda));
    formik.setFieldValue("Delivery", parseInt(infoMetas.Delivery));
    formik.setFieldValue("Total", parseInt(infoMetas.Total));
  }, [infoMetas]);

  return (
    <div className="content-setting-metas">
      {infoMetas && Object.keys(infoMetas).length > 0 ? (
        <form className="form-metas" onSubmit={formik.handleSubmit}>
          <h1>Informacion de Metas</h1>
          <NumberInput
            name="Total"
            label="Meta Mensual :"
            value={formik.values.Total}
            formatter={(value) => formatThousandsSeparator(value)}
            precision={0}
            onChange={(e) => {
              formik.setFieldValue("Total", !Number.isNaN(e) ? e : 0);
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
            Actualizar Meta
          </Button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Metas;
