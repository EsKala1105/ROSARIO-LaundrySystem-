import { simboloMoneda } from "../../../services/global";

export function formatThousandsSeparator(value, money) {
  if (Number.isNaN(parseFloat(value))) {
    return money ? simboloMoneda : "";
  }

  const fixedValue = parseFloat(value).toFixed(2);
  const formattedValue = fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return money ? `${simboloMoneda} ${formattedValue}` : formattedValue;
}

export function formatRoundedNumber(value) {
  // Convertir el input a número
  let numero = Number(value);

  // Verificar si el número es un entero o tiene decimales
  if (Number.isInteger(numero)) {
    // Si es un entero, simplemente devolver el número
    return numero;
  } else {
    let base = Math.floor(numero); // Obtener la parte entera
    let decimales = Math.round((numero % 1) * 100); // Obtener la parte decimal

    const segundoDigito = parseInt(decimales.toString().charAt(1));

    // Ajustar las decimales si es necesario
    if (decimales >= 10) {
      if (segundoDigito <= 5) {
        // Redondear hacia abajo al múltiplo de 10 más cercano
        decimales = Math.floor(decimales / 10) * 10;
      } else {
        // Redondear hacia arriba al múltiplo de 10 más cercano
        decimales = Math.ceil(decimales / 10) * 10;
      }
    } else {
      if (decimales <= 5) {
        // Redondear hacia abajo al múltiplo de 10 más cercano
        decimales = Math.floor(decimales / 10) * 10;
      } else {
        // Redondear hacia arriba al múltiplo de 10 más cercano
        decimales = Math.ceil(decimales / 10) * 10;
      }
    }

    // Obtener el número con las decimales ajustadas
    const numberFinal = base + decimales / 100;

    // Devolver el número
    return numberFinal;
  }
}
