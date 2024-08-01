/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import { MonthPickerInput } from "@mantine/dates";
import { Formik, Form, FieldArray } from "formik";

import { DateCurrent } from "../../../../../utils/functions";
import { GetReporte } from "../../../../../redux/actions/aReporte";
import "./reporteMensual.scss";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import moment from "moment";
import { Button, MultiSelect } from "@mantine/core";
import { UpdateInfoNegocio } from "../../../../../redux/actions/aNegocio";
import { getListItems } from "../utils";

const ReporteMesual = () => {
  const [datePrincipal, setDatePrincipal] = useState(new Date());
  const dispatch = useDispatch();
  const [infoReport, setInfoReport] = useState([]);

  const infoReporte_xMes = useSelector(
    (state) => state.reporte.infoReporte_xMes
  );
  const isInitialRender = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const InfoCategorias = useSelector(
    (state) => state.categorias.listCategorias
  );
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);
  const InfoServicios = useSelector((state) => state.servicios.listServicios);
  const InfoProductos = useSelector((state) => state.productos.listProductos);

  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const [itemSelected, setItemSelected] = useState([]);
  const [listItems, setListItems] = useState([]);

  const [ordenByName, setOrderByName] = useState([]);

  const fetchData = async (date) => {
    isInitialRender.current = true;
    const currentDate = moment(date).format("YYYY-MM-DD");
    await dispatch(
      GetReporte({ type: "monthly", filter: { date: currentDate } })
    );
  };

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
    if (infoReporte_xMes.length > 0) {
      setIsLoading(false);
      setInfoReport(infoReporte_xMes);
      isInitialRender.current = false;
    }
  }, [infoReporte_xMes]);

  useEffect(() => {
    if (isInitialRender.current === false) {
      setIsLoading(true);
      fetchData(datePrincipal);
    }
  }, [datePrincipal, InfoNegocio]);

  useEffect(() => {
    const idsItems = InfoNegocio.itemsInformeDiario;
    setItemSelected(idsItems);

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
    <div
      className="content-inform-m"
      style={isLoading ? null : { border: "solid 1px silver" }}
    >
      {isLoading ? (
        <div className="loading-general">
          <LoaderSpiner />
        </div>
      ) : (
        <>
          <div className="title-header">
            <h1>Informe Mensual</h1>
          </div>
          <div className="filter-date">
            <div>
              <MonthPickerInput
                label="Ingrese Fecha"
                placeholder="Pick date"
                value={datePrincipal}
                onChange={(date) => {
                  setDatePrincipal(date);
                }}
                mx="auto"
                maw={400}
              />
            </div>

            <div className="setting-tabla">
              <MultiSelect
                size="sm"
                label="Columnas de Reporte"
                value={itemSelected.map((item) => item.id)}
                onChange={(e) => {
                  setItemSelected(e);
                  const selectedItemsWithOrder = e.map((id, index) => ({
                    order: index + 1,
                    id: id,
                  }));
                  setItemSelected(selectedItemsWithOrder);
                }}
                placeholder="Escoge Servicios"
                clearable
                maxSelectedValues={5}
                maw={300}
                searchable
                data={listItems}
                maxDropdownHeight={200}
              />
              <div className="accion">
                <Button
                  className="btn-ajustar"
                  onClick={() => {
                    dispatch(
                      UpdateInfoNegocio({
                        itemsInformeDiario: itemSelected,
                      })
                    );
                  }}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{
              fEntrega: [],
            }}
          >
            {({ values }) => (
              <Form className="container-informe">
                <div className="informe-body">
                  <FieldArray name="fEntrega">
                    {() => (
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
                                    DateCurrent().format4 ===
                                    dayData.FechaPrevista
                                      ? "#ffd9d9"
                                      : null,
                                  gridTemplateColumns: `repeat(${
                                    ordenByName.length + 3
                                  }, minmax(100px, 1fr))`,
                                }}
                                data-fechaprevista={dayData.FechaPrevista}
                                ref={(element) => {
                                  if (
                                    element &&
                                    DateCurrent().format4 ===
                                      element.getAttribute("data-fechaprevista")
                                  ) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                      block: "start",
                                    });
                                  }
                                }}
                              >
                                <td>{dayData.FechaPrevista}</td>
                                <td>{dayData.CantidadPedido}</td>
                                {ordenByName.map((col) => {
                                  const infoItem = dayData.InfoItems.find(
                                    (item) => item.identificador === col.id
                                  );
                                  return (
                                    <td key={col.id}>
                                      {infoItem ? infoItem.Cantidad : 0}
                                    </td>
                                  );
                                })}
                                <td>
                                  {dayData.InfoItems.find(
                                    (item) =>
                                      item.identificador === iDelivery._id
                                  )?.Cantidad || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default ReporteMesual;
