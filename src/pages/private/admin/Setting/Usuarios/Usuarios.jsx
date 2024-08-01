/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";

import { MantineReactTable } from "mantine-react-table";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { useEffect, useState } from "react";
import "./usuarios.scss";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../../../../redux/states/user";
import { socket } from "../../../../../utils/socket/connect";
import axios from "axios";
import { Notify } from "../../../../../utils/notify/Notify";
import Maintenance from "./Accion/Maintenance";

const Usuarios = () => {
  const [
    mAccionUsuario,
    { open: openAccionUsuario, close: closeAccionUsuario },
  ] = useDisclosure(false);

  const dispatch = useDispatch();
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);
  const [ListUsuarios, setListUsuarios] = useState([]);

  const [action, setAction] = useState("");
  const [rowPick, setRowPick] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 50,
      },
      {
        header: "Celular",
        accessorKey: "phone",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        // Cell: ({ cell }) => (
        //   <Textarea value={cell.getValue()} minRows={3} maxRows={5} readOnly />
        // ),
        size: 100,
      },
      {
        header: "Correo",
        accessorKey: "email",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Rol",
        accessorKey: "rol",
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        // Cell: ({ cell }) => {
        //   // const data = cell.getValue();

        //   const infoData = InfoServicios.map((service) => ({
        //     value: service._id,
        //     label: service.nombre,
        //   }));

        //   infoData.push({ label: "Todos", value: "Todos" });

        //   return (
        //     <MultiSelect value={cell.getValue()} data={infoData} readOnly />
        //   );
        // },
        size: 80,
      },
      {
        header: "Usuario",
        accessorKey: "usuario",
        size: 100,
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
      },
    ],
    []
  );

  const validDeleteUsuario = (id) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Eliminar Usuario",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de eliminar este usuario ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancelado"),
      onConfirm: async () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          const userIdDeleted = await handleDeleteUser(id);
          const newInfo = ListUsuarios.filter(
            (user) => user._id !== userIdDeleted
          );
          setListUsuarios(newInfo);
        }
      },
    });
  };

  const validEnabledAccion = (user, action) => {
    let estado;
    if (InfoUsuario.nivel === "master") {
      estado = true;
    } else {
      if (action === "update") {
        if (user.rol === "admin" && user._id === InfoUsuario._id) {
          estado = true;
        } else if (user.rol === "admin" && user._id !== InfoUsuario._id) {
          estado = false;
        } else {
          estado = true;
        }
      } else {
        if (user.rol === "admin") {
          estado = false;
        } else {
          if (InfoUsuario.rol === "admin") {
            estado = true;
          } else {
            estado = false;
          }
        }
      }
    }

    return estado;
  };

  const handleGetListUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/get-list-users`
      );

      setListUsuarios(response.data);
    } catch (error) {
      console.log(error.response.data.mensaje);
      Notify("Error", "No se pudieron obtener los datos del usuario", "fail");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/delete-user/${userId}`
      );
      if (response.status === 200) {
        socket.emit("client:onDeleteUser", response.data);
        socket.emit("client:onDeleteAccount", response.data);
        Notify("Usuario Eliminado", "", "success");
        return response.data;
      }
    } catch (error) {
      Notify("Error", "No se pudo Eliminar Usuario", "fail");
      console.log(error.response.data.mensaje);
    }
  };

  const handleCloseAction = () => {
    closeAccionUsuario();
    setTimeout(() => {
      setRowPick(null);
      setAction("");
    }, 500);
  };

  useEffect(() => {
    handleGetListUser();
  }, []);

  useEffect(() => {
    // Nuevo Usuario Agregado
    socket.on("server:onNewUser", (newUser) => {
      setListUsuarios((prevList) => [...prevList, newUser]);
    });

    // Usuario Eliminado
    socket.on("server:onDeleteUser", (userIdDeleted) => {
      setListUsuarios((prevList) => {
        const newInfo = prevList.filter((user) => user._id !== userIdDeleted);
        return newInfo;
      });

      if (InfoUsuario._id === userIdDeleted) {
        alert("Comunicado del Administrador: Su cuenta Fue Eliminada");
        dispatch(resetUser());
      }
    });

    // Usuario Actualizado
    socket.on("server:onUpdateUser", (updatedUser) => {
      setListUsuarios((prevList) => {
        const newInfo = prevList.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        return newInfo;
      });
    });

    return () => {
      // Remove the event listener when the component unmounts
      socket.off("server:onNewUser");
      socket.off("server:onDeleteUser");
      socket.off("server:onUpdateUser");
    };
  }, []);

  return (
    <div className="content-usuario">
      <div className="action-h">
        <Button
          type="button"
          onClick={() => {
            openAccionUsuario();
            setAction("Add");
          }}
        >
          Agregar Nuevo Usuario
        </Button>
      </div>
      <MantineReactTable
        columns={columns}
        data={ListUsuarios}
        initialState={{
          density: "xs",
          pagination: {},
        }}
        enableToolbarInternalActions={false}
        enableColumnActions={false}
        enableRowActions={true}
        renderRowActions={({ row }) => (
          <div className="actions-ajuste-usuario">
            {validEnabledAccion(row.original, "update") ? (
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  setAction("Edit");
                  setRowPick(row.original);
                  openAccionUsuario();
                }}
              >
                <i className="fas fa-user-edit" />
              </button>
            ) : null}

            {validEnabledAccion(row.original, "delete") ? (
              <button
                className="btn-delete"
                type="button"
                onClick={() => {
                  validDeleteUsuario(row.original._id);
                }}
              >
                <i className="fas fa-user-times" />
              </button>
            ) : null}
          </div>
        )}
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Acciones", //change header text
          },
        }}
        positionActionsColumn="last"
        enableSorting={false}
        enableTopToolbar={false}
        enableExpandAll={false}
        enablePagination={false}
        enableBottomToolbar={false}
        enableStickyHeader
        mantineTableContainerProps={{
          sx: {
            width: "100%",
            maxHeight: "400px",
          },
        }}
      />
      <Modal
        opened={mAccionUsuario}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={() => handleCloseAction()}
        size="auto"
        title={action === "" ? `USUARIO : ${rowPick?.name}` : null}
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        {action === "Add" ? (
          <Maintenance onClose={handleCloseAction} />
        ) : action === "Edit" ? (
          <Maintenance info={rowPick} onClose={handleCloseAction} />
        ) : null}
      </Modal>
    </div>
  );
};

export default Usuarios;
