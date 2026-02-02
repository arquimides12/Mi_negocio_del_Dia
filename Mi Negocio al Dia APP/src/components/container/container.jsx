import { View } from "react-native";
import { styles } from "./container.styles";

export const Container = ({ children }) => {
    return <View style={styles.container}>{children}</View>
}