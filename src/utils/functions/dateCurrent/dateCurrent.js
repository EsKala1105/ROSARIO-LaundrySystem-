import moment from "moment";
import "moment/locale/es";
import "moment-timezone"; // Aquí importas moment-timezone
import { timeZone } from "../../../services/global";

moment.tz.setDefault(timeZone);
moment.locale("es");

export function DateCurrent() {
  const obtenerFechaHoraLocal = () => moment();

  const fechaHora = obtenerFechaHoraLocal();

  const dia = fechaHora.format("DD");
  const mes = fechaHora.format("MM");
  const año = fechaHora.format("YYYY");
  const hora = fechaHora.format("HH");
  const minutos = fechaHora.format("mm");

  const mesTexto = fechaHora.format("MMMM");

  return {
    format1: `${año}`,
    format2: `${dia} de ${mesTexto} de ${año}, ${hora}:${minutos}`,
    format3: `${hora}:${minutos}`,
    format4: `${año}-${mes}-${dia}`,
  };
}

export function formatFecha(fecha) {
  const fechaFormateada = moment(fecha).format("YYYY-MM-DD");

  return fechaFormateada;
}

export function formatHora(hora) {
  const horaFormateada = moment(hora).format("HH:mm");

  return horaFormateada;
}

export function DateDetail(date) {
  const fechaOriginal = moment(date);
  const fechaTransformada = fechaOriginal.format("dddd, D [de] MMMM [de] YYYY");

  return fechaTransformada;
}

export function DateDetail_Hora(fecha, hora) {
  const fechaHora = moment(`${fecha} ${hora}`, "YYYY-MM-DD HH:mm");
  return fechaHora.format("dddd, D MMMM [de] YYYY - hh:mm a");
}

export function GetFirstFilter() {
  const currentDate = moment();
  const previousMonth = currentDate
    .clone()
    .subtract(1, "month")
    .startOf("month");

  const formattedDates = [
    previousMonth.format("YYYY-MM-DD"),
    currentDate.format("YYYY-MM-DD"),
  ];

  const formattedMonths = `${previousMonth.format(
    "MMMM"
  )} - ${currentDate.format("MMMM")}`;

  return { formatoD: formattedDates, formatoS: formattedMonths };
}

export const calcularFechaFutura = (numeroDeDias) => {
  const fechaActual = moment();
  const nuevaFecha = fechaActual.clone().add(numeroDeDias, "days");
  return nuevaFecha.format("D [de] MMMM[, del] YYYY");
};

export const DateFormat24h = (hora24) => {
  // Parseamos la cadena de hora en formato de 24 horas
  const hora12 = moment(hora24, "HH:mm").format("hh:mm A");
  return hora12;
};
