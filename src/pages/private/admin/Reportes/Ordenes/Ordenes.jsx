/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MonthPickerInput } from "@mantine/dates";
import "./ordenes.scss";
import { Notify } from "../../../../../utils/notify/Notify";
import moment from "moment";
import {
  handleGetInfoPago,
  handleItemsCantidad,
} from "../../../../../utils/functions";
import { useSelector } from "react-redux";

const Ordenes = ({ onClose }) => {
  const [datePrincipal, setDatePrincipal] = useState(new Date());
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);

  const openModal = () => {
    onClose();
    const month = moment.utc(datePrincipal).format("MMMM");
    modals.openConfirmModal({
      title: "Reporte de Ordenes Mensual",
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
    const mes = String(datePrincipal.getMonth() + 1).padStart(2, "0");
    const anio = datePrincipal.getFullYear();

    const nombreMes = moment(datePrincipal).format("MMMM");

    const fileName = `Reporte de ${nombreMes}, del ${anio}`;

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-reporte-mensual?mes=${mes}&anio=${anio}`
      );

      const infoOrdenesM = response.data;
      console.log(infoOrdenesM);

      if (infoOrdenesM) {
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
            "N° Orden",
            "Nombre",
            "Modalidad",
            "Items",
            "Monto Cobrado",
            "Pago",
            "Monto Facturado",
            "Celular",
            "Direccion",
            "Documento",
            "Fecha de Ingreso",
            "Fecha de Salida",
          ])
          .eachCell((cell) => {
            cell.fill = headerStyle.fill;
            cell.font = headerStyle.font;
          });

        infoOrdenesM.forEach((item) => {
          const listItems = item.Items.filter(
            (item) => item.identificador !== iDelivery._id
          );

          const itemsText = Array.from(handleItemsCantidad(listItems)).join(
            "\n"
          );
          const estadoPago = handleGetInfoPago(item.ListPago, item.totalNeto);

          worksheet.addRow([
            item.codRecibo,
            item.Nombre,
            item.Modalidad,
            itemsText,
            estadoPago.pago > 0 ? +estadoPago.pago : 0,
            estadoPago.estado,
            +item.totalNeto,
            item.celular ? item.celular : "-",
            item.direccion ? item.direccion : "-",
            item.dni,
            item.dateRecepcion.fecha,
            item.dateEntrega.fecha,
          ]);
        });

        // Agregar una fila en blanco
        worksheet.addRow([]);

        // Guardar la fila de suma de los montos pagados
        const filaTotales = worksheet.addRow([]);

        // Obtener la letra de la columna "Monto Pagado" (D en este caso)
        const colMontoPagado = String.fromCharCode(65 + 4); // 65 es el código ASCII de 'A' y sumamos 3 para obtener 'D'
        // Obtener la letra de la columna "Monto Pagado" (D en este caso)
        const colTotalNeto = String.fromCharCode(65 + 6); // 65 es el código ASCII de 'A' y sumamos 3 para obtener 'D'

        // Calcular la celda donde deseas colocar la fórmula
        const vMontoPagadoCell = `${colMontoPagado}${filaTotales.number}`;

        // Calcular la celda donde deseas colocar la fórmula
        const vTotalPagadoCell = `${colTotalNeto}${filaTotales.number}`;

        // Asignar la fórmula a la celda correspondiente utilizando la propiedad value en lugar de formula
        worksheet.getCell(vMontoPagadoCell).value = {
          formula: `"Total : "&SUM(${colMontoPagado}2:${colMontoPagado}${
            infoOrdenesM.length + 1
          })`,
        };

        // Asignar la fórmula a la celda correspondiente utilizando la propiedad value en lugar de formula
        worksheet.getCell(vTotalPagadoCell).value = {
          formula: `"Total : "&SUM(${colTotalNeto}2:${colTotalNeto}${
            infoOrdenesM.length + 1
          })`,
        };

        const itemsColumn = worksheet.getColumn(4);

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
          if (column !== itemsColumn) {
            column.eachCell({ includeEmpty: true }, (cell) => {
              const cellLength = cell.value ? cell.value.toString().length : 10;
              maxLengthColumns = Math.max(maxLengthColumns, cellLength);
            });
            column.width = maxLengthColumns + 5; // Agrega un espacio adicional
          }
        });

        const maxLineLengths = [];
        await worksheet.eachRow({ includeEmpty: true }, (row) => {
          const cell = row.getCell(4); // Obtener la celda de la columna "Products"
          const lines = cell.text.split("\n");
          let maxLength = 0;
          lines.forEach((line) => {
            const lineLength = line.length;
            maxLength = Math.max(maxLength, lineLength);
          });
          maxLineLengths.push(maxLength);
        });

        const maxLength = Math.max(...maxLineLengths);
        itemsColumn.width = maxLength + 4;

        // Aplicar autofiltro a todas las columnas y filas
        const totalRows = worksheet.rowCount;
        const totalColumns = worksheet.columnCount;

        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: totalRows, column: totalColumns },
        };

        const HeaderProducts = worksheet.getCell("D1");

        itemsColumn.alignment = {
          horizontal: "left",
          vertical: "middle",
          wrapText: true,
          indent: 1,
        };
        HeaderProducts.alignment = { horizontal: "center", vertical: "middle" };

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
    <div className="cr_monthly">
      <h1 className="title">Exportar Reporte de Ordenes Mensual</h1>
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

export default Ordenes;
