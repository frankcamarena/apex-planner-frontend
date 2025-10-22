// src/components/VarianceChart.jsx

import React from 'react';
import { Card, Title, Text, Box } from '@mantine/core';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis, // Importado
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Función de utilidad para formatear valores grandes en el eje (e.g., 1000000 -> $1M)
const formatAxisValue = (value) => {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
};

// Función de utilidad para formatear moneda (usada en Tooltip)
const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

// Contenido del Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const variancePayload = payload.find(p => p.dataKey === 'totalVariance');
        const budgetPayload = payload.find(p => p.dataKey === 'totalBudget');
        
        return (
            <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
            }}>
                <Text fw={700} size="sm">{label}</Text>
                {variancePayload && (
                    <Text size="sm" color="green">
                        Variance: {formatCurrency(variancePayload.value)}
                    </Text>
                )}
                {budgetPayload && (
                    <Text size="sm" color="blue">
                        Budget: {formatCurrency(budgetPayload.value)}
                    </Text>
                )}
            </div>
        );
    }
    return null;
};


function VarianceChart({ data }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Box h={350}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 15, bottom: 0 }} 
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthYear" />
                        {/* Aplicamos la función de abreviación al Eje Y */}
                        <YAxis tickFormatter={formatAxisValue} /> 
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Area 
                            type="monotone" 
                            dataKey="totalVariance" 
                            stroke="#40c057" 
                            fill="#40c057" 
                            fillOpacity={0.6}
                            name="Variance $"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="totalBudget" 
                            stroke="#228be6" 
                            fill="#228be6" 
                            fillOpacity={0.1}
                            name="Budget $"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Card>
    );
}

export default VarianceChart;