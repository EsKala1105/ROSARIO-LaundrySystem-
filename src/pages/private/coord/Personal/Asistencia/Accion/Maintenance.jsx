/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import ValidIco from "../../../../../../components/ValidIco/ValidIco";
import { Radio, Group } from "@mantine/core";
import TimePicker from "react-time-picker";
import * as Yup from "yup";
import { modals } from "@mantine/modals";

import { Button, Text, Textarea } from "@mantine/core";

import "./maintenance.scss";
import moment from "moment";

// eslint-disable-next-line react/prop-types
const Maintenance = ({ info, onClose, onAddAsistencia }) => {
  const { infoDay, infoPersonal } = info;
  const [day, setDay] = useState();

  // normal - cumpleaños - feriado  - falta
  const lTipoRegistro = ["normal", "cumpleaños", "feriado", "falta"];

  const validationSchema = Yup.object().shape({
    tipoRegistro: Yup.string().required("Escoge una Opcion obligatorio"),
    ingreso: Yup.object()
      .shape({
        hora: Yup.string().required("Campo obligatorio"),
      })
      .required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      fecha: infoDay?.fecha,
      ingreso: infoDay?.ingreso,
      observacion: infoDay?.observacion,
      salida: infoDay?.salida,
      tipoRegistro: infoDay?.tipoRegistro || "normal",
      estado: infoDay?.estado,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dataFinal = {
        id: infoDay?._id,
        ...values,
        ingreso: {
          hora: values.ingreso.hora,
          saved: !!values.ingreso.hora,
        },
        salida: {
          hora: values.salida.hora,
          saved: !!values.salida.hora,
        },
      };

      handleValidateAdd(dataFinal);
    },
  });

  const handleValidateAdd = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Registro de Asistencia",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Estas seguro de actualizar datos de ASISTENCIA ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          onAddAsistencia(data);
          formik.resetForm();
          onClose();
        }
      },
    });
  };

  const handleGetDay = (date) => {
    const formattedDayOfWeek = moment(date, "YYYY-MM-DD").format("dddd");
    return formattedDayOfWeek;
  };

  useEffect(() => {
    if (info) {
      const iDay = handleGetDay(info?.infoDay.fecha);
      setDay(iDay);
    }
  }, [info]);

  useEffect(() => {
    if (formik.values.tipoRegistro === "falta") {
      formik.setFieldValue("ingreso.hora", infoPersonal.horaIngreso);
      formik.setFieldValue("salida.hora", infoPersonal.horaIngreso);
    } else {
      formik.setFieldValue("ingreso.hora", infoDay?.ingreso.hora);
      formik.setFieldValue("salida.hora", infoDay?.salida.hora);
    }
  }, [formik.values.tipoRegistro]);

  return (
    <form onSubmit={formik.handleSubmit} className="action-asistencia">
      <h1>{day}</h1>
      <div className="input-item">
        <Radio.Group
          name="tipoRegistro"
          onChange={(value) => {
            formik.setFieldValue("tipoRegistro", value);
          }}
          value={formik.values.tipoRegistro}
          label="Tipo de Registro"
        >
          <Group mt="xs">
            {lTipoRegistro.map((tp, index) => {
              const showRadioButton =
                tp !== "cumpleaños" ||
                !infoPersonal.birthDayUsed.some((date) =>
                  moment(date).isSame(formik.values.fecha, "year")
                );

              return showRadioButton ||
                (formik.values.estado === "update" &&
                  infoDay?.tipoRegistro === "cumpleaños") ? (
                <Radio key={index} value={tp} label={tp} />
              ) : null;
            })}
          </Group>
        </Radio.Group>
        {formik.errors.tipoRegistro &&
          formik.touched.tipoRegistro &&
          ValidIco({ mensaje: formik.errors.tipoRegistro })}
      </div>
      <div className="content-hour">
        <label htmlFor="">Hora Ingreso :</label>
        <div className="date-dh">
          <TimePicker
            className="hour-date"
            autoFocus={true}
            onChange={(newTime) => {
              const timeMoment = moment(newTime, "HH:mm");
              const timeString = timeMoment.format("HH:mm");
              formik.setFieldValue("ingreso.hora", timeString);
            }}
            value={
              moment(formik.values.ingreso?.hora, "HH:mm").isValid()
                ? moment(formik.values.ingreso?.hora, "HH:mm").toDate()
                : null
            }
            disabled={
              formik.values.tipoRegistro === "falta"
                ? true
                : formik.values.ingreso?.saved
                ? true
                : false
            }
            amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
            clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
            clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
            disableClock={true}
            format="h:mm a"
          />
          <div className="accion-id">
            {!formik.values.salida?.saved ? (
              <button
                className="day-date"
                disabled={formik.values.tipoRegistro === "falta"}
                onClick={() => {
                  formik.setFieldValue("ingreso.hora", "");
                  formik.setFieldValue("salida.hora", "");
                  formik.setFieldValue("salida.saved", false);
                  formik.setFieldValue("ingreso.saved", false);
                }}
                type="button"
              >
                X
              </button>
            ) : null}
          </div>
        </div>
        {formik.errors.ingreso &&
          formik.touched.ingreso &&
          formik.errors.ingreso.hora &&
          ValidIco({
            mensaje: formik.errors.ingreso.hora,
          })}
      </div>
      <div className="content-hour">
        <label htmlFor="">Hora Salida :</label>
        <div className="date-dh">
          <TimePicker
            className="hour-date"
            onChange={(newTime) => {
              const timeMoment = moment(newTime, "HH:mm");
              const timeString = timeMoment.format("HH:mm");
              formik.setFieldValue("salida.hora", timeString);
            }}
            value={
              moment(formik.values.salida?.hora, "HH:mm").isValid()
                ? moment(formik.values.salida?.hora, "HH:mm").toDate()
                : null
            }
            disabled={
              formik.values.tipoRegistro === "falta"
                ? true
                : formik.values.ingreso?.hora
                ? formik.values.salida?.saved
                  ? true
                  : false
                : true
            }
            amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
            clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
            clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
            disableClock={true}
            format="h:mm a"
          />
          <div className="accion-id">
            {formik.values.salida?.saved ? (
              <button
                className="day-date"
                disabled={
                  formik.values.tipoRegistro === "falta"
                    ? true
                    : formik.values.ingreso?.hora
                    ? false
                    : true
                }
                onClick={() => {
                  formik.setFieldValue("salida.hora", "");
                  formik.setFieldValue("salida.saved", false);
                }}
                type="button"
              >
                X
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="body-ct">
        <div className="input-item">
          <Textarea
            name="observacion"
            value={formik.values.observacion}
            onChange={formik.handleChange}
            placeholder="Redacte las observaciones necesarias ..."
            label="Observacion"
          />
        </div>
      </div>
      <Button type="submit" className="btn-save" color="teal">
        Guardar
      </Button>
    </form>
  );
};

export default Maintenance;
