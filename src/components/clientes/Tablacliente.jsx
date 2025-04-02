// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaCategorias que recibe props
const TablaClientes = ({ clientes, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID cliente</th>
          <th>primer Nombre</th>
          <th>segundo Nombre</th>
          <th>primer Apellido</th>
          <th>segudo Apellido</th>
          <th>Celular</th>
          <th>Dirección</th>
          <th>Cedula</th>
        </tr>
      </thead>
      <tbody>
      {clientes.map((cliente) => (
          <tr key={cliente.id_cliente}>
            <td>{cliente.id_cliente}</td>
            <td>{cliente.primer_nombre}</td>
            <td>{cliente.segundo_nombre}</td>
            <td>{cliente.primer_apellido}</td>
            <td>{cliente.segundo_apellido}</td>
            <td>{cliente.celular}</td>
            <td>{cliente.direccion}</td>
            <td>{cliente.cedula}</td>
                
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaClientes;