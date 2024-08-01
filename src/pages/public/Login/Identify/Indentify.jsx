/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './identify.scss';
import SwitchModel from '../../../../components/SwitchModel/SwitchModel';
import LoaderSpiner from '../../../../components/LoaderSpinner/LoaderSpiner';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { PublicRoutes } from '../../../../models';
import { TextInput } from '@mantine/core';
import { Notify } from '../../../../utils/notify/Notify';
import { socket } from '../../../../utils/socket/connect';

const Indentify = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    txtInfo: '',
    filtro: 'usuario',
  });
  const [onLoading, setOnLoading] = useState(false);
  const [onResponse, setOnResponse] = useState();
  const [onError, setOnError] = useState(0);
  const [isFlipped, setFlipped] = useState(false);

  const [infoUser, setInfoUser] = useState();

  // const [onWarning, setOnWarning] = useState('');

  const validationSchema = Yup.object().shape({
    _firstPass: Yup.string()
      .matches(/^[A-Za-z0-9]{5,}$/, 'La contraseña debe tener al menos 5 caracteres y contener solo letras y números')
      .required('Campo obligatorio'),
    _secondPass: Yup.string()
      .oneOf([Yup.ref('_firstPass')], 'Las contraseñas no coinciden')
      .required('Campo obligatorio'),
  });
  const formik = useFormik({
    initialValues: {
      _firstPass: '',
      _secondPass: '',
      codigo: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      openModal({
        id: infoUser?._id,
        data: {
          newPassword: values._firstPass,
          codigo: values.codigo,
        },
      });
      setSubmitting(false);
    },
  });

  const handleSendCodigo = async () => {
    setOnResponse('Enviando codigo...');
    setOnLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/send-cod-reset-password`,
        info
      );
      if (response.status === 200) {
        setOnLoading(false);
        setOnResponse('Envio Exitoso');
        setFlipped(true);
        setOnError(0);
        setInfo({
          txtInfo: '',
          filtro: 'usuario',
        });
      }
      setInfoUser(response.data);
    } catch (error) {
      // Puedes manejar los errores aquí
      setOnResponse(error.response.data);
      if (error.response.status === 403) {
        setOnError(1);
      }
      if (error.response.status === 400) {
        setOnError(2);
      }
      throw new Error(`No se pudo buscar el usuario - ${error.response.data}`);
    }
  };

  const openModal = (data) =>
    modals.openConfirmModal({
      title: 'Generar Nueva Contraseña',
      centered: true,
      children: <Text size="sm">¿ Estas seguro de realizar estos cambios ?</Text>,
      labels: { confirm: 'Si', cancel: 'No' },
      confirmProps: { color: 'green' },
      onCancel: () => console.log('Cancelado'),
      onConfirm: () => handleChagePassword(data),
    });

  const handleChagePassword = async (info) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/recover-password/${info.id}`,
        info.data
      );
      if (response.status === 200) {
        socket.emit('client:onChangeUser', response.data._id);
        Notify('Nueva contraseña creada existosamentea', '', 'success');
        navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
      }
    } catch (error) {
      Notify('Error al Cambiar Contraseña', error.response.data.mensaje, 'fail');
      throw new Error(`${error.response.data.mensaje}`);
    }
  };

  const handleBack = () => {
    setFlipped(false);
  };

  return (
    <div className="content-indetify">
      <div className={`cards-process ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-recover">
          <div className="title">
            <h2>Recupera tu cuenta</h2>
          </div>
          <div className="body-info">
            <p>
              Introduce tu nombre de <span>USUARIO</span> o <span>CORREO ELECTRONICO</span> para enviarte un codigo y
              puedas generar otra contraseña.
            </p>
            {onLoading ? (
              <div className="loading">
                {onError > 0 ? (
                  <i
                    style={{ color: onError === 1 ? '#ff9801' : '#ff0101' }}
                    className="fa-solid fa-circle-exclamation"
                  />
                ) : (
                  <LoaderSpiner size={50} />
                )}

                <span style={{ color: onError === 1 ? '#ff9801' : onError === 2 ? '#ff0101' : '#2f2f2f' }}>
                  {onResponse}
                </span>
                {onError !== 0 ? (
                  <button
                    style={{ background: onError === 1 ? '#ff9801' : onError === 2 ? '#ff0101' : '#2f2f2f' }}
                    className="btn-ok"
                    onClick={() => {
                      setOnLoading(false);
                      setOnError(0);
                      setInfo({
                        txtInfo: '',
                        filtro: 'usuario',
                      });
                    }}
                    type="button"
                  >
                    OK
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <div className="mode">
                  <SwitchModel
                    title="Encontrar por :"
                    onSwitch="Correo" // TRUE
                    offSwitch="Usuario" // FALSE
                    name="tipo"
                    defaultValue={info.filtro === 'usuario' ? false : true}
                    onChange={(value) => {
                      if (value === false) {
                        setInfo({
                          ...info,
                          filtro: 'usuario',
                        });
                      } else {
                        setInfo({
                          ...info,
                          filtro: 'email',
                        });
                      }
                    }}
                  />
                </div>
                <input
                  type="text"
                  // name="user"
                  className="form-style"
                  placeholder={
                    info.filtro === 'usuario' ? 'Ingrese su nombre de usuario' : 'Ingrese su correo electronico'
                  }
                  // id="user"
                  autoFocus
                  autoComplete="off"
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      txtInfo: e.target.value,
                    })
                  }
                />
              </>
            )}
          </div>
          {onLoading === false ? (
            <div className="actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
                }}
              >
                Cancelar
              </button>
              <button type="button" className="btn-send" onClick={handleSendCodigo}>
                Enviar
              </button>
            </div>
          ) : null}
        </div>
        <form onSubmit={formik.handleSubmit} className="card-identify hidden-card">
          <div className="title">
            <h2>Envio de Codigo Exitoso</h2>
            <p>
              <span>{infoUser?.email}</span>
              {`,  verifique en su apartado de "SPAM"`}
            </p>
          </div>
          <div className="body-info">
            <TextInput
              name="codigo"
              label="Codigo de Verificacion"
              radius="md"
              value={formik.values.codigo}
              onChange={(e) => formik.setFieldValue('codigo', e.target.value.toUpperCase())}
              required
              placeholder="Ingrese codigo de verificacion"
              autoComplete="off"
            />
            <div className="subTitle">
              <h2>Ingrese nueva contraseña</h2>
              <span>{infoUser?.usuario}</span>
            </div>

            <div className="space-info">
              <TextInput
                name="_firstPass"
                radius="md"
                value={formik.values._firstPass}
                error={formik.errors._firstPass}
                onChange={formik.handleChange}
                placeholder="Ingrese contraseña"
                autoComplete="off"
                required
              />
              <TextInput
                name="_secondPass"
                radius="md"
                value={formik.values._secondPass}
                error={formik.errors._secondPass}
                onChange={formik.handleChange}
                required
                placeholder="Ingrese contraseña nuevamente"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="actions">
            <button type="button" className="btn-return" onDoubleClick={() => setFlipped(false)}>
              Regresar
            </button>
            <button className="btn-saved" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Indentify;
