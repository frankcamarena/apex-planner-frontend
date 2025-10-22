// src/App.jsx (Actualizado para incluir AboutMVPView)

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Group, Box, Title, Space } from '@mantine/core'; 

// Importar todas las vistas
import DashboardView from './views/DashboardView'; // Ahora el Dashboard principal
import OTBMonitoringView from './views/OTBMonitoringView'; // Si renombras la vista de resumen
import DataEntryView from './views/DataEntryView'; 
import ProductDetailView from './views/ProductDetailView'; 
import PlanningIntelligenceView from './views/PlanningIntelligenceView';
import AboutMVPView from './views/AboutMVPView'; // <-- NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      {/* Barra de Navegación */}
      <Box p="lg" style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <Group justify="space-between">
          <Title order={2}>Apex Planner</Title>
          <Group>
            {/* Botón para Dashboard */}
            <Button component={Link} to="/" variant="subtle">Dashboard</Button>
            
            {/* Botón para OTB Monitoring (Detalle de la varianza) */}
            <Button component={Link} to="/otb-monitoring" variant="subtle">OTB Monitoring</Button>
            
            {/* Botón para Planning Intelligence */}
            <Button component={Link} to="/planning-intelligence" variant="subtle" color="teal">
              Planning Intelligence
            </Button>
            
            {/* Botón para Data Entry */}
            <Button component={Link} to="/data-entry" variant="filled">Data Entry</Button>

            {/* Botón para el Resumen del MVP */}
            <Button component={Link} to="/about" variant="subtle" color="gray">About MVP</Button>
          </Group>
        </Group>
      </Box>
      <Space h="md" />
      
      {/* Definición de Rutas */}
      <Routes>
        <Route path="/" element={<DashboardView />} />
        
        {/* RUTA NUEVA: OTB Monitoring (Usando la estructura del Dashboard anterior) */}
        {/* Nota: Necesitas crear/renombrar OTBMonitoringView si aún no existe */}
        <Route path="/otb-monitoring" element={<OTBMonitoringView />} /> 

        {/* RUTA: Planning Intelligence */}
        <Route path="/planning-intelligence" element={<PlanningIntelligenceView />} />

        <Route path="/data-entry" element={<DataEntryView />} />
        
        {/* RUTA: About MVP */}
        <Route path="/about" element={<AboutMVPView />} />

        {/* Ruta para el detalle de productos */}
        <Route path="/products/:deptId" element={<ProductDetailView />} /> 
      </Routes>
    </Router>
  );
}

export default App;