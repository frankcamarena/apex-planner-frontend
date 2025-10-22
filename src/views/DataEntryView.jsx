// src/views/DataEntryView.jsx

import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Box, Title, Stack, Group, Alert, Select } from '@mantine/core'; 
import { IconAlertCircle } from '@tabler/icons-react'; 
import { useCreateBudgetOTB } from '../hooks/useData';

// Arrays de datos para los selectores
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const YEARS = ['2025', '2026', '2027']; 

function DataEntryView() {
    const createOTBMutation = useCreateBudgetOTB();
    const currentYear = new Date().getFullYear().toString();
    
    const form = useForm({
        initialValues: {
            dept_id: '',
            allocated_receipts: '',
            month: 'JAN', 
            year: YEARS.includes(currentYear) ? currentYear : '2025', 
        },
        validate: {
            dept_id: (value) => value === '' ? 'Department ID is required' : (isNaN(Number(value)) ? 'Must be a number' : null),
            allocated_receipts: (value) => value === '' ? 'Budget amount is required' : (isNaN(Number(value)) ? 'Must be a number' : null),
            month: (value) => !value ? 'Month is required' : null,
            year: (value) => !value ? 'Year is required' : null,
        },
    });

    // LÓGICA DE LIMPIEZA DEL FORMULARIO AL ÉXITO
    useEffect(() => {
        if (createOTBMutation.isSuccess) {
            // Limpia los campos de entrada de usuario
            form.setValues({
                dept_id: '',
                allocated_receipts: '',
            });
            // Esto asegura que el mensaje de éxito se muestre solo al enviar
            createOTBMutation.reset(); 
        }
    }, [createOTBMutation.isSuccess, createOTBMutation.reset, form]); 


    const handleSubmit = (values) => {
        // Objeto de datos enviado al Backend
        const dataToSend = {
            dept_id: Number(values.dept_id),
            allocated_receipts: Number(values.allocated_receipts),
            
            // Mapeo de nombres
            fiscal_month: values.month, 
            fiscal_year: Number(values.year), 
            
            // CAMBIO CRÍTICO: Usar un valor positivo para based_on_cogs_ly
            based_on_cogs_ly: 100000, // Enviar un valor positivo
            otb_status: "OPEN", 
        };

        createOTBMutation.mutate(dataToSend);
    };

    return (
        <Box p="lg" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Stack spacing="xl">
                <Title order={1} c="dark">Open-to-Buy Data Entry</Title>
                <Title order={3} c="dark">Enter new Allocated Receipts</Title>
                
                {/* Mensajes de feedback */}
                {createOTBMutation.isSuccess && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Success" color="green">
                        Budget entry successful! Dashboard data will update shortly.
                    </Alert>
                )}

                {createOTBMutation.isError && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                        Failed to submit budget. The API returned an error (likely a 422 data validation failure).
                    </Alert>
                )}

                <Box w={400} p="xl" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white' }}>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="Department ID"
                                placeholder="E.g., 100"
                                required
                                {...form.getInputProps('dept_id')}
                            />
                            <TextInput
                                label="Allocated Receipts ($)"
                                placeholder="E.g., 500000"
                                required
                                {...form.getInputProps('allocated_receipts')}
                            />
                            
                            <Select
                                label="Fiscal Month"
                                placeholder="Select month"
                                required
                                data={MONTHS}
                                {...form.getInputProps('month')}
                            />

                            <Select
                                label="Fiscal Year"
                                placeholder="Select year"
                                required
                                data={YEARS}
                                {...form.getInputProps('year')}
                            />

                            <Group justify="flex-end" mt="md">
                                <Button 
                                    type="submit" 
                                    loading={createOTBMutation.isPending}
                                >
                                    Submit Budget Entry
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Box>
    );
}

export default DataEntryView;