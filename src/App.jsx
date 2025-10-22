// src/App.jsx (Updated to include Backtesting View)

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Group, Box, Title, Space } from '@mantine/core'; 

// Import all views
import DashboardView from './views/DashboardView'; 
import DataEntryView from './views/DataEntryView'; 
import ProductDetailView from './views/ProductDetailView'; 
import PlanningIntelligenceView from './views/PlanningIntelligenceView';
import AboutMVPView from './views/AboutMVPView'; 
import BacktestingView from './views/BacktestingView'; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <Box p="lg" style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <Group justify="space-between">
          <Title order={2}>Apex Planner</Title>
          <Group>
            {/* Dashboard */}
            <Button component={Link} to="/" variant="subtle">Dashboard</Button>
            
            {/* Planning Intelligence (Main Action) */}
            <Button component={Link} to="/planning-intelligence" variant="filled" color="teal">
              Planning Intelligence
            </Button>
            
            {/* Data Entry (Secondary Action) */}
            <Button component={Link} to="/data-entry" variant="filled">Data Entry</Button>
            
            {/* Backtesting & Value Assessment (New Button) */}
            <Button component={Link} to="/backtesting" variant="subtle" color="orange">Backtesting</Button>

            {/* About MVP */}
            <Button component={Link} to="/about" variant="subtle" color="gray">About MVP</Button>
          </Group>
        </Group>
      </Box>
      <Space h="md" />
      
      {/* Routing Definition */}
      <Routes>
        <Route path="/" element={<DashboardView />} />
        
        {/* Planning Intelligence */}
        <Route path="/planning-intelligence" element={<PlanningIntelligenceView />} />

        <Route path="/data-entry" element={<DataEntryView />} />
        
        {/* NEW ROUTE: Backtesting */}
        <Route path="/backtesting" element={<BacktestingView />} />

        {/* About MVP */}
        <Route path="/about" element={<AboutMVPView />} />

        {/* Product Detail (kept for data-entry flow) */}
        <Route path="/products/:deptId" element={<ProductDetailView />} /> 
      </Routes>
    </Router>
  );
}

export default App;