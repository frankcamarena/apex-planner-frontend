// src/components/KPICard.jsx
import { Card, Text, Title, Badge } from '@mantine/core';
import React from 'react';

function KPICard({ title, value, isAlert, color }) {
  const formatValue = (val) => {
    if (title.includes('$')) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    if (title.includes('%')) return `${val.toFixed(1)}%`;
    return val;
  };

  const alertColor = isAlert ? "red" : "green";

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Label / KPI Title */}
        <Text fz="sm" c="dimmed" mb="xs">
            {title}
        </Text>

        {/* KPI Value */}
        <Title 
            order={2} 
            c={isAlert !== undefined ? alertColor : color} 
        >
            {formatValue(value)}
        </Title>
        
        {/* Help Text (Variance: Surplus / Deficit) */}
        {title.includes('Variance') && (
             <Text fz="xs" c="dimmed" mt="xs">
                {value > 0 ? 'Surplus' : 'Risk / Deficit'} 
             </Text>
        )}
    </Card>
  );
}

export default KPICard;