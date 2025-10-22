// src/components/DeptSummaryTable.jsx
import { Table, Card, Text, Badge } from '@mantine/core';
import React from 'react';

function DeptSummaryTable({ data }) {
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const rows = data.map((item, index) => (
        <Table.Tr key={index} style={{ cursor: 'pointer' }}>
            <Table.Td style={{ fontWeight: 'bold' }}>{item.dept}</Table.Td>
            <Table.Td align="right">{formatCurrency(item.budget)}</Table.Td>
            <Table.Td align="right">{formatCurrency(item.buy)}</Table.Td>
            
            <Table.Td align="right">
                <Badge 
                    size="lg" 
                    variant="filled" 
                    color={item.variance < 0 ? 'red' : 'green'} 
                >
                    {formatCurrency(item.variance)}
                </Badge>
            </Table.Td>
            
            {/* Margen Bruto: toFixed(1) asegura que se muestre con un decimal */}
            <Table.Td align="right">{item.margin.toFixed(1)}%</Table.Td> 
        </Table.Tr>
    ));

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
    );
}

export default DeptSummaryTable;