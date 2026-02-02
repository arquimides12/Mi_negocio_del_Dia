import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#f1eaeaff",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width:0, height:5 },
        shadowOpacity: 0.20,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 6
    },
    titulo: {
        fontSize: 18,
        color: "#333"
    },
    texto: {
        fontSize: 16,
        color: "#999"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        margin: 5,
        justifyContent: "space-between"
    }
})