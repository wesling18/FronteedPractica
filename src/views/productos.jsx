
import React, { useState, useEffect } from 'react'; 
import { Container, Button, Col, Row } from "react-bootstrap";
import TablaProducto from '../components/producto/Tablaproducto';// Importa el componente de tabla
import ModalRegistroProducto from '../components/producto/ModalRegistroProductos';
import CuadroBusquedas from '../components/busquedas/Cuadrobusqueda';
import ModalEdicionProductos from '../components/producto/ModalActualizacionProductos';
import ModalEliminacionProductos from '../components/producto/ModalEliminarProductos';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


// Declaración del componente Categorias
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaProducto, setListaProducto] = useState([]); // Almacena los datos de la API
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });


   const [productoFiltradas, setProductoFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
  
    const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ProductoAEliminar, setProductoAEliminar] = useState(null);
  
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProductos = async () => { // Método renombrado a español
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las productos');
      }
      const datos = await respuesta.json();
      setListaProducto(datos);    // Actualiza el estado con los datos
      setProductoFiltradas(datos  )
      setCargando(false);           // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);           // Termina la carga aunque haya error
    }
  };

  // Obtener categorías para el dropdown
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categoria');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerProductos();            // Ejecuta la función al montar el componente
    obtenerCategorias();
  }, []);                           // Array vacío para que solo se ejecute una vez

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria || 
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        descripcion_producto: '',
        id_categoria: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };


  
