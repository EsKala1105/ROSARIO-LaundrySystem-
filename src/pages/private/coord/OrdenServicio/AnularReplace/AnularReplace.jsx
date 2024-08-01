/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { NumberInput, TextInput } from "@mantine/core";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import OrdenServicio from "../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import { DateCurrent } from "../../../../../utils/functions";
import "./anularReplace.scss";

import { ReactComponent as DeliveryPropio } from "../../../../../utils/img/Delivery/delivery-propio.svg";
import { ReactComponent as DeliveryPrivado } from "../../../../../utils/img/Delivery/delivery-privado.svg";

import { useDispatch, useSelector } from "react-redux";

import { PrivateRoutes } from "../../../../../models";
import {
  defaultHoraPrevista,
  simboloMoneda,
} from "../../../../../services/global";
import ValidIco from "../../../../../components/ValidIco/ValidIco";
import { AnularRemplazar_OrdensService } from "../../../../../redux/actions/aOrdenServices";
import { setLastRegister } from "../../../../../redux/states/service_order";

const Replace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { lastRegister } = useSelector((state) => state.orden);

  const ordenToAnular = useSelector((state) =>
    state.orden.registered.find((item) => item._id === id)
  );
  const infoAnulacion = location.state;
  const [infoGastoByDelivery, setInfoGastoByDelivery] = useState();
  const [ordenToReplace, setOrdenToReplace] = useState();

  const infoCodigo = useSelector((state) => state.codigo.infoCodigo);
  const InfoUsuario = useSelector((state) => state.user.infoUsuario);
  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const infoTipoGastoDeliveryRecojo = useSelector(
    (state) => state.tipoGasto.iDeliveryRecojo
  );

  const handleAnular_Replace = async (data) => {
    setRedirect(true);

    const { infoOrden, infoPago } = data;

    const dataToAnular = {
      idOrden: id,
      infoAnulacion: {
        _id: id,
        ...infoAnulacion,
        idUser: InfoUsuario._id,
      },
    };
    const dataToNewOrden = {
      infoOrden: {
        ...infoOrden,
        estado: "registrado",
        typeRegistro: "normal",
      },
      infoPago,
      infoGastoByDelivery,
    };

    await dispatch(
      AnularRemplazar_OrdensService({ dataToAnular, dataToNewOrden })
    ).then((res) => {
      if (res.error) {
        console.error(
          "Error al anular y remplazar la orden de servicio:",
          res.error.message
        );
        navigate(
          `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
        );
      }
    });
  };

  const handleGetInfoGastoByDelivery = (values) => {
    const infoGastoByDeliveryRecojo = {
      idTipoGasto: infoTipoGastoDeliveryRecojo._id,
      tipo: infoTipoGastoDeliveryRecojo.name,
      motivo: `[${String(infoCodigo.codActual).padStart(
        4,
        "0"
      )}] Delivery RECOJO en Transporte ${values.tipoDelivery} - ${
        values.name
      }`,
      date: {
        fecha: DateCurrent().format4,
        hora: DateCurrent().format3,
      },
      monto: values.price,
      idUser: InfoUsuario._id,
    };

    setInfoGastoByDelivery(infoGastoByDeliveryRecojo);
  };

  const inputRef = useRef(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    price: Yup.string().required("Campo obligatorio (numero)"),
    tipoDelivery: Yup.string().required("Selecciona medio de transporte"),
  });

  useEffect(() => {
    if (shouldFocusInput) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  useEffect(() => {
    const {
      idCliente,
      dni,
      Nombre,
      Modalidad,
      direccion,
      celular,
      Items,
      descuento,
      cargosExtras,
      subTotal,
      totalNeto,
    } = ordenToAnular;

    setOrdenToReplace({
      idCliente,
      codRecibo: infoCodigo.codActual,
      dni,
      Nombre,
      Modalidad,
      direccion,
      celular,
      dateRecepcion: {
        fecha: DateCurrent().format4,
        hora: DateCurrent().format3,
      },
      datePrevista: {
        fecha: DateCurrent().format4,
        hora: defaultHoraPrevista,
      },
      Items,
      descuento,
      subTotal,
      cargosExtras,
      totalNeto,
      gift_promo: [],
      ListPago: [],
    });
  }, [ordenToAnular]);

  useEffect(() => {
    if (lastRegister !== null) {
      const getId = lastRegister._id;
      dispatch(setLastRegister());
      navigate(
        `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/${getId}`
      );
    }
  }, [lastRegister]);

  return (
    <>
      {redirect === false ? (
        <div className="delivery-orden-service">
          {!infoGastoByDelivery &&
          ordenToReplace?.Modalidad === "Delivery" &&
          !InfoNegocio?.hasMobility ? (
            <Formik
              initialValues={{
                name: ordenToAnular?.Nombre,
                price: "",
                tipoDelivery: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleGetInfoGastoByDelivery(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit} className="content-delivery">
                  <div className="head-info-cd">
                    <h1>
                      Orden de Servcio :&nbsp;
                      {String(infoCodigo.codActual).padStart(6, "0")}
                    </h1>
                  </div>
                  <hr />
                  <div className="body-c-movilidad">
                    <fieldset className="content-movilidad">
                      <legend className="legend-c-movilidad">
                        &nbsp;&nbsp;
                        <span className="accion">&nbsp;(GASTO POR RECOJO)</span>
                        &nbsp;&nbsp;
                      </legend>
                      <div className="group-fieldset">
                        <fieldset className="checkbox-sub-group">
                          <legend className="checkbox-group-legend">
                            &nbsp;&nbsp;PAGADO&nbsp;&nbsp;
                          </legend>
                          <div className="checkbox">
                            <label className="checkbox-wrapper">
                              <Field
                                type="radio"
                                className="checkbox-input"
                                name="tipoDelivery"
                                value="Privado"
                                onClick={() => {
                                  setShouldFocusInput(true);
                                  setFieldValue("price", "");
                                }}
                              />
                              <span className="checkbox-tile">
                                <span className="checkbox-icon">
                                  <DeliveryPrivado className="custom-icon" />
                                </span>
                                <span className="checkbox-label">Privado</span>
                              </span>
                            </label>
                          </div>
                        </fieldset>
                        <fieldset className="checkbox-sub-group">
                          <legend className="checkbox-group-legend">
                            &nbsp;&nbsp;GRATIS&nbsp;&nbsp;
                          </legend>
                          <div className="checkbox">
                            <label className="checkbox-wrapper">
                              <Field
                                type="radio"
                                className="checkbox-input"
                                name="tipoDelivery"
                                value="Propio"
                                onClick={() => {
                                  setFieldValue("price", 0);
                                  setShouldFocusInput(true);
                                }}
                              />
                              <span className="checkbox-tile">
                                <span className="checkbox-icon">
                                  <DeliveryPropio className="custom-icon" />
                                </span>
                                <span className="checkbox-label">Propio</span>
                              </span>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                      {errors.tipoDelivery && touched.tipoDelivery && (
                        <div className="ico-req">
                          <i className="fa-solid fa-circle-exclamation ">
                            <div
                              className="info-req"
                              style={{ pointerEvents: "none" }}
                            >
                              <span>{errors.tipoDelivery}</span>
                            </div>
                          </i>
                        </div>
                      )}
                    </fieldset>
                    <div className="infoDelivery">
                      <div className="b-inputs">
                        <div className="input-info-required">
                          <TextInput
                            name="name"
                            size="md"
                            label="Nombres del Cliente :"
                            autoComplete="off"
                            disabled
                            onChange={handleChange}
                            value={values.name}
                          />
                          {errors.name &&
                            touched.name &&
                            ValidIco({ mensaje: errors.name })}
                        </div>
                        <div className="input-info-required">
                          <NumberInput
                            name="price"
                            label="Gasto por Delivery :"
                            size="md"
                            value={values.price}
                            ref={inputRef}
                            parser={(value) =>
                              value.replace(
                                new RegExp(`${simboloMoneda}\\s?|(,*)`, "g"),
                                ""
                              )
                            }
                            formatter={(value) => {
                              return Number.isNaN(parseFloat(value))
                                ? ""
                                : `${simboloMoneda} ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ","
                                  );
                            }}
                            placeholder="Ingrese Monto"
                            precision={2}
                            step={0.05}
                            disabled={values.tipoDelivery === "Propio"}
                            hideControls={true}
                            autoComplete="off"
                            onChange={(value) => setFieldValue("price", value)}
                          />
                          {errors.price &&
                            touched.price &&
                            ValidIco({ mensaje: errors.price })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="footer-delivery">
                    <button type="submit" className="btn-saved">
                      Siguiente
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <OrdenServicio
              titleMode="REMPLAZAR"
              mode="NEW"
              onAction={handleAnular_Replace}
              infoDefault={ordenToReplace}
            />
          )}
        </div>
      ) : (
        <div className="loading-general">
          <LoaderSpiner />
        </div>
      )}
    </>
  );
};

export default Replace;
