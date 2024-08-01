/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable } from "mantine-react-table";
import { Box, Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import "./servicios.scss";
import Portal from "../../../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./accion/Maintenance";
import { getInfoCategoria } from "../utilsPortafolio";
import { useDispatch, useSelector } from "react-redux";
import { deleteServicio } from "../../../../../../redux/actions/aServicios";
import { Notify } from "../../../../../../utils/notify/Notify";
import { formatThousandsSeparator } from "../../../../../../utils/functions";

const Servicios = () => {
  const [infoServicios, setInfoServicios] = useState([]);
  const [rowPick, setRowPick] = useState(null);
  const [PActions, setPActions] = useState(false);
  const [action, setAction] = useState("");

  const dispatch = useDispatch();
  const iServicios = useSelector((state) => state.servicios.listServicios);
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const handleTrasformData = (data) => {
    // Mapear los elementos de data y modificar la estructura
    const newData = data.map((item) => {
      const categoria = getInfoCategoria(iCategorias, item.idCategoria);
      const { idCategoria, ...rest } = item;

      return {
        ...rest,
        categoria,
      };
    });
    setInfoServicios(newData.sort((a, b) => a.nombre.localeCompare(b.nombre)));
  };

  const columns = useMemo(
    () => [
      {
        header: "Servicio",
        accessorKey: "nombre",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Categoría",
        accessorKey: "categoria.name",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 120,
      },
      {
        header: "Precio",
        accessorKey: "precioVenta",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Box>{formatThousandsSeparator(cell.getValue(), true)}</Box>
        ),
      },
      {
        header: "Fecha Creación",
        accessorKey: "dateCreation",
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
    setAction("");
  };

  const handleDeleteService = (id) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Eliminacion de Servicio",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Eliminar este Servicio ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },

      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(deleteServicio(id))
            .unwrap()
            .catch((error) => {
              // Aquí manejamos el error de la eliminación
              const { mensaje, codigos } = error;
              if (codigos?.length > 0) {
                setTimeout(() => {
                  alert(`${mensaje}: ${codigos.join(", ")}`);
                }, 1500);
              }
              Notify("NO SE PUDO ELIMINAR EL SERVICIO", "", "fail");
            });
          handleCloseAction();
        }
      },
    });
  };

  useEffect(() => {
    handleTrasformData(iServicios);
  }, [iServicios]);

  return (
    <div className="content-productos">
      <div className="actions-p">
        <h1>Lista de Servicios</h1>
        <button
          className="b-add-p"
          type="button"
          onClick={() => {
            setPActions(true);
            setAction("Add");
          }}
        >
          Agregar Servicio
        </button>
      </div>
      <MantineReactTable
        columns={columns}
        data={infoServicios}
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
            maxHeight: "400px",
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

      {PActions && (
        <Portal onClose={handleCloseAction}>
          {action === "Add" ? (
            <Maintenance onClose={handleCloseAction} />
          ) : action === "Edit" ? (
            <Maintenance info={rowPick} onClose={handleCloseAction} />
          ) : (
            <div className="portal-action-servicio">
              <span>Servicio : {rowPick.nombre}</span>
              <div className="action">
                <Button
                  type="submit"
                  style={{ background: "#339af0" }}
                  onClick={() => {
                    setAction("Edit");
                  }}
                >
                  Actualizar
                </Button>

                {rowPick.categoria.nivel === "secundario" ? (
                  <Button
                    type="submit"
                    style={{ background: "#e76565" }}
                    onClick={() => handleDeleteService(rowPick._id)}
                  >
                    Eliminar
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </Portal>
      )}

      {/* {PActions && (
        <Portal
          onClose={() => {
            setPActions(false);
          }}
        >
          <div className="portal-notificacion-promociones">
            <h2>Acceso Denegado</h2>
            <p>No tiene acceso hasta agregar almenos 1 registro de Categoria</p>
          </div>
        </Portal>
      )} */}
    </div>
  );
};

export default Servicios;
