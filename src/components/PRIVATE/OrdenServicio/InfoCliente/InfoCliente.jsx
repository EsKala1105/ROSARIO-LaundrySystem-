/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Autocomplete, Button, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React from "react";
import { documento } from "../../../../services/global";
import "./infoCliente.scss";
import { ScrollArea } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useEffect } from "react";
import ValidIco from "../../../ValidIco/ValidIco";
import { useDispatch, useSelector } from "react-redux";
import ActionCliente from "../../../../pages/private/admin/Clientes/ActionCliente/ActionCliente";
import { updateCliente } from "../../../../redux/actions/aClientes";

const InfoCliente = ({
  mode,
  paso,
  descripcion,
  changeValue,
  values,
  changeICliente,
  iCliente,
  error,
  touched,
}) => {
  const [infoClientes, setInfoClientes] = useState([]);
  const listClientes = useSelector((state) => state.clientes.listClientes);
  const [filterBy, setFilterBy] = useState("nombre");
  const [searchedValue, setSearchedValue] = useState("");
  // const [useSavedClients, setUseSavedClients] = useState(false);

  const [
    mUpdateCliente,
    { open: openModalUpdateCliente, close: closeModalUpdateCliente },
  ] = useDisclosure(false);

  const dispatch = useDispatch();

  const handleGetClientes = async (value) => {
    const regex = new RegExp(value, "i"); // 'i' para que sea insensible a mayúsculas/minúsculas
    const resultados = listClientes.filter((cliente) =>
      regex.test(cliente[filterBy])
    );
    setInfoClientes(resultados);
  };

  const handleUpdateCliente = async (datosCliente) => {
    dispatch(updateCliente({ id: iCliente._id, datosCliente }));
    closeModalUpdateCliente();
  };

  useEffect(() => {
    if (iCliente) {
      const infoChange = listClientes.find((cli) => cli._id === iCliente._id);
      if (infoChange) {
        changeICliente(infoChange);
        changeValue("dni", infoChange.dni);
        changeValue("name", infoChange.nombre);
        changeValue("celular", infoChange.phone);
        changeValue("direccion", infoChange.direccion);
      } else {
        setSearchedValue();
        changeICliente();
        changeValue("dni", "");
        changeValue("name", "");
        changeValue("celular", "");
        changeValue("direccion", "");
      }
    }
  }, [listClientes]);

  return (
    <div className="info-cliente">
      <div className="title">
        <h1>PASO {paso}</h1>
        <h2>{descripcion}</h2>
      </div>
      <div className="body">
        <DateInput
          className="input-info"
          label={`${
            mode === "PRELIMINARY" ? "Fecha de Registro" : "Fecha de Ingreso"
          }`}
          name="dateIngreso"
          value={values.dateIngreso}
          onChange={(date) => {
            changeValue("dateIngreso", date);
          }}
          style={{ paddingBottom: "8px" }}
          readOnly
        />
        {mode !== "UPDATE" ? (
          <>
            <hr />
            <div className="tipo-registro-cli">
              <Select
                style={{ width: "135px" }}
                label="Buscar por :"
                value={filterBy}
                onChange={(value) => {
                  changeICliente(null);
                  setFilterBy(value);
                  changeValue("dni", "");
                  changeValue("name", "");
                  changeValue("celular", "");
                  changeValue("direccion", "");
                  setSearchedValue("");
                }}
                data={[
                  { value: "nombre", label: "Nombre" },
                  { value: "dni", label: documento },
                  { value: "phone", label: "Teléfono" },
                ]}
              />
              <Autocomplete
                label=" "
                autoComplete="off"
                onChange={(value) => {
                  setSearchedValue(value);
                  handleGetClientes(value);
                  changeICliente(null);
                }}
                value={searchedValue}
                onItemSubmit={(selected) => {
                  const cliente = infoClientes.find(
                    (obj) => obj[filterBy] === selected.value
                  );
                  changeICliente(cliente);
                  changeValue("dni", cliente?.dni || "");
                  changeValue("name", cliente?.nombre || "");
                  changeValue("celular", cliente?.phone || "");
                  changeValue("direccion", cliente?.direccion || "");
                  setSearchedValue("");
                }}
                data={
                  searchedValue
                    ? infoClientes
                        .filter((obj) => obj[filterBy]) // Se asegura de que haya un valor en el campo filterBy
                        .map((obj) => obj[filterBy])
                    : []
                }
              />
              {iCliente ? (
                <Button
                  className="btn-update-info-user"
                  color="orange"
                  type="button"
                  onClick={() => {
                    openModalUpdateCliente();
                  }}
                >
                  <i className="fa-solid fa-user-pen" />
                </Button>
              ) : null}

              <Button
                className="btn-cancel-filter"
                type="button"
                onClick={() => {
                  changeICliente(null);
                  setFilterBy("nombre");
                  changeValue("dni", "");
                  changeValue("name", "");
                  changeValue("celular", "");
                  changeValue("direccion", "");
                  setSearchedValue("");
                }}
              >
                X
              </Button>
            </div>
          </>
        ) : null}

        <hr />
        <div className="input-info-required">
          <TextInput
            name="name"
            label="Nombres :"
            autoComplete="off"
            onChange={(e) => {
              const valor = e.target.value;
              changeValue("name", valor);
            }}
            value={values.name}
            readOnly={iCliente}
            disabled={mode === "UPDATE"}
          />
          {error.name && touched.name && ValidIco({ mensaje: error.name })}
        </div>
        <TextInput
          name="direccion"
          className="input-info"
          label="Direccion :"
          autoComplete="off"
          onChange={(e) => {
            const valor = e.target.value;
            changeValue("direccion", valor);
          }}
          value={values.direccion}
          readOnly={iCliente}
          disabled={mode === "UPDATE"}
        />
        <TextInput
          name="celular"
          className="input-info"
          label="Celular :"
          autoComplete="off"
          onChange={(e) => {
            const valor = e.target.value;
            changeValue("celular", valor);
          }}
          value={values.celular}
          readOnly={iCliente}
          disabled={mode === "UPDATE"}
        />
        <TextInput
          name="dni"
          className="input-info"
          label={`${documento} :`}
          autoComplete="off"
          onChange={(e) => {
            const valor = e.target.value;
            changeValue("dni", valor);
          }}
          value={values.dni}
          readOnly={iCliente}
          disabled={mode === "UPDATE"}
        />
      </div>
      <Modal
        opened={mUpdateCliente}
        onClose={() => {
          closeModalUpdateCliente();
        }}
        size="auto"
        scrollAreaComponent={ScrollArea.Autosize}
        title="¿ Actualizar Informacion de Cliente ?"
        centered
      >
        <ActionCliente info={iCliente} onAction={handleUpdateCliente} />
      </Modal>
    </div>
  );
};

export default InfoCliente;
