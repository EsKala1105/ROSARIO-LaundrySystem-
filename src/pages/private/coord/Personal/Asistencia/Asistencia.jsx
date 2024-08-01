/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import "./asistencia.scss";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";
import Portal from "../../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./Accion/Maintenance";
import { useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes, Roles } from "../../../../../models";
import { useParams } from "react-router-dom";
import { Button, NumberInput, Text, TextInput } from "@mantine/core";
import ValidIco from "../../../../../components/ValidIco/ValidIco";
import * as Yup from "yup";
import { useFormik } from "formik";
import TimePicker from "react-time-picker";
import Digital from "../../../../../components/Clock/Digital/Digital";
import { DatePickerInput, MonthPickerInput } from "@mantine/dates";
import { useSelector } from "react-redux";
import ExcelJS from "exceljs";
import { Notify } from "../../../../../utils/notify/Notify";
import { modals } from "@mantine/modals";

const Asistencia = () => {
  const { id } = useParams();
  const [infoPersonal, setInfoPersonal] = useState();
  const [extraInfo, setExtraInfo] = useState(null);
  const [listDays, setListDays] = useState([]);
  const [datePrincipal, setDatePrincipal] = useState(new Date());

  const [onChangeHorario, setChangeHorario] = useState(false);
  const [rowPick, setRowPick] = useState();
  const [Loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);

  const navigate = useNavigate();
  const InfoUsuario = useSelector((store) => store.user.infoUsuario);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo obligatorio"),
    horaIngreso: Yup.string().required("Campo obligatorio"),
    horaSalida: Yup.string().required("Campo obligatorio"),
    pagoByHour: Yup.string().required("Campo obligatorio"),
    pagoMensual: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      horaIngreso: "",
      horaSalida: "",
      pagoByHour: 0,
      dateNacimiento: "",
      pagoMensual: 0,
      estado: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      confirmEditInfoPersonal(values);
    },
  });

  // Función para calcular diferencias de tiempo
  function calcularDiferencias(
    horaIngreso,
    horaSalida,
    hIngresoByDay,
    hSalidaByDay
  ) {
    const formatoHora = "HH:mm";

    const horaIngresoPersonal = moment(horaIngreso, formatoHora);
    const horaSalidaPersonal = moment(horaSalida, formatoHora);
    const horaIngresoRegistro = moment(hIngresoByDay, formatoHora);
    const horaSalidaRegistro = moment(hSalidaByDay, formatoHora);

    // Calcular retraso en ingreso
    let retrasoIngreso = 0;
    if (horaIngresoRegistro.isAfter(horaIngresoPersonal)) {
      retrasoIngreso = horaIngresoRegistro.diff(horaIngresoPersonal, "minutes");
    }

    // Calcular tiempo extra en ingreso (si llega antes)
    let tiempoExtraIngreso = 0;
    if (horaIngresoRegistro.isBefore(horaIngresoPersonal)) {
      tiempoExtraIngreso = horaIngresoPersonal.diff(
        horaIngresoRegistro,
        "minutes"
      );
    }

    // Calcular tiempo extra en salida
    let tiempoExtraSalida = 0;
    if (horaSalidaRegistro.isAfter(horaSalidaPersonal)) {
      tiempoExtraSalida = horaSalidaRegistro.diff(
        horaSalidaPersonal,
        "minutes"
      );
    }

    // Calcular tiempo de salida antes de la hora establecida
    let tiempoAntesSalida = 0;
    if (horaSalidaRegistro.isBefore(horaSalidaPersonal)) {
      tiempoAntesSalida = horaSalidaPersonal.diff(
        horaSalidaRegistro,
        "minutes"
      );
    }

    return {
      retrasoIngreso,
      tiempoExtraIngreso,
      tiempoExtraSalida,
      tiempoAntesSalida,
    };
  }

  const generateListDay = (info) => {
    const fechaActual = moment();
    const primerDiaDelMes = moment(datePrincipal).startOf("month");
    let finalDiaDelMes;

    // Si estamos en el mes actual, finalDiaDelMes será el día actual
    if (moment().isSame(datePrincipal, "month")) {
      finalDiaDelMes = fechaActual.date();
    } else {
      // Si estamos en un mes anterior al actual, obtenemos el último día del mes anterior
      finalDiaDelMes = moment(datePrincipal).endOf("month").date();
    }

    return Array.from({ length: finalDiaDelMes }, (_, index) => {
      const fecha = moment(primerDiaDelMes)
        .add(index, "days")
        .format("YYYY-MM-DD");
      const infoAsistenciaByDay = info.find((item) => item.fecha === fecha);

      if (infoAsistenciaByDay) {
        return {
          ...infoAsistenciaByDay,
          estado: "update",
        };
      } else {
        return {
          _id: "",
          fecha,
          tipoRegistro: "",
          ingreso: {
            hora: "",
            saved: false,
          },
          salida: {
            hora: "",
            saved: false,
          },
          observacion: "",
          dateNacimiento: "",
          estado: "new",
        };
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Fecha",
        accessorKey: "fecha",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Hora Ingreso",
        accessorKey: "ingreso.hora",
        size: 70,
        mantineTableBodyCellProps: {
          align: "center",
        },
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Hora Salida",
        accessorKey: "salida.hora",
        size: 70,
        mantineTableBodyCellProps: {
          align: "center",
        },
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Observacion",
        accessorKey: "observacion",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        mantineTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <i
              onClick={() => {
                alert(cell.getValue());
              }}
              className="fa-solid fa-eye"
            ></i>
          ) : (
            "-"
          ),
      },
    ],
    []
  );

  const confirmEditInfoPersonal = (data) => {
    let confirmationEnabled = true;

    modals.openConfirmModal({
      title: "Actualizar Informacion de Personal",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de Actualizar este Personal ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        if (confirmationEnabled) {
          confirmationEnabled = false;
          handleUpdateInfoPersonal(data, id);
        }
      },
    });
  };

  const hangleGetInfoAsistencia = async () => {
    try {
      const dateP = moment(datePrincipal).format("YYYY-MM-DD");
      // Llamar a la API con la fecha formateada
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-list-asistencia/${dateP}/${id}`
      );
      setInfoPersonal(response.data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
    }
  };

  const handleAddAsistencia = async (data) => {
    try {
      let response;
      if (data.estado === "new") {
        response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/lava-ya/registrar-asistencia`,
          { idPersonal: id, ...data }
        );
      } else {
        response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/lava-ya/actualizar-asistencia/${data.id}`,
          data
        );
      }

      // Actualizar infoPersonal si existe infoPersonalUpdated en response.data
      let updatedInfoPersonal = { ...infoPersonal };
      if ("infoPersonalUpdated" in response.data) {
        const { infoPersonalUpdated } = response.data;
        const { birthDayUsed } = infoPersonalUpdated;
        updatedInfoPersonal.birthDayUsed = birthDayUsed;
      }

      // Actualizar listAsistencia
      let newListAsistencia = [...updatedInfoPersonal.listAsistencia];
      const { newInfoDay } = response.data;
      const existingDayIndex = newListAsistencia.findIndex(
        (day) => day.fecha === newInfoDay.fecha
      );

      if (existingDayIndex !== -1) {
        // Si se encontró un día con la misma fecha, remplazarlo
        newListAsistencia[existingDayIndex] = newInfoDay;
      } else {
        // Si no se encontró un día con la misma fecha, agregar newInfoDay
        newListAsistencia.push(newInfoDay);
      }
      updatedInfoPersonal.listAsistencia = newListAsistencia;

      // Actualizar infoPersonal
      setInfoPersonal(updatedInfoPersonal);

      Notify("Registro Exitoso", "", "success");
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  const handleUpdateInfoPersonal = async (data, id) => {
    try {
      // Llamar a la API con la fecha formateada
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/actualizar-personal/${id}`,
        data
      );
      const { name, horaIngreso, horaSalida, pagoByHour, dateNacimiento } =
        response.data;

      setInfoPersonal({
        ...infoPersonal,
        name,
        horaIngreso,
        horaSalida,
        pagoByHour,
        dateNacimiento,
      });
      Notify("Actualizacion Exitoso", "", "success");
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  const exportToExcel = async () => {
    const fileName = `Reporte de Asistencia - ${infoPersonal.names}`;

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Establecer el valor de pago por hora por defecto
    const defaultPaymentPerHour = formik.values.pagoByHour;
    const defaultMonthlyPayment = formik.values.pagoMensual;

    // Estilos para el encabezado
    const headerStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "333333" }, // Color de fondo para la cabecera (gris oscuro)
      },
      font: {
        color: { argb: "FFFFFF" }, // Color del texto en la cabecera (blanco)
        bold: true, // Texto en negrita
      },
    };

    const styleGreen = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9EAD3" }, // Color de fondo para la fila (verde claro)
      },
    };

    const styleRed = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ef8c8c" }, // Color de fondo para la fila (verde claro)
      },
    };

    const styleBlue = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "c0daf5" }, // Color de fondo para la fila (verde claro)
      },
    };

    const styleYellow = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f5f392" }, // Color de fondo para la fila (verde claro)
      },
    };

    // Agregar la cabecera
    worksheet
      .addRow([
        "Fecha",
        "Registro",
        `Hora Ingreso`,
        "Hora Salida",
        "Tiempo Extra (INGRESO)",
        "Tiempo Extra (SALIDA)",
        "Tiempo Tardanza",
        "Tiempo Salida (ANTES)",
        "Monto",
        "Total",
        "Observacion",
      ])
      .eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
      });

    worksheet.getColumn(1).width = 15; // Ajustar ancho para "Fecha"
    worksheet.getColumn(2).width = 20; // Ajustar ancho para "Registro"
    worksheet.getColumn(3).width = 17; // Ajustar ancho para "Hora Ingreso"
    worksheet.getColumn(4).width = 17; // Ajustar ancho para "Hora Salida"
    worksheet.getColumn(5).width = 17; // Ajustar ancho para "Tiempo Extra (INGRESO)"
    worksheet.getColumn(6).width = 15; // Ajustar ancho para "Tiempo Extra (SALIDA)"
    worksheet.getColumn(7).width = 15; // Ajustar ancho para "Tiempo Tardanza"
    worksheet.getColumn(8).width = 15; // Ajustar ancho para "Tiempo Salida (ANTES)"
    worksheet.getColumn(9).width = 17; // Ajustar ancho para "Estado"
    worksheet.getColumn(10).width = 13; // Ajustar ancho para "Total"
    worksheet.getColumn(11).width = 20; // Ajustar ancho para "Observacion"

    const infoDays = listDays.map((item) => {
      let Times = {
        retrasoIngreso: 0,
        tiempoExtraIngreso: 0,
        tiempoExtraSalida: 0,
        tiempoAntesSalida: 0,
      };

      if (item.ingreso.saved && item.salida.saved) {
        const { horaIngreso, horaSalida } = infoPersonal;
        const { ingreso: timeIngreso, salida: timeSalida } = item;

        const hIngresoByDay = timeIngreso.hora;
        const hSalidaByDay = timeSalida.hora;

        Times = calcularDiferencias(
          horaIngreso,
          horaSalida,
          hIngresoByDay,
          hSalidaByDay
        );
      }

      return {
        ...item,
        Times,
      };
    });

    infoDays.forEach((item, index) => {
      const rowIndex = index + 2;

      worksheet.addRow([
        item.fecha,
        item.tipoRegistro,
        item.ingreso.hora,
        item.salida.hora,
        item.Times.tiempoExtraIngreso > 0 ? item.Times.tiempoExtraIngreso : "",
        item.Times.tiempoExtraSalida > 0 ? item.Times.tiempoExtraSalida : "",
        item.Times.retrasoIngreso > 0 ? item.Times.retrasoIngreso : "",
        item.Times.tiempoAntesSalida > 0 ? item.Times.tiempoAntesSalida : "",
        {
          formula: `IF(SUM(IF(E${rowIndex}="", 0, E${rowIndex}), IF(F${rowIndex}="", 0, F${rowIndex}), -IF(G${rowIndex}="", 0, G${rowIndex}), -IF(H${rowIndex}="", 0, H${rowIndex})) > 0, "Extra", IF(SUM(IF(E${rowIndex}="", 0, E${rowIndex}), IF(F${rowIndex}="", 0, F${rowIndex}), -IF(G${rowIndex}="", 0, G${rowIndex}), -IF(H${rowIndex}="", 0, H${rowIndex})) < 0, "Penalidad", "Normal"))`,
        },
        {
          formula: `ABS(SUM(IF(E${rowIndex}="", 0, E${rowIndex}), IF(F${rowIndex}="", 0, F${rowIndex}), -IF(G${rowIndex}="", 0, G${rowIndex}), -IF(H${rowIndex}="", 0, H${rowIndex})))`,
        },
        item.Times.observacion,
      ]);
    });

    let TotalExtras = 0;
    let TotalPenalidad = 0;

    worksheet.eachRow((row) => {
      const cellValue = row.getCell("I").value; // Asumiendo que 'I' es la columna que quieres recorrer
      const amount = row.getCell("J").value; // Asumiendo que 'J' es la columna de los valores

      if (cellValue === "Extra") {
        TotalExtras += amount;
      } else if (cellValue === "Penalidad") {
        TotalPenalidad += amount;
      }
    });

    // Agregar fila de separación
    worksheet.addRow([]);

    // ->>>>>>>> TABLE DE TOTALES

    // Agregar la fila "Tiempo Extra"
    const TiempoExtra = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total de Tiempo (EXTRA)",
      0,
    ]);

    TiempoExtra.height = 40;

    // FILA q recorre cada COLUMNA para darle estilo
    TiempoExtra.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleGreen.fill;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
    });

    // Definir el contenido de la Celda Especifica
    // Columna : "J"
    // Fila    : "worksheet.rowCount"
    // worksheet.rowCount = Numero de filas hasta la posicion actual
    const TiempoExtraCell = worksheet.getCell(`J${worksheet.rowCount}`);

    // Asignarle Formula para SUMAR un rango de celdas
    TiempoExtraCell.value = {
      // formula: `SUMA(J2:J${worksheet.rowCount - 1})`,
      formula: `SUMIF(I2:I${worksheet.rowCount - 2}, "Extra", J2:J${
        worksheet.rowCount - 2
      })`,
    };

    // Agregar la fila "Tiempo Penalizado"
    const TiempoPenalizado = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total de Tiempo (PENALIDAD)",
      +defaultPaymentPerHour,
    ]);

    // Agregar fila de separación
    worksheet.addRow([]);

    TiempoPenalizado.height = 40;
    TiempoPenalizado.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleRed.fill;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
    });

    const TiempoPenalizadoCell = worksheet.getCell(
      `J${worksheet.rowCount - 1}`
    );

    // Asignarle Formula para SUMAR un rango de celdas
    TiempoPenalizadoCell.value = {
      formula: `SUMIF(I2:I${worksheet.rowCount - 4}, "Penalidad", J2:J${
        worksheet.rowCount - 4
      })`,
    };

    // Agregar fila "Monto x Hora Extra"
    const montoByHoraExtraRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Monto x Hora (Extra)",
      defaultPaymentPerHour,
    ]);
    montoByHoraExtraRow.height = 40;

    montoByHoraExtraRow.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
    });

    // Agregar fila "Monto x Hora Penalidad"
    const montoByHoraPenalidadRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Monto x Hora (Penalidad)",
      defaultPaymentPerHour,
    ]);
    montoByHoraPenalidadRow.height = 40;

    montoByHoraPenalidadRow.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
        };
      }
    });

    // Agregar fila "Pago Mensual"
    const pagoMensual = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Pago Mensual",
      defaultMonthlyPayment,
    ]);
    pagoMensual.height = 35;

    pagoMensual.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleBlue.fill;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }
    });

    // Agregar fila "Pago x Extra"
    const pagoByExtra = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Pago x Extra",
      0,
    ]);
    pagoByExtra.height = 35;

    pagoByExtra.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleGreen.fill;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
        };
      }
    });

    const PagoExtraCell = worksheet.getCell(`J${worksheet.rowCount}`);
    PagoExtraCell.value = {
      formula: `ROUND(IF(J${worksheet.rowCount - 6} / 60 >= 1.5, CEILING((J${
        worksheet.rowCount - 6
      } / 60) * J${worksheet.rowCount - 3}, 0.1), FLOOR((J${
        worksheet.rowCount - 6
      } / 60) * J${worksheet.rowCount - 3}, 0.1)), 1)`,
    };

    // Agregar fila "Pago x Penalidad"
    const pagoByPenalidad = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Pago x Penalidad",
      0,
    ]);
    pagoByPenalidad.height = 35;

    pagoByPenalidad.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleRed.fill;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.border = {
          right: { style: "thin" },
          top: { style: "thin" },
        };
      }
    });

    const PagoPenalidadCell = worksheet.getCell(`J${worksheet.rowCount}`);
    PagoPenalidadCell.value = {
      formula: `ROUND(IF(J${worksheet.rowCount - 6} / 60 >= 1.5, CEILING((J${
        worksheet.rowCount - 6
      } / 60) * J${worksheet.rowCount - 3}, 0.1), FLOOR((J${
        worksheet.rowCount - 6
      } / 60) * J${worksheet.rowCount - 3}, 0.1)), 1)`,
    };

    // Agregar fila "Pago Final"
    const pagoFinal = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Pago Final",
      0,
    ]);
    pagoFinal.height = 35;

    pagoFinal.eachCell((cell, colNumber) => {
      if (colNumber === 9) {
        cell.fill = styleYellow.fill;
        cell.border = {
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
          top: { style: "thin" },
        };
      }
      if (colNumber === 10) {
        cell.fill = styleYellow.fill;
        cell.border = {
          bottom: { style: "thin" },
          right: { style: "thin" },
          top: { style: "thin" },
        };
      }
    });

    const PagoFinalCell = worksheet.getCell(`J${worksheet.rowCount}`);
    PagoFinalCell.value = {
      formula: `J${worksheet.rowCount - 3} + (J${worksheet.rowCount - 2} - J${
        worksheet.rowCount - 1
      })`,
    };

    // Aplicar estilos y formato
    worksheet.eachRow((row) => {
      row.alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };
    });

    // Aplicar autofiltro a todas las columnas y filas
    const totalRows = worksheet.rowCount;
    const totalColumns = worksheet.columnCount;

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: totalRows, column: totalColumns },
    };

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".xlsx";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleCloseAction = () => {
    setRowPick();
    setChangeHorario(false);
  };

  useEffect(() => {
    hangleGetInfoAsistencia();
  }, [datePrincipal]);

  useEffect(() => {
    if (infoPersonal) {
      const conteo = infoPersonal?.listAsistencia.reduce(
        (conteo, asistencia) => {
          if (asistencia.tipoRegistro === "normal" && asistencia.observacion) {
            conteo.observaciones++;
          } else if (asistencia.tipoRegistro === "falta") {
            conteo.faltas++;
          } else if (asistencia.tipoRegistro === "feriado") {
            conteo.feriados++;
          }
          return conteo;
        },
        { observaciones: 0, faltas: 0, feriados: 0 }
      );
      // Obtener el año de la fecha proporcionada
      const momentFecha = moment(datePrincipal, "YYYY-MM-DD");
      const yearFecha = momentFecha.year();
      const BDUsado = infoPersonal?.birthDayUsed.some((birthday) => {
        return moment(birthday).year() === yearFecha;
      });
      setExtraInfo({
        BDUsado,
        ...conteo,
      });
      const ListDaysAsistidos = generateListDay(infoPersonal?.listAsistencia);

      setListDays(ListDaysAsistidos);
      formik.setFieldValue("name", infoPersonal.name);
      formik.setFieldValue("horaIngreso", infoPersonal.horaIngreso);
      formik.setFieldValue("horaSalida", infoPersonal.horaSalida);
      formik.setFieldValue("pagoByHour", infoPersonal.pagoByHour);
      formik.setFieldValue("dateNacimiento", infoPersonal.dateNacimiento);
      formik.setFieldValue("pagoMensual", infoPersonal.pagoMensual);
    }
  }, [infoPersonal, datePrincipal]);

  useEffect(() => {
    if (rowPick) {
      setChangeHorario(true);
    }
  }, [rowPick]);

  const handleExport = () => {
    if (!download) {
      setDownload(true);
      setTimeout(() => {
        setDownload(false);
        exportToExcel();
      }, 2400);
    }
  };

  return (
    <div className="content-asistencias">
      <div className="head-i">
        <div className="left-ih">
          <h1>Asistencia</h1>
          <div className="blocks-ih">
            <div className="block">
              <span className="title-b">CUMPLEAÑOS</span>
              <div className="info-b">
                {extraInfo?.BDUsado ? "USADO" : "SIN USAR"}
              </div>
            </div>
            <div className="block">
              <span className="title-b">FALTAS</span>
              <div className="info-b">{extraInfo?.faltas}</div>
            </div>
            <div className="block">
              <span className="title-b">FERIADOS</span>
              <div className="info-b">{extraInfo?.feriados}</div>
            </div>
            <div className="block">
              <span className="title-b">OBSERVACIONES</span>
              <div className="info-b">{extraInfo?.observaciones}</div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.PERSONAL}`);
          }}
          color="teal"
        >
          Retroceder
        </Button>
      </div>
      <hr />
      {Loading ? (
        <LoaderSpiner />
      ) : (
        <div className="personal-info">
          <div className="info-form">
            <Digital />
            <hr />
            <form onSubmit={formik.handleSubmit} className="i-box">
              <div className="input-item">
                <TextInput
                  name="name"
                  label="Nombre de Personal :"
                  value={formik.values.name}
                  placeholder="Ingrese numero"
                  autoComplete="off"
                  disabled={InfoUsuario.rol !== Roles.ADMIN ? true : false}
                  onChange={formik.handleChange}
                />
                {formik.errors.name &&
                  formik.touched.name &&
                  ValidIco(formik.errors.name)}
              </div>
              <div className="time-asis">
                <div className="input-item">
                  <div className="input-date">
                    <label htmlFor="">Hora Ingreso :</label>
                    <TimePicker
                      className="hour-date"
                      onChange={(newTime) => {
                        const timeMoment = moment(newTime, "HH:mm");
                        const timeString = timeMoment.format("HH:mm");
                        formik.setFieldValue("horaIngreso", timeString);
                      }}
                      value={
                        moment(formik.values.horaIngreso, "HH:mm").isValid()
                          ? moment(formik.values.horaIngreso, "HH:mm").toDate()
                          : null
                      }
                      disabled={InfoUsuario.rol !== Roles.ADMIN ? true : false}
                      amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
                      clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
                      clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
                      disableClock={true}
                      format="h:mm a"
                    />
                  </div>
                  {formik.errors.horaIngreso &&
                    formik.touched.horaIngreso &&
                    ValidIco({
                      mensaje: formik.errors.horaIngreso,
                    })}
                </div>
                <div className="input-item">
                  <div className="input-date">
                    <label htmlFor="">Hora Salida :</label>
                    <TimePicker
                      className="hour-date"
                      onChange={(newTime) => {
                        const timeMoment = moment(newTime, "HH:mm");
                        const timeString = timeMoment.format("HH:mm");
                        formik.setFieldValue("horaSalida", timeString);
                      }}
                      value={
                        moment(formik.values.horaSalida, "HH:mm").isValid()
                          ? moment(formik.values.horaSalida, "HH:mm").toDate()
                          : null
                      }
                      disabled={InfoUsuario.rol !== Roles.ADMIN ? true : false}
                      amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
                      clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
                      clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
                      disableClock={true}
                      format="h:mm a"
                    />
                  </div>
                  {formik.errors.horaSalida &&
                    formik.touched.horaSalida &&
                    ValidIco({
                      mensaje: formik.errors.horaSalida,
                    })}
                </div>
              </div>
              <div className="input-item">
                <DatePickerInput
                  name="dateNacimiento"
                  dropdownType="modal"
                  label="Fecha de Nacimiento"
                  placeholder="Fecha de Nacimiento"
                  disabled={InfoUsuario.rol !== Roles.ADMIN ? true : false}
                  value={
                    moment(formik.values.dateNacimiento, "YYYY-MM-DD").isValid()
                      ? moment(
                          formik.values.dateNacimiento,
                          "YYYY-MM-DD"
                        ).toDate()
                      : null
                  }
                  onChange={(date) => {
                    formik.setFieldValue(
                      "dateNacimiento",
                      moment(date).format("YYYY-MM-DD")
                    );
                  }}
                />
                {formik.errors.name &&
                  formik.touched.name &&
                  ValidIco(formik.errors.name)}
              </div>
              {InfoUsuario.rol === Roles.ADMIN ? (
                <>
                  <div className="input-item">
                    <NumberInput
                      name="pagoByHour"
                      label="Pago x Hora : ( Extra / Descuento )"
                      value={formik.values.pagoByHour}
                      precision={2}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "pagoByHour",
                          !Number.isNaN(e) ? e : 0
                        );
                      }}
                      min={0}
                      step={0.5}
                      hideControls
                      autoComplete="off"
                    />
                    {formik.errors.horaSalida &&
                      formik.touched.horaSalida &&
                      ValidIco({
                        mensaje: formik.errors.horaSalida,
                      })}
                  </div>
                  <div className="input-item">
                    <NumberInput
                      name="pagoMensual"
                      label="Pago Mensual :"
                      value={formik.values.pagoMensual}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "pagoMensual",
                          !Number.isNaN(e) ? e : 0
                        );
                      }}
                      min={0}
                      step={1}
                      hideControls
                      autoComplete="off"
                    />
                    {formik.errors.pagoMensual &&
                      formik.touched.pagoMensual &&
                      ValidIco({
                        mensaje: formik.errors.pagoMensual,
                      })}
                  </div>

                  <Button type="submit" className="btn-save" color="blue">
                    Guardar
                  </Button>
                </>
              ) : null}
            </form>
          </div>
          <div className="list-personal">
            <div className="head-list">
              <MonthPickerInput
                style={{ position: "relative", margin: "auto 0" }}
                label="Ingrese Fecha"
                placeholder="Pick date"
                maxDate={new Date()}
                value={datePrincipal}
                onChange={(date) => {
                  setDatePrincipal(date);
                }}
                maw={400}
              />
              {InfoUsuario.rol === Roles.ADMIN ? (
                <button
                  className={`button_wrapper ${download ? "loading" : ""}`}
                  onClick={handleExport}
                >
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.75"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                      />
                    </svg>
                  </div>
                </button>
              ) : null}
            </div>
            <MantineReactTable
              columns={columns}
              data={listDays}
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
                  maxHeight: "340px",
                },
              }}
              mantineTableBodyRowProps={({ row }) => ({
                onDoubleClick: () => {
                  const {
                    horaIngreso,
                    horaSalida,
                    dateNacimiento,
                    birthDayUsed,
                    id,
                  } = infoPersonal;
                  setRowPick({
                    infoPersonal: {
                      horaIngreso,
                      horaSalida,
                      dateNacimiento,
                      birthDayUsed,
                      id,
                    },
                    infoDay: row.original,
                  });
                },
              })}
            />
          </div>
        </div>
      )}
      {onChangeHorario && (
        <Portal
          onClose={() => {
            setChangeHorario(false);
          }}
        >
          <Maintenance
            onClose={handleCloseAction}
            info={rowPick}
            onAddAsistencia={handleAddAsistencia}
          />
        </Portal>
      )}
    </div>
  );
};

export default Asistencia;
