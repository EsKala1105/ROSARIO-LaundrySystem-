/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Button, MultiSelect } from "@mantine/core";
import { MantineReactTable } from "mantine-react-table";
import { Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useMemo, useState } from "react";

import "./list.scss";

import {
  handleItemsCantidad,
  formatThousandsSeparator,
} from "../../../../../../utils/functions/index";

import { useDispatch, useSelector } from "react-redux";

import { documento } from "../../../../../../services/global";
import {
  Anular_OrdenService,
  FinalzarRegistroPreliminar,
} from "../../../../../../redux/actions/aOrdenServices";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../../models";

import { Field, Form, Formik } from "formik";
import { modals } from "@mantine/modals";
import * as Yup from "yup";
import { Text } from "@mantine/core";

import { DateCurrent } from "../../../../../../utils/functions";
import SwtichDimension from "../../../../../../components/SwitchDimension/SwitchDimension";
import { MonthPickerInput } from "@mantine/dates";
import moment from "moment";

const List = ({ setMode }) => {
  const navigate = useNavigate();

  const [mAction, { open: openModalAction, close: closeModalAction }] =
    useDisclosure(false);

  const [mAnulacion, { open: openModalAnulacion, close: closeModalAnulacion }] =
    useDisclosure(false);

  const InfoUsuario = useSelector((state) => state.user.infoUsuario);

  //Filtros de Fecha
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);

  const { preliminary } = useSelector((state) => state.orden);
  const [onLoadingTable, setOnLoadingTable] = useState(false);
  const [hideAnulado, setHideAnulado] = useState(true);

  const dispatch = useDispatch();

  // Informacion de Ordenes Preliminares Formateada
  const [ListOrdenes, setListOrdenes] = useState([]);
  const [selectedMonth, setSelectMonth] = useState(moment().toDate());

  const [rowPick, setRowPick] = useState();

  const validationSchema = Yup.object().shape({
    motivo: Yup.string().required("Ingrese motivo de Anulacion"),
  });

  const handleGetAnulados = () => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Confirmar Anulacion",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Quieres obtener la lista de anulados del mes{" "}
          {moment(selectedMonth).format("MMMM").toUpperCase()} ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: () => setHideAnulado(true),
      onConfirm: async () => {
        setHideAnulado(false);
        if (confirmationEnabled) {
          confirmationEnabled = false;

          console.log("traer anulados");
        }
      },
    });
  };

  const handleAnular = (values) => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Confirmar Anulacion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro que quiere de ANULAR este pedido?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      //onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          await dispatch(
            Anular_OrdenService({
              id: rowPick.Id,
              infoAnulacion: {
                ...values,
                _id: rowPick.Id,
                idUser: InfoUsuario._id,
              },
            })
          );
          closeModalAnulacion();
        }
      },
    });
  };

  const handleFinalizarRegistro = () => {
    let confirmationEnabled = true;
    modals.openConfirmModal({
      title: "Confirmar Anulacion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de registrar la ORDEN DE RECOJO ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          await dispatch(FinalzarRegistroPreliminar(rowPick.Id));
          closeModalAction();
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "Recibo",
        header: "Orden",
        mantineFilterTextInputProps: {
          placeholder: "N°",
        },
        //enableEditing: false,
        size: 75,
      },

      {
        accessorKey: "Nombre",
        header: "Nombre",
        mantineFilterTextInputProps: {
          placeholder: "Cliente",
        },
        //enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "FechaRegistro",
        header: "Registro",
        mantineFilterTextInputProps: {
          placeholder: "Fecha",
        },
        size: 100,
      },
      {
        accessorKey: "items",
        header: "Items",
        mantineFilterTextInputProps: {
          placeholder: "Item",
        },
        Cell: ({ cell }) => (
          <MultiSelect
            data={cell.getValue()}
            value={cell.getValue()}
            readOnly
          />
        ),
        size: 250,
      },
      {
        accessorKey: "totalNeto",
        header: "Total",
        //enableSorting: false,
        Cell: ({ cell }) => (
          <Box>{formatThousandsSeparator(cell.getValue(), true)}</Box>
        ),
        enableEditing: false,
        mantineFilterTextInputProps: {
          placeholder: "Total",
        },
        size: 130,
      },
      {
        accessorKey: "FechaRecojo",
        header: "Recojo",
        mantineFilterTextInputProps: {
          placeholder: "Fecha",
        },
        size: 100,
      },
      {
        accessorKey: "Celular",
        header: "Celular",
        //enableSorting: false,
        mantineFilterTextInputProps: {
          placeholder: "Numero",
        },
        size: 100,
      },
      {
        accessorKey: "DNI",
        header: documento,
        //enableSorting: false,
        mantineFilterTextInputProps: {
          placeholder: documento,
        },
        size: 90,
      },
      {
        accessorKey: "attendedBy.name",
        header: "Cerrador",
        mantineFilterTextInputProps: {
          placeholder: "Cerrador",
        },
        //enableSorting: false,
        size: 100,
      },
    ],
    []
  );

  const getObjectIdTimestamp = (objectId) => {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  const handleGetFactura = async (info) => {
    const reOrdenar = [...info].sort((a, b) => {
      return getObjectIdTimestamp(b._id) - getObjectIdTimestamp(a._id);
    });

    const newData = await Promise.all(
      reOrdenar.map(async (d) => {
        const listItems = d.Items.filter(
          (item) => item.identificador !== iDelivery?._id
        );

        const structureData = {
          Id: d._id,
          Recibo: String(d.codRecibo).padStart(4, "0"),
          Nombre: d.Nombre,
          items: handleItemsCantidad(listItems),
          totalNeto: d.totalNeto,
          DNI: d.dni,
          Celular: d.celular,
          attendedBy: d.attendedBy,
          FechaRegistro: d.dateCreation.fecha,
          FechaRecojo: d.dateRecojo.fecha,
        };

        return structureData;
      })
    );

    setListOrdenes(newData);
  };

  useEffect(() => {
    if (!hideAnulado) {
      handleGetAnulados();
    }
  }, [selectedMonth]);

  useEffect(() => {
    handleGetFactura(preliminary);
  }, [preliminary]);

  return (
    <div className="list-pedidos-preliminar">
      <h1>Lista : Ordenes de Recojo</h1>
      <div className="body">
        <div className="header-list-preliminar">
          {/* <div className="sw-data">
            <SwtichDimension
              onSwitch="LISTA RECOJO"
              offSwitch="ANULADOS"
              name="Modalidad"
              defaultValue={hideAnulado}
              handleChange={(value) => {
                if (value === "ANULADOS") {
                  handleGetAnulados();
                } else {
                  setHideAnulado(true);
                }
              }}
              colorOn="#75cbaf"
              // colorOff=""
            />
            {!hideAnulado ? (
              <MonthPickerInput
                className="date-m"
                size="md"
                placeholder="Pick date"
                value={selectedMonth}
                maxDate={moment().toDate()}
                onChange={setSelectMonth}
                mx="auto"
                maw={400}
              />
            ) : null}
          </div> */}
          <div></div>
          <Button
            type="button"
            color="green"
            onClick={() => {
              setMode("Add");
            }}
          >
            Registrar
          </Button>
        </div>
        <MantineReactTable
          columns={columns}
          data={ListOrdenes}
          state={{ isLoading: onLoadingTable }}
          initialState={{
            showColumnFilters: true,
            density: "xs",
            sorting: [{ id: "Recibo", desc: true }],
            pagination: { pageSize: 5 },
          }}
          enableToolbarInternalActions={false}
          enableHiding={false}
          filterFns={{
            customFilterFn: (row, id, filterValue) => {
              return row.getValue(id) === filterValue;
            },
          }}
          localization={{
            filterCustomFilterFn: "Custom Filter Fn",
          }}
          enableColumnActions={false}
          enableSorting={false}
          enableTopToolbar={false}
          mantineTableProps={{
            highlightOnHover: false,
          }}
          mantineTableBodyCellProps={() => ({
            sx: {
              background: "transparent",
            },
          })}
          mantinePaginationProps={{
            showRowsPerPage: false,
          }}
          mantineTableBodyRowProps={({ row }) => ({
            onDoubleClick: () => {
              openModalAction();
              setRowPick(row.original);
            },
          })}
          enableStickyHeader={true}
          mantineTableContainerProps={{
            sx: {
              width: "100%",
              height: "100%",
              maxHeight: "calc(100% - 56px)",
              overflow: onLoadingTable ? "unset" : "auto",
              zIndex: "2",
            },
          }}
          enableRowVirtualization={true} // no scroll lateral
        />
      </div>
      <Modal
        opened={mAction}
        onClose={() => {
          closeModalAction();
          setRowPick();
        }}
        size="auto"
        title={`Cliente : ${rowPick?.Nombre} - (${rowPick?.Recibo})`}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <div className="preliminar-actions">
          <div className="actions-preliminar">
            <Button
              type="button"
              onClick={() => {
                navigate(
                  `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.IMPRIMIR_ORDER_SERVICE}/${rowPick.Id}`
                );
              }}
              color="blue"
            >
              Imprimir Orden
            </Button>
            <Button
              type="button"
              onClick={() => {
                closeModalAction();
                openModalAnulacion();
              }}
              color="red"
            >
              Anular
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigate(
                  `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.EDIT_ORDER_RECOJO}/${rowPick.Id}`
                );
              }}
              color="yellow"
            >
              Actualizar
            </Button>
          </div>
          <Button
            type="button"
            onClick={() => {
              handleFinalizarRegistro();
            }}
            color="green"
          >
            FINALIZAR REGISTRO
          </Button>
        </div>
      </Modal>
      <Modal
        opened={mAnulacion}
        onClose={() => {
          closeModalAnulacion();
          setTimeout(() => {
            setRowPick();
          }, 1000);
        }}
        className="m-anulacion"
        size="auto"
        title={`Cliente : ${rowPick?.Nombre} - (${rowPick?.Recibo})`}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <div className="action-anulacion">
          <h1>Anulacion</h1>
          <Formik
            initialValues={{
              motivo: "",
              fecha: DateCurrent().format4,
              hora: DateCurrent().format3,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleAnular(values);
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit} className="body-a">
                <div className="content-anuacion">
                  <Field
                    placeholder="Motivo de la anulacion"
                    className="description-info"
                    as="textarea"
                    name="motivo"
                    cols="30"
                    rows="10"
                  />
                  {errors.motivo && touched.motivo && (
                    <div className="ico-req">
                      <i className="fa-solid fa-circle-exclamation ">
                        <div
                          className="info-req"
                          style={{ pointerEvents: "none" }}
                        >
                          <span>{errors.motivo}</span>
                        </div>
                      </i>
                    </div>
                  )}
                </div>
                <div className="actions-bottom">
                  <Button type="submit" disabled={isSubmitting} color="red">
                    Anular
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default List;
