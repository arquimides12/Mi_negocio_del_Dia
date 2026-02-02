import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Negro absoluto
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 28,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 50,
    },
    btnPrimary: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: '#00B4D8', // Tu celeste
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    textBtnBlack: {
        color: '#000000',
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    textBtnCyan: {
        color: '#00B4D8',
        fontWeight: '900',
        textTransform: 'uppercase',
    }
});