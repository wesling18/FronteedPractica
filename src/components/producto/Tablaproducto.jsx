// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaCategorias que recibe props
const TablaProducto = ({ productos, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando productos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID producto</th>
          <th>Nombre de producto</th>
          <th>Descripcion del producto</th>
          <th>ID categoria</th>
          <th>Precio Unitario</th>
          <th>Stock</th>
          <th>imagen</th>
        </tr>
      </thead>
      <tbody>
      {productos.map((producto) => (
          <tr key={producto.id_producto}>
          <td>{producto.id_producto}</td>
          <td>{producto.nombre_producto}</td>
          <td>{producto.descripcion_producto}</td>
          <td>{producto.id_categoria}</td>
          <td>{producto.precio_unitario}</td>
          <td>{producto.stock}</td>
          <td>{producto.imagen}</td>
                
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaProducto;