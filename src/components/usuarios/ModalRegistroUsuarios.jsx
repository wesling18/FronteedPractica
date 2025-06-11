import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ModalRegistroUsuario = ({ mostrarModal, setMostrarModal, agregarUsuario, errorCarga }) => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleAgregarUsuario = () => {
    if (!usuario || !contraseña) {
      setLocalError('Por favor, completa todos los campos requeridos: usuario y contraseña.');
      return;
    }
    const usuarioData = {
      usuario,
      contraseña
    };
    agregarUsuario(usuarioData);
    setUsuario('');
    setContraseña('');
    setLocalError(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Usuario *</Form.Label>
            <Form.Control type="text" value={usuario} onChange={e => setUsuario(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregarUsuario}>
          Guardar Usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroUsuario;