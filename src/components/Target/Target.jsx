/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./target.scss";

const Target = ({ descripcion, title, imgIco, imgBack }) => {
  return (
    <div className="card">
      <img src={imgBack} className="card__image" alt="" />
      <div className="card__overlay">
        <div className="card__header">
          <svg className="card__arc" xmlns="http://www.w3.org/2000/svg">
            <path />
          </svg>
          <img className="card__thumb" src={imgIco} alt="" />
          <div className="card__header-text">
            <h3 className="card__title">
              Reporte <br />
              {title}
            </h3>
            {/* {subtitle ? (
              <span className="card__tagline">{subtitle}</span>
            ) : null} */}
            {/* 
            <span className="card__status">3 hours ago</span> */}
          </div>
        </div>
        <p className="card__description">{descripcion}</p>
      </div>
    </div>
  );
};

export default Target;
