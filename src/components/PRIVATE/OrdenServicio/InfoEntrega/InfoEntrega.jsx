/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./infoEntrega.scss";
import { DateInput } from "@mantine/dates";
import TimePicker from "react-time-picker";
import moment from "moment";

const InfoEntrega = ({ mode, paso, descripcion, changeValue, values }) => {
  const handleGetDay = (date) => {
    const formattedDayOfWeek = moment(date).format("dddd");
    return `${formattedDayOfWeek} : `;
  };

  return (
    <div className="info-entrega">
      <div className="title">
        <h1>PASO {paso}</h1>
        <h2>{descripcion}</h2>
      </div>
      <div className="body">
        <div className="content-date">
          <label htmlFor="">Entrega:</label>
          <div className="date-ma">
            <DateInput
              name="datePrevista"
              value={values.datePrevista}
              onChange={(date) => {
                changeValue("datePrevista", date);
              }}
              placeholder="Ingrese Fecha"
              minDate={values.dateRecojo}
              disabled={mode === "UPDATE"}
            />
            <div className="actions-date">
              <button
                type="button"
                className="btn-preview"
                onClick={() => {
                  const currentDate = values.dateRecojo;
                  const newDate = new Date(
                    Math.max(
                      values.datePrevista.getTime() - 24 * 60 * 60 * 1000,
                      currentDate.getTime()
                    )
                  );
                  changeValue("datePrevista", newDate);
                }}
                disabled={mode === "UPDATE"}
              >
                {"<"}
              </button>
              <button
                type="button"
                className="btn-next"
                tabIndex="6"
                onClick={() =>
                  changeValue(
                    "datePrevista",
                    new Date(
                      values.datePrevista.getTime() + 24 * 60 * 60 * 1000
                    )
                  )
                }
                disabled={mode === "UPDATE"}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
        <div className="content-hour">
          <label htmlFor=""></label>
          <div className="date-dh">
            <TimePicker
              name="hourPrevista"
              className="hour-date"
              onChange={(newTime) => {
                const timeMoment = moment(newTime, "HH:mm");
                const timeString = timeMoment.format("HH:mm");
                changeValue("hourPrevista", timeString);
              }}
              value={
                moment(values.hourPrevista, "HH:mm").isValid()
                  ? moment(values.hourPrevista, "HH:mm").toDate()
                  : null
              }
              disabled={mode === "UPDATE"}
              amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
              clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
              clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
              disableClock={true}
              format="h:mm a"
            />
            <label className="day-date">
              {handleGetDay(values.datePrevista)}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoEntrega;
