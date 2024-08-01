/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import './add.scss';
import { Button, NumberInput, Select, Switch, TextInput, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { getInfoCategoria, getListCategorias } from '../../utilsPortafolio';
import { useDispatch, useSelector } from 'react-redux';
import { addProducto } from '../../../../../../../redux/actions/aProductos';
import ValidIco from '../../../../../../../components/ValidIco/ValidIco';
import { Notify } from '../../../../../../../utils/notify/Notify';

const Add = ({ onClose }) => {
  const dispatch = useDispatch();
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo obligatorio'),
    categoria: Yup.object()
      .shape({
        id: Yup.string().required('El ID de la categoría es obligatorio'),
      })
      .required('Campo obligatorio'),
    precioVenta: Yup.string().required('Campo obligatorio'),
    simboloMedida: Yup.string().required('Campo obligatorio'),
    stockPrincipal: Yup.string().required('Campo obligatorio'),
    precioTransaccion: Yup.string().required('Campo obligatorio'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      categoria: {},
      precioVenta: '',
      simboloMedida: '',
      stockPrincipal: '',
      precioTransaccion: '',
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleNewProducto(values);
    },
  });

  const handleNewProducto = (info) => {
    modals.openConfirmModal({
      title: 'Registro de nuevo Producto',
      centered: true,
      children: <Text size="sm">¿ Estas seguro de Agregar este Producto ?</Text>,
      labels: { confirm: 'Si', cancel: 'No' },
      confirmProps: { color: 'green' },

      onConfirm: () => {
        const { categoria, ...rest } = info;
        dispatch(addProducto({ ...rest, idCategoria: categoria.id }));
        formik.resetForm();
        onClose();
        Notify('Registro Agregado Correctamente', '', 'success');
      },
    });
  };

  return (
    <div className="action-add-p">
      <h1>Agregando Nuevo Producto</h1>
      <form onSubmit={formik.handleSubmit} className="info-p">
        <div className="body-p">
          <div className="col-p">
            <div className="inp-p">
              <TextInput
                name="nombre"
                label="Nombre :"
                size="xs"
                value={formik.values.nombre}
                onChange={(e) => {
                  formik.setFieldValue('nombre', e.target.value);
                }}
                autoComplete="off"
              />
              {formik.errors.nombre && formik.touched.nombre && ValidIco({ mensaje: formik.errors.nombre })}
            </div>
            <div className="inp-p">
              <TextInput
                name="simboloMedida"
                size="xs"
                label="Simbolo de Medida :"
                value={formik.values.simboloMedida}
                onChange={(e) => {
                  formik.setFieldValue('simboloMedida', e.target.value);
                }}
                placeholder="Ejemplo: u , kg , lt , pr , m"
                autoComplete="off"
              />
              {formik.errors.simboloMedida &&
                formik.touched.simboloMedida &&
                ValidIco({ mensaje: formik.errors.simboloMedida })}
            </div>
            <div className="inp-p">
              <NumberInput
                name="precioVenta"
                size="xs"
                label="Precio Venta :"
                value={formik.values.precioVenta}
                onChange={(e) => {
                  formik.setFieldValue('precioVenta', e);
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
            <div className="inp-p">
              <NumberInput
                name="stockPrincipal"
                size="xs"
                label="Stock :"
                value={formik.values.stock}
                onChange={(e) => {
                  formik.setFieldValue('stockPrincipal', e);
                }}
                placeholder="Cantidad de Stock"
                precision={2}
                min={0}
                step={1}
                hideControls
                autoComplete="off"
              />
              {formik.errors.stockPrincipal &&
                formik.touched.stockPrincipal &&
                ValidIco({ mensaje: formik.errors.stockPrincipal })}
            </div>
          </div>
          <div className="col-p">
            <div className="inp-p">
              <NumberInput
                name="precioTransaccion"
                size="xs"
                // label={`Monto de Transacción (Gasto) ${
                //   formik.values.stock !== ''
                //     ? `por ${formik.values.stock}  ${formik.values.stock > 1 ? 'unidades' : 'unidad'}`
                //     : ''
                // }`}
                label="Gasto por Stock"
                value={formik.values.precioTransaccion}
                onChange={(e) => {
                  formik.setFieldValue('precioTransaccion', e);
                }}
                placeholder="Gasto por stock"
                precision={2}
                min={0}
                step={1}
                hideControls
                autoComplete="off"
              />
              {formik.errors.precioTransaccion &&
                formik.touched.precioTransaccion &&
                ValidIco({ mensaje: formik.errors.precioTransaccion })}
            </div>
            <div className="inp-p">
              <Select
                name="categoria"
                size="sm"
                label="Categoria"
                value={formik.values.categoria?.id}
                onChange={(e) => {
                  formik.setFieldValue('categoria', getInfoCategoria(iCategorias, e));
                }}
                placeholder="Escoge categoría"
                clearable
                searchable
                data={getListCategorias(iCategorias, 'Producto')}
                maxDropdownHeight={150}
                max={200}
              />
              {formik.errors.categoria && formik.touched.categoria && ValidIco({ mensaje: formik.errors.categoria })}
            </div>
            <div className="i-state">
              <label htmlFor="">Estado :</label>
              <Switch
                name="estado"
                size="xl"
                onLabel="Activado"
                offLabel="Desactivado"
                checked={formik.values.estado}
                onChange={(e) => {
                  formik.setFieldValue('estado', e.target.checked);
                }}
              />
            </div>
          </div>
        </div>
        <Button className="b-add" type="submit" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
          Agregar Producto
        </Button>
      </form>
    </div>
  );
};

export default Add;
