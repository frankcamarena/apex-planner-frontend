// src/hooks/useData.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import axios from 'axios';
import React from 'react'; 

// URL base de tu API en Render
const API_BASE_URL = 'https://apex-planner-backend-api.onrender.com/api';
// Definición de orden de meses para el gráfico de tendencia
const MONTH_ORDER = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ----------------------------------------------------------------------
// --- FUNCIONES DE FETCH Y MUTACIÓN (CRUD) ---
// ----------------------------------------------------------------------

// OTB (Budget)
const fetchBudgetOTB = async () => {
    const response = await axios.get(`${API_BASE_URL}/otb_budget`);
    return response.data;
};

const postBudgetOTB = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/otb_budget`, data);
    return response.data;
};

// Productos por Dept
const fetchProductsByDept = async (deptId) => {
    if (!deptId || deptId <= 0) return []; 
    const response = await axios.get(`${API_BASE_URL}/products?dept_id=${deptId}`);
    return response.data;
};

// Márgenes Promedio
const fetchAverageMargins = async () => {
    const response = await axios.get(`${API_BASE_URL}/margins/average`);
    return response.data;
};


// ----------------------------------------------------------------------
// --- HOOKS DE REACT QUERY (GET/MUTATE) ---
// ----------------------------------------------------------------------

export const useBudgetOTB = () => {
    return useQuery({
        queryKey: ['otbBudget'],
        queryFn: fetchBudgetOTB,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateBudgetOTB = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: postBudgetOTB,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['otbBudget'] });
        },
    });
};

export const useProductsByDept = (deptId) => {
    return useQuery({
        queryKey: ['products', deptId],
        queryFn: () => fetchProductsByDept(deptId),
        enabled: !!deptId && deptId > 0, 
        staleTime: 1000 * 60 * 5, 
    });
};

export const useAverageMargins = () => {
    return useQuery({
        queryKey: ['averageMargins'],
        queryFn: fetchAverageMargins,
        staleTime: 1000 * 60 * 60, 
    });
};


// ----------------------------------------------------------------------
// --- HOOK PRINCIPAL DEL DASHBOARD (Lógica de Año Calendario) ---
// ----------------------------------------------------------------------

/**
 * Hook para obtener y procesar datos del dashboard, opcionalmente filtrados por periodo/año calendario.
 * @param {string} [filterPeriod=null] - Periodo a filtrar (e.g., 'JAN,FEB,MAR'). 
 * @param {string} [filterYear=null] - Año Calendario a filtrar (e.g., '2025'). 
 */
export const useDashboardData = (filterPeriod = null, filterYear = null) => { 
    const { data: marginData, isLoading: isLoadingMargins } = useAverageMargins();
    const { data: otbData, isLoading: isLoadingOTB, isError } = useBudgetOTB();
    
    const isLoading = isLoadingOTB || isLoadingMargins; 

    // Mapea los márgenes para acceso rápido
    const marginMap = React.useMemo(() => {
        if (!marginData) return {};
        return marginData.reduce((acc, item) => {
            acc[item.dept_id] = item.margin_percent;
            return acc;
        }, {});
    }, [marginData]);


    const processedData = React.useMemo(() => { 
        // Caso sin datos
        if (!otbData || otbData.length === 0) {
            return { totalBudget: 0, totalBuy: 0, variance: 0, marginPct: 0, deptSummary: [], varianceTrendData: [] };
        }
        
        // --- 1. APLICAR FILTRO DE PERIODO/AÑO CALENDARIO ---
        let filteredOTBData = otbData;
        
        // Convertimos el año del filtro a número para la comparación
        const numericFilterYear = filterYear ? Number(filterYear) : null; 
        // Obtener array de meses del período seleccionado (e.g., ["JAN", "FEB", "MAR"])
        const monthsInPeriod = filterPeriod ? filterPeriod.split(',') : []; 

        if (filterPeriod || numericFilterYear) {
            filteredOTBData = otbData.filter(item => {
                const matchesPeriod = !filterPeriod || monthsInPeriod.includes(item.fiscal_month);
                
                let matchesYear = true; // Por defecto
                
                if (numericFilterYear) {
                    // LÓGICA CLAVE: Todos los meses deben pertenecer al AÑO CALENDARIO seleccionado.
                    matchesYear = item.fiscal_year === numericFilterYear;
                }
                
                return matchesPeriod && matchesYear;
            });
        }
        
        // Si hay un filtro y no hay datos que coincidan, retornamos valores a cero.
        if ((filterPeriod || numericFilterYear) && filteredOTBData.length === 0) {
             return { totalBudget: 0, totalBuy: 0, variance: 0, marginPct: 0, deptSummary: [], varianceTrendData: [] };
        }


        // --- 2. CÁLCULO DE KPIS Y RESUMEN ---
        let totalBudget = 0;
        let totalBuy = 0;
        let totalWeightedMargin = 0; 
        
        const deptMap = {};
        const varianceTrendMap = {}; 

        filteredOTBData.forEach(item => { // <-- USAMOS filteredOTBData
            const deptId = item.dept_id;
            const month = item.fiscal_month;
            const year = item.fiscal_year;

            const budget = item.allocated_receipts || 0;
            const buy = budget * 0.90; 
            const variance = budget - buy;
            
            // --- CÁLCULO DE RESUMEN POR DEPARTAMENTO ---
            const realMargin = marginMap[deptId] || 0; 
            
            if (!deptMap[deptId]) {
                deptMap[deptId] = {
                    dept: `Dept ${deptId}`,
                    budget: 0,
                    buy: 0,
                    variance: 0,
                    margin: 0, 
                };
            }

            deptMap[deptId].budget += budget;
            deptMap[deptId].buy += buy;
            deptMap[deptId].variance += variance;
            deptMap[deptId].margin = realMargin; 
            
            totalWeightedMargin += (budget * (realMargin / 100)); 
            totalBudget += budget;
            totalBuy += buy;
            
            // --- CÁLCULO DE TENDENCIA (Solo si NO hay filtro de periodo/año) ---
            if (!filterPeriod && !numericFilterYear) { 
                const key = `${year}-${month}`;
                if (!varianceTrendMap[key]) {
                     varianceTrendMap[key] = {
                         monthYear: `${month}-${year}`,
                         orderKey: Number(year) * 100 + MONTH_ORDER.indexOf(month),
                         totalBudget: 0,
                         totalBuy: 0,
                         totalVariance: 0,
                     };
                }
                
                varianceTrendMap[key].totalBudget += budget;
                varianceTrendMap[key].totalBuy += buy;
                varianceTrendMap[key].totalVariance += variance;
            }
        });

        const deptSummary = Object.values(deptMap);
        const totalVariance = totalBudget - totalBuy;
        
        const varianceTrendData = Object.values(varianceTrendMap)
            .sort((a, b) => a.orderKey - b.orderKey); 

        const totalMarginPct = totalBudget > 0 
            ? (totalWeightedMargin / totalBudget) * 100 
            : 0; 

        return { totalBudget, totalBuy, variance: totalVariance, marginPct: totalMarginPct, deptSummary, varianceTrendData };

    }, [otbData, marginMap, filterPeriod, filterYear]); // <-- DEPENDENCIAS DE FILTRO

    return { ...processedData, isLoading, isError };
};

const MOCK_ALL_PRODUCTS_DATA = [
    // Datos simulados de productos (style_id, cost, retail, imu_percent)
    { style_id: 'S001_A', dept_id: 100, cost: 50000, retail: 125000, imu_percent: 60.0 },
    { style_id: 'S002_B', dept_id: 100, cost: 35000, retail: 95000, imu_percent: 63.2 },
    { style_id: 'S003_C', dept_id: 200, cost: 80000, retail: 180000, imu_percent: 55.6 },
    { style_id: 'S004_D', dept_id: 200, cost: 20000, retail: 47000, imu_percent: 57.4 },
    { style_id: 'S005_E', dept_id: 300, cost: 120000, retail: 250000, imu_percent: 52.0 },
    { style_id: 'S006_F', dept_id: 300, cost: 45000, retail: 90000, imu_percent: 50.0 },
    { style_id: 'S007_G', dept_id: 400, cost: 60000, retail: 155000, imu_percent: 61.3 },
    { style_id: 'S008_H', dept_id: 400, cost: 15000, retail: 35000, imu_percent: 57.1 },
    { style_id: 'S009_I', dept_id: 500, cost: 90000, retail: 175000, imu_percent: 48.6 },
    { style_id: 'S010_J', dept_id: 500, cost: 25000, retail: 68000, imu_percent: 63.3 },
    { style_id: 'S011_K', dept_id: 600, cost: 70000, retail: 145000, imu_percent: 51.9 },
    { style_id: 'S012_L', dept_id: 800, cost: 10000, retail: 20000, imu_percent: 50.0 },
];

// Función fetch (simulada)
const fetchAllProducts = async () => {
    // Simula un retraso de red
    return new Promise(resolve => setTimeout(() => {
        // Añadir el Priority Score (IMU%) y Risk Category directamente al mock
        const processedData = MOCK_ALL_PRODUCTS_DATA.map(p => {
             // Lógica de riesgo basada en IMU% (tu regla del trader)
             const risk_category = p.imu_percent >= 60 ? 'Low Risk' : (p.imu_percent >= 55 ? 'Medium Risk' : 'High Risk');
             
             return {
                ...p,
                buy_cost: p.cost, 
                priority_score: p.imu_percent, 
                risk_category: risk_category,
            };
        });
        resolve(processedData);
    }, 500)); 
};

// ----------------------------------------------------------------------
// --- HOOK PARA PRODUCTOS GLOBALES (PLANIFICACIÓN) ---
// ----------------------------------------------------------------------

export const useAllProductsData = () => {
    return useQuery({
        queryKey: ['allProductsData'],
        queryFn: fetchAllProducts,
        staleTime: 1000 * 60 * 5, 
    });
};