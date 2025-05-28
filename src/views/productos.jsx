import React, { useState, useEffect } from 'react';
import Tablaproducto from '../components/producto/Tablaproducto'; // Asumiendo que tienes este componente
import ModalRegistroProductos from '../components/producto/ModalRegistroProductos';
import { Container, Button, Col } from "react-bootstrap";

// Corrección de la importación de jsPDF y jspdf-autotable
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Corregido 'jspdf-autoble' a 'jspdf-autotable'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Productos = () => { // Corrección de 'productos' a 'Productos' (convención de React)
  const [listaProductos, setListaProductos] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
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

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

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

  // Generar PDF de todos los productos
  const generarPDFproductos = () => {
    const doc = new jsPDF(); 

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F'); 

    // Título centrado con texto blanco 
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Descripción", "Categoria", "Precio", "Stock"];
    const filas = listaProductos.map((producto) => [ //  'productosFiltrados' a 'listaProductos'
      producto.id_producto,
      producto.nombre_producto,
      producto.descripcion_producto,
      producto.id_categoria,
      `C$ ${producto.precio_unitario}`,
      producto.stock
    ]);

    // Configuración de la tabla
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      margin: {
        top: 20,
        left: 14,
        right: 14
      },
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
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina}`; // Corrección: Simplificado sin totalPaginas
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      }
    });

    // Guardar el PDF con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  // Generar PDF de detalle de un producto
  const generarPDFDetalleProducto = (producto) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre_producto, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 30;

    if (producto.imagen) {
      const anchoImagen = 100;
      const altoImagen = (producto.imagen.height * anchoImagen) / producto.imagen.width; // Corrección: 'productoImagenes' a 'producto'
      const posicionX = (anchoPagina - anchoImagen) / 2;
      pdf.addImage(producto.imagen, "JPEG", posicionX, 40, anchoImagen, altoImagen);
      posicionY = 40 + altoImagen + 10;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text(`Descripción: ${producto.descripcion_producto}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Categoría: ${producto.id_categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Precio: $${producto.precio_unitario}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 30, { align: "center" });

    // Corrección: Agregar guardado del PDF
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `Producto_${producto.id_producto}_${dia}${mes}${anio}.pdf`;
    pdf.save(nombreArchivo);
  };

  // Exportar a Excel
  const exportarExcelProductos = () => {
    // Estructura de datos para la hoja Excel
    const datos = listaProductos.map((producto) => ({ // Corrección: 'productosFiltrados' a 'listaProductos'
      ID: producto.id_producto,
      Nombre: producto.nombre_producto,
      Descripción: producto.descripcion_producto,
      ID_Categoria: producto.id_categoria,
      Precio: parseFloat(producto.precio_unitario),
      Stock: producto.stock
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>
      <Button variant="primary" onClick={() => setMostrarModal(true)}>
        Nuevo Producto
      </Button>
      <br/><br/>

      <Tablaproducto
        productos={listaProductos} 
        cargando={cargando} 
        error={errorCarga} 
      />

      <Col lg={3} md={4} sm={4} xs={5}>
        <Button
          className="mb-3"
          onClick={generarPDFproductos}
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

   
      <ModalRegistroProductos
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
      />
    </Container>
  );
};

export default Productos; // Corrección: Coincide con el nombre del componente