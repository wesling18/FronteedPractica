import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorEmpleado = ({ empleados, total_ventas }) => {
const data = {
  labels: empleados, // Nombres de los empleados
  datasets: [
    {
      label: 'Ventas(C$)',
      data: total_ventas, // Total de ventas por empleado
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
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default VentasPorEmpleado;


