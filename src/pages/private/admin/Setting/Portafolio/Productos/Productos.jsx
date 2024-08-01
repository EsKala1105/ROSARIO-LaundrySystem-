/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable } from "mantine-react-table";
import { Box, Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import "./productos.scss";
import { simboloMoneda } from "../../../../../../services/global";
import Portal from "../../../../../../components/PRIVATE/Portal/Portal";
import Add from "./Accion/Add";
import Edit from "./Accion/Edit";
import { getInfoCategoria } from "../utilsPortafolio";
import { useDispatch, useSelector } from "react-redux";
import { deleteProducto } from "../../../../../../redux/actions/aProductos";
import { Notify } from "../../../../../../utils/notify/Notify";

const Productos = () => {
  const [infoProductos, setInfoProductos] = useState([]);
  const [rowPick, setRowPick] = useState(null);
  const [PActions, setPActions] = useState(false);
  const [action, setAction] = useState("");

  const dispatch = useDispatch();
  const iProductos = useSelector((state) => state.productos.listProductos);
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const handleTrasformData = (data) => {
    // Mapear los elementos de data y modificar la estructura
    const newData = data.map((item) => {
      // Encontrar las categorías correspondientes en iCategoria
      const categoria = getInfoCategoria(iCategorias, item.idCategoria);
      // Eliminar el campo idsCategoria del resultado
      const { idCategoria, ...rest } = item;
      // Crear un nuevo objeto con la misma información, pero con el campo categoria actualizado y sin idsCategori

      return {
        ...rest,
        categoria,
      };
    });
    setInfoProductos(newData);
  };

  const handleCloseAction = () => {
    setRowPick(null);
    setPActions(false);
    setAction("");
  };

  const handleDeleteProduct = (id) => {
    modals.openConfirmModal({
      title: "Eliminacion de Producto",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Eliminar este Producto ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },

      onConfirm: () => {
        dispatch(deleteProducto(id));
        handleCloseAction();
        Notify("Eliminacion Exitosa", "", "success");
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Producto",
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
        header: "Precio Venta",
        accessorKey: "precioVenta",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Box>
            {simboloMoneda} {cell.getValue()}
          </Box>
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
      {
        header: "Stock",
        accessorKey: "stockPrincipal",
        size: 30,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Box
            sx={() => ({
              backgroundColor: "#6cb199",
              borderRadius: "4px",
              color: "#fff",
              fontWeight: "800",
              textAlign: "center",
              padding: "5px 10px",
              width: "60px",
              margin: "0 5px",
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    handleTrasformData(iProductos);
  }, [iProductos]);

  return (
    <div className="content-productos">
      <div className="actions-p">
        <h1>Lista de Productos</h1>
        <button
          className="b-add-p"
          type="button"
          onClick={() => {
            setPActions(true);
            setAction("Add");
          }}
        >
          Agregar Producto
        </button>
      </div>
      <MantineReactTable
        columns={columns}
        data={infoProductos}
        initialState={{
          showColumnFilters: true,
          density: "xs",
          pagination: {},
          expanded: {
            1: false,
          },
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
        renderDetailPanel={({ row }) => (
          <div className="sub-row">
            <div className="inventario">
              {row.original.inventario
                .slice() // Hacer una copia del array antes de modificarlo
                .sort((a, b) => b.index - a.index)
                .map((inv, index) => (
                  <table className="stock-table" key={index}>
                    <tbody>
                      {index === 0 ? (
                        <tr>
                          <th
                            className={`${index === 0 ? "last-stock" : null}`}
                            colSpan="2"
                          >
                            Ultimo Ajuste de Stock
                          </th>
                        </tr>
                      ) : null}

                      <tr>
                        <td>Fecha / Hora:</td>
                        <td>
                          {inv.date.fecha} / {inv.date.hora}
                        </td>
                      </tr>
                      <tr>
                        <td>Tipo Stock:</td>
                        <td>{inv.tipo}</td>
                      </tr>
                      {inv.tipo === "abastecimiento" ? (
                        <tr>
                          <td>Precio Transaccion:</td>
                          <td>
                            {simboloMoneda} {inv.precioTransaccion}
                          </td>
                        </tr>
                      ) : null}

                      <tr>
                        <td>Stock:</td>
                        <td>{inv.stock}</td>
                      </tr>
                    </tbody>
                  </table>
                ))}
            </div>
          </div>
        )}
        mantineTableBodyRowProps={({ row }) => ({
          onDoubleClick: () => {
            setRowPick(row.original);
            setPActions(true);
          },
        })}
        positionExpandColumn="last"
      />

      {PActions && (
        <Portal onClose={handleCloseAction}>
          {action === "Add" ? (
            <Add onClose={handleCloseAction} />
          ) : action === "Edit" ? (
            <Edit onClose={handleCloseAction} InfoProducto={rowPick} />
          ) : (
            <div className="portal-action-producto">
              <span>Producto : {rowPick.nombre}</span>
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

                <Button
                  type="submit"
                  style={{ background: "#e76565" }}
                  onClick={() => handleDeleteProduct(rowPick._id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </Portal>
      )}
    </div>
  );
};

export default Productos;
