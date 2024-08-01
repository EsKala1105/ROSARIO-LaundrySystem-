/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import { Group, Select, Text } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";

import { useSelector } from "react-redux";

const SelectItem = forwardRef(({ /*image,*/ label, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap={true}>
      {/* <Avatar src={image} /> */}
      <div>
        <Text>{label}</Text>
      </div>
    </Group>
  </div>
));

const InputSelectedPrenda = ({ listenClick, tabI, disabled }) => {
  const iServicios = useSelector((state) => state.servicios.listServicios);
  const iCategorias = useSelector((state) => state.categorias.listCategorias);

  const [data, setData] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);

  const filtrarServicios = (servicios, categorias) => {
    const mapeoCategorias = categorias.reduce((acc, categoria) => {
      acc[categoria._id] = categoria;
      return acc;
    }, {});

    return servicios.filter((servicio) => {
      const categoria = mapeoCategorias[servicio.idCategoria];
      // Excluir si el servicio es "Delivery" y su categoría es de nivel "primario" o si el estado es false
      return (
        !(servicio.nombre === "Delivery" && categoria?.nivel === "primario") &&
        servicio.estado
      );
    });
  };

  useEffect(() => {
    const dataServicios = filtrarServicios(iServicios, iCategorias);

    const serviciosDB = dataServicios.map((service) => {
      return {
        label: service.nombre,
        value: service._id,
      };
    });

    const infoOrdenada = serviciosDB.sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    setData(infoOrdenada);
  }, [iServicios]);

  return (
    <Select
      label="Escoja Servicio :"
      placeholder="Escoga para agregar"
      itemComponent={SelectItem}
      data={data}
      value={defaultValue}
      size="lg"
      searchable={true}
      tabIndex={tabI}
      disabled={disabled}
      dropdownPosition="bottom"
      maxDropdownHeight={270}
      nothingFound="No encontrado"
      filter={(value, item) =>
        item.label.toLowerCase().includes(value.toLowerCase().trim())
      }
      hoverOnSearchChange={true}
      onChange={(value) => {
        listenClick(value);
        setDefaultValue(null);
      }}
    />
  );
};

export default InputSelectedPrenda;
