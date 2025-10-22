// src/views/DashboardView.jsx

import React, { useState } from 'react';
import { Title, SimpleGrid, Card, Text, Box, Group, Table, Stack, Center, Loader, Alert, Select } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useDashboardData } from '../hooks/useData';
import VarianceChart from '../components/VarianceChart';
import DeptVarianceBarChart from '../components/DeptVarianceBarChart'; // <-- Importado
import { Link } from 'react-router-dom';


// --- UTILITY FUNCTIONS ---

// Formato de moneda
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(val);

// --- PERIOD AND YEAR OPTIONS (AÑO CALENDARIO ESTÁNDAR) ---

// Definición de las agrupaciones por Trimestres de Año Calendario
const PERIOD_OPTIONS = [
    { value: 'JAN,FEB,MAR', label: 'Jan-Feb-Mar (Q1)' },
    { value: 'APR,MAY,JUN', label: 'Apr-May-Jun (Q2)' },
    { value: 'JUL,AUG,SEP', label: 'Jul-Aug-Sep (Q3)' },
    { value: 'OCT,NOV,DEC', label: 'Oct-Nov-Dec (Q4)' },
];

// Generar opciones de años dinámicamente
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
    { value: (CURRENT_YEAR - 1).toString(), label: (CURRENT_YEAR - 1).toString() },
    { value: CURRENT_YEAR.toString(), label: CURRENT_YEAR.toString() },
    { value: (CURRENT_YEAR + 1).toString(), label: (CURRENT_YEAR + 1).toString() },
];

// --- MAIN COMPONENT ---

function DashboardView() {
    // ESTADOS PARA FILTRO DE PERIODO/AÑO
    const [selectedPeriod, setSelectedPeriod] = useState(null); 
    const [selectedYear, setSelectedYear] = useState(null); 

    // USO DEL HOOK CON FILTROS
    const { 
        totalBudget, 
        totalBuy, 
        variance, 
        marginPct, 
        deptSummary, 
        varianceTrendData, 
        isLoading, 
        isError 
    } = useDashboardData(selectedPeriod, selectedYear); 
    
    // --- LÓGICA DE VISUALIZACIÓN DEL GRÁFICO ---
    const isFiltered = selectedPeriod !== null || selectedYear !== null;
    const showTrendChart = !isFiltered && varianceTrendData.length > 0;
    const showDeptBarChart = isFiltered && deptSummary.length > 0;

    if (isLoading) {
        return <Center h="100vh"><Loader size="xl" /></Center>;
    }

    if (isError) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Connection Error" color="red" m="lg">
                Error loading OTB data. Check your API connection.
            </Alert>
        );
    }

    // Lógica de color condicional para el KPI global
    const varianceGlobalColor = variance < 0 ? 'red' : 'green'; 
    
    // Preparar filas de la tabla de resumen
    const rows = deptSummary.map((item) => {
        const varianceColor = item.variance < 0 ? 'red' : 'green';
        
        return (
            <Table.Tr 
                key={item.dept} 
            >
                {/* Navigation Link for Dept ID */}
                <Table.Td style={{ fontWeight: 'bold' }}>
                    <Text component={Link} to={`/products/${item.dept.split(' ')[1]}`} c="blue" inherit>
                        {item.dept}
                    </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(item.budget)}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(item.buy)}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                    {/* Variance visual styling */}
                    <Text 
                        fw={700} 
                        style={{ 
                            backgroundColor: varianceColor === 'green' ? '#e0f7e9' : '#ffe6e6', 
                            color: varianceColor,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            display: 'inline-block'
                        }}
                    >
                        {formatCurrency(item.variance)}
                    </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>{item.margin.toFixed(1)}%</Table.Td>
            </Table.Tr>
        );
    });

    // Obtener la etiqueta del periodo seleccionado para el mensaje de resumen
    const periodLabel = selectedPeriod 
        ? PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label 
        : null;
    
    const yearLabel = selectedYear ? selectedYear : 'All Periods';


    return (
        <Box p="lg" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Stack spacing="xl">
                <Title order={1} c="dark">OTB Monitoring Dashboard</Title>

                {/* --- SELECTORES DE PERIODO Y AÑO CALENDARIO --- */}
                <Group justify="space-between" align="flex-end">
                    <Group>
                         <Select
                            label="Filter by Period (Quarter)"
                            placeholder="Select Quarter"
                            data={PERIOD_OPTIONS}
                            value={selectedPeriod}
                            onChange={setSelectedPeriod} 
                            clearable
                            w={250} 
                        />
                         <Select
                            label="Filter by Year" 
                            placeholder="Select Year"
                            data={YEAR_OPTIONS}
                            value={selectedYear}
                            onChange={setSelectedYear}
                            clearable
                            w={150}
                        />
                    </Group>
                    <Text fz="sm" c="dimmed" fw={700}>
                        {periodLabel && selectedYear 
                            ? `Showing Data for ${periodLabel} (${yearLabel})` 
                            : 'Showing Aggregate Data (All Periods)'}
                    </Text>
                </Group>


                {/* --- TOP KPIS (Colors and Titles in English) --- */}
                <SimpleGrid cols={4} spacing="xl">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text fz="xs" c="dimmed">OTB Budget $</Text>
                        <Title order={2} c="dark">{formatCurrency(totalBudget)}</Title> 
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text fz="xs" c="dimmed">Total Buy $</Text>
                        <Title order={2} c="blue">{formatCurrency(totalBuy)}</Title> 
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between">
                            <Text fz="xs" c="dimmed">Variance $</Text>
                            <Text fz="xs" c="dimmed">Remaining</Text> 
                        </Group>
                        <Title order={2} c={varianceGlobalColor}>{formatCurrency(variance)}</Title> 
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text fz="xs" c="dimmed">Gross Margin %</Text>
                        <Title order={2} c="grape">{marginPct.toFixed(1)}%</Title> 
                    </Card>
                </SimpleGrid>

                {/* --- CHART SECTION (Visualización Dinámica) --- */}
                <Title order={2} c="dark">
                    {isFiltered ? 'Department Variance Breakdown' : 'Budget Variance Trend'} 
                </Title>

                {/* Muestra Tendencia Histórica si NO está filtrado */}
                {showTrendChart && (
                    <VarianceChart data={varianceTrendData} />
                )}

                {/* Muestra Barras de Departamento si SÍ está filtrado */}
                {showDeptBarChart && (
                    <DeptVarianceBarChart data={deptSummary} /> 
                )}

                {/* Muestra un mensaje si no hay datos para ninguna visualización */}
                {!showTrendChart && !showDeptBarChart && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                         <Center h={350}>
                             <Text c="dimmed">
                                 [No sufficient data to display visualization for this period.]
                             </Text>
                         </Center>
                    </Card>
                )}


                {/* --- DEPARTMENT SUMMARY (Table) --- */}
                <Title order={2} c="dark">Open-to-Buy Summary by Department</Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Table 
                        striped 
                        highlightOnHover 
                        withTableBorder 
                        withColumnBorders 
                        verticalSpacing="sm"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Department</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>OTB Budget</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Total Buy</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Variance $</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Gross Margin %</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Card>
            </Stack>
        </Box>
    );
}

export default DashboardView;