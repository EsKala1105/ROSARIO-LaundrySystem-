/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './edit.scss';
import { simboloMoneda } from '../../../../../../../services/global';
import {
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  Switch,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { ReactComponent as Close } from '../../../../../../../utils/img/Acciones/Cruzar.svg';
import * as Yup from 'yup';
import { Overlay, AspectRatio, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useFormik } from 'formik';
import { getInfoCategoria, getListCategorias } from '../../utilsPortafolio';
import { useDispatch, useSelector } from 'react-redux';
import { updateInventario, updateProducto } from '../../../../../../../redux/actions/aProductos';
import ValidIco from '../../../../../../../components/ValidIco/ValidIco';
import { Notify } from '../../../../../../../utils/notify/Notify';

const Edit = ({ InfoProducto, onClose }) => {
  const [updateStock, setUpdateStock] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const validationSchemaProducto = Yup.object().shape({
    nombre: Yup.string().required('Campo obligatorio'),
    categoria: Yup.object()
      .shape({
        id: Yup.string().required('El ID de la categoría es obligatorio'),
      })
      .required('Campo obligatorio'),
    precioVenta: Yup.string().required('Campo obligatorio'),
    simboloMedida: Yup.string().required('Campo obligatorio'),
  });

  const validationSchemaInventario = Yup.object().shape({
    precioTransaccion: Yup.string().required('Campo obligatorio'),
    stock: Yup.string().required('Campo obligatorio'),
    motivo: Yup.string().required('Campo obligatorio'),
  });

  const formProduct = useFormik({
    initialValues: {
      nombre: InfoProducto.nombre,
      categoria: InfoProducto.categoria,
      precioVenta: InfoProducto.precioVenta,
      simboloMedida: InfoProducto.simboloMedida,
      estado: InfoProducto.estado,
      inventario: InfoProducto.inventario,
    },
    validationSchema: validationSchemaProducto,
    onSubmit: (values) => {
      const { categoria, inventario, ...rest } = values;
      handleUpdateProducto(InfoProducto._id, { ...rest, idCategoria: categoria.id });
      setUpdateStock(false);
      setVisible(false);
    },
  });

  const formInventario = useFormik({
    initialValues: {
      precioTransaccion: '',
      tipo: 'abastecimiento',
      stock: '',
      motivo: '',
    },
    validationSchema: validationSchemaInventario,
    onSubmit: (values) => {
      handleUpdateStock(InfoProducto._id, values);
    },
  });

  const handleUpdateProducto = (id, info) => {
    modals.openConfirmModal({
      title: 'Actualizacion de Producto',
      centered: true,
      children: <Text size="sm">¿ Estas seguro de Actualizar este Producto ?</Text>,
      labels: { confirm: 'Si', cancel: 'No' },
      confirmProps: { color: 'green' },

      onConfirm: () => {
        dispatch(updateProducto({ idProducto: id, productoData: info }));
        formProduct.resetForm();
        onClose();
        Notify('Actualizacion de Producto Exitoso', '', 'success');
      },
    });
  };

  const handleUpdateStock = (id, info) => {
    modals.openConfirmModal({
      title: 'Actualizacion de Inventario',
      centered: true,
      children: <Text size="sm">¿ Estas seguro de Actualizar el INVENTARIO de este PRODUCTO ?</Text>,
      labels: { confirm: 'Si', cancel: 'No' },
      confirmProps: { color: 'green' },

      onConfirm: () => {
        dispatch(updateInventario({ idProducto: id, inventarioData: info }));
        formInventario.resetForm();
        onClose();
        Notify('Actualizacion de Invetario Exitos', '', 'success');
      },
    });
  };

  return (
    <div className="action-edit-p">
      <h1>
        Actualizacion de Producto : <span className="name-pr">{InfoProducto.nombre}</span>
      </h1>
      <div className="be-p">
        <form onSubmit={formInventario.handleSubmit} className="list-bar-stock">
          {!updateStock ? (
            <div className="ca-stock">
              <h2>Lista de Cambios</h2>
              <span className="current-stock">Stock Actual : {InfoProducto.stock}</span>
              <div className="table-wrapper">
                <table className="sticky-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Precio Transaccion</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formProduct.values.inventario
                      .slice() // Hacer una copia del array antes de modificarlo
                      .sort((a, b) => b.index - a.index)
                      .map((inv, index) => (
                        <tr key={index}>
                          <td>{inv.date.fecha}</td>
                          <td className={inv.tipo === 'abastecimiento' ? 'plus' : 'minus'}>
                            <Tooltip
                              label={inv.tipo}
                              style={{ textTransform: 'capitalize', fontWeight: '600' }}
                              className="tooltip"
                              color={inv.tipo === 'abastecimiento' ? '#49e1a2' : '#e14949'}
                              position="right-end"
                              zIndex={9999}
                              withArrow
                              arrowPosition="center"
                              offset={10}
                              transitionProps={{ transition: 'skew-up', duration: 300 }}
                            >
                              <div>
                                {inv.tipo === 'abastecimiento' ? (
                                  <i className="fa-solid fa-circle-plus" />
                                ) : (
                                  <i className="fa-solid fa-circle-minus" />
                                )}
                              </div>
                            </Tooltip>
                          </td>
                          <td>
                            {simboloMoneda} {inv.precioTransaccion}
                          </td>
                          <td>{inv.stock}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="actions-stock">
                <Button
                  type="button"
                  onClick={() => {
                    setUpdateStock(true);
                    setVisible(true);
                  }}
                >
                  Ajustar Stock
                </Button>
              </div>
            </div>
          ) : (
            <div className="change-stock">
              <div className="head-i">
                <h1>Ajustando Stock</h1>
                <button className="b-cancelar" type="button">
                  <Close
                    className="ico-cancel"
                    onClick={() => {
                      setUpdateStock(false);
                      setVisible(false);
                    }}
                  />
                </button>
              </div>
              <span className="current-stock">Stock Actual : {formProduct.values.stock}</span>
              <Radio.Group
                size="xs"
                name="tipo"
                value={formInventario.values.tipo}
                onChange={(e) => {
                  console.log(e);
                  formInventario.setFieldValue('tipo', e);
                  formInventario.setFieldValue('stock', '');
                  formInventario.setFieldValue('motivo', e === 'abastecimiento' ? 'Abastecimiento' : '');
                }}
                label="Tipo :"
              >
                <Group mt="xs">
                  <Radio value="abastecimiento" color="teal" label="Aumento" />
                  <Radio value="desabastecimiento" color="red" label="Disminucion" />
                </Group>
              </Radio.Group>
              <div className="inp-p">
                <NumberInput
                  name="stock"
                  size="xs"
                  label="Cantidad de stock : "
                  value={formInventario.values.stock}
                  onChange={(e) => {
                    formInventario.setFieldValue('stock', e);
                  }}
                  placeholder="Ingrese monto de nuevo stock"
                  precision={0}
                  min={0}
                  max={formInventario.values.tipo === 'desabastecimiento' ? InfoProducto.stockPrincipal : 99999999999}
                  step={1}
                  hideControls
                  autoComplete="off"
                />
                {formInventario.errors.stock &&
                  formInventario.touched.stock &&
                  ValidIco({ mensaje: formInventario.errors.stock })}
              </div>
              <h2 className="new-stock">
                Nuevo stock es : {InfoProducto.stockPrincipal || 0}{' '}
                {formInventario.values.tipo === 'desabastecimiento' ? (
                  <>
                    - {formInventario.values.stock || 0} ={' '}
                    <span>{InfoProducto.stockPrincipal - formInventario.values.stock}</span>
                  </>
                ) : (
                  <>
                    + {formInventario.values.stock || 0} ={' '}
                    <span>{InfoProducto.stockPrincipal + formInventario.values.stock}</span>
                  </>
                )}
              </h2>
              <div className="inp-p">
                <NumberInput
                  name="precioTransaccion"
                  size="xs"
                  label={`${formInventario.values.tipo === 'desabastecimiento' ? 'Rembolso' : 'Gasto'} ${
                    formInventario.values.stock !== ''
                      ? `por ${formInventario.values.stock}  ${
                          formInventario.values.stock > 1 ? 'unidades' : 'unidad'
                        } de stock:`
                      : 'por stock'
                  } 
                `}
                  value={formInventario.values.precioTransaccion}
                  onChange={(e) => {
                    formInventario.setFieldValue('precioTransaccion', e);
                  }}
                  placeholder="Monto Total"
                  precision={0}
                  min={0}
                  step={1}
                  hideControls
                  autoComplete="off"
                />
                {formInventario.errors.precioTransaccion &&
                  formInventario.touched.precioTransaccion &&
                  ValidIco({ mensaje: formInventario.errors.precioTransaccion })}
              </div>
              <div className="inp-p">
                {formInventario.values.tipo === 'desabastecimiento' ? (
                  <Textarea
                    size="xs"
                    name="motivo"
                    placeholder="Ingrese Motivo"
                    onChange={(e) => {
                      formInventario.setFieldValue('motivo', e.target.value);
                    }}
                    label="Motivo :"
                  />
                ) : null}
                {formInventario.errors.motivo &&
                  formInventario.touched.motivo &&
                  ValidIco({ mensaje: formInventario.errors.motivo })}
              </div>

              <Button
                className="b-update-stock"
                color={`${formInventario.values.tipo === 'abastecimiento' ? 'teal' : 'red'}`}
                type="submit"
              >
                {`${formInventario.values.tipo === 'abastecimiento' ? 'Aumentar' : 'Reducir'} Stock`}
              </Button>
            </div>
          )}
        </form>
        <form onSubmit={formProduct.handleSubmit} className="action-i-product">
          <AspectRatio ratio={16 / 9} maw={400} mx="auto" style={{ height: '100%' }}>
            <div className="info-p">
              <h2>Informacion de Producto</h2>
              <div className="i-state">
                <label htmlFor="">Estado :</label>
                <Switch
                  name="estado"
                  size="xl"
                  onLabel="Activado"
                  offLabel="Desactivado"
                  checked={formProduct.values.estado}
                  onChange={(e) => {
                    formProduct.setFieldValue('estado', e.target.checked);
                  }}
                />
              </div>
              <div className="inp-p">
                <TextInput
                  name="nombre"
                  label="Nombre :"
                  size="xs"
                  value={formProduct.values.nombre}
                  onChange={(e) => {
                    formProduct.setFieldValue('nombre', e.target.value);
                  }}
                  autoComplete="off"
                />
                {formProduct.errors.nombre &&
                  formProduct.touched.nombre &&
                  ValidIco({ mensaje: formProduct.errors.nombre })}
              </div>
              <div className="inp-p">
                <TextInput
                  name="simboloMedida"
                  size="xs"
                  label="Simbolo de Medida :"
                  value={formProduct.values.simboloMedida}
                  onChange={(e) => {
                    formProduct.setFieldValue('simboloMedida', e.target.value);
                  }}
                  placeholder="Ejemplo: u , kg , lt , pr , m"
                  autoComplete="off"
                />
                {formProduct.errors.simboloMedida &&
                  formProduct.touched.simboloMedida &&
                  ValidIco({ mensaje: formProduct.errors.simboloMedida })}
              </div>
              <div className="inp-p">
                <Select
                  name="categoria"
                  size="sm"
                  label="Categoria"
                  value={formProduct.values.categoria?.id}
                  onChange={(e) => {
                    formProduct.setFieldValue('categoria', getInfoCategoria(iCategorias, e));
                  }}
                  placeholder="Escoge categoría"
                  clearable
                  searchable
                  data={getListCategorias(iCategorias, 'Producto')}
                  maxDropdownHeight={150}
                  max={200}
                />
                {formProduct.errors.categoria &&
                  formProduct.touched.categoria &&
                  ValidIco({ mensaje: formProduct.errors.categoria })}
              </div>
              <div className="inp-p">
                <NumberInput
                  name="precioVenta"
                  size="xs"
                  label="Precio Venta :"
                  value={formProduct.values.precioVenta}
                  onChange={(e) => {
                    formProduct.setFieldValue('precioVenta', e);
                  }}
                  placeholder="Monto Total"
                  precision={2}
                  min={0}
                  step={1}
                  hideControls
                  autoComplete="off"
                />
                {formProduct.errors.precioVenta &&
                  formProduct.touched.precioVenta &&
                  ValidIco({ mensaje: formProduct.errors.precioVenta })}
              </div>
              <Button type="submit" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                Actualizar Producto
              </Button>
            </div>
            {visible && <Overlay style={{ borderRadius: '10px', height: '100%' }} color="#000" />}
          </AspectRatio>
        </form>
      </div>
    </div>
  );
};

export default Edit;
