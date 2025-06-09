import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  clienteAEliminar,
  eliminarCliente,
}) => {
  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar al cliente{" "}
          <strong>
            {clienteAEliminar?.primer_nombre} {clienteAEliminar?.primer_apellido}
          </strong>
          ?
        </p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarCliente}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;