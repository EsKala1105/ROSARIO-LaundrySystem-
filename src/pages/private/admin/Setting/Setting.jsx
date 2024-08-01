/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./setting.scss";

import userSetting from "./userSetting.png";
import priceSetting from "./precio.png";
import businessSetting from "./business.png";
import impuestoSetting from "./impuestos.png";
import pointsSetting from "./points.png";
import metasSetting from "./metas.png";
import portafolioSetting from "./portafolio.png";
import categoriasSetting from "./categorias.png";
import GastosSetting from "./gastos.png";

import { Link } from "react-router-dom";
import { PrivateRoutes } from "../../../../models";
import { nameImpuesto, nameMoneda } from "../../../../services/global";
import Portal from "../../../../components/PRIVATE/Portal/Portal";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Setting = () => {
  const [PActions, setPActions] = useState(false);
  const iCategorias = useSelector((state) => state.categorias.listCategorias);
  const navigate = useNavigate();

  return (
    <div className="content-setting">
      <div className="list-st">
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_USERS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={userSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajuste de Usuarios</h1>
            <p>Realiza Eliminacion, Actualizacion y Agregar nuevo usuario</p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_BUSINESS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={businessSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajuste del Negocio</h1>
            <p>Cambios de horarios, nombre del negocio , direccion</p>
          </div>
        </Link>
        {/* <Link to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_PRICES}`} className="tag-setting">
          <div className="img">
            <img src={priceSetting} alt="" />
          </div>
          <div>
            <h1>Ajuste de Precios</h1>
            <p>Realiza Actualizacion en precios por defecto de prendas y Delivery</p>
          </div>
        </Link> */}
        {/* <Link onClick={() => setPActions(true)} className="tag-setting">
          <div className="img">
            <img src={portafolioSetting} alt="" />
          </div>
          <div>
            <h1>Servicios</h1>
            <p>Realiza Registros y Actualizacion de Servicios </p>
          </div>
        </Link> */}
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_SERVICIOS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={portafolioSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajustes de Servicios</h1>
            <p>
              Realiza nuevos Registros y Actualizacion de Servicios, pecios,
              nombres y asignacion de categorias
            </p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_CATEGORIAS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={categoriasSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Categorias</h1>
            <p>
              Realiza Registros , Actualizaciones en Categorias para los
              Servicios
            </p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_TIPO_GASTOS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={GastosSetting} alt="" />
          </div>
          <div>
            <h1>Tipos de Gastos</h1>
            <p>Realiza Registros, Actualizaciones de gastos recurrentes </p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_POINT}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={pointsSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajuste de Puntos</h1>
            <p>
              Actualiza el valor de puntos, "Donde "x" cantidad de {nameMoneda}{" "}
              valdra "y" cantidad de puntos"
            </p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_TAXES}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={impuestoSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajuste de Impuesto</h1>
            <p>Actualiza el valor del {nameImpuesto}, en porcentaje</p>
          </div>
        </Link>
        <Link
          to={`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_GOALS}`}
          className="tag-setting"
        >
          <div className="img">
            <img src={metasSetting} alt="" />
          </div>
          <div className="info-desc">
            <h1>Ajuste de Metas</h1>
            <p>Actualiza el valor de la (Meta Mensual)</p>
          </div>
        </Link>
      </div>
      {PActions && (
        <Portal
          onClose={() => {
            setPActions(false);
          }}
        >
          {iCategorias.length > 0 ? (
            <div className="portal-redirect-ps">
              <Button
                type="submit"
                style={{ background: "#339af0" }}
                onClick={() => {
                  navigate(
                    `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_PRODUCTOS}`,
                    { replace: true }
                  );
                  // setPActions(false)
                }}
              >
                Productos
              </Button>

              <Button
                type="submit"
                style={{ background: "#4eb979" }}
                onClick={() => {
                  navigate(
                    `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SETTING_SERVICIOS}`,
                    { replace: true }
                  );
                }}
              >
                Servicios
              </Button>
            </div>
          ) : (
            <div className="portal-setting-validation">
              <h2>Acceso Denegado</h2>
              <p>
                No tiene acceso hasta agregar almenos 1 registro de Categoria
              </p>
            </div>
          )}
        </Portal>
      )}
    </div>
  );
};

export default Setting;
