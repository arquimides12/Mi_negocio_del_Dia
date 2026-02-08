import { View, Text, FlatList, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from "./venta.styles"; 

export const VentaScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // El listener 'focus' asegura que si agregas un producto y vuelves, la lista se refresque
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductosPorUsuario();
        });
        return unsubscribe;
    }, [navigation]);

    const cargarProductosPorUsuario = async () => {
        try {
            // 1. Obtenemos el ID del usuario que entró con su PIN
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            
            if (!usuarioId) {
                Alert.alert("Error", "No se encontró sesión activa. Vuelve a ingresar tu PIN.");
                return;
            }

            // 2. Consultamos la ruta específica para ese ID
            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            
            if (res.ok) {
                const data = await res.json();
                // Filtramos para no mostrar productos sin stock
                setProductos(data.filter(p => Number(p.cantidad) > 0));
            } else {
                console.error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Alert.alert("Error", "Asegúrate de que el servidor y el Wi-Fi estén activos.");
        }
    };

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.id === producto.id);
        if(existe) {
            if(existe.cantidad < producto.cantidad) {
                existe.cantidad += 1;
                setCarrito([...carrito]);
            } else {
                Alert.alert("Sin Stock", "Ya no quedan más unidades de este producto.");
            }
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };
    
    useEffect(() => { 
        const t = carrito.reduce((acc, item) => acc + (Number(item.precio_venta) * item.cantidad), 0);
        setTotal(t);
    }, [carrito]);

    const finalizarVenta = async () => {
        if(carrito.length === 0) return;
        
        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            const items = carrito.map(i => ({ id: i.id, cantidad: i.cantidad }));

            const res = await fetch('http://192.168.1.18:3000/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    items,
                    usuarioId: usuarioId 
                })
            });
            
            if(res.ok) {
                Alert.alert("Venta Exitosa", `Venta registrada. Total: $${total.toFixed(2)}`, [
                    { text: "Cerrar", onPress: () => {
                        setCarrito([]);
                        cargarProductosPorUsuario(); // Refrescar stock después de vender
                    }}
                ]);
            } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData.mensaje || "Falló la venta");
            }
        } catch (error) {
            Alert.alert("Error", "Error de red al procesar venta");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Caja / Vender</Text>
            <Text style={{color: '#BBB', marginBottom: 10}}>Selecciona productos para el carrito:</Text>
            
            <FlatList 
                data={productos}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => agregarAlCarrito(item)}
                        style={styles.itemProducto}>
                        <View>
                            <Text style={styles.nombreProd}>{item.nombre}</Text>
                            <Text style={styles.detalleProd}>
                                Precio: ${Number(item.precio_venta).toFixed(2)} | Stock: {item.cantidad}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={{color: '#666', textAlign: 'center', marginTop: 40}}>
                        No hay productos disponibles para este usuario.
                    </Text>
                }
            />

            <View style={styles.resumenContainer}>
                <Text style={styles.textoCarrito}>Items: {carrito.length}</Text>
                <Text style={styles.totalTexto}>Total: ${total.toFixed(2)}</Text>
                <Button 
                    title="FINALIZAR VENTA" 
                    onPress={finalizarVenta} 
                    color="#27ae60" 
                    disabled={carrito.length === 0}
                />
            </View>
        </View>
    );
}