// src/views/OTBMonitoringView.jsx
import React from 'react';
import { Container, Title, Text, SimpleGrid, Card, Badge, Table, Group, Center } from '@mantine/core';

// Datos Mock (Basados en el OTB de la hoja de cálculo)
const varianceData = [
    { dept: '100 - Slippers', plan: 1068000, actual: 428400, variance: 639600 },
    { dept: '200 - Dress', plan: 620000, actual: 428400, variance: 191600 },
    { dept: '300 - Casual', plan: 500000, actual: 509200, variance: -9200 }, // Sobrecumplido (negativo)
    { dept: '500 - Sneakers', plan: 500000, actual: 232370, variance: 267630 },
    { dept: '580 - Performance', plan: 600000, actual: 420576, variance: 179424 },
    { dept: '800 - Sandals', plan: 600000, actual: 322642, variance: 277358 },
    { dept: '900 - Clogs', plan: 900000, actual: 772670, variance: 127330 },
];

const getVarianceBadge = (variance) => {
    if (variance > 500000) return <Badge color="red">High Variance</Badge>;
    if (variance > 0) return <Badge color="orange">Under-Bought</Badge>;
    if (variance < 0) return <Badge color="teal">Over-Bought</Badge>;
    return <Badge color="gray">On Plan</Badge>;
};

const OTBMonitoringView = () => {
  const totalVariance = varianceData.reduce((sum, item) => sum + item.variance, 0);

  // Simulación del componente de Gráfico de Barras
  const VarianceChartMock = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Variance Breakdown by Department</Title>
        <Text c="dimmed" size="sm" mb="sm">
            Visualización de la varianza entre el OTB Planificado y la Compra Real (Mock Chart).
        </Text>
        <Center style={{ height: 250, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <Text c="gray" fw={500}>Gráfico de Barras - Datos simulados</Text>
        </Center>
    </Card>
  );

  return (
    <Container size="xl" py="xl">
        <Title order={1} mb="lg">OTB Monitoring</Title>
        <Text size="lg" mb="xl">
            Análisis detallado de la varianza del OTB por departamento para el Período actual.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4}>Total OTB Variance</Title>
                <Text size="xl" fw={700} style={{ color: totalVariance >= 0 ? 'orange' : 'teal' }}>
                    {totalVariance >= 0 ? '$' : '-$'}{Math.abs(totalVariance).toLocaleString('en-US')}
                </Text>
                <Text c="dimmed" size="sm">
                    {totalVariance >= 0 ? 'Capacidad restante (Sub-Bought).' : 'Exceso de compra (Over-Bought). '}
                </Text>
            </Card>
            <VarianceChartMock />
        </SimpleGrid>

        <Title order={2} mt="xl" mb="md">Detailed Variance Table</Title>
        <Table withRowBorders withTableBorder striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>DEPT</Table.Th>
                    <Table.Th>Planned Buy ($)</Table.Th>
                    <Table.Th>Actual Buy ($)</Table.Th>
                    <Table.Th>Variance ($)</Table.Th>
                    <Table.Th>Status</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {varianceData.map((item) => (
                    <Table.Tr key={item.dept}>
                        <Table.Td>{item.dept}</Table.Td>
                        <Table.Td>{item.plan.toLocaleString('en-US')}</Table.Td>
                        <Table.Td>{item.actual.toLocaleString('en-US')}</Table.Td>
                        <Table.Td style={{ color: item.variance >= 0 ? 'orange' : 'teal' }}>
                             {item.variance >= 0 ? '$' : '-$'}{Math.abs(item.variance).toLocaleString('en-US')}
                        </Table.Td>
                        <Table.Td>{getVarianceBadge(item.variance)}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Container>
  );
};

export default OTBMonitoringView;