// src/views/BacktestingView.jsx

import React from 'react';
import { Container, Title, Text, SimpleGrid, Card, Badge, Table, Group, ThemeIcon } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconUser, IconRobot } from '@tabler/icons-react';

// Mock Data for Backtesting Comparison (e.g., 2025 Q1)
const comparisonData = {
    // Key Performance Indicators
    'Total Buy Value ($)': { human: 4500000, ai: 4200000 },
    'Achieved Gross Margin (%)': { human: 58.5, ai: 62.1 },
    'High Risk Exposure (%)': { human: 22.0, ai: 15.0 },
    'Stock-to-Sales Ratio': { human: 4.5, ai: 3.8 },
};

// Function to determine the "better" value and financial delta
const getComparisonMetrics = (kpi, humanValue, aiValue) => {
    let delta = aiValue - humanValue;
    let deltaPct = (delta / humanValue) * 100;
    
    // Determine the 'better' value (higher is better for Margin, lower for Risk/S-t-S)
    let isAIBetter;
    let color;

    if (kpi === 'Achieved Gross Margin (%)') {
        isAIBetter = aiValue > humanValue;
        color = isAIBetter ? 'teal' : 'red';
    } else if (kpi === 'High Risk Exposure (%)' || kpi === 'Stock-to-Sales Ratio') {
        isAIBetter = aiValue < humanValue; // Lower is better for risk/efficiency
        color = isAIBetter ? 'teal' : 'red';
        delta = humanValue - aiValue; // Show reduction as positive
        deltaPct = (delta / humanValue) * 100;
    } else {
        isAIBetter = true; // Neutral for Buy Value in this context
        color = 'gray';
    }

    return {
        delta: delta,
        deltaPct: deltaPct,
        color: color,
        isAIBetter: isAIBetter
    };
};

const BacktestingView = () => {
    return (
        <Container size="xl" py="xl">
            <Title order={1} mb="md">Backtesting & Value Assessment</Title>
            <Text size="lg" mb="xl" c="dimmed">
                Analysis of Intelligent Recommendation vs. Actual Results for 2025 Q1 to quantify the financial delta and benchmark AI performance.
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
                {/* --- Human Output Card --- */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group align="flex-start" mb="md">
                        <ThemeIcon size="lg" radius="xl" color="gray"><IconUser size={24} /></ThemeIcon>
                        <Title order={3}>Human Buy (Actual Results)</Title>
                    </Group>
                    <Text size="lg" fw={500} c="dimmed">Strategy: Traditional Buyer Discretion</Text>
                </Card>

                {/* --- AI Output Card --- */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group align="flex-start" mb="md">
                        <ThemeIcon size="lg" radius="xl" color="blue"><IconRobot size={24} /></ThemeIcon>
                        <Title order={3}>AI Recommendation (Greedy Algorithm)</Title>
                    </Group>
                    <Text size="lg" fw={500} c="dimmed">Strategy: Maximize IMU% under Risk Constraint</Text>
                </Card>
            </SimpleGrid>

            {/* --- Comparison Table --- */}
            <Title order={2} mt="xl" mb="md">KPI Delta Comparison (2025 Q1)</Title>
            <Table withRowBorders withTableBorder striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: '40%' }}>KEY PERFORMANCE INDICATOR</Table.Th>
                        <Table.Th>HUMAN ACTUAL</Table.Th>
                        <Table.Th>AI RECOMMENDATION</Table.Th>
                        <Table.Th>IMPACT/DELTA</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {Object.entries(comparisonData).map(([kpi, data]) => {
                        const metrics = getComparisonMetrics(kpi, data.human, data.ai);
                        
                        // Formatting
                        const humanValue = kpi.includes('$') ? `$${data.human.toLocaleString()}` : `${data.human}%`;
                        const aiValue = kpi.includes('$') ? `$${data.ai.toLocaleString()}` : `${data.ai}%`;
                        const deltaSign = metrics.isAIBetter ? '+' : '-';
                        const formattedDelta = kpi.includes('$') ? `$${Math.abs(metrics.delta).toLocaleString()}` : `${Math.abs(metrics.delta).toFixed(1)}%`;
                        
                        return (
                            <Table.Tr key={kpi}>
                                <Table.Td fw={500}>{kpi}</Table.Td>
                                <Table.Td>{humanValue}</Table.Td>
                                <Table.Td>{aiValue}</Table.Td>
                                <Table.Td>
                                    <Group spacing="xs">
                                        <Badge color={metrics.color} variant="light">
                                            {metrics.isAIBetter ? 'BETTER' : 'WORSE'}
                                        </Badge>
                                        <Text c={metrics.color} fw={700}>
                                            {deltaSign}
                                            {formattedDelta}
                                        </Text>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Container>
    );
};

export default BacktestingView;