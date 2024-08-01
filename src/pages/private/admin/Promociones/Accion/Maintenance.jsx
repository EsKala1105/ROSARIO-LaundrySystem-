/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { modals } from "@mantine/modals";
import {
  addPromocion,
  updatePromocion,
} from "../../../../../redux/actions/aPromociones";
import {
  Button,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import SwitchModel from "../../../../../components/SwitchModel/SwitchModel";
import ValidIco from "../../../../../components/ValidIco/ValidIco";
import { nameMoneda } from "../../../../../services/global";

import "./maintenance.scss";

// eslint-disable-next-line react/prop-types
const Maintenance = ({ info, onClose }) => {
  const isEdit = info != null;
  const dispatch = useDispatch();
  const [listPrendas, setListPrendas] = useState([]);
  const [lPrendasInicial, setLPrendasInicial] = useState([]);

  const InfoServicios = useSelector((state) => state.servicios.listServicios);
  const InfoCategorias = useSelector(
    (state) => state.categorias.listCategorias
  );

  const validationSchema = Yup.object().shape({
    tipoPromocion: Yup.string().required("Campo obligatorio"),
    prenda: Yup.array()
      .min(1, "Debe seleccionar al menos una prenda")
      .of(Yup.string().required("Campo obligatorio")),
    cantidadMin: Yup.string().required("Campo obligatorio"),
    tipoDescuento: Yup.string().required("Campo obligatorio"),
    descripcion: Yup.string().required("Campo obligatorio"),
    descuento: Yup.string().required("Campo obligatorio"),
    vigencia: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      tipoPromocion: "Unico",
      prenda: [],
      alcance: "",
      cantidadMin: "",
      tipoDescuento: "Porcentaje",
      descripcion: "",
      descuento: "",
      vigencia: "",
      state: "activo",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let infoAprobada;
      if (values.prenda.includes("Todos")) {
        infoAprobada = {
          ...values,
          alcance: "Todos",
          prenda: [],
        };
      } else {
        infoAprobada = { ...values, alcance: "Parte" };
      }

      isEdit
        ? handleUpdatePromocion(infoAprobada)
        : handleAddPromocion(infoAprobada);
    },
  });

  const handleAddPromocion = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Registro de Promocion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de agregar esta nueva Promocion ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          dispatch(addPromocion(data));
          formik.resetForm();
          onClose();
        }
      },
    });
  };

  const handleUpdatePromocion = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Actualizacion de Promocion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de actulizar esta Promocion ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(updatePromocion({ infoPromo: data, id: info._id }));
          formik.resetForm();
          onClose();
        }
      },
    });
  };

  const filtrarServicios = (servicios, categorias) => {
    const mapeoCategorias = categorias.reduce((acc, categoria) => {
      acc[categoria._id] = categoria;
      return acc;
    }, {});

    // Filtrar los servicios
    let serviciosFiltrados = servicios.filter((servicio) => {
      const categoria = mapeoCategorias[servicio.idCategoria];
      // Excluir solo si el servicio es "Delivery" y su categoría es de nivel "primario"
      return !(categoria?.nivel === "primario");
    });

    // Agregar el servicio "Todos"
    serviciosFiltrados.unshift({
      _id: "Todos",
      nombre: "Todos",
    });

    // Mapear los servicios y devolverlos
    const listServices = serviciosFiltrados.map((service) => {
      return {
        label: service.nombre,
        value: service._id,
      };
    });

    setListPrendas(listServices);
    setLPrendasInicial(listServices);
  };

  useEffect(() => {
    filtrarServicios(InfoServicios, InfoCategorias);
  }, [InfoServicios, InfoCategorias]);

  useEffect(() => {
    if (isEdit) {
      formik.setValues({
        tipoPromocion: info?.tipoPromocion,
        prenda: info?.prenda,
        alcance: info?.alcance,
        cantidadMin: info?.cantidadMin,
        tipoDescuento: info?.tipoDescuento,
        descripcion: info?.descripcion,
        descuento: info?.descuento,
        vigencia: info?.vigencia,
        state: info?.state,
      });
    }
  }, [info]);

  return (
    <form onSubmit={formik.handleSubmit} className="action-promotion">
      <h1>Promociones</h1>
      <div className="switch-option">
        <div className="input-item">
          <SwitchModel
            title="Tipo de Promocion :"
            onSwitch="Unico" // TRUE
            offSwitch="Varios" // FALSE
            disabled={isEdit}
            colorBackground={isEdit ? "#ea995b" : "#5b81ea"}
            name="tipoPromocion"
            defaultValue={
              formik.values.tipoPromocion === "Unico" ? true : false
            }
            onChange={(value) => {
              formik.setFieldValue("tipoDescuento", "Porcentaje");
              formik.setFieldValue("cantidadMin", value ? "" : 0);
              formik.setFieldValue("prenda", []);
              if (value === true) {
                formik.setFieldValue("tipoPromocion", "Unico");
              } else {
                formik.setFieldValue("tipoPromocion", "Varios");
                setListPrendas(lPrendasInicial);
              }
            }}
          />
          {formik.errors.tipoPromocion &&
            formik.touched.tipoPromocion &&
            ValidIco({ mensaje: formik.errors.tipoPromocion })}
        </div>
        {formik.values.tipoPromocion === "Unico" ? (
          <div className="input-item">
            <SwitchModel
              disabled={isEdit}
              title="Tipo de Descuento :"
              onSwitch="Gratis" // TRUE
              offSwitch="Porcentaje" // FALSE
              colorBackground={isEdit ? "#ea995b" : "#5b81ea"}
              name="tipoDescuento"
              defaultValue={
                formik.values.tipoDescuento === "Porcentaje" ? false : true
              }
              onChange={(value) => {
                formik.setFieldValue("descuento", "");

                if (value === true) {
                  formik.setFieldValue("tipoDescuento", "Gratis");
                } else {
                  formik.setFieldValue("tipoDescuento", "Porcentaje");
                  formik.setFieldValue("cantidadMin", "");
                }
                formik.setFieldValue("prenda", []);
              }}
            />
            {formik.errors.tipoDescuento &&
              formik.touched.tipoDescuento &&
              ValidIco({ mensaje: formik.errors.tipoDescuento })}
          </div>
        ) : (
          <div className="input-item">
            <SwitchModel
              disabled={isEdit}
              title="Tipo de Descuento :"
              onSwitch="Monto" // TRUE
              offSwitch="Porcentaje" // FALSE
              name="tipoDescuento"
              colorBackground={isEdit ? "#ea995b" : "#5b81ea"}
              defaultValue={
                formik.values.tipoDescuento === "Monto" ? true : false
              }
              onChange={(value) => {
                formik.setFieldValue("descuento", "");
                formik.setFieldValue("cantidadMin", "");
                formik.setFieldValue("prenda", []);
                if (value === true) {
                  formik.setFieldValue("tipoDescuento", "Monto");
                } else {
                  formik.setFieldValue("tipoDescuento", "Porcentaje");
                  if (formik.values.tipoPromocion === "Varios") {
                    formik.setFieldValue("cantidadMin", 0);
                  }
                  // if (formik.values.prenda.includes('Todos')) {

                  // } else {
                  //   setListPrendas(lPrendasInicial);
                  // }
                  // formik.setFieldValue('prenda', ['Todos']);

                  // formik.setFieldValue('cantidadMin', '');
                }
              }}
            />
            {formik.errors.tipoDescuento &&
              formik.touched.tipoDescuento &&
              ValidIco({ mensaje: formik.errors.tipoDescuento })}
          </div>
        )}
      </div>
      <div className="body-ct">
        <div className="lateral">
          {formik.values.tipoPromocion === "Unico" ? (
            <>
              <div className="input-item">
                {formik.values.tipoDescuento === "Gratis" ? (
                  <NumberInput
                    name="descuento"
                    label="Numero Prendas Gratuitas"
                    value={formik.values.descuento}
                    disabled={isEdit}
                    precision={2}
                    min={0}
                    step={1}
                    hideControls
                    autoComplete="off"
                    onChange={(e) => {
                      formik.setFieldValue("descuento", e);
                    }}
                  />
                ) : (
                  <NumberInput
                    name="descuento"
                    label="Porcentaje de Descuento :"
                    disabled={isEdit}
                    value={formik.values.descuento}
                    placeholder="Ingrese Porcentaje de Descuento"
                    precision={2}
                    max={100}
                    min={0}
                    step={10}
                    hideControls
                    autoComplete="off"
                    onChange={(e) => {
                      formik.setFieldValue("descuento", e);
                    }}
                  />
                )}
                {formik.errors.descuento &&
                  formik.touched.descuento &&
                  ValidIco({ mensaje: formik.errors.descuento })}
              </div>
              <div className="input-item">
                <Select
                  name="prenda"
                  label="Prenda"
                  disabled={isEdit}
                  value={
                    formik.values.prenda.length > 0
                      ? formik.values.prenda[0]
                      : ""
                  }
                  onChange={(e) => {
                    formik.setFieldValue("prenda", [e]);
                  }}
                  placeholder="Escoge una prenda"
                  clearable
                  searchable
                  // formik.setFieldValue('tipoDescuento', 'Gratis');
                  data={listPrendas.filter(
                    (service) => service.value !== "Todos"
                  )}
                />
                {formik.errors.prenda &&
                  formik.touched.prenda &&
                  ValidIco({ mensaje: formik.errors.prenda })}
              </div>
              <div className="input-item">
                <NumberInput
                  name="cantidadMin"
                  label="Cantidad Minima :"
                  disabled={isEdit}
                  value={formik.values.cantidadMin}
                  placeholder="Cantidad Minima para efectuar promocion"
                  precision={0}
                  min={0}
                  step={1}
                  hideControls
                  autoComplete="off"
                  onChange={(e) => {
                    formik.setFieldValue("cantidadMin", e);
                  }}
                />
                {formik.errors.cantidadMin &&
                  formik.touched.cantidadMin &&
                  ValidIco({ mensaje: formik.errors.cantidadMin })}
              </div>
            </>
          ) : (
            <>
              <div className="input-item">
                {formik.values.tipoDescuento === "Monto" ? (
                  <NumberInput
                    name="descuento"
                    label={`Monto de Descuento : (${nameMoneda})`}
                    placeholder={`Monto en ${nameMoneda}`}
                    value={formik.values.descuento}
                    disabled={isEdit}
                    precision={2}
                    min={1}
                    step={1}
                    hideControls
                    autoComplete="off"
                    onChange={(e) => {
                      formik.setFieldValue("descuento", e);
                    }}
                  />
                ) : (
                  <NumberInput
                    name="descuento"
                    label="Porcentaje de Descuento :"
                    value={formik.values.descuento}
                    placeholder="Ingrese Porcentaje de Descuento"
                    precision={2}
                    disabled={isEdit}
                    max={100}
                    min={0}
                    step={10}
                    hideControls
                    autoComplete="off"
                    onChange={(e) => {
                      formik.setFieldValue("descuento", e);
                    }}
                  />
                )}
                {formik.errors.descuento &&
                  formik.touched.descuento &&
                  ValidIco({ mensaje: formik.errors.descuento })}
              </div>
              <div className="input-item">
                <MultiSelect
                  name="prenda"
                  label="Prenda"
                  value={formik.values.prenda}
                  disabled={isEdit}
                  onChange={(e) => {
                    if (e.includes("Todos")) {
                      formik.setFieldValue("prenda", ["Todos"]);
                    } else {
                      formik.setFieldValue("prenda", e);
                    }
                  }}
                  placeholder="Escoge una prenda"
                  clearable
                  searchable
                  data={listPrendas.filter((service) =>
                    formik.values.tipoDescuento === "Monto"
                      ? service.value === "Todos"
                      : lPrendasInicial
                  )}
                />
                {formik.errors.prenda &&
                  formik.touched.prenda &&
                  ValidIco({ mensaje: formik.errors.prenda })}
              </div>

              <div className="input-item">
                <NumberInput
                  name="cantidadMin"
                  label={`Cantidad Minima : (${
                    formik.values.tipoDescuento === "Monto"
                      ? nameMoneda
                      : "Prenda"
                  })`}
                  value={formik.values.cantidadMin}
                  placeholder="Cantidad Minima para efectuar promocion"
                  precision={0}
                  disabled={
                    isEdit || formik.values.tipoDescuento === "Porcentaje"
                  }
                  min={
                    formik.values.descuento !== 0
                      ? formik.values.descuento
                      : null
                  }
                  step={1}
                  hideControls
                  autoComplete="off"
                  onChange={(e) => {
                    formik.setFieldValue("cantidadMin", e);
                  }}
                />
                {formik.errors.cantidadMin &&
                  formik.touched.cantidadMin &&
                  ValidIco({ mensaje: formik.errors.cantidadMin })}
              </div>
            </>
          )}
        </div>
        <div className="lateral">
          <div className="input-item">
            <Textarea
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              disabled={isEdit}
              placeholder="Promocion 2 x 1 en ..."
              label="Ingrese Descripcion"
            />
            {formik.errors.descripcion &&
              formik.touched.descripcion &&
              ValidIco({ mensaje: formik.errors.descripcion })}
          </div>
          <div className="input-item">
            <NumberInput
              name="vigencia"
              label="Vigencia: (Dias)"
              value={formik.values.vigencia}
              placeholder="N° Dias para q caduque promocion"
              disabled={isEdit}
              precision={0}
              min={1}
              step={1}
              hideControls
              autoComplete="off"
              onChange={(e) => {
                formik.setFieldValue("vigencia", e);
              }}
            />
            {formik.errors.vigencia &&
              formik.touched.vigencia &&
              ValidIco({ mensaje: formik.errors.vigencia })}
          </div>
          <div
            className="input-item"
            style={{
              border: "1px solid #0081ff",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <label htmlFor="">Estado :</label>
            <Switch
              name="state"
              size="xl"
              color={isEdit ? "orange" : "blue"}
              onLabel="Activado"
              offLabel="Inactivo"
              checked={formik.values.state === "activo"}
              onChange={(e) => {
                formik.setFieldValue(
                  "state",
                  e.target.checked ? "activo" : "inactivo"
                );
              }}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="btn-save"
        color={isEdit ? "orange" : "blue"}
      >
        {isEdit ? "Actualizar" : "Agregar"} Promocion
      </Button>
    </form>
  );
};

export default Maintenance;
