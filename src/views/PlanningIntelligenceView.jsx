// src/views/PlanningIntelligenceView.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { Title, Card, Text, Box, Group, Table, Stack, Center, Loader, Alert, TextInput, Checkbox, Badge, SimpleGrid } from '@mantine/core';
import { IconAlertCircle, IconShoppingCartCheck, IconMinus, IconPercentage, IconCurrencyDollar } from '@tabler/icons-react';
import { useAllProductsData } from '../hooks/useData'; // Hook con el mock

// --- UTILITY FUNCTIONS ---
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
}).format(val);

// --- MAIN COMPONENT ---

function PlanningIntelligenceView() {
    // 1. ESTADOS DE CONFIGURACIÓN Y SELECCIÓN
    const [maxCapacity, setMaxCapacity] = useState(1000000); // $1M por defecto
    const [maxRiskPct, setMaxRiskPct] = useState(15); // 15% por defecto
    const [selectedStyles, setSelectedStyles] = useState({}); // { style_id: { cost, riskCategory } }

    // 2. OBTENER DATOS (del mock)
    const { data: allProducts, isLoading, isError } = useAllProductsData();

    // 3. PROCESAMIENTO Y PRIORIZACIÓN DE DATOS
    const processedProducts = useMemo(() => {
        if (!allProducts || allProducts.length === 0) return [];

        // 1. ORDENAR por Priority Score (IMU%) de mayor a menor
        let sorted = [...allProducts].sort((a, b) => b.priority_score - a.priority_score);

        let currentBuyCost = 0;
        let highRiskCount = 0;
        
        // Límite de estilos de Alto Riesgo permitido (basado en el total de estilos)
        const highRiskLimit = Math.ceil(sorted.length * (maxRiskPct / 100));

        // 2. GENERAR RECOMENDACIÓN AUTOMÁTICA (Algoritmo Greedy)
        return sorted.map(product => {
            const productBuyCost = product.buy_cost;
            const isHighRisk = product.risk_category === 'High Risk';
            let recommendation = 'PASS';
            
            // Si el estilo actual cabe en el presupuesto restante
            if (currentBuyCost + productBuyCost <= maxCapacity) {
                if (!isHighRisk) {
                    // Riesgo Bajo/Medio: BUY
                    recommendation = 'BUY';
                    currentBuyCost += productBuyCost;
                } else {
                    // Riesgo Alto: BUY solo si no excede la tolerancia al riesgo
                    if (highRiskCount < highRiskLimit) {
                        recommendation = 'BUY';
                        currentBuyCost += productBuyCost;
                        highRiskCount++;
                    } else {
                         recommendation = 'PASS (Risk Limit)';
                    }
                }
            } else if (currentBuyCost <= maxCapacity) {
                 recommendation = 'PASS (Capacity)';
            }
            
            return {
                ...product,
                recommendation: recommendation,
            };
        });

    }, [allProducts, maxCapacity, maxRiskPct]);


    // 4. LÓGICA DE SELECCIÓN MANUAL Y CÁLCULO DE KPIS
    
    // Función para manejar la selección manual del checkbox
    const handleSelectStyle = useCallback((styleId, cost, riskCategory, isChecked) => {
        setSelectedStyles(prev => {
            const newState = { ...prev };
            if (isChecked) {
                newState[styleId] = { cost, riskCategory };
            } else {
                delete newState[styleId];
            }
            return newState;
        });
    }, []);

    // Cálculo de KPIS de resumen para la selección manual
    const buySummary = useMemo(() => {
        const totalBuy = Object.values(selectedStyles).reduce((sum, s) => sum + s.cost, 0);
        const highRiskBuyCount = Object.values(selectedStyles).filter(s => s.riskCategory === 'High Risk').length;
        const totalSelected = Object.keys(selectedStyles).length;
        
        const highRiskPct = totalSelected > 0 ? (highRiskBuyCount / totalSelected) * 100 : 0;

        return {
            totalBuy,
            remainingCapacity: maxCapacity - totalBuy,
            highRiskPct,
            totalSelected
        };
    }, [selectedStyles, maxCapacity]);


    // --- RENDERING ---

    if (isLoading) {
        return <Center h="100vh"><Loader size="xl" /></Center>;
    }

    if (isError) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Connection Error" color="red" m="lg">
                Error al cargar los datos de productos. Usando mock de datos.
            </Alert>
        );
    }
    
    // Contenido de la tabla
    let tableContent;

    if (processedProducts.length === 0) {
        tableContent = (
             <Table.Tr><Table.Td colSpan={8}><Center p="md"><Text c="dimmed">No product data available.</Text></Center></Table.Td></Table.Tr>
        );
    } else {
        tableContent = processedProducts.map((item) => {
            const isSelected = !!selectedStyles[item.style_id];
            const recommendationColor = item.recommendation.includes('BUY') ? 'green' : 'red';
            const riskColor = item.risk_category === 'Low Risk' ? 'green' : (item.risk_category === 'Medium Risk' ? 'yellow' : 'red');

            return (
                <Table.Tr key={item.style_id} style={{ backgroundColor: isSelected ? '#e0f7ff' : 'white' }}>
                    <Table.Td style={{ fontWeight: 'bold' }}>{item.style_id}</Table.Td>
                    <Table.Td>{`Dept ${item.dept_id}`}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(item.buy_cost)}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{item.imu_percent ? item.imu_percent.toFixed(1) : 'N/A'}%</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{item.priority_score ? item.priority_score.toFixed(1) : 'N/A'}</Table.Td>
                    
                    <Table.Td>
                        <Badge color={riskColor} variant="light">{item.risk_category}</Badge>
                    </Table.Td>
                    
                    <Table.Td>
                        <Badge color={recommendationColor} variant="filled">{item.recommendation}</Badge>
                    </Table.Td>
                    
                    <Table.Td>
                        <Center>
                            <Checkbox 
                                checked={isSelected}
                                onChange={(event) => 
                                    handleSelectStyle(item.style_id, item.buy_cost, item.risk_category, event.currentTarget.checked)
                                }
                            />
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        });
    }


    return (
        <Box p="lg" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Stack spacing="xl">
                <Title order={1} c="dark">Planning Intelligence Module</Title>

                {/* --- INPUTS DE CONFIGURACIÓN --- */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">1. Set Planning Constraints</Title>
                    <Group align="flex-end" spacing="lg">
                        <TextInput
                            label="Max Buy Capacity ($)"
                            placeholder="e.g., 1000000"
                            value={maxCapacity}
                            onChange={(event) => setMaxCapacity(Number(event.currentTarget.value) || 0)}
                            type="number"
                            icon={<IconCurrencyDollar size={16} />}
                            w={200}
                        />
                        <TextInput
                            label="Max High Risk Tolerance (%)"
                            placeholder="e.g., 15"
                            value={maxRiskPct}
                            onChange={(event) => setMaxRiskPct(Number(event.currentTarget.value) || 0)}
                            type="number"
                            icon={<IconPercentage size={16} />}
                            w={200}
                        />
                         <Text fz="sm" c="dimmed">
                            *The "Recommendation" column is calculated based on these constraints.
                        </Text>
                    </Group>
                </Card>

                {/* --- KPIS DE RESULTADOS --- */}
                <Title order={3} c="dark">2. Selected Buy Summary</Title>
                <SimpleGrid cols={4} spacing="xl">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between">
                            <Text fz="xs" c="dimmed">Total Selected Items</Text>
                            <IconShoppingCartCheck size={20} color='blue' />
                        </Group>
                        <Title order={2} c="dark">{buySummary.totalSelected}</Title>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                         <Group justify="space-between">
                            <Text fz="xs" c="dimmed">Current Buy $</Text>
                            <IconCurrencyDollar size={20} color='blue' />
                        </Group>
                        <Title order={2} c="blue">{formatCurrency(buySummary.totalBuy)}</Title>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                         <Group justify="space-between">
                            <Text fz="xs" c="dimmed">Remaining Capacity $</Text>
                            <IconMinus size={20} color='green' />
                        </Group>
                        <Title order={2} c={buySummary.remainingCapacity < 0 ? 'red' : 'green'}>
                            {formatCurrency(buySummary.remainingCapacity)}
                        </Title>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                         <Group justify="space-between">
                            <Text fz="xs" c="dimmed">High Risk % of Selected</Text>
                            <IconPercentage size={20} color='red' />
                        </Group>
                        <Title order={2} c={buySummary.highRiskPct > maxRiskPct ? 'red' : 'dark'}>
                            {buySummary.highRiskPct.toFixed(1)}%
                        </Title>
                    </Card>
                </SimpleGrid>


                {/* --- TABLA DE PRIORIZACIÓN --- */}
                <Title order={3} c="dark">3. Product Prioritization Table</Title>
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
                                <Table.Th>Style ID</Table.Th>
                                <Table.Th>Dept</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Buy $</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>IMU %</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>Priority Score</Table.Th>
                                <Table.Th>Risk Category</Table.Th>
                                <Table.Th>Recommendation</Table.Th>
                                <Table.Th>Select for Buy</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tableContent}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Stack>
        </Box>
    );
}

export default PlanningIntelligenceView;