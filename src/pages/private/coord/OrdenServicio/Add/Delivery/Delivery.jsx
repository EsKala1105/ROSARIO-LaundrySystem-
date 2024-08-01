/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NumberInput, TextInput } from "@mantine/core";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import OrdenServicio from "../../../../../../components/PRIVATE/OrdenServicio/OrdenServicio";
import LoaderSpiner from "../../../../../../components/LoaderSpinner/LoaderSpiner";
import { DateCurrent } from "../../../../../../utils/functions";
import "./delivery.scss";

import { ReactComponent as DeliveryPropio } from "../../../../../../utils/img/Delivery/delivery-propio.svg";
import { ReactComponent as DeliveryPrivado } from "../../../../../../utils/img/Delivery/delivery-privado.svg";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";
import { AddOrdenServices } from "../../../../../../redux/actions/aOrdenServices";

import { setLastRegister } from "../../../../../../redux/states/service_order";
import { PrivateRoutes } from "../../../../../../models";
import {
  defaultHoraPrevista,
  simboloMoneda,
} from "../../../../../../services/global";
import ValidIco from "../../../../../../components/ValidIco/ValidIco";

const Delivery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const infoCodigo = useSelector((state) => state.codigo.infoCodigo);
  const { lastRegister } = useSelector((state) => state.orden);

  const { InfoImpuesto } = useSelector((state) => state.modificadores);

  const InfoUsuario = useSelector((state) => state.user.infoUsuario);
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);
  const { InfoImpuesto: iImpuesto } = useSelector(
    (state) => state.modificadores
  );

  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [registrar, setRegistrar] = useState(false);

  const [redirect, setRedirect] = useState(false);

  const [infoGastoByDelivery, setInfoGastoByDelivery] = useState();
  const [infoDefault, setInfoDefault] = useState();

  const infoTipoGastoDeliveryRecojo = useSelector(
    (state) => state.tipoGasto.iDeliveryRecojo
  );

  // Reservar
  const handleReservar = async (values) => {
    const infoGastoByDelivery = {
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

    const infoOrden = {
      codRecibo: infoCodigo.codActual,
      dateRecepcion: {
        fecha: DateCurrent().format4,
        hora: DateCurrent().format3,
      },
      dateRecojo: {
        fecha: "",
        hora: "",
      },
      Modalidad: "Delivery",
      Nombre: values.name,
      idCliente: "",
      Items: [
        {
          identificador: iDelivery._id,
          tipo: "servicio",
          cantidad: 1,
          item: iDelivery.nombre,
          simboloMedida: iDelivery.simboloMedida,
          descripcion: "Transporte",
          price: iDelivery.precioVenta,
          monto: iDelivery.precioVenta,
          descuentoManual: 0,
          total: iDelivery.precioVenta,
          disable: {
            cantidad: true,
            item: true,
            descripcion: true,
            monto: false,
            total: false,
            descuentoManual: false,
            action: true,
          },
        },
      ],
      celular: "",
      direccion: "",
      datePrevista: {
        fecha: DateCurrent().format4,
        hora: defaultHoraPrevista,
      },
      dateEntrega: {
        fecha: "",
        hora: "",
      },
      descuento: {
        estado: false,
        modoDescuento: "Ninguno",
        info: null,
        monto: 0,
      },
      estadoPrenda: "pendiente",
      estado: "reservado",
      dni: "",
      subTotal: 0,
      cargosExtras: {
        impuesto: {
          estado: false,
          valor: iImpuesto.IGV,
          importe: 0,
        },
      },
      totalNeto: 0,
      modeRegistro: "nuevo",
      gift_promo: [],
      attendedBy: {
        name: InfoUsuario.name,
        rol: InfoUsuario.rol,
      },
      typeRegistro: "normal",
    };

    await dispatch(
      AddOrdenServices({
        infoOrden,
        rol: InfoUsuario.rol,
        infoPago: null,
        infoGastoByDelivery,
        infoUser: {
          _id: InfoUsuario._id,
          name: InfoUsuario.name,
          usuario: InfoUsuario.usuario,
          rol: InfoUsuario.rol,
        },
      })
    );
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  // Registrar
  const handleRegistrar = async (info) => {
    const { infoOrden, infoPago, rol } = info;
    if (infoGastoByDelivery) {
      setRedirect(true);
      await dispatch(
        AddOrdenServices({
          infoOrden: {
            ...infoOrden,
            estado: "registrado",
            typeRegistro: "normal",
          },
          infoPago,
          rol,
          infoGastoByDelivery,
          infoUser: {
            _id: InfoUsuario._id,
            name: InfoUsuario.name,
            usuario: InfoUsuario.usuario,
            rol: InfoUsuario.rol,
          },
        })
      ).then((res) => {
        if (res.error) {
          console.error(
            "Error en el servicio al agregar la orden:",
            res.error.message
          );
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
          );
        }
      });
    }
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

    setInfoDefault({
      codRecibo: infoCodigo.codActual,
      dni: "",
      Nombre: values.name,
      Modalidad: "Delivery",
      direccion: "",
      celular: "",
      dateRecepcion: {
        fecha: DateCurrent().format4,
        hora: DateCurrent().format3,
      },
      datePrevista: {
        fecha: DateCurrent().format4,
        hora: defaultHoraPrevista,
      },
      Items: [
        {
          identificador: iDelivery?._id,
          tipo: "servicio",
          cantidad: 1,
          item: iDelivery?.nombre,
          simboloMedida: iDelivery?.simboloMedida,
          descripcion: "Transporte",
          price: iDelivery?.precioVenta,
          monto: iDelivery?.precioVenta,
          descuentoManual: 0,
          total: iDelivery?.precioVenta,
          disable: {
            cantidad: true,
            item: true,
            descripcion: true,
            monto: false,
            total: false,
            descuentoManual: false,
            action: true,
          },
        },
      ],
      descuento: {
        estado: false,
        modoDescuento: "Ninguno",
        info: null,
        monto: 0,
      },
      subTotal: 0,
      cargosExtras: {
        impuesto: {
          estado: false,
          valor: iImpuesto.IGV,
          importe: 0,
        },
      },
      totalNeto: 0,
      gift_promo: [],
      ListPago: [],
    });
    setInfoGastoByDelivery(infoGastoByDeliveryRecojo);

    setRegistrar(true);
  };

  const inputRef = useRef(null);

  const openModal = (values) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Reserva de Pedido",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro que quieres RESERVAR este pedido ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleReservar(values);
        }
      },
    });
  };

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
          {registrar === false ? (
            <Formik
              initialValues={{
                name: "",
                price: "",
                tipoDelivery: "",
                submitAction: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (values.submitAction === "reservar") {
                  openModal(values);
                } else if (values.submitAction === "registrar") {
                  handleGetInfoGastoByDelivery(values);
                }
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                isSubmitting,
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
                            onChange={handleChange}
                            ref={inputRef}
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
                    <button
                      type="submit"
                      className="btn-saved"
                      disabled={isSubmitting}
                      onClick={() => setFieldValue("submitAction", "reservar")}
                    >
                      Reservar
                    </button>
                    <button
                      type="submit"
                      className="btn-saved"
                      onClick={() => setFieldValue("submitAction", "registrar")}
                    >
                      Registrar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <OrdenServicio
              titleMode="REGISTRAR"
              mode={"NEW"}
              onAction={handleRegistrar}
              infoDefault={infoDefault}
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

export default Delivery;
