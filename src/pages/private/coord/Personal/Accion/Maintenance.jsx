/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React from "react";

import ValidIco from "../../../../../components/ValidIco/ValidIco";
import { TextInput } from "@mantine/core";
import TimePicker from "react-time-picker";
import * as Yup from "yup";
import { modals } from "@mantine/modals";

import { Button, NumberInput, Text } from "@mantine/core";

import "./maintenance.scss";
import moment from "moment";
import { DateInput } from "@mantine/dates";

// eslint-disable-next-line react/prop-types
const Maintenance = ({ onClose, onAdd }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    horaIngreso: Yup.string().required("Campo obligatorio"),
    horaSalida: Yup.string().required("Campo obligatorio"),
    pagoByHour: Yup.string().required("Campo obligatorio"),
    dateNacimiento: Yup.string().required("Campo obligatorio"),
    pagoMensual: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      horaIngreso: "",
      horaSalida: "",
      pagoByHour: "",
      dateNacimiento: "",
      pagoMensual: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      confirmAdd(values);
    },
  });

  const confirmAdd = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Registro de Personal",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Agregar este Personal Nuevo ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          formik.resetForm();
          onClose();
          onAdd(data);
        }
      },
    });
  };

  return (
    <form onSubmit={formik.handleSubmit} className="action-personal">
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
          ValidIco({
            mensaje: formik.errors.name,
          })}
      </div>
      <div className="time-asis">
        <div className="input-item">
          <div className="input-date">
            <label htmlFor="">Hora Ingreso :</label>
            <TimePicker
              className="hour-date"
              onChange={(newTime) => {
                const timeMoment = moment(newTime, "HH:mm");
                const timeString = timeMoment.format("HH:mm");
                formik.setFieldValue("horaIngreso", timeString);
              }}
              value={
                moment(formik.values.horaIngreso, "HH:mm").isValid()
                  ? moment(formik.values.horaIngreso, "HH:mm").toDate()
                  : null
              }
              amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
              clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
              clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
              disableClock={true}
              format="h:mm a"
            />
          </div>
          {formik.errors.horaIngreso &&
            formik.touched.horaIngreso &&
            ValidIco({
              mensaje: formik.errors.horaIngreso,
            })}
        </div>
        <div className="input-item">
          <div className="input-date">
            <label htmlFor="">Hora Salida :</label>
            <TimePicker
              className="hour-date"
              onChange={(newTime) => {
                const timeMoment = moment(newTime, "HH:mm");
                const timeString = timeMoment.format("HH:mm");
                formik.setFieldValue("horaSalida", timeString);
              }}
              value={
                moment(formik.values.horaSalida, "HH:mm").isValid()
                  ? moment(formik.values.horaSalida, "HH:mm").toDate()
                  : null
              }
              amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
              clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
              clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
              disableClock={true}
              format="h:mm a"
            />
          </div>
          {formik.errors.horaSalida &&
            formik.touched.horaSalida &&
            ValidIco({
              mensaje: formik.errors.horaSalida,
            })}
        </div>
      </div>
      <div className="input-item">
        <DateInput
          value={
            moment(formik.values.dateNacimiento, "YYYY-MM-DD").isValid()
              ? moment(formik.values.dateNacimiento, "YYYY-MM-DD").toDate()
              : null
          }
          onChange={(date) => {
            formik.setFieldValue(
              "dateNacimiento",
              moment(date).format("YYYY-MM-DD")
            );
          }}
          label="Fecha de Nacimiento"
          placeholder="Ingrese Fecha"
        />
        {formik.errors.horaSalida &&
          formik.touched.horaSalida &&
          ValidIco({
            mensaje: formik.errors.horaSalida,
          })}
      </div>
      <div className="input-item">
        <NumberInput
          name="pagoByHour"
          label="Pago x Hora :  ( Extra / Descuento )"
          value={formik.values.pagoByHour}
          precision={2}
          onChange={(e) => {
            formik.setFieldValue("pagoByHour", !Number.isNaN(e) ? e : 0);
          }}
          min={0}
          step={0.5}
          hideControls
          autoComplete="off"
        />
        {formik.errors.horaSalida &&
          formik.touched.horaSalida &&
          ValidIco({
            mensaje: formik.errors.horaSalida,
          })}
      </div>
      <div className="input-item">
        <NumberInput
          name="pagoMensual"
          label="Pago Mensual :"
          value={formik.values.pagoMensual}
          onChange={(e) => {
            formik.setFieldValue("pagoMensual", !Number.isNaN(e) ? e : 0);
          }}
          min={0}
          step={1}
          hideControls
          autoComplete="off"
        />
        {formik.errors.pagoMensual &&
          formik.touched.pagoMensual &&
          ValidIco({
            mensaje: formik.errors.pagoMensual,
          })}
      </div>

      <Button type="submit" className="btn-save" color="blue">
        Guardar
      </Button>
    </form>
  );
};

export default Maintenance;
