/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable } from "mantine-react-table";
import { Button, Text, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";

import "./tipoGastos.scss";
import Portal from "../../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./accion/Maintenance";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Notify } from "../../../../../utils/notify/Notify";
import { DeleteTipoGastos } from "../../../../../redux/actions/aTipoGasto";

const TipoGastos = () => {
  const [infoGastos, setInfoGastos] = useState([]);
  const [rowPick, setRowPick] = useState(null);
  const [PActions, setPActions] = useState(false);
  const [action, setAction] = useState("Add");

  const dispatch = useDispatch();
  const { infoTipoGasto, iDeliveryEnvio, iDeliveryRecojo } = useSelector(
    (state) => state.tipoGasto
  );

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        size: 200,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Detalle",
        accessorKey: "detalle",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Textarea value={cell.getValue()} minRows={3} maxRows={5} readOnly />
        ),
        size: 250,
      },
      {
        header: "Fecha Creación",
        accessorKey: "dateCreation.fecha",
        size: 100,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
    ],
    []
  );

  const handleCloseAction = () => {
    setRowPick(null);
    setPActions(false);
    setAction("Add");
  };

  const handleDeleteTipoGasto = async (id) => {
    let confirmationEnabled = true;
    setPActions(false);
    setAction("Add");

    modals.openConfirmModal({
      title: "Eliminando tipo de Gastos",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Eliminar este tipo de Gasto ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: handleCloseAction,
      onConfirm: async () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          try {
            const actionResult = await dispatch(DeleteTipoGastos(id));

            unwrapResult(actionResult);
            Notify("Categoria Elinado Exitosamente", "", "success");
            handleCloseAction();
          } catch (error) {
            if (error.itemsAsociados) {
              Notify("Error al Eliminar Categoria", "", "fail");
            }
          }
          setPActions(false);
        }
      },
    });
  };

  useEffect(() => {
    const newListGastos = [iDeliveryEnvio, iDeliveryRecojo, ...infoTipoGasto];
    setInfoGastos(newListGastos);
  }, [infoTipoGasto, iDeliveryEnvio, iDeliveryRecojo]);

  return (
    <div className="content-tipo-gasto">
      <div className="actions-s">
        <h1>Tipos de Gastos</h1>
      </div>
      <div className="body-infomation">
        <MantineReactTable
          columns={columns}
          data={infoGastos}
          initialState={{
            showColumnFilters: true,
            density: "md",
            pagination: {},
          }}
          enableToolbarInternalActions={false}
          enableColumnActions={false}
          enableSorting={false}
          enableTopToolbar={false}
          mantineTableProps={{
            highlightOnHover: false,
          }}
          enableExpandAll={false}
          enablePagination={false}
          enableBottomToolbar={false}
          enableRowNumbers
          enableStickyHeader
          mantineTableContainerProps={{
            sx: {
              maxHeight: "600px  ",
              maxWidth: "1000px",
            },
          }}
          mantineTableBodyRowProps={({ row }) => ({
            onDoubleClick: () => {
              setRowPick(row.original);
              setPActions(true);
            },
          })}
        />
        <div>
          {action !== "Edit" ? (
            <Maintenance />
          ) : (
            <Maintenance info={rowPick} cancelarEdit={handleCloseAction} />
          )}
        </div>
      </div>
      {PActions && (
        <Portal onClose={handleCloseAction}>
          <div className="portal-action-tipo-gastos">
            <span>Tipo de Gasto : {rowPick.name.toUpperCase()}</span>
            <div className="action">
              <Button
                type="submit"
                style={{ background: "#339af0" }}
                onClick={() => {
                  setAction("Edit");
                  setPActions(false);
                }}
              >
                Actualizar
              </Button>

              {rowPick.nivel === "secundario" ? (
                <Button
                  type="submit"
                  style={{ background: "#e76565" }}
                  onClick={() => handleDeleteTipoGasto(rowPick._id)}
                >
                  Eliminar
                </Button>
              ) : null}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default TipoGastos;
