import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const ModalRegistroVenta = ({ 
  mostrarModal, 
  setMostrarModal, 
  nuevaVenta, 
  setNuevaVenta, 
  detallesVenta, 
  setDetallesVenta, 
  agregarDetalle, 
  agregarVenta, 
  errorCarga, 
  clientes, 
  empleados, 
  productos 
}) => {
  const [idCliente, setIdCliente] = useState(nuevaVenta.id_cliente);
  const [idEmpleado, setIdEmpleado] = useState(nuevaVenta.id_empleado);
  const [fechaVenta, setFechaVenta] = useState(nuevaVenta.fecha_venta || new Date());
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: 1, precio_unitario: 0 });

  useEffect(() => {
    setIdCliente(nuevaVenta.id_cliente || '');
    setIdEmpleado(nuevaVenta.id_empleado || '');
    setFechaVenta(nuevaVenta.fecha_venta ? new Date(nuevaVenta.fecha_venta) : new Date());
    console.log('Productos disponibles en el modal:', productos); // Depuración
  }, [nuevaVenta, productos]);

  const agregarDetalleLocal = () => {
    console.log('Intentando agregar detalle con id_producto:', nuevoDetalle.id_producto, typeof nuevoDetalle.id_producto); // Depuración
    if (!nuevoDetalle.id_producto || nuevoDetalle.cantidad <= 0 || nuevoDetalle.precio_unitario <= 0) {
      alert('Por favor, complete todos los campos del detalle con valores válidos.');
      return;
    }
    const productoSeleccionado = productos.find(p => p.id_producto === Number(nuevoDetalle.id_producto));
    console.log('Producto seleccionado:', productoSeleccionado); // Depuración
    if (!productoSeleccionado) {
      alert('Producto no encontrado. Seleccione un producto válido.');
      return;
    }
    agregarDetalle({
      ...nuevoDetalle,
      nombre_producto: productoSeleccionado.nombre_producto
    });
    setNuevoDetalle({ id_producto: '', cantidad: 1, precio_unitario: 0 });
  };

  const calcularTotal = () => {
    return detallesVenta.reduce((total, detalle) => total + detalle.cantidad * detalle.precio_unitario, 0);
  };

  const handleAgregarVenta = () => {
    const totalVenta = calcularTotal();
    if (!idCliente || !idEmpleado || !fechaVenta || detallesVenta.length === 0) {
      alert('Por favor, complete todos los campos (cliente, empleado, fecha y al menos un detalle).');
      return;
    }
    setNuevaVenta({
      ...nuevaVenta,
      id_cliente: idCliente,
      id_empleado: idEmpleado,
      fecha_venta: fechaVenta,
      total_venta: totalVenta
    });
    agregarVenta({
      id_cliente: idCliente,
      id_empleado: idEmpleado,
      fecha_venta: fechaVenta.toISOString().slice(0, 19).replace('T', ' '),
      total_venta: totalVenta,
      detalles: detallesVenta.map(d => ({ id_producto: d.id_producto, cantidad: d.cantidad, precio_unitario: d.precio_unitario }))
    });
    setMostrarModal(false);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <div className="text-danger">{errorCarga}</div>}
        <Form>
          <Form.Group>
            <Form.Label>Cliente</Form.Label>
            <Form.Control as="select" value={idCliente || ''} onChange={e => setIdCliente(e.target.value)}>
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
            <Form.Control as="select" value={idEmpleado || ''} onChange={e => setIdEmpleado(e.target.value)}>
              <option value="">Seleccione un empleado</option>
              {empleados.map(empleado => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.primer_nombre} {empleado.primer_apellido}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha de Venta</Form.Label>
            <Form.Control type="date" value={fechaVenta.toISOString().split('T')[0]} onChange={e => {
              const [year, month, day] = e.target.value.split('-');
              setFechaVenta(new Date(year, month - 1, day));
            }} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hora de Venta</Form.Label>
            <Form.Control type="time" value={fechaVenta.toTimeString().split(' ')[0].substring(0, 5)} onChange={e => {
              const [hours, minutes] = e.target.value.split(':');
              setFechaVenta(new Date(fechaVenta.setHours(hours, minutes, 0, 0)));
            }} />
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
                  <td>{detalle.nombre_producto || 'Producto no encontrado'}</td>
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
            <Form.Control as="select" value={nuevoDetalle.id_producto} onChange={e => {
              const producto = productos.find(p => p.id_producto === Number(e.target.value));
              setNuevoDetalle({ 
                ...nuevoDetalle, 
                id_producto: e.target.value, 
                precio_unitario: producto ? producto.precio_unitario || nuevoDetalle.precio_unitario : nuevoDetalle.precio_unitario 
              });
            }}>
              <option value="">Seleccione un producto</option>
              {productos.length > 0 ? (
                productos.map(producto => (
                  <option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombre_producto}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay productos disponibles</option>
              )}
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
          <Button onClick={agregarDetalleLocal}>Agregar Detalle</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregarVenta}>
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;