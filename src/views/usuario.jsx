import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import TablaUsuarios from     '../components/usuarios/Tablausuario';                              
import ModalRegistroUsuario from '../components/usuarios/ModalRegistroUsuarios';
import ModalActualizacionUsuario from '../components/usuarios/ModalActualizacionUsuarios';
import ModalEliminacionUsuario from '../components/usuarios/ModalEliminacionUsuario';

const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios');
      if (!respuesta.ok) throw new Error('Error al cargar los usuarios');
      const datos = await respuesta.json();
      setListaUsuarios(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarusuarios/${usuarioAEliminar.id_usuario}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar el usuario');
      setMostrarModalEliminacion(false);
      await obtenerUsuarios();
      setUsuarioAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminacion(true);
  };

  const agregarUsuario = async (usuarioData) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarusuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
      });
      if (!respuesta.ok) throw new Error('Error al registrar el usuario');
      await obtenerUsuarios();
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarusuarios/${usuarioActualizado.id_usuario}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActualizado),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el usuario');
      await obtenerUsuarios();
      setMostrarModalActualizacion(false);
      setUsuarioAEditar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Usuarios</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
            Nuevo Usuario
          </Button>
        </Col>
      </Row>
      <br />
      {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
      <TablaUsuarios
        usuarios={listaUsuarios}
        cargando={cargando}
        error={errorCarga}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={(usuario) => { setUsuarioAEditar(usuario); setMostrarModalActualizacion(true); }}
      />
      <ModalEliminacionUsuario
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarUsuario={eliminarUsuario}
      />
      <ModalRegistroUsuario
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        agregarUsuario={agregarUsuario}
        errorCarga={errorCarga}
      />
      <ModalActualizacionUsuario
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        usuario={usuarioAEditar}
        actualizarUsuario={actualizarUsuario}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Usuarios;