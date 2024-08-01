/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import "react-time-picker/dist/TimePicker.css";
import { Modal } from "@mantine/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useSelector } from "react-redux";
import InfoCliente from "./InfoCliente/InfoCliente";
import "./ordenServicio.scss";
import InfoServicios from "./InfoServicios/InfoServicios";
import { Button, Text, ScrollArea } from "@mantine/core";
import InfoEntrega from "./InfoEntrega/InfoEntrega";
import InfoDescuento from "./InfoDescuento/InfoDescuento";
import { useState } from "react";
import { useEffect } from "react";
import InfoPromociones from "./InfoPromociones/InfoPromociones";
import InfoPuntos from "./InfoPuntos/InfoPuntos";
import InfoPago from "./InfoPago/InfoPago";
import {
  defaultHoraPrevista,
  defaultHoraRecojo,
  showFactura,
  simboloMoneda,
} from "../../../services/global";
import { modals } from "@mantine/modals";
import axios from "axios";
import {
  DateCurrent,
  formatFecha,
  formatHora,
  formatRoundedNumber,
} from "../../../utils/functions";
import Promocion from "./Promocion/Promocion";
import { useDisclosure } from "@mantine/hooks";
import InfoPagos from "./InfoPagos/InfoPagos";
import MetodoPago from "../MetodoPago/MetodoPago";
import SwtichDimension from "../../SwitchDimension/SwitchDimension";
import InfoFactura from "./InfoFactura/InfoFactura";
import InfoRecojo from "./InfoRecojo/InfoRecojo";

