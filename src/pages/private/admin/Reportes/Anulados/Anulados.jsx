/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MonthPickerInput } from "@mantine/dates";
import "./anulados.scss";

import { Notify } from "../../../../../utils/notify/Notify";
import moment from "moment";

const Anulados = ({ onClose }) => {
  const [datePrincipal, setDatePrincipal] = useState(new Date());

  const openModal = () => {
    onClose();
    const month = moment.utc(datePrincipal).format("MMMM");
    modals.openConfirmModal({
      title: "Reporte de Anulaciones Mensual",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Desea Generar Reporte de : {month.toUpperCase()} ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onConfirm: () => exportToExcel(),
    });
  };

  const exportToExcel = async () => {
    const fecha = moment(datePrincipal).format("YYYY-MM-DD");
    const anio = datePrincipal.getFullYear();

    const nombreMes = moment(datePrincipal).format("MMMM");

    const fileName = `Reporte de Anulaciones del ${nombreMes}, del ${anio}`;

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-reporte-anulados/${fecha}`
      );

      const infoAnulaosM = response.data;

      if (infoAnulaosM) {
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Datos");

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

        // Agregar la cabecera
        worksheet
          .addRow([
            "N° ",
            "N° Orden",
            "Nombre",
            "totalNeto",
            "Fecha Ingreso ",
            "Fecha Anulacion",
            "Motivo",
            "Responsable",
          ])
          .eachCell((cell) => {
            cell.fill = headerStyle.fill;
            cell.font = headerStyle.font;
          });

        infoAnulaosM.forEach((anulado, index) => {
          worksheet.addRow([
            index + 1,
            anulado.codRecibo,
            anulado.Nombre,
            +anulado.totalNeto,
            `${anulado.dateRecepcion.fecha} / ${anulado.dateRecepcion.hora}`,
            `${anulado.fechaAnulacion.fecha} / ${anulado.fechaAnulacion.hora}`,
            anulado.motivo,
            `${anulado.responsable.name} (${anulado.responsable.rol})`,
          ]);
        });

        // Agregar una fila en blanco
        worksheet.addRow([]);

        worksheet.eachRow((row) => {
          row.alignment = {
            wrapText: true,
            horizontal: "center",
            vertical: "middle",
          };
        });

        // Ajustar automáticamente el ancho de las columnas excepto "Products" basado en el contenido
        let maxLengthColumns = 0;
        await worksheet.columns.forEach((column) => {
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellLength = cell.value ? cell.value.toString().length : 10;
            maxLengthColumns = Math.max(maxLengthColumns, cellLength);
          });
          column.width = maxLengthColumns + 5; // Agrega un espacio adicional
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
      }
    } catch (error) {
      Notify("Error", "No se pudo Generar reporte EXCEL", "fail");
      console.log(error.response.data.mensaje);
    }
  };
  return (
    <div className="cr_anulados">
      <h1 className="title">Exportar Reporte de Anulaciones Mensual</h1>
      <MonthPickerInput
        style={{ position: "relative" }}
        label="Ingrese Fecha"
        placeholder="Pick date"
        value={datePrincipal}
        onChange={(date) => {
          setDatePrincipal(date);
        }}
        mx="auto"
        maw={400}
      />
      <button className="xport-xsls" onClick={openModal}>
        Exportar a Excel
      </button>
    </div>
  );
};

export default Anulados;
