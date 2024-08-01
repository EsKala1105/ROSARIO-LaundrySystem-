/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { AddGasto } from "../../../../redux/actions/aGasto";

import { NumberInput, Select, TextInput, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

import "./gastos.scss";
import { simboloMoneda } from "../../../../services/global";
import { useState } from "react";
import ValidIco from "../../../../components/ValidIco/ValidIco";

const Gasto = ({ onClose }) => {
  const dispatch = useDispatch();
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);
  const { infoTipoGasto, iDeliveryEnvio, iDeliveryRecojo } = useSelector(
    (state) => state.tipoGasto
  );

  const [listTipoGastos, setListTipoGastos] = useState([]);

  const validationSchema = Yup.object().shape({
    idTipoGasto: Yup.string().required("Ingrese tipo de gasto"),
    motivo: Yup.string().required("Ingrese motivo de gasto"),
    monto: Yup.string().required("Ingrese monto (numerico)"),
  });

  const formik = useFormik({
    initialValues: {
      idTipoGasto: "",
      motivo: "",
      monto: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Buscar el tipo de gasto correspondiente al idTipoGasto seleccionado
      const tipoGastoSeleccionado = listTipoGastos.find(
        (tGasto) => tGasto.value === values.idTipoGasto
      );

      // Verificar si se encontró el tipo de gasto antes de acceder a su propiedad label
      const tipo = tipoGastoSeleccionado ? tipoGastoSeleccionado.label : "";

      // Desestructurar el objeto values para mayor claridad
      const { idTipoGasto, motivo, monto } = values;

      // Abrir el modal con los datos recopilados
      openModal({
        idTipoGasto,
        tipo,
        motivo,
        monto,
        idUser: InfoUsuario._id,
      });

      // Indicar que el formulario ya no se está enviando
      setSubmitting(false);
    },
  });

  const openModal = (values) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Confirmar Gasto",
      centered: true,
      children: <Text size="sm">¿ Estas seguro que agregar este GASTO ?</Text>,
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleSaveGasto(values);
        }
      },
    });
  };

  const handleSaveGasto = (infoGasto) => {
    dispatch(AddGasto({ infoGasto, rol: InfoUsuario.rol }));
    onClose();
  };

  useEffect(() => {
    const iTiposGasto = [iDeliveryEnvio, iDeliveryRecojo, ...infoTipoGasto];
    const dataSeletTipoGasto = iTiposGasto.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    setListTipoGastos(dataSeletTipoGasto);
  }, [infoTipoGasto, iDeliveryEnvio, iDeliveryRecojo]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="container-gasto">
        <h1>Gastos</h1>
        <div className="info-gasto">
          <div className="input-g">
            <Select
              name="idTipoGasto"
              label="Tipo Gasto"
              value={formik.values.idTipoGasto}
              onChange={(e) => {
                formik.setFieldValue("idTipoGasto", e);
              }}
              placeholder="Escoge una Tipo Gasto"
              clearable
              searchable
              // formik.setFieldValue('tipoDescuento', 'Gratis');
              data={listTipoGastos}
            />
            {formik.errors.idTipoGasto &&
              formik.touched.idTipoGasto &&
              ValidIco({ mensaje: formik.errors.idTipoGasto })}
          </div>
          <div className="input-g">
            <Textarea
              placeholder="Motivo del Gasto.."
              name="motivo"
              value={formik.values.motivo}
              onChange={(e) => {
                formik.setFieldValue("motivo", e.target.value);
              }}
            />
            {formik.errors.motivo &&
              formik.touched.motivo &&
              ValidIco({ mensaje: formik.errors.motivo })}
          </div>
          <div className="input-g">
            <NumberInput
              name="monto"
              value={formik.values.monto}
              parser={(value) =>
                value.replace(new RegExp(`${simboloMoneda}\\s?|(,*)`, "g"), "")
              }
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${simboloMoneda} ${value}`.replace(
                      /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                      ","
                    )
                  : ""
              }
              min={0}
              placeholder="Ingrese Monto"
              precision={2}
              step={0.05}
              hideControls
              autoComplete="off"
              onChange={(value) => formik.setFieldValue("monto", value)}
            />
            {formik.errors.monto &&
              formik.touched.monto &&
              ValidIco({ mensaje: formik.errors.monto })}
          </div>
          <div className="actions-bottom">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="b-saved"
            >
              Agregar Gasto
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Gasto;
