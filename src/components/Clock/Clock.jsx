/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./clock.scss";
import Digital from "./Digital/Digital";

const Clock = ({ getTime }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Función para formatear los números de un solo dígito con un cero delante
  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : number;
  };

  // Devolver la fecha y hora exactas como un objeto
  const currentDateTime = {
    year: time.getFullYear(),
    month: formatNumber(time.getMonth() + 1),
    day: formatNumber(time.getDate()),
    hour: formatNumber(time.getHours()),
    minute: formatNumber(time.getMinutes()),
    second: formatNumber(time.getSeconds()),
    ampm: time.getHours() >= 12 ? "PM" : "AM",
  };

  // Calcular los grados para la rotación de la barra de horas
  const hourDegrees =
    (360 / 12) * time.getHours() + (360 / 12 / 60) * time.getMinutes();

  useEffect(() => {
    getTime(currentDateTime);
  }, [time]);

  return (
    <div className="content-clock">
      <div className="analog-time">
        <div className="clock">
          <div
            className="hour_hand "
            style={{ transform: `rotateZ(${hourDegrees}deg)` }}
          />
          <div
            className="min_hand"
            style={{
              transform: `rotateZ(${time.getMinutes() * 6}deg)`,
            }}
          />
          <div
            className="sec_hand"
            style={{
              transform: `rotateZ(${time.getSeconds() * 6}deg)`,
            }}
          />
          <span className="twelve">12</span>
          <span className="one">1</span>
          <span className="two">2</span>
          <span className="three">3</span>
          <span className="four">4</span>
          <span className="five">5</span>
          <span className="six">6</span>
          <span className="seven">7</span>
          <span className="eight">8</span>
          <span className="nine">9</span>
          <span className="ten">10</span>
          <span className="eleven">11</span>
          {/* Mostrar la hora digital debajo del reloj */}
        </div>
      </div>
      <Digital iTime={time} />
    </div>
  );
};

export default Clock;
