import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000', 
        padding: 20 
    },
    title: { 
        color: '#00E5FF', 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        marginTop: 10 
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden'
    },
    imagePickerText: { 
        color: '#666', 
        fontSize: 16 
    },
    previewImage: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover' 
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333'
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    textArea: { 
        height: 100, 
        textAlignVertical: 'top' 
    },
    btnGuardar: {
        backgroundColor: '#00E5FF',
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40
    },
    btnText: { 
        color: '#000', 
        fontWeight: 'bold', 
        fontSize: 16 
    }
});