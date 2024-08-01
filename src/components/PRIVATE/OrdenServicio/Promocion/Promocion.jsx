/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import axios from "axios";
import React, { useState, useEffect } from "react";
import "./promocion.scss";
import { useSelector } from "react-redux";
import Cupon from "../../Cupon/Cupon";

const Promocion = ({ onAddCupon }) => {
  const infoPromocion = useSelector((state) => state.promocion.infoPromocion);
  const [listPromos, setListPromos] = useState([]);
  const [givenPromotions, setGivenPromotions] = useState([]);

  const handleAddPromocion = async (promo) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/lava-ya/generate-codigo-cupon`
      );

      if (response.data) {
        const codigoCupon = response.data;
        setGivenPromotions([...givenPromotions, { codigoCupon, ...promo }]);
      } else {
        alert("No se pudo generar promocion");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleRegisterPromocion = () => {
    const promos = [];
    givenPromotions.map((p) => {
      const info = {
        codigoPromocion: p.codigo,
        codigoCupon: p.codigoCupon,
      };
      promos.push(info);
    });
    onAddCupon(promos);
  };

  useEffect(() => {
    const iPromos = infoPromocion.filter(
      (promocion) => promocion.state === "activo"
    );
    setListPromos(iPromos);
  }, [infoPromocion]);

  return (
    <div className="content-p">
      <div className="actions">
        <button
          type="button"
          className="btn-delete"
          onClick={() => {
            const nuevoArray = givenPromotions.filter(
              (_, index) => index < givenPromotions.length - 1
            );
            setGivenPromotions(nuevoArray);
          }}
        >
          Eliminar
        </button>
        <button
          type="button"
          className="btn-add-promo"
          onClick={() => {
            handleRegisterPromocion();
          }}
        >
          Agregar Promocion
        </button>
      </div>
      <div className="body-promos-cupones">
        <div className="list-promos">
          {listPromos?.map((p) => (
            <button
              className="item-promo"
              key={p.codigo}
              onClick={() => {
                handleAddPromocion(p);
              }}
              type="button"
            >
              {p.descripcion}
            </button>
          ))}
        </div>
        {givenPromotions.length > 0 ? (
          <div className="container-promociones">
            {givenPromotions?.map((promo, index) => (
              <React.Fragment key={index}>
                <Cupon infoPromo={promo} />
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Promocion;
