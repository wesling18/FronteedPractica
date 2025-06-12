import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalEliminacionVenta = ({ mostrarModalEliminacion, setMostrarModalEliminacion, eliminarVenta, venta }) => {
  const handleEliminar = () => {
    if (venta && venta.id_venta) {
      eliminarVenta(venta.id_venta);
    }
  };

  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de eliminar esta venta?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;