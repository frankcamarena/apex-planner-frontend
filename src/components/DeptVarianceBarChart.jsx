// src/components/DeptVarianceBarChart.jsx

import React from 'react';
import { BarChart } from '@mantine/charts';
import { Card, Title, Text, Center } from '@mantine/core';

// Función de formato de moneda (simplificada para usar notación de miles/millones)
const formatCurrency = (val) => {
    // Usamos el valor absoluto para formatear
    const absVal = Math.abs(val);
    
    if (absVal >= 1000000) {
        return `${(absVal / 1000000).toFixed(1)}M`;
    }
    if (absVal >= 1000) {
        return `${(absVal / 1000).toFixed(0)}K`; // Redondear a miles
    }
    return absVal.toFixed(0);
};

// Formateador para el eje de valores (para agregar el signo de dólar y el formato K/M)
const valueAxisFormatter = (value) => `$${formatCurrency(value)}`;

function DeptVarianceBarChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Center h={350}>
                    <Text c="dimmed">[No variance data available for this period.]</Text>
                </Center>
            </Card>
        );
    }
    
    const chartData = data.map(item => ({
        // CLAVE DE CATEGORÍA: El departamento
        dept: item.dept, 
        // CLAVE DE VALOR: La varianza
        Variance: item.variance,
    }));
    
    const numDepartments = data.length;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Variance Breakdown by Department (Selected Period)</Title>
            <BarChart
                // La altura debe ser generosa para barras horizontales
                h={numDepartments * 50 + 100} 
                data={chartData}
                dataKey="dept" // CLAVE DE CATEGORÍA: 'dept' (Eje Y)
                series={[{ name: 'Variance', color: 'blue.6' }]}
                
                orientation="horizontal" // FORZAMOS ORIENTACIÓN HORIZONTAL
                
                // AXIS Y (Etiquetas de Categoría/Departamento)
                yAxisProps={{ 
                    tickFormatter: (label) => label, // Mostrar etiqueta de texto
                    tickCount: numDepartments,
                }} 
                
                // AXIS X (Valores de Varianza)
                xAxisProps={{ 
                    tickFormatter: valueAxisFormatter, // Aplicamos el formato K/M
                    tickCount: 5, 
                }} 
                
                // Solución al color negro: Añadir un fondo transparente al hover.
                // Aunque esto idealmente va en CSS global, a veces Mantine acepta estilos
                // para el componente padre. Si esto falla, el problema es CSS.
                style={{ '&:hover .mantine-BarChart-bar': { opacity: 0.8 } }}
                
                seriesColor={({ Variance }) => (Variance < 0 ? 'red' : 'green')} 
                tooltipAnimationDuration={200}
                withTooltip
                withLegend
                unit="$"
            />
        </Card>
    );
}

export default DeptVarianceBarChart;