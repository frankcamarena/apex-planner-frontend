// src/views/ProductDetailView.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Title, Text, Stack, Center, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ProductTable from '../components/ProductTable'; // Componente que crearemos
import { useProductsByDept } from '../hooks/useData';

function ProductDetailView() {
    // Obtener el dept_id de la URL. Si la ruta es /products/100, deptId será '100'.
    const { deptId } = useParams(); 
    const deptNumber = Number(deptId); 

    const { data: products, isLoading, isError } = useProductsByDept(deptNumber);

    if (isLoading) {
        return <Center h="100vh"><Loader size="xl" /></Center>;
    }
    if (isError) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Connection Error" color="red" m="lg">
                Error loading product data for Department {deptId}.
            </Alert>
        );
    }
    if (!products || products.length === 0) {
        return (
             <Alert title="No Data Found" color="yellow" m="lg">
                No products found for Department {deptId}.
            </Alert>
        );
    }

    return (
        <Box p="lg" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Stack spacing="xl">
                <Title order={1} c="dark">Product Detail View</Title>
                <Title order={2} c="dark">Department {deptId} Inventory Summary</Title>
                
                <ProductTable products={products} />
            </Stack>
        </Box>
    );
}

export default ProductDetailView;