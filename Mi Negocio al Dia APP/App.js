import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- PANTALLAS DE AUTENTICACIÓN ---
import { AuthScreens } from './src/screens/auth/AuthScreens';
import { RegisterScreen } from './src/screens/auth/register/RegisterScreen'; 
import { VerifyCode } from './src/screens/auth/verify/VerifyCode'; 

// --- PANTALLAS DE NEGOCIO ---
import { HomeScreen } from './src/screens/home/home';
import { InventarioScreen } from './src/screens/producto/inventario'; 
import { ProductoFormScreen } from './src/screens/producto-form/producto-form';
import { CajaScreen } from './src/screens/caja/caja'; 
// CORREGIDO: Importación con 's' al final para que coincida con el export del archivo
import { ReportesScreen } from './src/screens/reportes/reportes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Auth" 
        screenOptions={{ 
          headerShown: false 
        }}
      >
        {/* 1. Autenticación */}
        <Stack.Screen name="Auth" component={AuthScreens} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />

        {/* 2. Sistema Principal */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Pantalla de Caja/Venta */}
        <Stack.Screen 
          name="Venta" 
          component={CajaScreen} 
        />

        {/* Pantalla de Inventario */}
        <Stack.Screen 
          name="Inventario" 
          component={InventarioScreen} 
        />

        {/* Formulario para Crear Productos */}
        <Stack.Screen 
          name="ProductoForm" 
          component={ProductoFormScreen} 
        />

        {/* Reportes y Alertas - CORREGIDO: Nombre del componente con 's' */}
        <Stack.Screen 
          name="Reportes" 
          component={ReportesScreen} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}