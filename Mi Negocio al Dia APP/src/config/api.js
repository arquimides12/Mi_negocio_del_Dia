// src/config/api.js
import { Platform } from 'react-native';

/**
 * LÓGICA DE CONEXIÓN DINÁMICA
 */
const BASE_URL = Platform.OS === 'web' 
    ? "http://localhost:3000" 
    : "http://192.168.1.18:3000"; 

export const ENDPOINTS = {
    PRODUCTOS: `${BASE_URL}/producto`,
    VENTAS: `${BASE_URL}/venta`,
    ALERTAS: `${BASE_URL}/producto/alertas`,
    ESTADISTICAS: `${BASE_URL}/venta/estadisticas`
};