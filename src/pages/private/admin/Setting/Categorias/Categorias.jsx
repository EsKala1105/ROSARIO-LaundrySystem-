/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable } from "mantine-react-table";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import "./categorias.scss";
import Portal from "../../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./accion/Maintenance";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategoria } from "../../../../../redux/actions/aCategorias";
import { unwrapResult } from "@reduxjs/toolkit";
import { Notify } from "../../../../../utils/notify/Notify";

const Categorias = () => {
  const [infoCategorias, setInfoCategorias] = useState([]);
  const [rowPick, setRowPick] = useState(null);
  const [PActions, setPActions] = useState(false);
  const [action, setAction] = useState("Add");

  const [PNotice, setPNotice] = useState(false);
  const [itemsImp, setItemsImp] = useState([]);

  const dispatch = useDispatch();
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Tipo",
        accessorKey: "tipo",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 120,
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
    setAction("Add");
  };

  const handleDeleteCategoria = async (id) => {
    let confirmationEnabled = true;
    setPActions(false);
    setAction("Add");

    modals.openConfirmModal({
      title: "Eliminacion de Categoria",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Eliminar esta Categoria ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: handleCloseAction,
      onConfirm: async () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          try {
            const actionResult = await dispatch(deleteCategoria(id));
            unwrapResult(actionResult);
            Notify("Categoria Elinado Exitosamente", "", "success");
            handleCloseAction();
          } catch (error) {
            if (error.itemsAsociados) {
              Notify("Error al Eliminar Categoria", "", "fail");
              setItemsImp(error.itemsAsociados);
              setPNotice(true);
            }
          }
          setPActions(false);
        }
      },
    });
  };

  useEffect(() => {
    // Filtrar las categorías, excluyendo las de "nivel": "primario"
    const categoriasFiltradas = iCategorias.filter(
      (categoria) => categoria.nivel !== "primario"
    );

    // Invertir el orden de las categorías filtradas
    const categoriasInvertidas = categoriasFiltradas.reverse();

    // Actualizar el estado con las categorías invertidas y filtradas
    setInfoCategorias(categoriasInvertidas);
  }, [iCategorias]);

  return (
    <div className="content-servicio">
      <div className="actions-s">
        <h1>Informacion de Categorias</h1>
      </div>
      <div className="body-infomation">
        <MantineReactTable
          columns={columns}
          data={infoCategorias}
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
          <div className="portal-action-categoria">
            <span className="title">
              Categoria : {rowPick.name.toUpperCase()}
            </span>
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

              <Button
                type="submit"
                style={{ background: "#e76565" }}
                onClick={() => handleDeleteCategoria(rowPick._id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Portal>
      )}
      {PNotice && (
        <Portal
          onClose={() => {
            setPActions(false);
            setPNotice(false);
            handleCloseAction();
          }}
        >
          <div className="content-imp">
            <div className="title">
              <h2>Error: Categoria no Eliminada</h2>
              <p>
                <strong>
                  Existen productos o servicios asociados a la categoria{" "}
                  <strong className="cat-select">
                    "{rowPick.name.toUpperCase()}"
                  </strong>
                </strong>
                , asegurece de que ningun producto o servicio este usando esta
                categoria
              </p>
            </div>
            <div className="list-asociados">
              <span>Items usando la categoria :</span>
              <ul>
                {itemsImp.map((a, index) => (
                  <li key={index}>{`${a.tipo.toUpperCase()} - ${a.nombre}`}</li>
                ))}
              </ul>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Categorias;
