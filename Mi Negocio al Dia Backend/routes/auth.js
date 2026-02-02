const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario'); // Importa el modelo de la DB

// 1. RUTA PARA REGISTRAR (Genera el PIN)
router.post('/registro', async (req, res) => {
    try {
        const { nombreCompleto, telefono, fechaNacimiento, nombreEmpresa } = req.body;

        // Validación de datos recibidos
        if (!telefono || !nombreCompleto) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
        }

        // Generar código de 6 dígitos
        const codigoPin = Math.floor(100000 + Math.random() * 900000).toString();

        // Crear o actualizar el usuario en la DB
        await Usuario.upsert({
            nombreCompleto,
            telefono,
            fechaNacimiento,
            nombreEmpresa,
            codigoPin,
            verificado: false
        });

        console.log("-----------------------------------------");
        console.log(`NUEVO REGISTRO: ${nombreCompleto}`);
        console.log(`CÓDIGO PIN PARA ${telefono}: ${codigoPin}`);
        console.log("-----------------------------------------");

        return res.status(200).json({ 
            success: true, 
            message: "Código generado exitosamente",
            debugCode: codigoPin 
        });

    } catch (error) {
        console.error("Error en /registro:", error);
        return res.status(500).json({ success: false, message: "Error interno en el servidor" });
    }
});

// 2. RUTA PARA VERIFICAR (Valida el PIN e incluye los datos del negocio)
router.post('/verificar', async (req, res) => {
    try {
        const { telefono, codigoPin } = req.body;
        console.log(`Intentando verificar: Tel ${telefono} con PIN ${codigoPin}`);

        if (!telefono || !codigoPin) {
            return res.status(400).json({ success: false, message: "Teléfono o PIN ausentes" });
        }

        // Buscamos al usuario por su teléfono
        const usuario = await Usuario.findOne({ where: { telefono } });

        if (!usuario) {
            console.log("Usuario no encontrado en DB");
            return res.status(404).json({ success: false, message: "Usuario no registrado" });
        }

        console.log(`PIN en DB: ${usuario.codigoPin} | PIN ingresado: ${codigoPin}`);

        // Comparamos los códigos
        if (String(usuario.codigoPin).trim() === String(codigoPin).trim()) {
            await usuario.update({ verificado: true });
            
            console.log("¡VALIDACIÓN EXITOSA!");
            
            // Devolvemos los datos REALES para que el móvil los muestre
            return res.status(200).json({ 
                success: true, 
                message: "Acceso concedido",
                user: {
                    nombreEmpresa: usuario.nombreEmpresa,
                    nombreCompleto: usuario.nombreCompleto
                }
            });
        } else {
            console.log("Los códigos NO coinciden");
            return res.status(401).json({ 
                success: false, 
                message: "El código PIN es incorrecto" 
            });
        }

    } catch (error) {
        console.error("Error en /verificar:", error);
        return res.status(500).json({ success: false, message: "Error al procesar la verificación" });
    }
});

// 3. RUTA PARA CONSULTAR USUARIOS
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

module.exports = router;