export const getInfoCategoria = (iCategoria, id) => {
  const categoria = iCategoria.find((c) => c._id === id);
  if (categoria) {
    return { id: categoria._id, name: categoria.name, nivel: categoria.nivel };
  } else {
    return null;
  }
};

export const getListCategorias = (categorias, tipo) => {
  const categoriasFiltradas = categorias.filter((item) => item.tipo === tipo && item.nivel !== 'primario');
  return categoriasFiltradas.map((item) => ({
    label: item.name,
    value: item._id,
  }));
};
