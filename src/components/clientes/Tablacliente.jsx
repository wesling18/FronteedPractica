import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TablaClientes = ({
  clientes,
  cargando,
  error,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  if (cargando) {
    return <div>Cargando clientes...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Función para determinar la clase de la fila según el id_cliente
  const getRowClass = (id) => {
    const modulo = id % 5;
    switch (modulo) {
      case 0:
        return "table-active";
      case 1:
        return "table-success";
      case 2:
        return "table-warning";
      case 3:
        return "table-danger";
      case 4:
        return "table-info";
      default:
        return "";
    }
  };

  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>ID Cliente</th>
          <th>Primer Nombre</th>
          <th>Segundo Nombre</th>
          <th>Primer Apellido</th>
          <th>Segundo Apellido</th>
          <th>Celular</th>
          <th>Dirección</th>
          <th>Cédula</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id_cliente} className={getRowClass(cliente.id_cliente)}>
            <td>{cliente.id_cliente}</td>
            <td>{cliente.primer_nombre}</td>
            <td>{cliente.segundo_nombre}</td>
            <td>{cliente.primer_apellido}</td>
            <td>{cliente.segundo_apellido}</td>
            <td>{cliente.celular}</td>
            <td>{cliente.direccion}</td>
            <td>{cliente.cedula}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                onClick={() => abrirModalEdicion(cliente)}
                title="Editar cliente"
                className="me-2"
              >
                🕷️
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => abrirModalEliminacion(cliente)}
                title="Eliminar cliente"
              >
                🗑️
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaClientes;