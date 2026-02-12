import { View, Text, FlatList, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "./venta.styles";

export const VentaScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    const cargarProductosPorUsuario = async () => {
        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            if (!usuarioId) return;

            const res = await fetch(`http://192.168.1.18:3000/producto/usuario/${usuarioId}`);
            if (res.ok) {
                const data = await res.json();
                
                // --- DOBLE FILTRO: Solo con Stock Y que estén Activos ---
                const filtrados = data.filter(p => 
                    Number(p.cantidad) > 0 && p.estado === 'activo'
                );
                
                setProductos(filtrados);
                console.log("🔄 Productos activos y con stock refrescados");
            }
        } catch (e) {
            console.log("Error cargando productos:", e);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', cargarProductosPorUsuario);
        return unsubscribe;
    }, [navigation]);

    const agregarAlCarrito = (p) => {
        const existe = carrito.find(item => item.id === p.id);
        if (existe) {
            if (existe.cantidad < p.cantidad) {
                setCarrito(carrito.map(i => 
                    i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i
                ));
            } else {
                Alert.alert("Sin stock", "No puedes agregar más de lo que hay en inventario.");
            }
        } else {
            setCarrito([...carrito, { ...p, cantidad: 1 }]);
        }
    };

    useEffect(() => {
        const t = carrito.reduce((acc, i) => acc + (Number(i.precio_venta) * i.cantidad), 0);
        setTotal(t);
    }, [carrito]);

    const finalizarVenta = async () => {
        if (carrito.length === 0) return;

        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            // Nota: Asegúrate que tu backend use 'items' o 'carrito' según tu ruta
            const itemsParaEnviar = carrito.map(i => ({ id: i.id, cantidad: i.cantidad }));

            const res = await fetch('http://192.168.1.18:3000/producto/vender', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carrito: itemsParaEnviar, // Cambiado a 'carrito' para coincidir con tu router.post("/vender")
                    usuarioId: usuarioId
                })
            });

            if (res.ok) {
                Alert.alert("Éxito", "Venta procesada correctamente", [
                    {
                        text: "OK",
                        onPress: () => {
                            setCarrito([]); 
                            cargarProductosPorUsuario(); 
                        }
                    }
                ]);
            } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData.mensaje || "Error en el servidor");
            }
        } catch (error) {
            console.log("Error de red:", error.message);
            Alert.alert("Error de Conexión", `Detalle: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Caja / Vender</Text>
            
            <FlatList
                // Aplicamos el filtro directamente aquí también por seguridad visual
                data={productos.filter(p => p.estado === 'activo')} 
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => agregarAlCarrito(item)} 
                        style={styles.itemProducto}
                    >
                        <View>
                            <Text style={styles.nombreProd}>{item.nombre}</Text>
                            <Text style={styles.detalleProd}>
                                Stock: {item.cantidad} | ${Number(item.precio_venta).toFixed(2)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={{textAlign: 'center', marginTop: 20, color: 'gray'}}>
                        No hay productos activos para vender.
                    </Text>
                }
            />

            <View style={styles.resumenContainer}>
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
};