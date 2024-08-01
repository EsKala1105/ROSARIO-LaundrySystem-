import moment from "moment";

// export function DiasAttencion(diasPresentes) {
//   const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

//   // Copiar y ordenar los días presentes
//   const diasOrdenados = [...diasPresentes];
//   diasOrdenados.sort((a, b) => a - b);

//   // Crear un rango completo del 1 al 7
//   const rangoCompleto = [1, 2, 3, 4, 5, 6, 7];

//   // Filtrar los números faltantes
//   const diasFaltantes = rangoCompleto.filter((dia) => !diasOrdenados.includes(dia));

//   // Ordenar los números faltantes de menor a mayor
//   diasFaltantes.sort((a, b) => a - b);

//   // Función para verificar si un conjunto de números es consecutivo
//   const esConsecutivo = (conjunto) => {
//     for (let i = 1; i < conjunto.length; i++) {
//       if (conjunto[i] - conjunto[i - 1] !== 1 && conjunto[i] !== 1 && conjunto[i - 1] !== 7) {
//         return false;
//       }
//     }
//     return true;
//   };

//   let dRes;

//   if (diasFaltantes.length === 1) {
//     // Ajustamos el número para que sea el día de la semana correspondiente
//     const adjustedDiaFaltante = diasFaltantes - 1;

//     // Encontramos el día inicial y el día final
//     const init = diasSemana[(adjustedDiaFaltante + 1) % 7];
//     const end = diasSemana[(adjustedDiaFaltante - 1 + 7) % 7];

//     dRes = `${init} a ${end}`;
//   } else if (diasFaltantes.length > 1) {
//     // Más de un día faltante
//     if (esConsecutivo(diasFaltantes)) {
//       // Encontramos el día inicial y el día final
//       const init = Math.max(...diasFaltantes) === 7 ? 'Lun' : diasSemana[Math.max(...diasFaltantes) % 7];
//       const end = Math.min(...diasFaltantes) === 1 ? 'Dom' : diasSemana[Math.min(...diasFaltantes) - 2];

//       dRes = `${init} a ${end}`;
//     } else {
//       const grupos = agruparConsecutivos(diasOrdenados);
//       // Función para convertir números en nombres de días
//       const numerosToDias = (numeros) => numeros.map((numero) => diasSemana[numero - 1]);

//       // Obtener los nombres de los días correspondientes a los números en cada grupo
//       const nombresDiasGrupos = grupos.map(numerosToDias);

//       // Unir los nombres de los días de cada grupo en una cadena
//       const res = nombresDiasGrupos
//         .map((nombres) => {
//           if (nombres.length === 1) {
//             return nombres[0];
//           } else {
//             return `${nombres[0]} a ${nombres[nombres.length - 1]}`;
//           }
//         })
//         .join(', ');

//       dRes = res;
//     }
//   } else {
//     dRes = `Lun a Dom`;
//   }

//   return dRes;
// }

export function HoraAttencion(horas) {
  const { inicio, fin } = horas;
  const formattedInicio = moment(inicio, "HH:mm").format("hh:mm A");
  const formattedFin = moment(fin, "HH:mm").format("hh:mm A");

  return `${formattedInicio} a ${formattedFin}`;
}

// function agruparConsecutivos(arr) {
//   const grupos = [];
//   let grupoActual = [arr[0]];

//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] === arr[i - 1] + 1 || (arr[i] === 1 && arr[i - 1] === 7)) {
//       grupoActual.push(arr[i]);
//     } else {
//       grupos.push([...grupoActual]);
//       grupoActual = [arr[i]];
//     }
//   }

//   grupos.push(grupoActual);

//   // Buscar grupos que contienen 1 y 7 y agruparlos
//   for (let i = 0; i < grupos.length; i++) {
//     if (grupos[i].includes(1)) {
//       for (let e = 0; e < grupos.length; e++) {
//         if (grupos[e].includes(7)) {
//           if (i !== e) {
//             // Evitamos unir el mismo array consigo mismo
//             grupos[e].push(...grupos[i]);
//             grupos.splice(i, 1); // Eliminamos el array que ya ha sido unido
//           }
//           break;
//         }
//       }
//     }
//   }

//   return grupos;
// }
