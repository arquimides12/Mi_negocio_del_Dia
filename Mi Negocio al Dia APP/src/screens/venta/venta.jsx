import { View, Text, FlatList, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../../config/api";
import { styles } from "./venta.styles"; // <--- Importamos los estilos

export const VentaScreen = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch(ENDPOINTS.PRODUCTOS)
            .then(res => res.json())
            .then(data => setProductos(data.filter(p => p.cantidad > 0)))
            .catch(err => console.error(err));
    }, []);

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.id === producto.id);
        if(existe) {
            if(existe.cantidad < producto.cantidad) {
                existe.cantidad += 1;
                setCarrito([...carrito]);
            } else {
                Alert.alert("Stock Límite", "No hay más unidades disponibles");
            }
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };
    
    useEffect(() => { 
        const t = carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);
        setTotal(t);
    }, [carrito]);

    const finalizarVenta = async () => {
        if(carrito.length === 0) return;
        const items = carrito.map(i => ({ id: i.id, cantidad: i.cantidad }));

        try {
            const res = await fetch(ENDPOINTS.VENTAS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });
            const data = await res.json();
            
            if(res.ok) {
                Alert.alert("Venta Exitosa", `Total: $${total.toFixed(2)}`, [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", data.mensaje);
            }
        } catch (error) {
            Alert.alert("Error", "Error de conexión");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecciona productos:</Text>
            
            <FlatList 
                data={productos}
                style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => agregarAlCarrito(item)}
                        style={styles.itemProducto}>
                        <Text style={styles.nombreProd}>{item.nombre}</Text>
                        <Text style={styles.detalleProd}>${item.precio_venta} - (Stock: {item.cantidad})</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.resumenContainer}>
                <Text style={styles.textoCarrito}>Carrito ({carrito.length} items)</Text>
                <Text style={styles.totalTexto}>Total: ${total.toFixed(2)}</Text>
                <Button title="✅ FINALIZAR VENTA" onPress={finalizarVenta} color="green" disabled={carrito.length === 0}/>
            </View>
        </View>
    );
}