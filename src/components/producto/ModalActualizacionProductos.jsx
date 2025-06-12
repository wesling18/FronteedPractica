import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ModalActualizacionProducto = ({ mostrarModal, setMostrarModal, producto, actualizarProducto, errorCarga }) => {
  const [nombre_producto, setNombreProducto] = useState('');
  const [descripcion_producto, setDescripcionProducto] = useState('');
  const [id_categoria, setIdCategoria] = useState('');
  const [precio_unitario, setPrecioUnitario] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (producto) {
      setNombreProducto(producto.nombre_producto || '');
      setDescripcionProducto(producto.descripcion_producto || '');
      setIdCategoria(producto.id_categoria || '');
      setPrecioUnitario(producto.precio_unitario || '');
      setStock(producto.stock || '');
      setImagen(producto.imagen || '');
    }
  }, [producto]);

  const handleActualizarProducto = () => {
    if (!nombre_producto || !id_categoria || !precio_unitario || !stock) {
      setLocalError('Por favor, completa todos los campos requeridos: nombre, categoría, precio y stock.');
      return;
    }
    const productoActualizado = {
      id_producto: producto.id_producto,
      nombre_producto,
      descripcion_producto,
      id_categoria,
      precio_unitario: parseFloat(precio_unitario),
      stock: parseInt(stock),
      imagen
    };
    actualizarProducto(productoActualizado); // Pasar el objeto actualizado
    setLocalError(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Nombre del Producto *</Form.Label>
            <Form.Control type="text" value={nombre_producto} onChange={e => setNombreProducto(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" value={descripcion_producto} onChange={e => setDescripcionProducto(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID Categoría *</Form.Label>
            <Form.Control type="number" value={id_categoria} onChange={e => setIdCategoria(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio Unitario *</Form.Label>
            <Form.Control type="number" step="0.01" value={precio_unitario} onChange={e => setPrecioUnitario(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Stock *</Form.Label>
            <Form.Control type="number" value={stock} onChange={e => setStock(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Imagen (URL)</Form.Label>
            <Form.Control type="text" value={imagen} onChange={e => setImagen(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleActualizarProducto}>
          Actualizar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionProducto;