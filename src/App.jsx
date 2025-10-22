// src/App.jsx (Actualizado con Planning Intelligence)

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Group, Box, Title, Space } from '@mantine/core'; 
import DashboardView from './views/DashboardView';
import DataEntryView from './views/DataEntryView'; 
import ProductDetailView from './views/ProductDetailView';
import PlanningIntelligenceView from './views/PlanningIntelligenceView'; // <-- NUEVA IMPORTACIÓN

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
            
            {/* Botón para Planning Intelligence */}
            <Button component={Link} to="/planning-intelligence" variant="subtle" color="teal">
              Planning Intelligence
            </Button>

            {/* Botón para Data Entry */}
            <Button component={Link} to="/data-entry" variant="filled">Data Entry</Button>
          </Group>
        </Group>
      </Box>
      <Space h="md" />
      
      {/* Definición de Rutas */}
      <Routes>
        <Route path="/" element={<DashboardView />} />
        
        {/* RUTA NUEVA: Planning Intelligence */}
        <Route path="/planning-intelligence" element={<PlanningIntelligenceView />} />

        <Route path="/data-entry" element={<DataEntryView />} />
        
        {/* Ruta para el detalle de productos (manteniéndola) */}
        <Route path="/products/:deptId" element={<ProductDetailView />} /> 
      </Routes>
    </Router>
  );
}

export default App;