/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Clock from "../../../../components/Clock/Clock";

import icoTime from "./reloj.png";
import "./personal.scss";
import LoaderSpiner from "../../../../components/LoaderSpinner/LoaderSpiner";
import Portal from "../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./Accion/Maintenance";
import { useEffect } from "react";
import axios from "axios";
import { PrivateRoutes, Roles } from "../../../../models";
import { useNavigate } from "react-router-dom";
import { Notify } from "../../../../utils/notify/Notify";
import { Button } from "@mantine/core";
import { useSelector } from "react-redux";
import moment from "moment";

const Personal = () => {
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);
  const [listPersonal, setListPersonal] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [timeCurrent, setTimeCurrent] = useState();

  const navigate = useNavigate();

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      // Llamar a la API con la fecha formateada
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-personal`
      );
      setListPersonal(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  const handleAddPersonal = async (data) => {
    try {
      // Llamar a la API con la fecha formateada
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/registrar-personal`,
        data
      );
      setListPersonal([...listPersonal, response.data]);
      Notify("Registro Exitoso", "", "success");
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  const handleCloseAction = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <div className="content-personal">
      <h1>Asistencia</h1>
      <hr />
      <div className="body-personal">
        <Clock getTime={setTimeCurrent} />
        <div className={`container-mantine ${Loading ? "total-sp" : null}`}>
          {Loading ? (
            <LoaderSpiner />
          ) : (
            <>
              {InfoUsuario.rol === Roles.ADMIN ? (
                <div className="action-personal">
                  <Button
                    type="button"
                    className="btn-add"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    color="blue"
                  >
                    Agregar Personal
                  </Button>
                </div>
              ) : null}

              <div className="list-card-asistencia">
                {listPersonal.map((per, index) => (
                  <button
                    type="buttom"
                    onClick={() =>
                      navigate(
                        `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ASISTENCIA}/${per._id}`
                      )
                    }
                    className="card-personal"
                    key={index}
                  >
                    <div className="title">
                      <h1>{per.name}</h1>
                    </div>
                    <div className="accion">
                      <img src={icoTime} alt="" />
                    </div>
                    <div className="body">
                      {
                        <div className="extra-info">
                          <div className="info-i">
                            <table className="info-table">
                              <tbody>
                                <tr>
                                  <td>Hora Ingreso :</td>
                                  <td>
                                    {moment(per.horaIngreso, "HH:mm").format(
                                      "h:mm A"
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Hora Salida :</td>
                                  <td>
                                    {moment(per.horaSalida, "HH:mm").format(
                                      "h:mm A"
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <hr />
                            <span className="title-bd">
                              FECHA DE CUMPLEAÑOS
                            </span>
                            <br />
                            <span>
                              {moment(per.dateNacimiento).format("D [de] MMMM")}
                            </span>
                          </div>
                        </div>
                      }
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {modalOpen && (
        <Portal onClose={handleCloseAction}>
          <Maintenance onClose={handleCloseAction} onAdd={handleAddPersonal} />
        </Portal>
      )}
    </div>
  );
};

export default Personal;
