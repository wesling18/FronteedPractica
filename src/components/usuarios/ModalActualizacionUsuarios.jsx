import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ModalActualizacionUsuario = ({ mostrarModal, setMostrarModal, usuario, actualizarUsuario, errorCarga }) => {
  const [usuarioEdit, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setUsuario(usuario.usuario || '');
      setContraseña(usuario.contraseña || '');
    }
  }, [usuario]);

  const handleActualizarUsuario = () => {
    if (!usuarioEdit || !contraseña) {
      setLocalError('Por favor, completa todos los campos requeridos: usuario y contraseña.');
      return;
    }
    const usuarioActualizado = {
      id_usuario: usuario.id_usuario,
      usuario: usuarioEdit,
      contraseña
    };
    actualizarUsuario(usuarioActualizado);
    setLocalError(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Usuario *</Form.Label>
            <Form.Control type="text" value={usuarioEdit} onChange={e => setUsuario(e.target.value)} />
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
        <Button variant="primary" onClick={handleActualizarUsuario}>
          Actualizar Usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionUsuario;