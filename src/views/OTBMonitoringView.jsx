// src/views/OTBMonitoringView.jsx

import React from 'react';
import { Container, Title, Text, Center } from '@mantine/core';

const OTBMonitoringView = () => {
  return (
    <Container size="xl" py="xl">
        <Center style={{ height: 'calc(100vh - 120px)' }}>
            <Title order={1} c="dimmed">
                OTB Monitoring (Working on Visuals...)
            </Title>
        </Center>
    </Container>
  );
};

export default OTBMonitoringView;