const eliminarProducto = async () => {
  if (!ProductoAEliminar) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/api/eliminarproductos/${ProductoAEliminar.id_producto}`, {
      method: 'DELETE',
    });

    if (!respuesta.ok) {
      throw new Error('Error al eliminar la producto');
    }

    await obtenerProductos(); // Refresca la lista
    setMostrarModalEliminacion(false);
    establecerPaginaActual(1); // Regresa a la primera página
    setProductoAEliminar(null);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};


const abrirModalEliminacion = (producto) => {
  setProductoAEliminar(producto);
  setMostrarModalEliminacion(true);
};


const manejarCambioInputEdicion = (e) => {
  const { name, value } = e.target;
  setProductoEditado(prev => ({
    ...prev,
    [name]: value
  }));
};


const actualizarProductos = async () => {
    if (
      !productoEditado?.nombre_producto ||
      !productoEditado?.descripcion_producto ||
      !productoEditado?.id_categoria ||
      !productoEditado?.precio_unitario ||
      !productoEditado?.stock
    ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarproductos/${productoEditado.id_producto}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_producto: productoEditado.nombre_producto,
            descripcion_producto: productoEditado.descripcion_producto,
            id_categoria: productoEditado.id_categoria,
            precio_unitario: productoEditado.precio_unitario,
            stock: productoEditado.stock,
            imagen: productoEditado.imagen // Incluir imagen
          }),
        }
      );

      if (!respuesta.ok) {
        const errorData = await respuesta.json(); // Obtener detalles del error
        throw new Error(errorData.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
      }

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message); // Mostrar el mensaje de error en la vista
      console.error('Error al actualizar:', error);
    }
  };


const abrirModalEdicion = (producto) => {
  setProductoEditado(producto);
  setMostrarModalEdicion(true);
};


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
    const filtradas = ListaProducto.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion_producto.toLowerCase().includes(texto)
    );
    setProductoFiltradas(filtradas);
  };
  

  // Calcular elementos paginados
    const productoPaginadas = productoFiltradas.slice(
      (paginaActual - 1) * elementosPorPagina,
      paginaActual * elementosPorPagina
    );


const generarPDFProductos = () => {
    const doc = new jsPDF();
    
    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F'); // Ajuste dinámico al ancho total
    
    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Descripción", "Categoría", "Precio", "Stock"];
    
    // Asegurarse de que `productoFiltradas` está correctamente definido
    if (!productoFiltradas || productoFiltradas.length === 0) {
        console.error("No hay datos disponibles para generar el PDF.");
        return;
    }

    const filas = productoFiltradas.map(producto => [
        producto.id_producto,
        producto.nombre_producto,
        producto.descripcion_producto,
        producto.id_categoria,
        `C$${producto.precio_unitario.toFixed(2)}`, // Formato correcto con dos decimales
        producto.stock
    ]);

    autoTable(doc, {
        head: [columnas],
        body: filas,  // Corregido: `body: filas`
        startY: 40,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        margin: { top: 20, left: 14, right: 14 },
        tableWidth: "auto",
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' }
        },
        pageBreak: "auto",
        rowPageBreak: "auto",
        didDrawPage: function (data) {
            const alturaPagina = doc.internal.pageSize.getHeight();
            const anchoPagina = doc.internal.pageSize.getWidth();
            const numeroPagina = doc.internal.getNumberOfPages();

            // Ajuste correcto de pie de página
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const piePagina = `Página ${numeroPagina} de ${doc.internal.getNumberOfPages()}`;
            doc.text(piePagina, anchoPagina / 2, alturaPagina - 10, { align: "center" });
        },
    });

    // Guardar el PDF con nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
};

    const generarPDFDetalleProducto = (producto) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre_producto, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    if (producto.imagen) {
        const propiedadesImagen = pdf.getImageProperties(producto.imagen);
        const anchoImagen = 100;
        const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
        const posicionX = (anchoPagina - anchoImagen) / 2;

        pdf.addImage(producto.imagen, "JPEG", posicionX, 40, anchoImagen, altoImagen);
        posicionY = 40 + altoImagen + 10;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`Descripción: ${producto.descripcion_producto}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Categoría: ${producto.id_categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Precio: $${producto.precio_unitario}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 38, { align: "center" });

    pdf.save(`${producto.nombre_producto}.pdf`);
    };


    const exportarExcelProductos = () => {
      // Estructura de datos para la hoja Excel
      const datos = productoFiltradas.map((producto) => ({
          ID: producto.id_producto,
          Nombre: producto.nombre_producto,
          Descripcion: producto.descripcion_producto,
          Id_Categoria: producto.id_categoria,
          Precio: parseFloat(producto.precio_unitario),
          Stock: producto.stock
      }));

      // Crear hoja y libro Excel
          const hoja = XLSX.utils.json_to_sheet(datos);
          const libro = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

          // Crear el archivo binario
          const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });4


          // Guardar el Excel con un nombre basado en la fecha actual
          const fecha = new Date();
          const dia = String(fecha.getDate()).padStart(2, '0');
          const mes = String(fecha.getMonth() + 1).padStart(2, '0');
          const anio = fecha.getFullYear();

          const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

          // Guardar archivo
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, nombreArchivo);
    }

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        <Row>
        <Col lg={2} md={4} sm={4} xs={5}> 
        <Button variant="primary" onClick={() => setMostrarModal(true)}  style={{ width: "100%"}}>
          Nuevo Producto
        </Button>
        </Col>

        <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={generarPDFProductos}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar reporte PDF
        </Button>
      </Col>

      <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={exportarExcelProductos}
          variant="secondary"
          style={{ width: "100%" }}
        >
          Generar Excel
        </Button>
      </Col>


        <Col lg={6} md={8} sm={8} xs={7}> 
              <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
          </Col>

        </Row>
        <br/>


        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaProducto
          productos={productoPaginadas} 
          cargando={cargando} 
          error={errorCarga} 
          totalElementos={ListaProducto.length} // Total de elementos
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          generarPDFDetalleProducto={generarPDFDetalleProducto}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          categorias={listaCategorias}
        />

      <ModalEliminacionProductos
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminarProducto}
        />


        <ModalEdicionProductos
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProductos}
          errorCarga={errorCarga}
        />

        

      </Container>
    </>
  );
};

// Exportación del componente
export default Productos;