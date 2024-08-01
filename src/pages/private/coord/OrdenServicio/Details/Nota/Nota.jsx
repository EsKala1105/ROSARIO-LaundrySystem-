/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./nota.scss";

import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Nota_OrdenService } from "../../../../../../redux/actions/aOrdenServices";

const Nota = ({ onReturn, infOrden }) => {
  const dispatch = useDispatch();

  const [notes, setNotes] = useState([]);
  const [idOrden, setIdOrden] = useState();
  const lastTextareaRef = useRef(null);

  const handleAddNote = () => {
    const newNote = { id: notes.length + 1, text: "", show: true };
    const updatedNotes = notes.map((note) => ({ ...note, show: false }));
    setNotes([...updatedNotes, newNote]);
  };

  const handleNoteChange = (id, newText) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text: newText } : note
    );
    setNotes(updatedNotes);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const toggleNoteVisibility = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, show: !note.show } : note
    );
    setNotes(updatedNotes);
  };

  const handleSaveNote = async () => {
    await dispatch(
      Nota_OrdenService({
        id: idOrden,
        infoNotas: notes,
      })
    );
    onReturn();
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: "Notas de Orden de Servicio",
      centered: true,
      children: (
        <Text size="sm">{"¿ Estas seguro de guardar esta nota(s) ?"}</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("cancelado"),
      onConfirm: () => handleSaveNote(),
    });

  useEffect(() => {
    if (infOrden) {
      setNotes(
        infOrden.notas.length > 0
          ? infOrden.notas
          : [{ id: 1, text: "", show: true }]
      );
      setIdOrden(infOrden._id);
    }
  }, [infOrden]);

  useEffect(() => {
    if (lastTextareaRef.current) {
      lastTextareaRef.current.focus();
    }
  }, [notes]);

  return (
    <div className="note-container">
      <div className="sticky-note sticky-note-one">
        <div className="body-stick">
          {notes.map((note, index) => (
            <div key={note.id} className="note">
              <div className="header-info">
                <span> Nota {index + 1} :</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <i className="fa-solid fa-trash" />
                  </button>

                  <button
                    type="button"
                    className={note.show ? "color-show" : "color-hide"}
                    onClick={() => toggleNoteVisibility(note.id)}
                  >
                    {note.show ? (
                      <i className="fa-solid fa-eye-slash" />
                    ) : (
                      <i className="fa-solid fa-eye" />
                    )}
                  </button>
                </div>
              </div>
              <textarea
                id={note.id}
                ref={index === notes.length - 1 ? lastTextareaRef : null}
                className={note.show ? "show" : "hide"}
                // cols="20"
                // rows="10"
                defaultValue={note.text}
                placeholder="Ingrese Nota..."
                onChange={(e) => handleNoteChange(note.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button type="button" className="btn-add" onClick={handleAddNote}>
          <i className="fa-solid fa-plus" />
        </button>
      </div>
      <div className="btn-actions">
        <button type="button" onClick={onReturn}>
          Regresar
        </button>
        <button
          type="button"
          onClick={() => {
            openModal();
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default Nota;
