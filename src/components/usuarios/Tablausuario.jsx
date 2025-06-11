import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TablaUsuarios= ({ usuarios, cargando, error, abrirModalEliminacion, abrirModalActualizacion }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID Usuario</th>
          <th>Usuario</th>
          <th>Contraseña</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cargando ? (
          <tr><td colSpan="4">Cargando...</td></tr>
        ) : error ? (
          <tr><td colSpan="4">Error: {error}</td></tr>
        ) : usuarios.length === 0 ? (
          <tr><td colSpan="4">No hay usuarios registrados</td></tr>
        ) : (
          usuarios.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.usuario}</td>
              <td>{'*'.repeat(usuario.contraseña.length)}</td> {/* Ocultar contraseña por seguridad */}
              <td>
                <Button variant="warning" onClick={() => abrirModalActualizacion(usuario)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => abrirModalEliminacion(usuario)}>
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

export default TablaUsuarios;