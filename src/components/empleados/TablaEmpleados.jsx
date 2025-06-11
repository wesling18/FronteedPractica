import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TablaEmpleados = ({ empleados, cargando, error, abrirModalEliminacion, abrirModalActualizacion }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID Empleado</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Celular</th>
          <th>Cargo</th>
          <th>Fecha Contratación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cargando ? (
          <tr><td colSpan="7">Cargando...</td></tr>
        ) : error ? (
          <tr><td colSpan="7">Error: {error}</td></tr>
        ) : empleados.length === 0 ? (
          <tr><td colSpan="7">No hay empleados registrados</td></tr>
        ) : (
          empleados.map(empleado => (
            <tr key={empleado.id_empleado}>
              <td>{empleado.id_empleado}</td>
              <td>{empleado.primer_nombre} {empleado.segundo_nombre}</td>
              <td>{empleado.primer_apellido} {empleado.segundo_apellido}</td>
              <td>{empleado.celular}</td>
              <td>{empleado.cargo}</td>
              <td>{empleado.fecha_contratacion}</td>
              <td>
                <Button variant="warning" onClick={() => abrirModalActualizacion(empleado)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => abrirModalEliminacion(empleado)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default TablaEmpleados;