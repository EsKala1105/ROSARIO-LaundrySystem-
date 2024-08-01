/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./maintenance.scss";
import {
  Button,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getInfoCategoria, getListCategorias } from "../../utilsPortafolio";
import {
  addServicio,
  updateServicio,
} from "../../../../../../../redux/actions/aServicios";
import { useDispatch, useSelector } from "react-redux";
import ValidIco from "../../../../../../../components/ValidIco/ValidIco";
import { Notify } from "../../../../../../../utils/notify/Notify";
import { formatThousandsSeparator } from "../../../../../../../utils/functions";

const Maintenance = ({ info, onClose }) => {
  const isEdit = info != null;
  const dispatch = useDispatch();
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Campo obligatorio"),
    categoria: Yup.object()
      .shape({
        id: Yup.string().required("El ID de la categoría es obligatorio"),
      })
      .required("Campo obligatorio"),
    precioVenta: Yup.string().required("Campo obligatorio"),
    simboloMedida: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      categoria: "",
      precioVenta: "",
      simboloMedida: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { categoria, ...rest } = values;

      if (isEdit) {
        handleUpdateServicio({ ...rest, idCategoria: categoria.id });
      } else {
        handleNewServicio({ ...rest, idCategoria: categoria.id });
      }
    },
  });

  const handleNewServicio = (data) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Registro de nuevo Servicio",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Agregar este Servicio ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(addServicio(data));
          Notify("Registro Agregado Correctamente", "", "success");
          formik.resetForm();
          onClose();
        }
      },
    });
  };

  const handleUpdateServicio = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Actualizacion de Servicio",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Actualizar el Servicio ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(
            updateServicio({ idServicio: info._id, servicioActualizado: data })
          );
          formik.resetForm();
          onClose();
        }
      },
    });
  };

  useEffect(() => {
    if (isEdit) {
      formik.setValues({
        nombre: info.nombre,
        categoria: info.categoria,
        precioVenta: info.precioVenta,
        simboloMedida: info.simboloMedida,
        estado: info.estado,
      });
    }
  }, [info]);

  return (
    <div className="action-service">
      <h1>{isEdit ? "Actualizando" : "Agregando Nuevo"} Servicio</h1>
      <form onSubmit={formik.handleSubmit} className="info-s">
        <div className="body-s">
          <div className="col-s">
            <div className="inp-s">
              <TextInput
                name="nombre"
                label="Nombre :"
                size="xs"
                value={formik.values.nombre}
                disabled={info?.categoria?.nivel === "primario"}
                onChange={(e) => {
                  formik.setFieldValue("nombre", e.target.value);
                }}
                autoComplete="off"
              />
              {formik.errors.nombre &&
                formik.touched.nombre &&
                ValidIco({ mensaje: formik.errors.nombre })}
            </div>
            <div className="inp-s">
              <NumberInput
                name="precioVenta"
                size="xs"
                label="Precio :"
                value={formik.values.precioVenta}
                formatter={(value) => formatThousandsSeparator(value)}
                onChange={(e) => {
                  formik.setFieldValue("precioVenta", e);
                }}
                placeholder="Monto por unidad"
                precision={2}
                min={0}
                step={1}
                hideControls
                autoComplete="off"
              />
              {formik.errors.precioVenta &&
                formik.touched.precioVenta &&
                ValidIco({ mensaje: formik.errors.precioVenta })}
            </div>
            <div className="inp-s">
              <TextInput
                name="simboloMedida"
                size="xs"
                label="Simbolo de Medida :"
                value={formik.values.simboloMedida}
                disabled={info?.categoria?.nivel === "primario"}
                onChange={(e) => {
                  formik.setFieldValue("simboloMedida", e.target.value);
                }}
                placeholder="Ejemplo: u , kg , lt , pr , m"
                autoComplete="off"
              />
              {formik.errors.simboloMedida &&
                formik.touched.simboloMedida &&
                ValidIco({ mensaje: formik.errors.simboloMedida })}
            </div>
          </div>
          <div className="col-s">
            <div className="inp-s">
              <Select
                name="categoria"
                size="sm"
                label="Categoria"
                value={formik.values.categoria?.id}
                disabled={info?.categoria?.nivel === "primario"}
                onChange={(e) => {
                  formik.setFieldValue("categoria", e);
                  formik.setFieldValue(
                    "categoria",
                    getInfoCategoria(iCategorias, e)
                  );
                }}
                placeholder="Escoge categoría"
                clearable
                searchable
                data={getListCategorias(iCategorias, "Servicio")}
                maxDropdownHeight={150}
                max={200}
              />
              {formik.errors.categoria &&
                formik.touched.categoria &&
                ValidIco({ mensaje: formik.errors.categoria })}
            </div>
            <div className="i-state">
              <label htmlFor="">Estado :</label>
              <Switch
                name="estado"
                size="xl"
                onLabel="Activado"
                disabled={info?.categoria?.nivel === "primario"}
                offLabel="Desactivado"
                checked={formik.values.estado}
                onChange={(e) => {
                  formik.setFieldValue("estado", e.target.checked);
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="b-add"
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          {isEdit ? "Actualizar" : "Agregar"} Servicio
        </Button>
      </form>
    </div>
  );
};

export default Maintenance;
