const getItem = (list, group) => {
  return list.map((item) => ({
    label: `${item.nombre ? item.nombre : item.name} - ${group.charAt(0)}`,
    value: `${group.substring(0, 3)}${item._id}`,
    group: group,
  }));
};

export const getListItems = (iProduct, iService, iCategory, iDelivery) => {
  // Filtrar servicios para excluir aquellos cuya categoría asociada es de nivel "secundario"
  const serviciosFiltrados = iService.filter(
    (servicio) => servicio._id !== iDelivery._id
  );

  const categoruasFiltrados = iCategory.filter(
    (categoria) => categoria.nivel !== "primario"
  );

  const services = getItem(serviciosFiltrados, "SERVICIOS");
  const categorys = getItem(categoruasFiltrados, "CATEGORIAS");
  const products = getItem(iProduct, "PRODUCTOS");

  const dataSelect = [...services, ...categorys, ...products];
  return dataSelect;
};
