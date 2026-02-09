const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs'); 
const { Op, Sequelize } = require("sequelize");
const Producto = require("../models/producto");

// --- CONFIGURACIÓN DE ALMACENAMIENTO DE IMÁGENES ---
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- NUEVA RUTA PARA REPORTES (CORRIGE EL ERROR <) ---
// Esta ruta servirá para: http://192.168.1.18:3000/producto/usuario/7
router.get('/usuario/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        const productos = await Producto.findAll({
            where: { usuarioId: usuarioId }
        });

        res.json(productos); 
    } catch (error) {
        console.error("Error al obtener productos por usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 1. OBTENER INVENTARIO: Solo los productos del usuario logueado
router.get("/", async (req, res) => {
    try {
        const { usuarioId } = req.query; 
        
        if (!usuarioId) {
            return res.status(400).json({ mensaje: "Falta el ID del usuario" });
        }

        const productos = await Producto.findAll({
            where: { usuarioId: usuarioId } 
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

// 2. CREAR PRODUCTO: Se guarda amarrado al usuarioId
router.post("/", upload.single("imagen"), async (req, res) => {
    try {
        const { nombre, precio_compra, precio_venta, cantidad, stock_minimo, descripcion, usuarioId } = req.body;
        
        const imagenUrl = req.file ? `uploads/${req.file.filename}` : null;

        const producto = await Producto.create({ 
            nombre, 
            precio_compra: parseFloat(precio_compra) || 0, 
            precio_venta: parseFloat(precio_venta) || 0, 
            cantidad: parseInt(cantidad) || 0, 
            stock_inicial: parseInt(cantidad) || 0, 
            stock_minimo: parseInt(stock_minimo) || 5, 
            descripcion, 
            imagen: imagenUrl,
            usuarioId: parseInt(usuarioId) 
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error("Error al crear:", error);
        res.status(500).json({ mensaje: "Error al crear producto" });
    }
});

// 3. VENDER: Descuenta stock
router.post("/vender", async (req, res) => {
    const { carrito, usuarioId } = req.body;
    try {
        for (const item of carrito) {
            const producto = await Producto.findOne({
                where: { id: item.id, usuarioId: usuarioId }
            });

            if (producto && producto.cantidad > 0) {
                const cantidadAVender = item.cantidad_a_vender || 1;
                producto.cantidad = producto.cantidad - cantidadAVender; 
                await producto.save();
            }
        }
        res.json({ mensaje: "Venta procesada con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en la venta" });
    }
});

// 4. ALERTAS: Stock bajo
router.get("/alertas", async (req, res) => {
    try {
        const { usuarioId } = req.query;
        const productosBajos = await Producto.findAll({
            where: {
                usuarioId: usuarioId,
                cantidad: { [Op.lte]: Sequelize.col('stock_minimo') }
            }
        });
        res.json(productosBajos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en alertas" });
    }
});

// 5. ELIMINAR
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.query;

        const producto = await Producto.findOne({ where: { id, usuarioId } });
        
        if (!producto) {
            return res.status(404).json({ mensaje: "No encontrado o no autorizado" });
        }

        if (producto.imagen) {
            const rutaImagen = path.join(__dirname, '..', producto.imagen);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            }
        }

        await producto.destroy();
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

module.exports = router;