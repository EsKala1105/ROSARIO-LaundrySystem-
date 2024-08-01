/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import ExcelJS from "exceljs";
import "./items.scss";
import SwitchModel from "../../../../../components/SwitchModel/SwitchModel";
import { MonthPickerInput } from "@mantine/dates";
import moment from "moment";
import { Roles } from "../../../../../models";
import { useSelector } from "react-redux";
import { formatThousandsSeparator } from "../../../../../utils/functions";
import BotonExport from "../../../../../components/PRIVATE/BotonExport/BotonExport";

const Items = () => {
  const [data, setData] = useState([]);
  const [valorizarX, setValorizarX] = useState("cantidad");
  const [tipoFiltro, setTipoFiltro] = useState("servicios");
  const [infoProductos, setInfoProductos] = useState([]);
  const [infoServicios, setInfoServicios] = useState([]);

  const [datePrincipal, setDatePrincipal] = useState(new Date());

  const InfoUsuario = useSelector((store) => store.user.infoUsuario);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fechaConsulta = moment(datePrincipal).format("YYYY-MM-DD");
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/lava-ya/get-informacion/${fechaConsulta}`
        );
        const data = response.data;
        data.forEach((dato) => {
          dato.montoGenerado = Number(dato.montoGenerado.toFixed(2));
          dato.cantidad = Number(dato.cantidad.toFixed(2));
        });

        const iProd = data.filter((item) => item.tipo === "productos");
        const iServ = data.filter((item) => item.tipo === "servicios");

        setInfoProductos(iProd);
        setInfoServicios(iServ);
        setTipoFiltro("servicios");
        setData(iServ);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [datePrincipal]);

  const minPrendas = 10;

  // Ordenar los datos de acuerdo al atributo especificado en valorizarX
  const sortedData = data.sort((a, b) => b[valorizarX] - a[valorizarX]);

  // Tomar solo los primeros 10 elementos después de ordenar
  const trimmedData =
    sortedData.length > minPrendas
      ? sortedData.slice(0, minPrendas)
      : sortedData;

  const newdata = trimmedData.sort((a, b) => a[valorizarX] - b[valorizarX]);

  // Primero ordenamos los datos de acuerdo al atributo especificado en valorizarX
  const ascendingData = data.sort((a, b) => a[valorizarX] - b[valorizarX]);

  // Luego tomamos solo los primeros 10 elementos después de ordenar
  const bottomData = ascendingData.slice(0, minPrendas).reverse();

  const exportToExcel = async () => {
    const fileName = `Reporte de ${
      tipoFiltro === "productos" ? "Productos" : "Servicios"
    }`;

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
        "Categoria",
        `${tipoFiltro === "productos" ? "Producto" : "Servicio"}`,
        "Cantidad",
        "Monto Generado",
      ])
      .eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
      });
    data.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.categoria.name,
        item.nombre,
        // `${item.cantidad} ${item.simboloMedida} `,
        // `${simboloMoneda} ${item.montoGenerado}`,
        +item.cantidad,
        +item.montoGenerado,
      ]);
    });

    worksheet.eachRow((row) => {
      row.alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };
    });

    let maxLengthColumns = 0;
    await worksheet.columns.forEach((column) => {
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        maxLengthColumns = Math.max(maxLengthColumns, cellLength);
      });
      column.width = maxLengthColumns + 2; // Agrega un espacio adicional
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

  return (
    <div className="container-productos">
      <div className="header-p">
        {InfoUsuario.rol === Roles.ADMIN ? (
          <SwitchModel
            title="Valorizar por :"
            onSwitch="Cantidad" // TRUE
            offSwitch="Monto" // FALSE
            name="valorizacion"
            defaultValue={valorizarX === "cantidad" ? true : false}
            onChange={(value) => {
              if (value === true) {
                setValorizarX("cantidad");
              } else {
                setValorizarX("montoGenerado");
              }
            }}
          />
        ) : (
          <div style={{ width: "200px" }} />
        )}
        <div>
          <h1>
            Reporte de {tipoFiltro === "productos" ? "Productos" : "Servicios"}
          </h1>
          <MonthPickerInput
            style={{ position: "relative", width: "100%", textAlign: "center" }}
            label="Seleccion de Fecha"
            placeholder="Pick date"
            value={datePrincipal}
            onChange={(date) => {
              setDatePrincipal(date);
            }}
            mx="auto"
            maw={400}
          />
        </div>
        <div style={{ width: "200px" }}></div>
        {/* <SwitchModel
          title="Tipo :"
          onSwitch="Producto" // TRUE
          offSwitch="Servicio" // FALSE
          name="tipoPromocion"
          defaultValue={tipoFiltro === "productos" ? true : false}
          onChange={(value) => {
            if (value === true) {
              setData(infoProductos);
              setTipoFiltro("productos");
            } else {
              setData(infoServicios);
              setTipoFiltro("servicios");
            }
          }}
        /> */}
      </div>
      <div className="body-p">
        <div className="graf-prod">
          <h1>
            {tipoFiltro === "productos" ? "Productos" : "Servicios"} Mas
            Rentables
          </h1>
          <ResponsiveBar
            data={newdata} // Usar los datos ajustados
            keys={[
              `${
                valorizarX === "montoGenerado" ? "montoGenerado" : "cantidad"
              }`,
            ]}
            indexBy="nombre"
            layout="horizontal"
            margin={{ top: 10, right: 40, bottom: 60, left: 120 }}
            padding={0.3}
            groupMode="grouped"
            colors="#8DD3C7"
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            label={(d) => {
              return d.value === 0 ? (
                <tspan x="15">{d.value}</tspan>
              ) : (
                <tspan x="50">
                  {valorizarX === "montoGenerado"
                    ? `${formatThousandsSeparator(d.value, true)}`
                    : `${formatThousandsSeparator(d.value)} ${
                        d.data.simboloMedida
                      } `}
                </tspan>
              );
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: -40,
            }}
            axisBottom={{
              tickValues: 3,
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: `${
                valorizarX === "montoGenerado" ? "Monto" : "Cantidad"
              }`,
              legendPosition: "middle",
              legendOffset: 40,
            }}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            theme={{
              labels: {
                text: {
                  fontWeight: "bold", // Establece el peso del texto
                },
              },
              tooltip: {
                container: {
                  display: "none",
                },
              },
            }}
          />
        </div>
        <div className="list-products">
          <div className="table-wrapper">
            <table className="sticky-table">
              <thead>
                <tr>
                  <th>
                    {" "}
                    {tipoFiltro === "productos" ? "Productos" : "Servicios"}
                  </th>
                  <th>Cantidad</th>
                  {InfoUsuario.rol === Roles.ADMIN ? (
                    <th>Monto Generado</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {data
                  .sort((a, b) => b[valorizarX] - a[valorizarX])
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>
                        {formatThousandsSeparator(item.cantidad)}{" "}
                        {item.simboloMedida}
                      </td>
                      {InfoUsuario.rol === Roles.ADMIN ? (
                        <td>
                          {formatThousandsSeparator(item.montoGenerado, true)}
                        </td>
                      ) : null}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="action-t">
            {InfoUsuario.rol === Roles.ADMIN ? (
              <BotonExport onExport={exportToExcel} />
            ) : null}
          </div>
        </div>
        <div className="graf-prod">
          <h1>
            {tipoFiltro === "productos" ? "Productos" : "Servicios"} Menos
            Rentables
          </h1>
          <ResponsiveBar
            data={bottomData} // Usar los datos de los menos vendidos
            keys={[
              `${
                valorizarX === "montoGenerado" ? "montoGenerado" : "cantidad"
              }`,
            ]}
            indexBy="nombre"
            layout="horizontal"
            margin={{ top: 20, right: 120, bottom: 70, left: 40 }}
            padding={0.3}
            groupMode="grouped"
            colors="#d38d8d"
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            label={(d) => {
              return d.value === 0 ? (
                <tspan x="-15">{d.value}</tspan>
              ) : (
                <tspan x="">
                  {valorizarX === "montoGenerado"
                    ? `${formatThousandsSeparator(d.value, true)}`
                    : `${formatThousandsSeparator(d.value)} ${
                        d.data.simboloMedida
                      }`}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </tspan>
              );
            }}
            axisTop={null}
            axisLeft={null}
            axisRight={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisBottom={{
              tickValues: 3,
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: `${
                valorizarX === "montoGenerado" ? "Monto" : "Cantidad"
              }`,
              legendPosition: "middle",
              legendOffset: 40,
            }}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            theme={{
              labels: {
                text: {
                  fontWeight: "bold", // Puedes cambiar 'bold' por el peso que desees, como 700.
                  fill: "#ffffff",
                },
              },
              tooltip: {
                container: {
                  display: "none",
                },
              },
            }}
            // Invertir la dirección de las barras agregando la propiedad 'reverse'
            reverse={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Items;
