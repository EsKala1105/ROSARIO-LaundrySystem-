import moment from "moment";
import { formatThousandsSeparator } from "../formatNumber/formatNumber";

export function handleCantidad(products) {
  let sumaOtrosProductos = 0;
  let sumaRopaKilo = 0;

  for (const producto of products) {
    if (
      producto.producto === "Ropa x Kilo" &&
      producto.producto !== "Delivery"
    ) {
      sumaRopaKilo += parseFloat(producto.cantidad);
    } else if (producto.producto !== "Delivery") {
      sumaOtrosProductos += parseInt(producto.cantidad);
    }
  }

  // Crear un array con los resultados no vacíos
  const resultados = [];
  if (sumaRopaKilo > 0) {
    resultados.push(`${sumaRopaKilo} kg`);
  }
  if (sumaOtrosProductos > 0) {
    resultados.push(
      sumaOtrosProductos === 1 ? "1 pieza" : `${sumaOtrosProductos} piezas`
    );
  }

  return resultados;
}

function calculateTimeDifference(startDate, endDate) {
  const duration = moment.duration(endDate.diff(startDate));

  const days = duration.asDays();
  const months = duration.asMonths();
  const years = duration.asYears();

  if (years >= 1) {
    return `${Math.floor(years)} año${Math.floor(years) > 1 ? "s" : ""} ${
      Math.floor(months % 12)
        ? `${Math.floor(months % 12)} mes${
            Math.floor(months % 12) !== 1 ? "es" : ""
          }`
        : ""
    } ${Math.floor(days % 30)} día${Math.floor(days % 30) > 1 ? "s" : ""}`;
  } else if (months >= 1) {
    return `${Math.floor(months)} mes${Math.floor(months) > 1 ? "es" : ""} ${
      Math.floor(days % 30)
        ? `${Math.floor(days % 30)} día${
            Math.floor(days % 30) !== 1 ? "s" : ""
          }`
        : ""
    }`;
  } else {
    return `${Math.floor(days)} día${Math.floor(days) > 1 ? "s" : ""}`;
  }
}

export function handleOnWaiting(dateEntrada, stateOrden, dateEndProcess) {
  const entradaMoment = moment(dateEntrada);
  const actualMoment = moment();

  let fechaFinal;
  let totalDias;

  if (stateOrden === "entregado") {
    const fechaInicio = moment(dateEntrada);
    const fechaFin = moment(dateEndProcess);
    const duracion = moment.duration(fechaFin.diff(fechaInicio));
    totalDias = duracion.asDays();
    const diasRestantes = Math.floor(totalDias);
    fechaFinal = moment(fechaInicio).add(diasRestantes, "days").toDate();
  } else {
    let diasRestantes = actualMoment.diff(entradaMoment, "days");

    const fechaInicio = moment(dateEntrada);
    const fechaFin = actualMoment;
    const duracion = moment.duration(fechaFin.diff(fechaInicio));
    totalDias = duracion.asDays();
    diasRestantes = Math.floor(totalDias);

    fechaFinal = moment(fechaInicio).add(diasRestantes, "days").toDate();
  }

  const mensaje = calculateTimeDifference(
    moment(dateEntrada),
    moment(fechaFinal)
  );

  const respuesta = {
    stado: stateOrden === "anulado" || stateOrden === "donado" ? false : true,
    stadoEntrega: stateOrden === "entregado" ? true : false,
    showText: mensaje,
    nDias: Math.floor(totalDias), // Redondear hacia abajo el número de días
  };

  return respuesta;
}

export function handleItemsCantidad(productos) {
  return productos
    .reduce((acc, p) => {
      const existingProduct = acc.find(
        (item) => item.identificador === p.identificador
      ); // Se busca por `identificador`
      if (existingProduct) {
        // Se suma la cantidad convertida a número; parseFloat asume que puede haber decimales siempre
        existingProduct.cantidad += parseFloat(p.cantidad);
      } else {
        // Se agrega un nuevo item con cantidad convertida a número
        acc.push({
          identificador: p.identificador,
          cantidad: parseFloat(p.cantidad),
          simboloMedida: p.simboloMedida, // Se guarda el simboloMedida
          item: p.item, // Se incluye el nombre del item
        });
      }
      return acc;
    }, [])
    .map((item) => {
      // Redondea la cantidad a 2 decimales máximo
      const cantidadRedondeada = parseFloat(item.cantidad.toFixed(2));
      // Retorna el texto con el formato deseado, usando simboloMedida para determinar la unidad
      return `${item.item} - (${formatThousandsSeparator(cantidadRedondeada)}${
        item.simboloMedida
      })`;
    });
}
