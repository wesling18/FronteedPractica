
import React, { useState, useEffect } from 'react'; 
import { Container } from "react-bootstrap";
import TablaProducto from '../components/producto/Tablaproducto';// Importa el componente de tabla

// Declaración del componente Categorias
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaProducto, setListaProducto] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerProductos = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las productos');
        }
        const datos = await respuesta.json();
        setListaProducto(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerProductos();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaProducto
          productos={ListaProducto} 
          cargando={cargando} 
          error={errorCarga} 
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Productos;