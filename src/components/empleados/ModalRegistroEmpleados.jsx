import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ModalRegistroEmpleado = ({ mostrarModal, setMostrarModal, agregarEmpleado, errorCarga }) => {
  const [primer_nombre, setPrimerNombre] = useState('');
  const [segundo_nombre, setSegundoNombre] = useState('');
  const [primer_apellido, setPrimerApellido] = useState('');
  const [segundo_apellido, setSegundoApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [cargo, setCargo] = useState('');
  const [fecha_contratacion, setFechaContratacion] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleAgregarEmpleado = () => {
    if (!primer_nombre || !primer_apellido || !celular || !cargo || !fecha_contratacion) {
      setLocalError('Por favor, completa todos los campos requeridos.');
      return;
    }
    const empleadoData = {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      celular,
      cargo,
      fecha_contratacion
    };
    agregarEmpleado(empleadoData);
    setPrimerNombre('');
    setSegundoNombre('');
    setPrimerApellido('');
    setSegundoApellido('');
    setCelular('');
    setCargo('');
    setFechaContratacion('');
    setLocalError(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Primer Nombre *</Form.Label>
            <Form.Control type="text" value={primer_nombre} onChange={e => setPrimerNombre(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Segundo Nombre</Form.Label>
            <Form.Control type="text" value={segundo_nombre} onChange={e => setSegundoNombre(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Primer Apellido *</Form.Label>
            <Form.Control type="text" value={primer_apellido} onChange={e => setPrimerApellido(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control type="text" value={segundo_apellido} onChange={e => setSegundoApellido(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Celular *</Form.Label>
            <Form.Control type="text" value={celular} onChange={e => setCelular(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cargo *</Form.Label>
            <Form.Control type="text" value={cargo} onChange={e => setCargo(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha Contratación *</Form.Label>
            <Form.Control type="date" value={fecha_contratacion} onChange={e => setFechaContratacion(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregarEmpleado}>
          Guardar Empleado
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;