/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import "./negocio.scss";
import { modals } from "@mantine/modals";
import { Button, MultiSelect, Switch, Text } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { PrivateRoutes, Roles } from "../../../../../models";
import { useNavigate } from "react-router-dom";
import { UpdateInfoNegocio } from "../../../../../redux/actions/aNegocio";
import SwtichDimension from "../../../../../components/SwitchDimension/SwitchDimension";
const Negocio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const InfoNegocio = useSelector((state) => state.negocio.infoNegocio);

  const InfoServicios = useSelector((state) => state.servicios.listServicios);
  const InfoCategorias = useSelector(
    (state) => state.categorias.listCategorias
  );

  const formik = useFormik({
    initialValues: {
      name: InfoNegocio.name,
      direccion: InfoNegocio.direccion,
      contacto: InfoNegocio.contacto,
      itemsAtajos: InfoNegocio.itemsAtajos,
      rolQAnulan: InfoNegocio.rolQAnulan,
      funcionamiento: InfoNegocio.funcionamiento,
      horario: InfoNegocio.horario,
      oldOrder: InfoNegocio.oldOrder,
      hasMobility: InfoNegocio.hasMobility,
      filterListDefault: InfoNegocio.filterListDefault,
    },
    //validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      openModal(values);
      setSubmitting(false);
    },
  });

  const openModal = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Acttualizar Informacion de Negocio",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Desea de realizar cambios en el informacion del negocio ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleUpdateNegocio(data);
        }
      },
    });
  };

  const handleUpdateNegocio = (data) => {
    dispatch(UpdateInfoNegocio(data));
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`);
  };

  const getListServices = (servicios) => {
    // Crear un mapa para acceder fácilmente al nivel de categoría por _id
    const nivelCategoriaPorId = InfoCategorias.reduce((acc, categoria) => {
      acc[categoria._id] = categoria.nivel;
      return acc;
    }, {});

    // Filtrar servicios para excluir aquellos cuya categoría asociada es de nivel "secundario"
    const serviciosFiltrados = servicios.filter((servicio) => {
      const nivelCategoria = nivelCategoriaPorId[servicio.idCategoria];
      return nivelCategoria !== "primario";
    });

    // Mapear los servicios filtrados a la estructura deseada
    return serviciosFiltrados.map((servicio) => ({
      label: servicio.nombre,
      value: servicio._id,
    }));
  };

  const handleAddItem = (tipo) => {
    const maxNumeros = 2;
    const listToUpdate =
      tipo === "contacto" ? formik.values.contacto : formik.values.horario;
    const currentIndex = listToUpdate.length;

    if (currentIndex < maxNumeros) {
      const newItem =
        tipo === "contacto"
          ? { index: currentIndex, numero: "" }
          : { index: currentIndex, horario: "" };
      formik.setFieldValue(tipo, [...listToUpdate, newItem]);
    }
  };

  const handleDeleteItem = (tipo, indexToDelete) => {
    const listToUpdate =
      tipo === "contacto" ? formik.values.contacto : formik.values.horario;

    const updatedList = listToUpdate.filter(
      (_, index) => index !== indexToDelete
    );

    formik.setFieldValue(tipo, updatedList);
  };

  useEffect(() => {
    formik.setFieldValue("name", InfoNegocio.name);
    formik.setFieldValue("direccion", InfoNegocio.direccion);
    formik.setFieldValue("contacto", InfoNegocio.contacto);
    formik.setFieldValue("itemsAtajos", InfoNegocio.itemsAtajos);
    formik.setFieldValue("rolQAnulan", InfoNegocio.rolQAnulan);
    formik.setFieldValue("funcionamiento", InfoNegocio.funcionamiento);
    formik.setFieldValue("horario", InfoNegocio.horario);
    formik.setFieldValue("oldOrder", InfoNegocio.oldOrder);
    formik.setFieldValue("hasMobility", InfoNegocio.hasMobility);
    formik.setFieldValue("filterListDefault", InfoNegocio.filterListDefault);
  }, [InfoNegocio]);

  useEffect(() => {
    if (!formik.values.rolQAnulan.includes(Roles.ADMIN)) {
      // Si no está presente, agregarlo al array
      formik.setFieldValue("rolQAnulan", [
        ...formik.values.rolQAnulan,
        Roles.ADMIN,
      ]);
    }
  }, [formik.values.rolQAnulan]);

  return (
    <div className="content-negocio">
      {Object.keys(InfoNegocio).length > 0 ? (
        <form onSubmit={formik.handleSubmit} className="form-info">
          <div className="body-negocio">
            <div className="i-negocio">
              <h1>Informacion del Negocio</h1>
              <div className="data">
                <div className="columns-paralelo">
                  <div className="input-item">
                    <TextInput
                      name="name"
                      label="Nombre :"
                      defaultValue={formik.values.name}
                      placeholder="Ingrese Nombre del Negocio"
                      autoComplete="off"
                      required
                      onChange={(e) => {
                        formik.setFieldValue("name", e.target.value);
                      }}
                    />
                  </div>
                  <div className="input-item">
                    <TextInput
                      name="direccion"
                      label="Direccion :"
                      defaultValue={formik.values.direccion}
                      placeholder="Ingrese Direccion"
                      required
                      autoComplete="off"
                      onChange={(e) => {
                        formik.setFieldValue("direccion", e.target.value);
                      }}
                    />
                  </div>
                  <div className="input-item-switch">
                    <SwtichDimension
                      title="Registros Antiguos :"
                      onSwitch="Activado"
                      offSwitch="Desactivado"
                      name="oldOrder"
                      defaultValue={formik.values.oldOrder}
                      handleChange={(value) => {
                        formik.setFieldValue(
                          "oldOrder",
                          value === "Activado" ? true : false
                        );
                      }}
                      // colorOn=""
                      // colorOff=""
                      // disabled=""
                    />
                    <SwtichDimension
                      title="Mobilidad Propia :"
                      onSwitch="SI"
                      offSwitch="NO"
                      name="hasMobility"
                      defaultValue={formik.values.hasMobility}
                      handleChange={(value) => {
                        formik.setFieldValue(
                          "hasMobility",
                          value === "SI" ? true : false
                        );
                      }}
                      colorOn="#5bc97d"
                      // colorOff=""
                      // disabled=""
                    />
                  </div>
                </div>
                <div className="columns-paralelo">
                  <div className="input-list">
                    {formik.values.contacto?.map((contacto, index) => (
                      <div className="input-item" key={index}>
                        <TextInput
                          name={`contacto-${index}`}
                          label={`Numero de Contacto :`}
                          defaultValue={contacto?.numero}
                          placeholder={`Ingrese Teléfono ${index + 1}`}
                          autoComplete="off"
                          maxLength={13}
                          required
                          autoFocus
                          onChange={(e) => {
                            formik.setFieldValue(
                              `contacto.${index}.numero`,
                              e.target.value
                            );
                          }}
                        />
                        {index === 0 ? (
                          <button
                            className={`state-ii add`}
                            type="button"
                            onClick={() => {
                              handleAddItem("contacto");
                            }}
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        ) : (
                          <button
                            className={`state-ii delete`}
                            type="button"
                            onClick={() => handleDeleteItem("contacto", index)}
                          >
                            <i className="fa-solid fa-x" />
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Este bloque solo se muestra si no hay datos agregados previamente */}
                    {formik.values.contacto?.length === 0 && (
                      <div className="input-item">
                        <TextInput
                          name={`contacto-0`}
                          label="Numero de Contacto "
                          defaultValue=""
                          maxLength={35}
                          placeholder="Ingrese Teléfono 1"
                          autoComplete="off"
                          required
                          onChange={(e) => {
                            formik.setFieldValue(`contacto`, [
                              {
                                index: 0,
                                numero: e.target.value,
                              },
                            ]);
                          }}
                        />
                        {formik.values.contacto[0]?.numero ? (
                          <button
                            className={`state-ii add`}
                            type="button"
                            onClick={() => {
                              handleAddItem("contacto"); // Utilizamos la función handleAddItem para agregar un nuevo elemento
                            }}
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="input-list">
                    {formik.values.horario?.map((horario, index) => (
                      <div className="input-item" key={index}>
                        <TextInput
                          name={`horario-${index}`}
                          label={`Horario :`}
                          defaultValue={horario?.horario}
                          placeholder={`Ingrese Horario #${index + 1}`}
                          autoComplete="off"
                          autoFocus
                          maxLength={35}
                          required
                          onChange={(e) => {
                            formik.setFieldValue(
                              `horario.${index}.horario`,
                              e.target.value
                            );
                          }}
                        />
                        {index === 0 ? (
                          <button
                            className={`state-ii add`}
                            type="button"
                            onClick={() => {
                              handleAddItem("horario");
                            }}
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        ) : (
                          <button
                            className={`state-ii delete`}
                            type="button"
                            onClick={() => handleDeleteItem("horario", index)}
                          >
                            <i className="fa-solid fa-x" />
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Este bloque solo se muestra si no hay datos agregados previamente */}
                    {formik.values.horario?.length === 0 && (
                      <div className="input-item">
                        <TextInput
                          name={`horario-0`}
                          label="Horario"
                          defaultValue=""
                          maxLength={35}
                          placeholder="Ingrese Horario 1"
                          autoComplete="off"
                          required
                          onChange={(e) => {
                            formik.setFieldValue(`horario`, [
                              {
                                index: 0,
                                horario: e.target.value,
                              },
                            ]);
                          }}
                        />
                        {formik.values.horario[0].horario ? (
                          <button
                            className={`state-ii add`}
                            type="button"
                            onClick={() => {
                              handleAddItem("horario");
                            }}
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="i-sistema">
              <h1>Informacion del Sistema</h1>
              <div className="data">
                <div className="columns-paralelo">
                  <div className="input-item">
                    <MultiSelect
                      name="itemsAtajos"
                      size="sm"
                      label="Items de Atajos (2 max) :"
                      value={formik.values.itemsAtajos}
                      onChange={(e) => {
                        formik.setFieldValue("itemsAtajos", e);
                      }}
                      placeholder="Escoge categoría"
                      clearable
                      maxSelectedValues={2}
                      searchable
                      data={getListServices(InfoServicios)}
                      maxDropdownHeight={150}
                      max={250}
                    />
                  </div>
                  <div className="input-item">
                    <MultiSelect
                      name="rolQAnulan"
                      size="sm"
                      label="Roles que Anulan:"
                      value={formik.values.rolQAnulan}
                      onChange={(e) => {
                        formik.setFieldValue("rolQAnulan", e);
                      }}
                      placeholder="Escoge categoría"
                      clearable
                      maxSelectedValues={3}
                      searchable
                      data={[
                        { value: Roles.ADMIN, label: "Administrador" },
                        { value: Roles.GERENTE, label: "Gerente" },
                        { value: Roles.COORD, label: "Coordinador" },
                      ]}
                      maxDropdownHeight={150}
                      max={250}
                    />
                  </div>
                </div>
                <div className="columns-paralelo">
                  <div className="input-horario">
                    <span>Horario de Funcionamiento</span>
                    <table className="t-horario">
                      <thead>
                        <tr>
                          <th>Hora</th>
                          <th>Actividad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="horario">
                              <TimeInput
                                name="inicio"
                                required
                                defaultValue={
                                  formik.values.funcionamiento?.horas.inicio
                                }
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "funcionamiento.horas.inicio",
                                    e.target.value
                                  );
                                }}
                              />
                              <TimeInput
                                required
                                name="fin"
                                defaultValue={
                                  formik.values.funcionamiento?.horas.fin
                                }
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "funcionamiento.horas.fin",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </td>
                          <td
                            onClick={() =>
                              formik.setFieldValue(
                                "funcionamiento.actividad",
                                !formik.values.funcionamiento?.actividad
                              )
                            }
                          >
                            <div
                              className={`item-day ${
                                formik.values.funcionamiento?.actividad
                                  ? "open"
                                  : "close"
                              }`}
                            >
                              <div className="day" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <SwtichDimension
                    title="Filtrar Lista Principal Por :"
                    onSwitch="Pendientes"
                    offSwitch="Otros"
                    name="filterListDefault"
                    defaultValue={
                      formik.values.filterListDefault === "others"
                        ? false
                        : true
                    }
                    handleChange={(value) => {
                      formik.setFieldValue(
                        "filterListDefault",
                        value === "Otros" ? "others" : "pendiente"
                      );
                    }}
                    colorOn="goldenrod"
                    // colorOff=""
                    // disabled=""
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            className="btn-save"
            type="submit"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Actualizar
          </Button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Negocio;

{
  /* <div className="state">
              <div className="input-item">
                <SwitchModel
                  title="Estado"
                  onSwitch="Abierto" // TRUE
                  offSwitch="Cerrado" // FALSE
                  name="estado"
                  defaultValue={formik.values.estado}
                  onChange={(value) => {
                    formik.setFieldValue('estado', value);
                  }}
                />
              </div>
            </div> */
}
