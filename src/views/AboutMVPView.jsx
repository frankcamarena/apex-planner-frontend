// src/views/AboutMVPView.jsx

import React from 'react';
import { Container, Title, Text, Group, List, ListItem, Badge, Space, Divider } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconSettings, IconUpload } from '@tabler/icons-react';

const AboutMVPView = () => {
    return (
        <Container size="xl" py="xl">
            <Title order={1} mb="lg">Apex Planner: MVP Summary</Title>
            
            <Text size="lg" mb="xl" c="dimmed">
                The **Apex Planner MVP** is focused on the **Buy Decision-Making** process, using price intelligence and predefined risk rules to optimize the usage of the OTB (Open-to-Buy) budget across the entire purchasing lifecycle.
            </Text>

            <Divider my="md" label="MVP Structure: Core Views" labelPosition="left" />

            {/* --- ESTRUCTURA DE VISTAS --- */}
            <List spacing="sm" size="md" icon={<IconCheck size={18} color="teal" />}>
                <ListItem>
                    <Text span fw={700}>Dashboard:</Text> Provides a **macro overview** of the financial health of the total buy (OTB Budget, Total Buy, Variance, and Gross Margin).
                </ListItem>
                <ListItem>
                    <Text span fw={700}>OTB Monitoring:</Text> Provides a **detailed visual breakdown** of the OTB status and purchasing performance by Department and over Time (Temporal Trend).
                </ListItem>
                <ListItem>
                    <Text span fw={700}>Planning Intelligence:</Text> The core module for **Buy Decision-Making**. It applies capacity and risk constraints to generate a prioritized product purchase list.
                </ListItem>
                <ListItem>
                    <Text span fw={700}>Data Entry:</Text> The primary function for **data governance**. Allows users to **upload and manage the core data files** (e.g., OTB budgets, product costing sheets) that feed the entire system.
                </ListItem>
            </List>

            <Space h="xl" />
            <Title order={2} mb="md">Core Functionality: Planning Intelligence</Title>

            <Text mb="lg">
                The Planning Intelligence section drives value by dividing the decision process into three functional steps:
            </Text>

            {/* --- FUNCIONALIDAD CENTRAL --- */}
            <Title order={3} size="h4" mb="xs">1. Set Planning Constraints <IconSettings size={18} color="blue" /></Title>
            <List spacing="xs" size="sm">
                <ListItem>
                    **Max Buy Capacity (\$):** Maximum budget available for the purchase.
                </ListItem>
                <ListItem>
                    **Max High Risk Tolerance (%):** Maximum percentage of "High Risk" products allowed in the total buy mix.
                </ListItem>
            </List>
            
            <Space h="md" />

            <Title order={3} size="h4" mb="xs">2. Product Prioritization Table</Title>
            <List spacing="xs" size="sm">
                <ListItem>
                    **Priority Score:** Uses the **IMU% (Initial Markup)** as the key profitability indicator. Products are sorted from highest to lowest IMU%.
                </ListItem>
                <ListItem>
                    **Risk Category:** Products are classified based on IMU%: <Badge color="green">Low Risk (IMU% ≥ 60%)</Badge>, <Badge color="yellow">Medium Risk (55% ≤ IMU% &lt; 60%)</Badge>, <Badge color="red">High Risk (IMU% &lt; 55%)</Badge>.
                </ListItem>
                <ListItem>
                    **Recommendation:** Applies a **Greedy algorithm** to select the highest priority products while strictly adhering to both the Max Buy Capacity and the Max High Risk Tolerance.
                </ListItem>
            </List>
            
            <Space h="md" />

            <Title order={3} size="h4" mb="xs">3. Selected Buy Summary</Title>
            <List spacing="xs" size="sm">
                <ListItem>
                    **Capacity Tracking:** Displays the Current Buy \$ and the Remaining Capacity \$.
                </ListItem>
                <ListItem icon={<IconAlertTriangle size={18} color="orange" />}>
                    **Risk Alert:** Calculates the High Risk % of Selected items, serving as a **visual alert** if the trader's manual selection exceeds the set risk tolerance.
                </ListItem>
            </List>
        </Container>
    );
};

export default AboutMVPView;