/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Modal,
  MultiSelect,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ScrollArea } from "@mantine/core";
import "./promocion.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  DeletePromocion,
  updatePromocion,
} from "../../../../redux/actions/aPromociones";
import { simboloMoneda } from "../../../../services/global";
import { Notify } from "../../../../utils/notify/Notify";
import axios from "axios";
import { useMemo } from "react";
import { MantineReactTable } from "mantine-react-table";
import Pet from "../../../../utils/img/Promocion/pet.jpg";
import Maintenance from "./Accion/Maintenance";
import { calcularFechaFutura } from "../../../../utils/functions";
import SwtichDimension from "../../../../components/SwitchDimension/SwitchDimension";
import LoaderSpiner from "../../../../components/LoaderSpinner/LoaderSpiner";

const Promociones = () => {
  const [mCupones, { open: openModalCupones, close: closeModalCupones }] =
    useDisclosure(false);

  const [mAccionPromo, { open: openAccionPromo, close: closeAccionPromo }] =
    useDisclosure(false);

  const dispatch = useDispatch();

  const [onLoading, setOnLoading] = useState(false);

  const [listPromociones, setListPromociones] = useState([]);

  const [rowPick, setRowPick] = useState(null);
  const [action, setAction] = useState("");
  const [nCupon, setNCupones] = useState("");

  const InfoServicios = useSelector((state) => state.servicios.listServicios);

  const infoPromocion = useSelector((state) => state.promocion.infoPromocion);

  const columns = useMemo(
    () => [
      {
        header: "Codigo",
        accessorKey: "codigo",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Descripcion",
        accessorKey: "descripcion",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Textarea value={cell.getValue()} minRows={3} maxRows={5} readOnly />
        ),
        size: 250,
      },
      {
        header: "Descuento",
        accessorKey: "descuento",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Items",
        accessorKey: "Items",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => {
          // const data = cell.getValue();

          const infoData = InfoServicios.map((service) => ({
            value: service._id,
            label: service.nombre,
          }));

          infoData.push({ label: "Todos", value: "Todos" });

          return (
            <MultiSelect value={cell.getValue()} data={infoData} readOnly />
          );
        },
        size: 250,
      },
      {
        header: "Cantidad Minima",
        accessorKey: "cantidadMin",
        size: 100,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Vigencia",
        accessorKey: "vigencia",
        size: 30,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Estado",
        accessorKey: "state",
        size: 30,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue() === "activo" ? (
              <i style={{ color: "#2260ff" }} className="fa-solid fa-eye" />
            ) : (
              <i
                style={{ color: "#686868" }}
                className="fa-solid fa-eye-slash"
              />
            )}
          </Box>
        ),
      },
    ],
    []
  );

  const validDeletePromocion = (id) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Eliminar Promocion",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Estas seguro de eliminar esta promocion - AL ELIMINAR LA PROMOCION
          SE ELIMINARAN TODOS LOS CUPONES CREADOS DE ESTA PROMOCION ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          dispatch(DeletePromocion(id));
          handleCloseAction();
        }
      },
    });
  };

  const handleGenerarCupones = async (codigoPromocion, cantCupones) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/generate-multiples-cupones`,
        {
          codigoPromocion,
          cantCupones,
        }
      );

      const codigosGenerados = response.data;

      // Generar el texto con el título y los códigos numerados
      let texto = `LISTA DE CUPONES : ${rowPick.descripcion} \n\n`;
      codigosGenerados.forEach((codigo, index) => {
        texto += `${index + 1}. ${codigo}\n`;
      });

      // Crear el archivo Blob y descargarlo
      const archivo = new Blob([texto], { type: "text/plain" });
      const url = URL.createObjectURL(archivo);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `${cantCupones} - CODIGO DE CUPONES.txt`;
      document.body.appendChild(enlace);
      enlace.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(enlace);
      }, 0);
      Notify("Cupones Generados Exitosamente", "", "success");
    } catch (error) {
      Notify("Error al Generar Cupones", "", "fail");
      console.error("Error al generar los cupones:", error);
    } finally {
      // Esta parte siempre se ejecutará, independientemente de si hubo un error o no
      setOnLoading(false);
      closeModalCupones();
      setNCupones("");
    }
  };

  const handleUpdateEstado = async (infoPromo, id) => {
    dispatch(updatePromocion({ infoPromo, id }));
  };

  const handleGetValuesServices = (ids) => {
    const resultado = [];

    ids.forEach((id) => {
      const productoEncontrado = InfoServicios.find(
        (service) => service._id === id
      );
      if (productoEncontrado) {
        resultado.push(productoEncontrado._id);
      }
    });

    return resultado;
  };

  const handleCloseAction = () => {
    closeAccionPromo();
    setTimeout(() => {
      setRowPick(null);
      setAction("");
    }, 500);
  };

  useEffect(() => {
    const transformData = (ListPromos) => {
      return ListPromos.map((promo) => {
        const newAtrr =
          promo.alcance === "Parte"
            ? handleGetValuesServices(promo.prenda)
            : ["Todos"];

        let CantidadMinima;
        if (promo.tipoPromocion === "Unico") {
          if (
            promo.tipoDescuento === "Porcentaje" ||
            promo.tipoDescuento === "Gratis"
          ) {
            CantidadMinima =
              promo.tipoPromocion === "Unico"
                ? `${promo.cantidadMin} ${
                    InfoServicios.find(
                      (service) => service._id === promo.prenda[0]
                    )?.simboloMedida
                  }`
                : promo.cantidadMin;
          } else {
            CantidadMinima = `${simboloMoneda} ${promo.cantidadMin}`;
          }
        } else {
          if (promo.tipoDescuento === "Monto") {
            CantidadMinima = `${simboloMoneda}${promo.cantidadMin}`;
          } else {
            CantidadMinima = promo.cantidadMin;
          }
        }

        let Descuento;
        if (promo.tipoDescuento === "Monto") {
          Descuento = `${simboloMoneda} ${promo.descuento}`;
        } else if (promo.tipoDescuento === "Gratis") {
          Descuento = `${promo.descuento} VU`;
        } else {
          Descuento = `${promo.descuento} %`;
        }

        return {
          ...promo,
          cantidadMin: CantidadMinima,
          descuento: Descuento,
          Items: newAtrr,
          vigencia: `${promo.vigencia} ${
            promo.vigencia === 1 ? "dia" : "dias"
          }`,
        };
      });
    };

    const transformedPromociones = transformData(infoPromocion);
    setListPromociones(transformedPromociones);
  }, [infoPromocion, InfoServicios]);

  return (
    <div className="content-promos">
      <div className="action-h">
        <Button
          type="button"
          onClick={() => {
            openAccionPromo();
            setAction("Add");
          }}
        >
          Agregar Promocion
        </Button>
      </div>
      <MantineReactTable
        columns={columns}
        data={listPromociones}
        initialState={{
          density: "xs",
          pagination: {},
        }}
        enableToolbarInternalActions={false}
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
          },
        }}
        mantineTableBodyRowProps={({ row }) => ({
          onDoubleClick: () => {
            const iPromo = infoPromocion.find(
              (pr) => pr._id === row.original._id
            );

            const newAtrr =
              iPromo.alcance === "Parte"
                ? handleGetValuesServices(iPromo.prenda)
                : ["Todos"];
            setRowPick({ ...iPromo, prenda: newAtrr });
            openAccionPromo();
          },
        })}
      />
      <Modal
        opened={mAccionPromo}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={() => handleCloseAction()}
        size="auto"
        title={action === "" ? `codigo : ${rowPick?.codigo}` : null}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        {action === "Add" ? (
          <Maintenance onClose={handleCloseAction} />
        ) : (
          // : action === "Edit" ? (
          //<Maintenance info={rowPick} onClose={handleCloseAction} />
          //)
          <div className="portal-action-promocion">
            <div className="action">
              <div className="swtich-state">
                <SwtichDimension
                  onSwitch="ACTIVADO"
                  offSwitch="DESACTIVADO"
                  name="swtich-state"
                  defaultValue={rowPick?.state === "activo" ? true : false}
                  handleChange={(value) => {
                    modals.openConfirmModal({
                      title: "Registro de Promocion",
                      centered: true,
                      children: (
                        <Text size="sm">
                          ¿ Estas seguro de Actualizar el Estado de esta
                          Promocion ?
                        </Text>
                      ),
                      labels: { confirm: "Si", cancel: "No" },
                      confirmProps: { color: "blue" },
                      //onCancel: () => console.log("Cancelado"),
                      onConfirm: () => {
                        const infoPromo = {
                          state: value === "ACTIVADO" ? "activo" : "inactivo",
                        };
                        handleUpdateEstado(infoPromo, rowPick?._id);
                        handleCloseAction();
                      },
                    });
                  }}
                  colorOn="#339af0"
                />
              </div>

              <Button
                type="submit"
                style={{ background: "#1ec885" }}
                onClick={() => {
                  openModalCupones();
                  closeAccionPromo();
                }}
              >
                Generar Cupon
              </Button>

              <Button
                type="submit"
                style={{ background: "#e76565" }}
                onClick={() => validDeletePromocion(rowPick._id)}
              >
                Eliminar Promocion
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        opened={mCupones}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={() => {
          closeModalCupones();
          handleCloseAction();
        }}
        size={450}
        title={"Generar Multiples Cupones de Promociones"}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOnLoading(true);
            handleGenerarCupones(rowPick.codigo, nCupon);
          }}
          className="content-generate-cupon"
        >
          {onLoading ? (
            <div className="loading-cupon">
              <LoaderSpiner />
            </div>
          ) : null}
          <div
            className="body-cupon"
            style={{ visibility: onLoading ? "hidden" : "visible" }}
          >
            <div className="cup-space">
              <div className="cupon-card">
                <div className="info-promo">
                  <div>
                    <h1>PROMOCION:</h1>
                    <h2 style={{ fontSize: "0.8em", textAlign: "justify" }}>
                      {rowPick?.descripcion}
                    </h2>
                  </div>
                  <div>
                    <img src={Pet} alt="" />
                  </div>
                </div>
                <h2
                  className="vigencia"
                  style={{ float: "right", fontSize: "0.9em" }}
                >
                  Vencimiento : {calcularFechaFutura(rowPick?.vigencia)}
                </h2>
              </div>
            </div>
            <NumberInput
              label="Cantidad de CUPONES"
              radius="md"
              value={nCupon}
              precision={0}
              step={1}
              min={1}
              max={100}
              hideControls={true}
              autoComplete="off"
              required
              onChange={(value) => {
                setNCupones(value);
              }}
            />
            <Button
              type="submit"
              className="btn-save"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              Generar Cupones
            </Button>
            <div />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Promociones;
