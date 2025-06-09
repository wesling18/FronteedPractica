import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalEdicionCliente from "../components/clientes/ModalEdicionClientes";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionClientes";
import ModalRegistroCliente from "../components/clientes/ModalRegistroClientes";
import TablaClientes from "../components/clientes/Tablacliente";
import CuadroBusqueda from "../components/busquedas/CuadroBusqueda";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [clienteEditado, setClienteEditado] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular: "",
    direccion: "",
    cedula: "",
  });

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes");
      if (!respuesta.ok) throw new Error("Error al cargar los clientes");
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos); // Inicializa la lista filtrada
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const actualizarCliente = async () => {
    if (
      !clienteEditado?.primer_nombre ||
      !clienteEditado?.primer_apellido ||
      !clienteEditado?.celular ||
      !clienteEditado?.cedula
    ) {
      setErrorCarga("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarCliente/${clienteEditado.id_cliente}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteEditado),
        }
      );

      if (!respuesta.ok) throw new Error("Error al actualizar el cliente");

      await obtenerClientes();
      setMostrarModalEdicion(false);
      setClienteEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCliente = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarCliente/${clienteAEliminar.id_cliente}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) throw new Error("Error al eliminar el cliente");

      await obtenerClientes();
      setMostrarModalEliminacion(false);
      setClienteAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const registrarCliente = async () => {
    if (
      !nuevoCliente.primer_nombre ||
      !nuevoCliente.primer_apellido ||
      !nuevoCliente.celular ||
      !nuevoCliente.cedula
    ) {
      setErrorCarga("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarclientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.mensaje || "Error al registrar el cliente");
      }

      await obtenerClientes();
      setMostrarModalRegistro(false);
      setNuevoCliente({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        celular: "",
        direccion: "",
        cedula: "",
      });
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditado(cliente);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioInputRegistro = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.primer_nombre.toLowerCase().includes(texto) ||
        cliente.primer_apellido.toLowerCase().includes(texto) ||
        cliente.cedula.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  return (
    <Container className="mt-5">
      <h4>Clientes</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            style={{ width: "100%" }}
            onClick={() => setMostrarModalRegistro(true)}
          >
            Nuevo Cliente
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusqueda
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br />
      <br />
      <TablaClientes
        clientes={clientesFiltrados}
        cargando={cargando}
        error={errorCarga}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
      />
      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditado={clienteEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarCliente={actualizarCliente}
        errorCarga={errorCarga}
      />
      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        clienteAEliminar={clienteAEliminar}
        eliminarCliente={eliminarCliente}
      />
      <ModalRegistroCliente
        mostrarModalRegistro={mostrarModalRegistro}
        setMostrarModalRegistro={setMostrarModalRegistro}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInputRegistro}
        registrarCliente={registrarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Clientes;