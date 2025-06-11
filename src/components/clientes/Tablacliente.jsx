// Importaciones necesarias para el componente visual
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';


// Declaración del componente TablaCategorias que recibe props
const TablaClientes  = ({ clientes, 
  cargando, 
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion 
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
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
          
          <th>Acciones</th>
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

            <td>

              <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(cliente)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>


                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(cliente)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
              </td>
                
          </tr>
        ))}
      </tbody>
    </Table>


    <Paginacion
    elementosPorPagina={elementosPorPagina}
    totalElementos={totalElementos}
    paginaActual={paginaActual}
    establecerPaginaActual={establecerPaginaActual}
    />

    </>
  );
};

// Exportación del componente
export default TablaClientes;