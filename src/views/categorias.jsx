// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categoria/TablaCategorias';
import ModalRegistroCategoria from '../components/categoria/ModalRegistroCategoria';
import CuadroBusqueda from '../components/busquedas/CuadroBusqueda';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Categorias
const categorias = () => {
  // Estados para manejar los datos, carga y errores
  const [listaCategorias, setListaCategorias] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion_categoria: ''
  });

//
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  //
  const obtenerCategorias = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/categoria');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const datos = await respuesta.json();
        setListaCategorias(datos);    // Actualiza el estado con los datos
        setCategoriasFiltradas(datos);//jueputa
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerCategorias();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez


// Maneja los cambios en los inputs del modal
const manejarCambioInput = (e) => {
  const { name, value } = e.target;
  setNuevaCategoria(prev => ({
    ...prev,
    [name]: value
  }));
};


 // Manejo la inserción de una nueva categoría
 const agregarCategoria = async () => {
  if (!nuevaCategoria.nombre_categoria || !nuevaCategoria.descripcion_categoria) {
  setErrorCarga("Por favor, completa todos los campos antes de guardar.");
  return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCategoria),
    });

    if (!respuesta.ok) {
      throw new Error('Error al agregar la categoría');
    }

    await obtenerCategorias(); // Refresca toda la lista desde el servidor
    setNuevaCategoria({ nombre_categoria: '', descripcion_categoria: '' });
    setMostrarModal(false);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};

const manejarCambioBusqueda = (e) => {
  const texto = e.target.value.toLowerCase();//Manejo del cambio de busqueda.
  setTextoBusqueda(texto);
  
  const filtradas = listaCategorias.filter(
    (categoria) =>
      categoria.nombre_categoria.toLowerCase().includes(texto) ||
      categoria.descripcion_categoria.toLowerCase().includes(texto)
  );
  setCategoriasFiltradas(filtradas);
};







  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Categorías</h4>

       

     
  <Row>

    <Col lg={2} md={4} sm={4} xs={5}>
      <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
        Nueva Categoría
      </Button>
    </Col>
    <Col lg={5} md={8} sm={8} xs={7}>
      <CuadroBusqueda
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />
    </Col>
    
  </Row>




        <br/><br/>

        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaCategorias 

          categorias={categoriasFiltradas} 
          cargando={cargando} 
          error={errorCarga} 
        />

      <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
          errorCarga={errorCarga}
        />

      </Container>
    </>
  );
};

// Exportación del componente
export default categorias;
