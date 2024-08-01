// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import React, { useState, useRef, useEffect } from 'react';
// import styled from 'styled-components';
// //import './nota.scss';

// const Container = styled.div`
//   display: grid;
//   overflow: hidden;
//   width: 100%;
//   grid-template-areas: 'title';
//   margin: 0 auto;

//   .note-container {
//     justify-self: center;

//     .sticky-note {
//       width: 300px;
//       font-size: 20px;
//       outline: none;
//       position: relative;
//       margin: 50px 10px;
//       padding: 40px 20px;
//       position: relative;

//       &::before {
//         content: '';
//         position: absolute;
//         display: block;
//       }

//       &::after {
//         content: '';
//         position: absolute;
//         bottom: 0;
//         border-width: 12px 12px 12px 12px;
//         border-style: solid;
//       }

//       &.sticky-note-one {
//         background-color: #fae3e3;
//         grid-area: sticker1;
//         box-shadow: 9px 0px 10px -5px rgba(0, 0, 0, 0.42);

//         &::before {
//           background-color: rgba(108, 212, 255, 0.6);
//           width: 120px;
//           height: 35px;
//           left: 50%;
//           top: -15px;
//           transform: translateX(-50%) rotate(3deg);
//         }
//         &::after {
//           left: 0;
//           border-top-color: #51c0ef;
//           border-right-color: #51c0ef;
//           border-bottom-color: #fff;
//           border-left-color: #fff;
//         }
//       }

//       .body-stick {
//         display: grid;
//         gap: 20px;
//         overflow: auto;

//         &::-webkit-scrollbar {
//           width: 0;
//           height: 0;
//           display: none;
//         }

//         .note {
//           display: grid;
//           textarea {
//             width: 100%;
//             margin: 0;
//             height: 100px;
//             background: #bee7f9;
//             transition: all 0.7s;
//             resize: none;
//             font-size: 15px;
//             padding: 10px;
//             //overflow: hidden;
//             border: solid 1px silver;
//             border-top: 0;
//             outline: none;
//             text-align: justify;

//             &::-webkit-scrollbar {
//               width: 0;
//               height: 0;
//               display: none;
//             }

//             &.hide {
//               height: 0;
//               visibility: hidden;
//               transition: all 0.7s;
//               padding: 0 10px;
//             }
//           }

//           .header-info {
//             display: flex;
//             justify-content: space-between;
//             background: #fbfdba;
//             padding: 5px 10px;
//             border-radius: 10px 10px 0 0;
//             border: solid 1px silver;

//             button {
//               width: 30px;
//               height: 30px;
//               border-radius: 50%;
//               border: none;
//               color: #fff;
//               box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

//               &:hover {
//                 background: #62c180;
//               }
//             }

//             .color-show {
//               background: #50a5ef;
//             }

//             .color-hide {
//               background: #5d5d5d;
//             }
//           }
//           .remplazo-text-area {
//             width: 260px;
//             padding: 10px;
//             background: #bee7f9;
//             font-size: 15px;
//             overflow: hidden; /* Puedes ajustar esto según tus necesidades */
//             word-wrap: break-word;
//         }
//       }
//     }
//     .btn-add {
//       position: absolute;
//       width: 50px;
//       height: 50px;
//       border-radius: 50%;
//       right: -25px;
//       bottom: -25px;
//       font-size: 25px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background: #cbd2ff;
//       border: none;
//       box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
//       color: #fff;

//       &:hover {
//         background-color: #7686ef;
//       }
//     }
//   }
// `;

// const Nota = ({ onMode, setMode, handleGetData, info }) => {
//   const [notes, setNotes] = useState([{ id: 1, text: '', show: true }]);
//   const lastTextareaRef = useRef(null);

//   const handleAddNote = () => {
//     const newNote = { id: notes.length + 1, text: '', show: true };
//     const updatedNotes = notes.map((note) => ({ ...note, show: false }));
//     setNotes([...updatedNotes, newNote]);
//   };

//   const handleNoteChange = (id, newText) => {
//     const updatedNotes = notes.map((note) => (note.id === id ? { ...note, text: newText } : note));
//     setNotes(updatedNotes);
//     handleGetData(notes);
//   };

//   const toggleNoteVisibility = (id) => {
//     const updatedNotes = notes.map((note) => (note.id === id ? { ...note, show: !note.show } : note));
//     setNotes(updatedNotes);
//   };

//   useEffect(() => {
//     if (lastTextareaRef.current) {
//       lastTextareaRef.current.focus();
//       lastTextareaRef.current.scrollIntoView({ behavior: 'smooth' }); // Mueve el scroll al último textarea
//     }
//   }, [notes]); // Se ejecutará cuando notes cambie

//   return (
//     <Container>
//       <div className="note-container">
//         <div className="sticky-note sticky-note-one">
//           <div className="body-stick">
//             {notes.map((note, index) => (
//               <div key={note.id} className="note">
//                 <div className="header-info">
//                   <span> Nota {index + 1} :</span>
//                   {onMode === false ? (
//                     <button
//                       type="button"
//                       className={note.show ? 'color-show' : 'color-hide'}
//                       onClick={() => toggleNoteVisibility(note.id)}
//                     >
//                       {note.show ? <i className="fa-solid fa-eye-slash" /> : <i className="fa-solid fa-eye" />}
//                     </button>
//                   ) : null}
//                 </div>
//                 {onMode === false ? (
//                   <textarea
//                     id={note.id}
//                     ref={index === notes.length - 1 ? lastTextareaRef : null}
//                     className={note.show ? 'show' : 'hide'}
//                     // cols="20"
//                     // rows="10"
//                     defaultValue={note.text}
//                     placeholder="Ingrese Nota..."
//                     onChange={(e) => handleNoteChange(note.id, e.target.value)}
//                   />
//                 ) : (
//                   <div
//                     className="remplazo-text-area"
//                     onClick={() => {
//                       setMode(false);
//                     }}
//                   >
//                     {note.text}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           {onMode === false ? (
//             <button type="button" className="btn-add" onClick={handleAddNote}>
//               <i className="fa-solid fa-plus" />
//             </button>
//           ) : null}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Nota;
