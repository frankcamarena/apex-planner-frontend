// src/components/ProductTable.jsx
import { Table, Card, Text } from '@mantine/core';
import React from 'react';

// Función para calcular el Initial Markup (Margen Bruto Inicial)
const calculateIMU = (retail, cost) => {
    if (retail <= 0) return 0;
    return (1 - (cost / retail)) * 100; // Devuelve en porcentaje
};

function ProductTable({ products }) {
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const rows = products.map((item, index) => {
        const imu = calculateIMU(item.initial_retail_price, item.initial_cost);
        
        return (
            <Table.Tr key={index} style={{ cursor: 'pointer' }}>
                <Table.Td style={{ fontWeight: 'bold' }}>{item.style_id}</Table.Td>
                <Table.Td>{item.color_id}</Table.Td>
                <Table.Td>{item.size_us}</Table.Td>
                <Table.Td align="right">{formatCurrency(item.initial_cost)}</Table.Td>
                <Table.Td align="right">{formatCurrency(item.initial_retail_price)}</Table.Td>
                <Table.Td align="right">{imu.toFixed(1)}%</Table.Td>
            </Table.Tr>
        );
    });

    return (
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
                        <Table.Th>Color</Table.Th>
                        <Table.Th>Size</Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>Cost $</Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>Retail $</Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>IMU %</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Text fz="sm" c="dimmed" mt="md">
                IMU % (Initial Markup) is calculated as: 1 - (Cost / Retail Price).
            </Text>
        </Card>
    );
}

export default ProductTable;