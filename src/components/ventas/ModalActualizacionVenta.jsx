import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';

const ModalActualizacionVenta = ({ mostrarModal, setMostrarModal, venta, detalles, clientes, empleados, productos, actualizarVenta, updateError }) => {
  const [idCliente, setIdCliente] = useState(venta?.id_cliente || '');
  const [idEmpleado, setIdEmpleado] = useState(venta?.id_empleado || '');
  const [fechaVenta, setFechaVenta] = useState(venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date());
  const [detallesVenta, setDetallesVenta] = useState(detalles || []);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: 1, precio_unitario: 0 });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setIdCliente(venta?.id_cliente || '');
    setIdEmpleado(venta?.id_empleado || '');
    setFechaVenta(venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date());
    setDetallesVenta(detalles || []);
    setLocalError(null);
  }, [venta, detalles]);

  const agregarDetalle = () => {
    if (nuevoDetalle.id_producto && nuevoDetalle.cantidad > 0 && nuevoDetalle.precio_unitario > 0) {
      setDetallesVenta([...detallesVenta, nuevoDetalle]);
      setNuevoDetalle({ id_producto: '', cantidad: 1, precio_unitario: 0 });
    } else {
      setLocalError('Por favor, selecciona un producto, cantidad y precio válidos.');
    }
  };

  const calcularTotal = () => {
    return detallesVenta.reduce((total, detalle) => total + detalle.cantidad * detalle.precio_unitario, 0);
  };

  const handleActualizarVenta = async () => {
    if (!idCliente || !idEmpleado || detallesVenta.length === 0) {
      setLocalError('Por favor, completa todos los campos y agrega al menos un detalle.');
      return;
    }
    try {
      const totalVenta = calcularTotal();
      await actualizarVenta({
        id_venta: venta.id_venta,
        id_cliente: idCliente,
        id_empleado: idEmpleado,
        fecha_venta: fechaVenta.toISOString().slice(0, 19).replace('T', ' '),
        total_venta: totalVenta,
        detalles: detallesVenta
      });
    } catch (error) {
      setLocalError(error.message);
    }
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {updateError && <Alert variant="danger">Error: {updateError}</Alert>}
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Cliente</Form.Label>
            <Form.Control as="select" value={idCliente} onChange={e => setIdCliente(e.target.value)}>
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.primer_nombre} {cliente.primer_apellido}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Empleado</Form.Label>
            <Form.Control as="select" value={idEmpleado} onChange={e => setIdEmpleado(e.target.value)}>
              <option value="">Seleccione un empleado</option>
              {empleados.map(empleado => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.primer_nombre} {empleado.primer_apellido}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha y Hora de Venta</Form.Label>
            <Form.Control
              type="datetime-local"
              value={fechaVenta.toISOString().slice(0, 16)}
              onChange={e => setFechaVenta(new Date(e.target.value))}
            />
          </Form.Group>
          <h5>Detalles de la Venta</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {detallesVenta.map((detalle, index) => (
                <tr key={index}>
                  <td>{productos.find(p => p.id_producto === detalle.id_producto)?.nombre_producto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.precio_unitario.toFixed(2)}</td>
                  <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => setDetallesVenta(detallesVenta.filter((_, i) => i !== index))}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h6>Agregar Nuevo Detalle</h6>
          <Form.Group>
            <Form.Label>Producto</Form.Label>
            <Form.Control as="select" value={nuevoDetalle.id_producto} onChange={e => setNuevoDetalle({ ...nuevoDetalle, id_producto: e.target.value })}>
              <option value="">Seleccione un producto</option>
              {productos.map(producto => (
                <option key={producto.id_producto} value={producto.id_producto}>
                  {producto.nombre_producto}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control type="number" value={nuevoDetalle.cantidad} onChange={e => setNuevoDetalle({ ...nuevoDetalle, cantidad: parseInt(e.target.value) || 1 })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control type="number" step="0.01" value={nuevoDetalle.precio_unitario} onChange={e => setNuevoDetalle({ ...nuevoDetalle, precio_unitario: parseFloat(e.target.value) || 0 })} />
          </Form.Group>
          <Button onClick={agregarDetalle}>Agregar Detalle</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleActualizarVenta}>
          Actualizar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionVenta;