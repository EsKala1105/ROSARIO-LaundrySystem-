/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./infoRecojo.scss";
import { DateInput } from "@mantine/dates";
import TimePicker from "react-time-picker";
import moment from "moment";

const InfoRecojo = ({ mode, paso, descripcion, changeValue, values }) => {
  const handleGetDay = (date) => {
    const formattedDayOfWeek = moment(date).format("dddd");
    return `${formattedDayOfWeek} : `;
  };

  return (
    <div className="info-recojo">
      <div className="title">
        <h1>PASO {paso}</h1>
        <h2>{descripcion}</h2>
      </div>
      <div className="body">
        <div className="content-date">
          <label htmlFor="">Recojo:</label>
          <div className="date-ma">
            <DateInput
              name="dateRecojo"
              value={values.dateRecojo}
              onChange={(date) => {
                changeValue("dateRecojo", date);
              }}
              placeholder="Ingrese Fecha"
              minDate={new Date()}
              disabled={mode === "UPDATE"}
            />
            <div className="actions-date">
              <button
                type="button"
                className="btn-preview"
                onClick={() => {
                  const currentDate = new Date();
                  const newDate = new Date(
                    Math.max(
                      values.dateRecojo.getTime() - 24 * 60 * 60 * 1000,
                      currentDate.getTime()
                    )
                  );
                  changeValue("datePrevista", newDate);
                  changeValue("dateRecojo", newDate);
                }}
                disabled={mode === "UPDATE"}
              >
                {"<"}
              </button>
              <button
                type="button"
                className="btn-next"
                tabIndex="6"
                onClick={() => {
                  const newDate = new Date(
                    values.dateRecojo.getTime() + 24 * 60 * 60 * 1000
                  );
                  changeValue("datePrevista", newDate);
                  changeValue("dateRecojo", newDate);
                }}
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
              name="hourRecojo"
              className="hour-date"
              onChange={(newTime) => {
                const timeMoment = moment(newTime, "HH:mm");
                const timeString = timeMoment.format("HH:mm");
                changeValue("hourRecojo", timeString);
              }}
              value={
                moment(values.hourRecojo, "HH:mm").isValid()
                  ? moment(values.hourRecojo, "HH:mm").toDate()
                  : null
              }
              disabled={mode === "UPDATE"}
              amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
              clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
              clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
              disableClock={true}
              required
              format="h:mm a"
            />
            <label className="day-date">
              {handleGetDay(values.dateRecojo)}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoRecojo;
