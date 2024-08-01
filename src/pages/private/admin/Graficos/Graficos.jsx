// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import './graficos.scss';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';
// import dayjs from 'dayjs';

// const renderQuarterTick = (tickProps) => {
//   const { x, y, payload, width } = tickProps;
//   const { value, offset } = payload;

//   const dates = value.split(' - ');

//   const startDate = dayjs(dates[0]);
//   const endDate = dayjs(dates[1]);

//   const dateText = `${startDate.format('dddd, D')} -  ${endDate.format('dddd, D')}`;
//   const textAnchor = 'middle'; // Alinea el texto al centro

//   return (
//     <text
//       fill="rgb(102, 102, 102)"
//       style={{ fontSize: '15px' }}
//       x={x + width * 0.1}
//       y={y + 10}
//       textAnchor={textAnchor}
//       fontSize={12}
//     >
//       {dateText}
//     </text>
//   );
// };

// const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
//   return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}`}</text>;
// };

// const Graficos = () => {
//   const [inf_xS, setInfo_xS] = useState([]);

//   const getInforme_xSemana = async (mes, año) => {
//     try {
//       const info = await axios.get(`http://localhost:3001/api/lava-ya/get-reporte?mes=${mes}&anio=${año}`);
//       if (info) {
//         const finalRes = info.data.map((semanaData, index) => {
//           const semana = `Semana ${index + 1}`;
//           const productos = semanaData.productos;
//           const rangeDate = `${semanaData.fechaInicial} - ${semanaData.fechaFinal}`;
//           return {
//             name: semana,
//             date: rangeDate,
//             ...productos,
//           };
//         });

//         setInfo_xS(finalRes);
//       }
//     } catch (error) {
//       // Puedes manejar los errores aquí
//       throw new Error(`No se pudieron obtener los datos del usuario - ${error}`);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (inf_xS.length === 0) {
//         getInforme_xSemana('08', '2023');
//       }
//     };
//   }, []);

//   return (
//     <div>
//       {inf_xS.length > 0 ? (
//         <BarChart
//           width={1400}
//           height={500}
//           data={inf_xS}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 0,
//             bottom: 50,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" dy={50} /* label="Agosto" tick={renderCustomAxisTick}*/ />
//           <XAxis
//             dataKey="date"
//             axisLine={true}
//             tickLine={true}
//             interval={0}
//             tick={renderQuarterTick}
//             height={1}
//             scale="band"
//             xAxisId="quarter"
//           />
//           <YAxis />
//           {/* <Tooltip /> */}
//           <Bar dataKey="Ropa x Kilo" barSize={30} fill="#FF2F16" label={renderCustomBarLabel} />
//           <Bar dataKey="Edredon" barSize={30} fill="#FFAE16" label={renderCustomBarLabel} />
//           <Bar dataKey="Planchado" barSize={30} fill="#16FF64" label={renderCustomBarLabel} />
//           <Bar dataKey="Zapatillas" barSize={30} fill="#16CAFF" label={renderCustomBarLabel} />
//           <Bar dataKey="Cortinas" barSize={30} fill="#8884d8" label={renderCustomBarLabel} />
//           <Bar dataKey="Otros" barSize={30} fill="#616161" label={renderCustomBarLabel} />
//           <Legend verticalAlign="top" height={40} />
//         </BarChart>
//       ) : null}
//     </div>
//   );
// };

// export default Graficos;
