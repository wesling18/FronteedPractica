import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import './App.css';
import Encabezado from "./components/encabezado/Encabezado";
import Clientes from "./views/clientes"; 
import Productos from "./views/productos";
import Categorias from "./views/categorias";
import Ventas from "./views/ventas";
import Usuarios from "./views/usuario";


const App = () => {
  return (
    
    <Router>
      <main className="margen-superior-main">
      <Encabezado/>
        <Routes>
       

        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/usuarios" element={<Usuarios />} />

        </Routes>
      </main>
    </Router>
  );
};

export default App;