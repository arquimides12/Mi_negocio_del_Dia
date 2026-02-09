const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// 1. REGISTRO: Crea usuario y genera PIN de 6 dígitos
router.post('/registro', async (req, res) => {
    try {
        const { nombreCompleto, telefono, fechaNacimiento, nombreEmpresa } = req.body;

        if (!telefono || !nombreCompleto) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }

        const codigoPin = Math.floor(100000 + Math.random() * 900000).toString();

        // Guarda si es nuevo o actualiza si el teléfono ya existe
        await Usuario.upsert({
            nombreCompleto,
            telefono,
            fechaNacimiento,
            nombreEmpresa,
            codigoPin,
            verificado: false
        });

        console.log(`PIN GENERADO PARA ${nombreCompleto}: ${codigoPin}`);

        return res.status(200).json({ 
            success: true, 
            codigoPin // Se envía para que la App lo muestre al usuario
        });

    } catch (error) {
        console.error("Error registro:", error);
        return res.status(500).json({ success: false });
    }
});

// 2. LOGIN/VERIFICACIÓN: Acceso directo con el PIN
router.post('/verificar', async (req, res) => {
    try {
        const { codigoPin } = req.body; 

        // Busca al dueño del PIN
        const usuario = await Usuario.findOne({ 
            where: { codigoPin: String(codigoPin).trim() } 
        });

        if (!usuario) {
            return res.status(401).json({ success: false, message: "PIN incorrecto" });
        }

        await usuario.update({ verificado: true });
        
        // Retorna el ID para filtrar productos por usuario después
        return res.status(200).json({ 
            success: true, 
            user: {
                id: usuario.id,
                nombreEmpresa: usuario.nombreEmpresa,
                nombreCompleto: usuario.nombreCompleto
            }
        });

    } catch (error) {
        console.error("Error verificación:", error);
        return res.status(500).json({ success: false });
    }
});

// 3. LISTADO: Consultar usuarios registrados
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

module.exports = router;