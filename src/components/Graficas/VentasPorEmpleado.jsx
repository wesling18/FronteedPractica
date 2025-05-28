import { Card, Button } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const VentasPorEmpleado = ({ empleados, total_ventas }) => {
  const chartRef = useRef(null);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(28, 41, 51);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Reporte de Ventas por Empleado', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    const chartInstance = chartRef.current;
    const chartCanvas = chartInstance?.canvas;
    const chartImage = chartCanvas?.toDataURL('image/png', 1.0);
    doc.addImage(chartImage, 'PNG', 14, 40, 180, 180);

    const columnas = ['Empleado', 'Ventas (C$)'];
    const filas = empleados.map((empleado, index) => [empleado, total_ventas[index]]);
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 230,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 28, left: 14, right: 14 },
    });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `VentasPorEmpleado_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  const data = {
    labels: empleados,
    datasets: [
      {
        label: 'Ventas(C$)',
        data: total_ventas,
        backgroundColor: 'rgba(190, 192, 75, 0.2)',
        borderColor: 'rgb(192, 124, 75)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Córdobas (C$)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Empleados',
        },
      },
    },
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Ventas por empleado</Card.Title>
        <div style={{ height: "300px", justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Bar ref={chartRef} data={data} options={options} />
        </div>
        <Button className="btn btn-primary mt-3" onClick={generarPDF}>
          Generar Reporte <i className="bi bi-download"></i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default VentasPorEmpleado;