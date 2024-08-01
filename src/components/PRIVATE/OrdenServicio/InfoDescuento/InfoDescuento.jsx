/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./infoDescuento.scss";
import SwtichDimension from "../../../SwitchDimension/SwitchDimension";
import { Button, Group, TextInput } from "@mantine/core";
import Portal from "../../Portal/Portal";
import { useSelector } from "react-redux";

import { Radio } from "@mantine/core";

const InfoDescuento = ({
  paso,
  descripcion,
  changeValue,
  values,
  iCliente,
  validCupon,
  recalculatePromoDescuento,
}) => {
  const [codigoCupon, setCodigoCupon] = useState();
  const [iPromo, setIPromo] = useState(null);

  const [PortalValidPromocion, setPortalValiPromocion] = useState(false);

  const handleGetOpcionDescuento = (estado) => {
    if (estado === "SI") {
      changeValue("descuento.estado", true);
      changeValue("descuento.modoDescuento", "Ninguno");
      changeValue("descuento.info", null);
      changeValue("descuento.monto", 0);
    } else {
      changeValue("descuento.estado", false);
      changeValue("descuento.modoDescuento", "Ninguno");
      changeValue("descuento.info", null);
      changeValue("descuento.monto", 0);
    }
  };

  const handleCancelarDescuento = () => {
    changeValue("descuento.estado", false);
    changeValue("descuento.modoDescuento", "Ninguno");
    changeValue("descuento.info", null);
    changeValue("descuento.monto", 0);
  };

  return (
    <div className="info-descuento">
      <div className="title">
        <h1>PASO {paso}</h1>
        <h2>{descripcion}</h2>
      </div>
      <div className="body">
        {values.descuento.estado ? (
          <>
            <Button
              className="cancel-descuento"
              onClick={handleCancelarDescuento}
            >
              X
            </Button>
            <Radio.Group
              label="Tipo de Descuento :"
              className="group-descuento"
              name="favoriteFramework"
              value={values.descuento.modoDescuento}
              onChange={(value) => {
                changeValue("descuento.modoDescuento", value);
              }}
            >
              <Group mt="md">
                <Radio value="Promocion" label="Promocion" />
                <Radio
                  disabled={iCliente === null}
                  value="Puntos"
                  label="Puntos"
                />

                <Radio value="Manual" label="Manual" />
              </Group>
            </Radio.Group>
          </>
        ) : null}
        {values.descuento.estado === false ? (
          <div className="input-switch">
            <SwtichDimension
              onSwitch="SI"
              offSwitch="NO"
              name="sw-stado-descuento"
              defaultValue={values.descuento.estado}
              handleChange={handleGetOpcionDescuento}
            />
          </div>
        ) : null}
        {values.descuento.modoDescuento === "Promocion" &&
        values.descuento.estado ? (
          <Button
            type="button"
            className="btn-promocion"
            onClick={() => {
              setPortalValiPromocion(true);
              setIPromo(null);
              setCodigoCupon();
            }}
          >
            Agregar Promocion
          </Button>
        ) : null}
      </div>
      {PortalValidPromocion ? (
        <Portal
          onClose={() => {
            setPortalValiPromocion(false);
          }}
        >
          <div className="valid-promocion">
            <h2>Ingresar codigo de Promocion</h2>
            <TextInput
              label="Codigo de Promocion :"
              className="input-promotion"
              radius="md"
              onChange={(e) => {
                setCodigoCupon(e.target.value);
                setIPromo(null);
              }}
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-valid"
              onClick={async () => {
                const infoValidacion = await validCupon(codigoCupon);
                setIPromo(infoValidacion);
              }}
            >
              Validar
            </button>
            {iPromo ? (
              <>
                <textarea
                  style={
                    iPromo?.validacion === true
                      ? { borderColor: "#00e676" }
                      : { borderColor: "#f5532f" }
                  }
                  className="description-info"
                  value={
                    iPromo?.validacion === true
                      ? iPromo?.promocion.descripcion
                      : iPromo?.respuesta
                  }
                  readOnly
                />
                {iPromo?.validacion === true ? (
                  <button
                    type="button"
                    className="btn-add"
                    onClick={() => {
                      // Buscar si ya existe un registro en la lista
                      const exists =
                        values.descuento.info?.codigoCupon === codigoCupon;

                      if (!exists && iPromo) {
                        const infoDescuentoByPromo = {
                          cantidadMin: iPromo.promocion.cantidadMin,
                          codigoCupon: codigoCupon,
                          codigoPromocion: iPromo.promocion.codigo,
                          descripcion: iPromo.promocion.descripcion,
                          prenda: iPromo.promocion.prenda,
                          alcance: iPromo.promocion.alcance,
                          nMultiplicador:
                            iPromo.promocion.tipoDescuento === "Porcentaje"
                              ? iPromo.promocion.descuento / 100
                              : iPromo.promocion.descuento,
                          tipoDescuento: iPromo.promocion.tipoDescuento,
                          tipoPromocion: iPromo.promocion.tipoPromocion,
                        };

                        const descuento =
                          recalculatePromoDescuento(infoDescuentoByPromo);

                        changeValue("descuento.info", infoDescuentoByPromo);
                        changeValue("descuento.monto", descuento);

                        alert("¡Se agregó correctamente!");
                        setPortalValiPromocion(false);
                        setIPromo(null);
                        setCodigoCupon();
                      } else {
                        // Si ya existe un registro con el mismo codigoPromocion, puedes manejarlo como desees
                        alert("¡El registro ya existe!");
                      }
                    }}
                  >
                    Agregar
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </Portal>
      ) : null}
    </div>
  );
};

export default InfoDescuento;
