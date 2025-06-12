import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionClientes = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditado,
  manejarCambioInputEdicion,
  actualizarCliente,
  errorCarga,
}) => {
  const [idCliente, setIdCliente] = useState(clienteEditado?.id_cliente || '');

  useEffect(() => {
    if (clienteEditado) {
      setIdCliente(clienteEditado.id_cliente || '');
    }
  }, [clienteEditado]);

  const handleActualizarCliente = () => {
    const datos = {
      id_cliente: idCliente,
      primer_nombre: clienteEditado?.primer_nombre || '',
      segundo_nombre: clienteEditado?.segundo_nombre || '',
      primer_apellido: clienteEditado?.primer_apellido || '',
      segundo_apellido: clienteEditado?.segundo_apellido || '',
      celular: clienteEditado?.celular || '',
      direccion: clienteEditado?.direccion || '',
      cedula: clienteEditado?.cedula || '',
    };
    console.log('Datos a enviar:', datos); // Depuración
    if (!datos.primer_nombre || !datos.primer_apellido || !datos.cedula || !datos.celular) {
      alert('Por favor, complete todos los campos obligatorios (Primer Nombre, Primer Apellido, Cédula, Celular).');
      return;
    }
    actualizarCliente(datos);
    setMostrarModalEdicion(false);
  };

  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formPrimerNombre">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="primer_nombre"
              value={clienteEditado?.primer_nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el primer nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSegundoNombre">
            <Form.Label>Segundo Nombre</Form.Label>
            <Form.Control
              type="text"
              name="segundo_nombre"
              value={clienteEditado?.segundo_nombre || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el segundo nombre (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrimerApellido">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="primer_apellido"
              value={clienteEditado?.primer_apellido || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el primer apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSegundoApellido">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="segundo_apellido"
              value={clienteEditado?.segundo_apellido || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el segundo apellido (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCelular">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={clienteEditado?.celular || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el número de celular (8 dígitos)"
              maxLength={8}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={clienteEditado?.direccion || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la dirección (máx. 150 caracteres)"
              maxLength={150}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteEditado?.cedula || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la cédula (máx. 14 caracteres)"
              maxLength={14}
              required
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleActualizarCliente}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionClientes;