import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import TablaEmpleados from '../components/empleados/TablaEmpleados';
import ModalRegistroEmpleado from '../components/empleados/ModalRegistroEmpleados';
import ModalActualizacionEmpleado from '../components/empleados/ModalActualizacionEmpleados.jsx';
import ModalEliminacionEmpleado from '../components/empleados/ModalEliminarEmpleados.jsx';

const Empleados = () => {
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const respuesta = await fetch('http://localhost:3000/api/empleados');
      if (!respuesta.ok) throw new Error('Error al cargar los empleados');
      const datos = await respuesta.json();
      setListaEmpleados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarempleados/${empleadoAEliminar.id_empleado}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar el empleado');
      setMostrarModalEliminacion(false);
      await obtenerEmpleados();
      setEmpleadoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  const agregarEmpleado = async (empleadoData) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarEmpleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
      });
      if (!respuesta.ok) throw new Error('Error al registrar el empleado');
      await obtenerEmpleados();
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarEmpleado = async (empleadoActualizado) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarempleados/${empleadoActualizado.id_empleado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoActualizado),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el empleado');
      await obtenerEmpleados();
      setMostrarModalActualizacion(false);
      setEmpleadoAEditar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Gestión de Empleados</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
            Nuevo Empleado
          </Button>
        </Col>
      </Row>
      <br />
      {errorCarga && <Alert variant="danger">Error: {errorCarga}</Alert>}
      <TablaEmpleados
        empleados={listaEmpleados}
        cargando={cargando}
        error={errorCarga}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalActualizacion={(empleado) => { setEmpleadoAEditar(empleado); setMostrarModalActualizacion(true); }}
      />
      <ModalEliminacionEmpleado
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarEmpleado={eliminarEmpleado}
      />
      <ModalRegistroEmpleado
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        agregarEmpleado={agregarEmpleado}
        errorCarga={errorCarga}
      />
      <ModalActualizacionEmpleado
        mostrarModal={mostrarModalActualizacion}
        setMostrarModal={setMostrarModalActualizacion}
        empleado={empleadoAEditar}
        actualizarEmpleado={actualizarEmpleado}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Empleados;