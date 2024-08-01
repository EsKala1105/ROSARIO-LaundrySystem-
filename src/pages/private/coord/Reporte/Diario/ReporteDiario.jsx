/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DateCurrent } from "../../../../../utils/functions";
import { GetReporte } from "../../../../../redux/actions/aReporte";
import { PrivateRoutes } from "../../../../../models";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import "./reporteDiario.scss";
import { getListItems } from "../utils";

const ReporteDiario = ({ onClose }) => {
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);
  const [isLoading, setIsLoading] = useState(true);
  const [infoReport, setInfoReport] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const infoReporte_xDias = useSelector(
    (state) => state.reporte.infoReporte_xDias
  );
  const isInitialRender = useRef(false);

  const [listItems, setListItems] = useState([]);

  const [ordenByName, setOrderByName] = useState([]);

  const InfoCategorias = useSelector(
    (state) => state.categorias.listCategorias
  );
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);
  const InfoServicios = useSelector((state) => state.servicios.listServicios);
  const InfoProductos = useSelector((state) => state.productos.listProductos);

  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  useEffect(() => {
    const lItems = getListItems(
      InfoProductos,
      InfoServicios,
      InfoCategorias,
      iDelivery
    );
    setListItems(lItems);
  }, [InfoProductos, InfoServicios, InfoCategorias, iDelivery]);

  useEffect(() => {
    const fetchData = async () => {
      isInitialRender.current = true;
      await dispatch(GetReporte({ type: "daily", filter: { days: 3 } }));
    };

    if (isInitialRender.current === false) {
      fetchData();
    }
  }, [dispatch]);

  useEffect(() => {
    if (infoReporte_xDias.length > 0) {
      setIsLoading(false);
      setInfoReport(infoReporte_xDias);
    }
  }, [infoReporte_xDias]);

  useEffect(() => {
    const idsItems = InfoNegocio.itemsInformeDiario;

    const orderedItems = idsItems.map((item, index) => {
      const infoItem = listItems.find((objeto) => objeto.value === item.id);
      return {
        name: infoItem?.label.slice(0, -4),
        id: item.id.substring(3),
        order: index + 1, // Se suma 1 para iniciar el orden desde 1 en lugar de 0
      };
    });

    setOrderByName(orderedItems);
  }, [InfoNegocio, listItems]);

  return (
    <div className="content-reporte-diario">
      {isLoading ? (
        <div className="loading-general">
          <LoaderSpiner />
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr
                style={{
                  gridTemplateColumns: `repeat(${
                    ordenByName.length + 3
                  }, minmax(100px, 1fr))`,
                }}
              >
                <th>Fecha Entrega</th>
                <th>Cantidad</th>
                {ordenByName
                  .sort((a, b) => a.order - b.order) // Ordenar los elementos según el número de orden
                  .map((col) => (
                    <th key={col.order}>{col.name}</th>
                  ))}
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {infoReport.map((dayData, index) => (
                <tr
                  key={index}
                  style={{
                    background:
                      DateCurrent().format4 === dayData.FechaPrevista
                        ? "#ffd9d9"
                        : null,
                    gridTemplateColumns: `repeat(${
                      ordenByName.length + 3
                    }, minmax(100px, 1fr))`,
                  }}
                  data-fechaprevista={dayData.FechaPrevista}
                >
                  <td>{dayData.FechaPrevista}</td>
                  <td>{dayData.CantidadPedido}</td>
                  {ordenByName.map((col) => {
                    const infoItem = dayData.InfoItems.find(
                      (item) => item.identificador === col.id
                    );
                    return (
                      <td key={col.id}>{infoItem ? infoItem.Cantidad : 0}</td>
                    );
                  })}
                  <td>
                    {dayData.InfoItems.find(
                      (item) => item.identificador === iDelivery?._id
                    )?.Cantidad || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {InfoUsuario.rol !== "pers" && (
            <div className="action-end">
              <button
                type="button"
                onClick={() => {
                  onClose(false);
                  navigate(
                    `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_ORDER_SERVICE}`
                  );
                }}
              >
                Informe Completo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReporteDiario;
