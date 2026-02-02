// src/screens/card/card.jsx
import { View, Text, Button } from "react-native";
import { styles } from "./card.styles";

export const Card = ({ id, nombre, precio, cantidad, onDelete, onUpdate }) => {
    return (
        <View style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.titulo}>{nombre}</Text>
                <Text style={{fontWeight:'bold', color:'green', fontSize:18}}>${precio}</Text>
            </View>
            <Text style={styles.texto}>Stock Disponible: {cantidad}</Text>
            
            <View style={styles.buttonContainer}>
                <Button color="#c0392b" title="Eliminar" onPress={onDelete} />
                <Button color="#f39c12" title="Editar" onPress={onUpdate} />
            </View>
        </View>
    )
}