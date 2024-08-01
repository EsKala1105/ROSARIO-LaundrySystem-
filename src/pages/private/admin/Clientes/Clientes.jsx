/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { MantineReactTable } from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";
import { Button, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { useMemo } from "react";

import React from "react";
import { Modal } from "@mantine/core";
import { documento } from "../../../../services/global";
import "./clientes.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addCliente,
  deleteCliente,
  updateCliente,
} from "../../../../redux/actions/aClientes";
import ActionCliente from "./ActionCliente/ActionCliente";

const Clientes = () => {
  const [mOptions, { open: openModalOptions, close: closeModalOptions }] =
    useDisclosure(false);

  const [
    mActionCliente,
    { open: openModalActionCliente, close: closeModalActionCliente },
  ] = useDisclosure(false);

  const [rowPick, setRowPick] = useState(null);

  const dispatch = useDispatch();
  const listClientes = useSelector((state) => state.clientes.listClientes);

  const columns = useMemo(
    () => [
      {
        header: `${documento}`,
        accessorKey: "dni",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Nombre",
        accessorKey: "nombre",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 250,
      },

      {
        header: "Celular",
        accessorKey: "phone",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 100,
      },
      {
        header: "Total de Puntos",
        enableColumnFilter: false,
        accessorKey: "scoreTotal",
        size: 130,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Direccion",
        enableColumnFilter: false,
        accessorKey: "direccion",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Textarea value={cell.getValue()} minRows={1} maxRows={5} readOnly />
        ),
        size: 200,
      },
    ],
    []
  );

  const handleAddClientes = async (datosCliente) => {
    dispatch(addCliente(datosCliente));
    handleCloseAction();
  };

  const handleDeleteCliente = async (id) => {
    dispatch(deleteCliente(id));
    setRowPick();
  };

  const handleUpdateCliente = async (datosCliente) => {
    dispatch(updateCliente({ id: rowPick._id, datosCliente }));
    handleCloseAction();
  };

  const handleCloseAction = () => {
    setRowPick();
    closeModalActionCliente();
  };

  return (
    <div className="content-clientes">
      <div className="body-clientes">
        <div className="list-clientes">
          <div className="header-cli">
            <h1>Clientes</h1>
            <Button
              type="button"
              onClick={() => {
                setRowPick();
                openModalActionCliente();
              }}
              className="btn-save"
              color="blue"
            >
              Nuevo Cliente
            </Button>
          </div>
          <MantineReactTable
            columns={columns}
            data={listClientes}
            initialState={{
              showColumnFilters: true,
              density: "xs",
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
            enableExpandAll={false}
            enablePagination={false}
            enableBottomToolbar={false}
            enableStickyHeader
            mantineTableContainerProps={{
              sx: {
                maxHeight: "400px",
                width: "100%",
              },
            }}
            enableRowVirtualization={true} // no scroll lateral
            mantineTableBodyRowProps={({ row }) => {
              const iCliente = listClientes.find(
                (c) => c._id === row.original._id
              );

              const handleClick = () => {
                setRowPick(iCliente);
              };

              const handleDoubleClick = () => {
                setRowPick(iCliente);
                openModalOptions();
              };

              return {
                onClick: handleClick,
                onDoubleClick: handleDoubleClick,
              };
            }}
          />
        </div>
        <div className="detail-cliente">
          <span className="title-detail">Historial de Órdenes</span>
          <div className="table-wrapper">
            <table className="sticky-table">
              <thead>
                <tr>
                  <th>ORDEN</th>
                  <th>FECHA</th>
                  <th>PUNTOS</th>
                </tr>
              </thead>
              <tbody>
                {rowPick?.infoScore.map((visita, index) => (
                  <tr key={index}>
                    <td>{visita.codigo}</td>
                    <td>{visita.dateService.fecha}</td>
                    <td>{visita.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="info-extra">
            <span>Total de Visitas </span>
            <span>
              {rowPick?.infoScore &&
                new Set(rowPick?.infoScore.map((item) => item.idOrdenService))
                  .size}
            </span>
          </div>
        </div>
      </div>
      <Modal
        opened={mOptions}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={closeModalOptions}
        size="auto"
        title={rowPick?.nombre}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            type="button"
            onClick={() => {
              closeModalOptions();
              openModalActionCliente();
            }}
            className="btn-save"
            color="yellow"
          >
            ACTUALIZAR INFORMACION
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleDeleteCliente(rowPick?._id);
              closeModalOptions();
            }}
            className="btn-save"
            color="red"
          >
            ELIMINAR CLIENTE
          </Button>
        </div>
      </Modal>
      <Modal
        opened={mActionCliente}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={() => {
          closeModalActionCliente();
          handleCloseAction();
        }}
        size="auto"
        title={`${
          rowPick
            ? "Actualizar informacion del cliente"
            : "Agregar nuevo cliente"
        }`}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <ActionCliente
          info={rowPick}
          onAction={rowPick ? handleUpdateCliente : handleAddClientes}
        />
      </Modal>
    </div>
  );
};

export default Clientes;