const OrdenServicio = ({ mode, onAction, infoDefault, titleMode }) => {
  const [mPromocion, { open: openModalPromocion, close: closeModalPromocion }] =
    useDisclosure(false);

  const [
    mMetodoPago,
    { open: openModalMetodoPago, close: closeModalMetodoPago },
  ] = useDisclosure(false);

  const iCodigo = useSelector((state) => state.codigo.infoCodigo.codActual);
  const { InfoImpuesto: iImpuesto, InfoPuntos: iPuntos } = useSelector(
    (state) => state.modificadores
  );
  const iPromocion = useSelector((state) => state.promocion.infoPromocion);
  const iUsuario = useSelector((state) => state.user.infoUsuario);
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);
  const iServicios = useSelector((state) => state.servicios.listServicios);
  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const listClientes = useSelector((state) => state.clientes.listClientes);

  const [sidePanelVisible, setSidePanelVisible] = useState(false);

  const [infoCliente, setInfoCliente] = useState(null);
  const [infoPagos, setInfoPagos] = useState([]);

  const [currentPago, setCurrentPago] = useState();

  // descuento cupon promocion
  const [onPromocion, setOnPromocion] = useState(false);

  // const [dataPromo, setDataPromo] = useState();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    Items: Yup.array()
      .min(1, "Debe haber al menos un item")
      .test(
        "categoria",
        "Debe haber al menos un item - Delivery no cuenta",
        function (value) {
          return value.some((item) => item.identificador !== iDelivery?._id);
        }
      )
      .of(
        Yup.object().shape({
          //cantidad: Yup.string().required("Campo obligatorio"),
          //descripcion: Yup.string().required("Campo obligatorio"),
          //total: Yup.string().required("Campo obligatorio"),
        })
      ),
  });

  const getItemsAdaptados = (Items) => {
    return Items.map((item) => {
      // Transforma cada item a la nueva estructura
      const isDelivery = iDelivery?._id === item.identificador ? true : false;
      return {
        cantidad: item.cantidad,
        identificador: item.identificador,
        simboloMedida: item.simboloMedida,
        tipo: item.tipo,
        item: item.item,
        descripcion: item.descripcion,
        expanded: false, // Valor estático para el ejemplo
        price: item.precio,
        monto: item.monto,
        descuentoManual: item.descuentoManual,
        total: item.total,
        disable: {
          cantidad: isDelivery ? true : mode !== "UPDATE" ? false : true,
          item: true,
          descripcion: isDelivery,
          monto: mode === "UPDATE",
          descuentoManual: mode === "UPDATE",
          total:
            mode !== "UPDATE"
              ? false
              : isDelivery && mode !== "UPDATE"
              ? false
              : true,
          action: isDelivery ? true : mode !== "UPDATE" ? false : true,
        },
      };
    });
  };

  const formik = useFormik({
    initialValues: {
      dni: "",
      name: "",
      Modalidad: mode === "PRELIMINARY" ? "Delivery" : "Tienda",
      direccion: "",
      celular: "",
      dateIngreso: new Date(),
      dateRecojo: new Date(),
      hourRecojo: defaultHoraRecojo,
      datePrevista: new Date(),
      hourPrevista: defaultHoraPrevista,
      Items:
        mode === "PRELIMINARY"
          ? [
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
            ]
          : [],
      descuento: {
        estado: false,
        modoDescuento: "Ninguno", // Puntos | Promocion | Manual | Ninguno
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let correcciones;
      if (
        values.descuento.info !== null &&
        values.descuento.modoDescuento === "Promocion" &&
        values.descuento.estado
      ) {
        correcciones = await validItems(values.descuento.info);
      }

      if (correcciones) {
        alert(`La Promoción Exige:\n\n${correcciones}`);
      } else {
        if (mode === "NEW") {
          const thereIsPromo = iPromocion.length > 0;
          const thereIsPromoActiva = iPromocion.some(
            (promocion) => promocion.state === "activo"
          );

          if (thereIsPromo && thereIsPromoActiva) {
            openModalPromocion();
          } else {
            openModal([]);
          }
        } else {
          openModal([]);
        }
      }
    },
  });

  const validCupon = async (codigoCupon) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/validar-cupon/${codigoCupon}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      // Captura errores y devuelve un mensaje de error genérico
      return {
        mensaje: "Error al hacer la solicitud: " + error.message,
      };
    }
  };

  const validItems = async (promociones) => {
    const listItems = formik.values.Items;

    const idServicios = promociones.prenda;

    let servicios = [];

    // Crear un arreglo con la información de los servicios asociados a cada identificador
    idServicios.forEach((serviceID) => {
      const infoService = iServicios.find((i) => i._id === serviceID);
      if (infoService) {
        // Verificar si se encontró la información del servicio
        servicios.push({
          identificador: infoService._id,
          servicio: infoService.nombre,
          simbolo: infoService.simboloMedida,
        });
      }
    });

    const identificadoresReferencia = servicios.map(
      (item) => item.identificador
    );

    // Filtrar los elementos de la lista base que coinciden con los identificadores de la lista de referencia
    const itemsValidos = listItems.filter((item) =>
      identificadoresReferencia.includes(item.identificador)
    );

    const cantMin = promociones.cantidadMin;

    const handleGetCaActual = (atributo) =>
      itemsValidos.reduce((total, item) => total + +item[atributo], 0);

    let infoFaltante = "";
    let cantActual = 0;
    if (promociones.tipoPromocion === "Varios") {
      // Varios
      if (promociones.tipoDescuento === "Porcentaje") {
        // Pocentaje
        cantActual = handleGetCaActual("cantidad");
      } else {
        // Monto
        cantActual = handleGetCaActual("total");
      }
    } else {
      // Unico
      cantActual = handleGetCaActual("cantidad");
    }

    const res = cantActual >= cantMin;

    if (promociones.tipoPromocion === "Unico") {
      if (!res) {
        infoFaltante = `${`Minimo ${cantMin}${
          servicios[0].simbolo
        } del servicio "${servicios[0].servicio}" y ${
          cantActual === 0
            ? "no registraste ninguno"
            : `solo registraste : ${cantActual}${servicios[0].simbolo}`
        }`}`;
      }
    } else {
      if (!res) {
        if (promociones.tipoDescuento === "Monto") {
          infoFaltante = `${`Minimo ${simboloMoneda}${cantMin} en gastos de servicio y ${
            cantActual === 0
              ? "no registraste ninguno"
              : `solo registro : ${simboloMoneda}${cantActual}`
          }`}`;
        }
      }
    }

    return infoFaltante;
  };

  const openModal = async (cups) => {
    let confirmationEnabled = true;
    closeModalPromocion();
    setOnPromocion(false);
    const values = {
      ...formik.values,
      gift_promo: cups.length > 0 ? cups : [],
    };

    modals.openConfirmModal({
      title: "Registro de Orden de Servicio",
      centered: true,
      children: (
        <Text size="sm">
          ¿Estás seguro de registrar esta Orden de Servicio?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => formik.setFieldValue("gift_promo", []),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleGetInfo(values);
        }
      },
    });
  };

  const handleGetInfo = async (data) => {
    const infoIntem = data.Items.map((p) => ({
      identificador: p.identificador,
      tipo: p.tipo,
      cantidad: p.cantidad,
      item: p.item,
      simboloMedida: p.simboloMedida,
      descripcion: p.descripcion,
      precio: p.price,
      monto: p.monto,
      descuentoManual: p.descuentoManual,
      total: p.total,
    }));

    let descuentoUpdated;
    if (!data.descuento.info || !data.descuento.estado) {
      descuentoUpdated = {
        estado: false,
        modoDescuento: "Ninguno",
        info: null,
        monto: 0,
      };
    } else {
      descuentoUpdated = data.descuento;
    }

    let cargosExtrasUpdated;
    if (!data.cargosExtras.impuesto.estado) {
      cargosExtrasUpdated = {
        impuesto: {
          estado: false,
          valor: 0,
          importe: 0,
        },
      };
    } else {
      cargosExtrasUpdated = data.cargosExtras;
    }

    const infoPago = currentPago
      ? {
          ...currentPago,
          date: {
            fecha: DateCurrent().format4,
            hora: DateCurrent().format3,
          },
          isCounted: true,
          idUser: iUsuario._id,
        }
      : null;

    const infoOrden = {
      dateRecepcion: {
        fecha: formatFecha(data.dateIngreso),
        hora: formatHora(data.dateIngreso),
      },
      Modalidad: data.Modalidad,
      Nombre: data.name,
      idCliente: infoCliente ? infoCliente._id : "",
      Items: infoIntem,
      celular: data.celular,
      direccion: data.direccion,
      datePrevista: {
        fecha: formatFecha(data.datePrevista),
        hora: data.hourPrevista,
      },
      dateRecojo:
        mode === "PRELIMINARY" && "Delivery"
          ? {
              fecha: formatFecha(data.dateRecojo),
              hora: data.hourRecojo,
            }
          : {
              fecha: "",
              hora: "",
            },
      dateEntrega: {
        fecha: "",
        hora: "",
      },
      descuento: descuentoUpdated,
      dni: data.dni,
      subTotal: data.subTotal,
      cargosExtras: cargosExtrasUpdated,
      totalNeto: data.totalNeto,
      modeRegistro: "nuevo",
      gift_promo: data.gift_promo,
      attendedBy: {
        name: iUsuario.name,
        rol: iUsuario.rol,
      },
    };

    onAction({
      infoOrden,
      infoPago,
      rol: iUsuario.rol,
    });

    formik.handleReset();
  };

  const handleChageValue = (name, value) => {
    formik.setFieldValue(name, value);
  };

  const toggleSidePanel = () => {
    setSidePanelVisible(!sidePanelVisible);
  };

  const sumaTotalesItems = (listItems) => {
    return listItems.reduce((total, item) => {
      const ItemTotal = parseFloat(item.total);
      return isNaN(ItemTotal) ? total : total + ItemTotal;
    }, 0);
  };

  const MontoxPoints = (xpoints) => {
    const puntos = parseFloat(iPuntos.score);
    const valor = parseFloat(iPuntos.valor);
    const equivalenteEnSoles = (xpoints / puntos) * valor;

    return equivalenteEnSoles;
  };

  const recalculatePromoDescuento = (dataPromo) => {
    if (dataPromo.tipoDescuento === "Porcentaje") {
      let itemsConsideradas;
      if (dataPromo.tipoPromocion === "Varios") {
        if (dataPromo.alcance === "Todos") {
          itemsConsideradas = formik.values.Items;
        } else {
          itemsConsideradas = formik.values.Items.filter((elemento) =>
            dataPromo.prenda.includes(elemento.identificador)
          );
        }

        let sumaTotales = sumaTotalesItems(itemsConsideradas);

        const dscFinal = +parseFloat(
          sumaTotales * dataPromo.nMultiplicador
        ).toFixed(1);

        return dscFinal;
      } else {
        // TIPO PROMOCION = UNICO

        // obtener el id de la prenda x q puede haber mas de 1 del mismo id
        itemsConsideradas = formik.values.Items.filter(
          (i) => i.identificador === dataPromo.prenda[0]
        );

        // suma los montos del mismo item
        if (itemsConsideradas.length > 0) {
          let sumaTotales = sumaTotalesItems(itemsConsideradas);

          // Calcular descuentos y actualizar sumaTotales

          const dscFinal = +parseFloat(
            sumaTotales * dataPromo.nMultiplicador
          ).toFixed(1);

          return dscFinal;
        }
        return 0;
      }
    } else {
      if (dataPromo.tipoDescuento === "Gratis") {
        const prendaEncontrada = iServicios.find(
          (p) => p._id === dataPromo.prenda[0]
        );
        const dscFinal =
          prendaEncontrada.precioVenta * dataPromo.nMultiplicador;
        return dscFinal;
      } else {
        // TIPO DESCUENTO = Monto
        return dataPromo.nMultiplicador;
      }
    }
  };

  useEffect(() => {
    if (formik.values.descuento.modoDescuento === "Manual") {
      formik.values.Items.forEach((row, index) => {
        formik.setFieldValue(`Items.${index}.descuentoManual`, 0);
        formik.setFieldValue(`Items.${index}.total`, row.monto);
      });
    } else {
      if (formik.values.descuento.modoDescuento === "Puntos" && infoCliente) {
        formik.setFieldValue(`descuento.info`, {
          puntosUsados: 0,
          puntosRestantes: 0,
        });
      } else {
        formik.setFieldValue(`descuento.info`, null);
      }
    }
  }, [formik.values.descuento.modoDescuento]);

  useEffect(() => {
    if (formik.values.descuento.estado) {
      if (
        formik.values.descuento.modoDescuento === "Promocion" &&
        formik.values.descuento.info &&
        mode !== "UPDATE"
      ) {
        if (formik.values.descuento.info) {
          setSidePanelVisible(true);
        } else {
          setSidePanelVisible(false);
        }
      }
      if (
        formik.values.descuento.modoDescuento === "Puntos" &&
        formik.values.descuento.info &&
        mode !== "UPDATE"
      ) {
        if (infoCliente) {
          setSidePanelVisible(true);
        } else {
          setSidePanelVisible(false);
        }
      }
    } else {
      setSidePanelVisible(false);
    }
  }, [formik.values.descuento]);

  useEffect(() => {
    const subTotal = formik.values.subTotal;

    let montoIGV = 0;
    if (formik.values.cargosExtras.impuesto.estado === true) {
      montoIGV = +(
        subTotal * formik.values.cargosExtras.impuesto.valor
      ).toFixed(2);
    }
    formik.setFieldValue("cargosExtras.impuesto.importe", montoIGV);
    const total = subTotal + montoIGV;

    let descuento = 0;
    // Calcular Descuento
    if (formik.values.descuento.estado) {
      if (formik.values.descuento.modoDescuento === "Promocion") {
        if (formik.values.descuento.info) {
          descuento = recalculatePromoDescuento(formik.values.descuento.info);
        } else {
          descuento = 0;
        }
      } else if (formik.values.descuento.modoDescuento === "Puntos") {
        const puntosUsados = formik.values.descuento.info?.puntosUsados;

        descuento = Number(MontoxPoints(puntosUsados).toFixed(2)) || 0;
      } else if (formik.values.descuento.modoDescuento === "Manual") {
        descuento = 0;
      } else {
        // Ninguno
        descuento = 0;
      }
    }
    formik.setFieldValue("descuento.monto", descuento);

    const totalNeto = total - descuento;
    formik.setFieldValue("totalNeto", +formatRoundedNumber(totalNeto));
  }, [
    formik.values.Items,
    formik.values.descuento.estado,
    formik.values.descuento.modoDescuento,
    formik.values.descuento.info,
    formik.values.cargosExtras.impuesto.estado,
    formik.values.cargosExtras.impuesto.valor,
    formik.values.subTotal,
  ]);

  useEffect(() => {
    setCurrentPago();
  }, [formik.values.totalNeto]);

  useEffect(() => {
    if (infoDefault) {
      handleChageValue("dni", infoDefault.dni);
      handleChageValue("name", infoDefault.Nombre);
      handleChageValue("Modalidad", infoDefault.Modalidad);
      handleChageValue("direccion", infoDefault.direccion);
      handleChageValue("celular", infoDefault.celular);
      handleChageValue(
        "dateIngreso",
        moment(infoDefault.dateRecepcion.fecha, "YYYY-MM-DD").toDate()
      );
      handleChageValue(
        "datePrevista",
        moment(infoDefault.datePrevista.fecha, "YYYY-MM-DD").toDate()
      );
      handleChageValue(
        "dateRecojo",
        moment(infoDefault.dateRecojo.fecha, "YYYY-MM-DD").toDate()
      );
      handleChageValue("hourPrevista", infoDefault.datePrevista.hora);
      handleChageValue("hourRecojo", infoDefault.dateRecojo.hora);
      handleChageValue("subTotal", infoDefault.subTotal);
      handleChageValue("cargosExtras", infoDefault.cargosExtras);
      handleChageValue("totalNeto", infoDefault.totalNeto);
      handleChageValue("gift_promo", infoDefault.gift_promo);
      handleChageValue("descuento", infoDefault.descuento);

      setInfoPagos(infoDefault.ListPago);
      const dCliente = listClientes.find(
        (cli) => cli._id === infoDefault.idCliente
      );

      if (infoDefault.descuento.estado && infoDefault.descuento.info) {
        if (infoDefault.descuento.modoDescuento === "Promocion") {
          setInfoCliente(dCliente);
          setSidePanelVisible(true);
        } else if (infoDefault.descuento.modoDescuento === "Puntos") {
          setInfoCliente({
            ...dCliente,
            scoreTotal:
              dCliente.scoreTotal + infoDefault.descuento.info.puntosUsados,
          });
          setSidePanelVisible(true);
        } else {
          setInfoCliente(dCliente);
        }
      } else {
        setInfoCliente(dCliente);
      }

      setTimeout(() => {
        handleChageValue("Items", getItemsAdaptados(infoDefault.Items));
      }, 1000);
    }
  }, [infoDefault]);

  return (
    <form onSubmit={formik.handleSubmit} className="content-recibo">
      <div className="head-recibo">
        <div
          className={`h-colum-data ${
            !InfoNegocio?.hasMobility ? "width-ct" : null
          }`}
        >
          <div className="title-recibo">
            {mode === "PRELIMINARY" ? (
              <h1>ORDEN DE RECOJO A DOMICILIO</h1>
            ) : (
              <h1>
                {titleMode}&nbsp;-&nbsp;ORDEN SERVICIO N°&nbsp;
                {infoDefault ? `${infoDefault.codRecibo} ` : iCodigo}
              </h1>
            )}
          </div>
          <Button className="btn-saved" type="submit">
            {titleMode}
          </Button>
        </div>
        {InfoNegocio?.hasMobility ? (
          <div className="h-colum-modo">
            <SwtichDimension
              onSwitch="Tienda"
              offSwitch="Delivery"
              name="Modalidad"
              defaultValue={
                formik.values.Modalidad === "Delivery" ? false : true
              }
              handleChange={(value) => {
                formik.setFieldValue("Modalidad", value);
                if (value === "Delivery") {
                  formik.setFieldValue("Items", [
                    {
                      identificador: iDelivery._id,
                      tipo: "servicio",
                      cantidad: 1,
                      item: "Delivery",
                      simboloMedida: "vj",
                      descripcion: "Movilidad",
                      price: iDelivery.precioVenta,
                      monto: iDelivery.precioVenta,
                      descuentoManual: 0,
                      total: iDelivery.precioVenta,
                      disable: {
                        cantidad: true,
                        item: true,
                        descripcion: false,
                        monto: false,
                        total: false,
                        descuentoManual: false,
                        action: true,
                      },
                    },
                    ...formik.values.Items,
                  ]);
                } else {
                  const updatedItems = formik.values.Items.filter(
                    (item) => item.identificador !== iDelivery._id
                  );
                  formik.setFieldValue("Items", updatedItems);
                }
              }}
              colorOn="#75cbaf"
              // colorOff=""
              disabled={
                mode === "UPDATE" || mode === "PRELIMINARY" ? true : false
              }
            />
          </div>
        ) : null}
      </div>
      <div className="container">
        <div className="principal-data">
          <InfoCliente
            iCliente={infoCliente}
            changeICliente={setInfoCliente}
            // ------------------------------------- //
            mode={mode}
            changeValue={handleChageValue}
            values={formik.values}
            // ------------------------------------- //
            paso="1"
            descripcion="Información del Cliente"
            error={formik.errors}
            touched={formik.touched}
          />
          <InfoServicios
            iCliente={infoCliente}
            iDelivery={iDelivery}
            iPuntos={iPuntos}
            iServicios={iServicios}
            // ------------------------------------- //
            mode={mode}
            changeValue={handleChageValue}
            values={formik.values}
            // ------------------------------------- //
            paso="2"
            descripcion="¿Qué trajo el cliente?"
            error={formik.errors}
            touched={formik.touched}
          />
        </div>
        <div className="other-info">
          {formik.values.Modalidad === "Delivery" && mode === "PRELIMINARY" ? (
            <InfoRecojo
              mode={mode}
              changeValue={handleChageValue}
              values={formik.values}
              paso="3"
              descripcion="Fecha de Recojo"
            />
          ) : null}

          <InfoEntrega
            mode={mode}
            changeValue={handleChageValue}
            values={formik.values}
            paso={
              formik.values.Modalidad === "Delivery" && mode === "PRELIMINARY"
                ? "4"
                : "3"
            }
            descripcion="¿Para cuando estara Listo?"
          />
          {showFactura ? (
            <InfoFactura
              mode={mode}
              changeValue={handleChageValue}
              values={formik.values}
              paso={
                showFactura &&
                formik.values.Modalidad === "Delivery" &&
                mode === "PRELIMINARY"
                  ? "5"
                  : "4"
              }
              descripcion="Agregar Factura"
            />
          ) : null}

          {mode !== "UPDATE" ? (
            <>
              <InfoDescuento
                iCliente={infoCliente}
                validCupon={validCupon}
                recalculatePromoDescuento={recalculatePromoDescuento}
                // ------------------------------------- //
                changeValue={handleChageValue}
                values={formik.values}
                // ------------------------------------- //
                paso={
                  showFactura
                    ? formik.values.Modalidad === "Delivery" &&
                      mode === "PRELIMINARY"
                      ? "6"
                      : "5"
                    : formik.values.Modalidad === "Delivery" &&
                      mode === "PRELIMINARY"
                    ? "5"
                    : "4"
                }
                descripcion="¿Deseas Agregar Descuento?"
              />

              {mode !== "PRELIMINARY" ? (
                <>
                  <InfoPago
                    currentPago={currentPago}
                    openModalMetodoPago={openModalMetodoPago}
                    // ------------------------------------- //
                    values={formik.values}
                    // ------------------------------------- //
                    paso={
                      showFactura
                        ? formik.values.Modalidad === "Delivery" &&
                          mode === "PRELIMINARY"
                          ? "7"
                          : "6"
                        : formik.values.Modalidad === "Delivery" &&
                          mode === "PRELIMINARY"
                        ? "6"
                        : "5"
                    }
                    descripcion="Agregar Pago"
                  />
                </>
              ) : null}
            </>
          ) : (
            <InfoPagos
              values={formik.values}
              infoPagos={infoPagos}
              iUsuario={iUsuario}
              descripcion="Lista de Pagos"
              codRecibo={infoDefault.codReciboo}
            />
          )}
        </div>
      </div>
      {((formik.values.descuento.modoDescuento === "Promocion" &&
        formik.values.descuento.info) ||
        (formik.values.descuento.modoDescuento === "Puntos" && infoCliente)) &&
      mode !== "UPDATE" ? (
        <div
          className={`side-info-extra ${
            sidePanelVisible ? "show-panel" : "hide-panel"
          }`}
        >
          <div className="content-body">
            {formik.values.descuento.modoDescuento === "Puntos" &&
            infoCliente ? (
              <InfoPuntos iCliente={infoCliente} />
            ) : null}
            {formik.values.descuento.modoDescuento === "Promocion" &&
            formik.values.descuento.info ? (
              <InfoPromociones
                values={formik.values}
                changeValue={handleChageValue}
              />
            ) : null}
          </div>

          <Button onClick={toggleSidePanel} className="btn-toggleside">
            {sidePanelVisible ? (
              <i className="fa-solid fa-angle-left" />
            ) : (
              <i className="fa-solid fa-angle-right" />
            )}
          </Button>
        </div>
      ) : null}
      <Modal
        opened={mPromocion}
        onClose={() => {
          closeModalPromocion();
          setOnPromocion(false);
          formik.setFieldValue("gift_promo", []);
        }}
        size={650}
        scrollAreaComponent={ScrollArea.Autosize}
        title="¿ Deseas entregar uno o mas cupones de Promocion ?"
        centered
      >
        {onPromocion === true ? (
          <Promocion onAddCupon={openModal} />
        ) : (
          <div className="opcion">
            <button
              className="btn-action acp"
              type="button"
              onClick={() => {
                setOnPromocion(true);
              }}
            >
              Si
            </button>
            <button
              className="btn-action neg"
              type="submit"
              onClick={() => openModal([])}
            >
              No
            </button>
          </div>
        )}
      </Modal>
      <Modal
        opened={mMetodoPago}
        onClose={() => {
          closeModalMetodoPago();
        }}
        size="auto"
        scrollAreaComponent={ScrollArea.Autosize}
        // title=""
        centered
      >
        <MetodoPago
          currentPago={currentPago}
          onConfirm={(value) => setCurrentPago(value)}
          onCancel={() => setCurrentPago()}
          onClose={closeModalMetodoPago}
          totalToPay={
            parseFloat(formik.values.totalNeto) -
            (infoPagos.reduce(
              (total, pago) => total + parseFloat(pago.total),
              0
            ) -
              (currentPago ? parseFloat(currentPago.total) : 0))
          }
        />
      </Modal>
    </form>
  );
};

export default OrdenServicio;
