const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs'); // Librería para manipular archivos
const { Op, Sequelize } = require("sequelize");
const Producto = require("../models/producto");

// --- CONFIGURACIÓN DE ALMACENAMIENTO ---
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 1. OBTENER TODO EL INVENTARIO
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

// 2. CREAR PRODUCTO (CON RUTA LIMPIA Y STOCK INICIAL)
router.post("/", upload.single("imagen"), async (req, res) => {
    try {
        const { nombre, precio_compra, precio_venta, cantidad, stock_minimo, descripcion } = req.body;
        
        // Guardamos 'uploads/archivo.jpg' (sin la barra / al inicio para el celular)
        const imagenUrl = req.file ? `uploads/${req.file.filename}` : null;

        const producto = await Producto.create({ 
            nombre, 
            precio_compra: parseFloat(precio_compra), 
            precio_venta: parseFloat(precio_venta), 
            cantidad: parseInt(cantidad), 
            stock_inicial: parseInt(cantidad), // Para el cálculo de ganancias futuro
            stock_minimo: parseInt(stock_minimo), 
            descripcion, 
            imagen: imagenUrl 
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error("Error al crear:", error);
        res.status(500).json({ mensaje: "Error al crear producto" });
    }
});

// 3. RUTA PARA VENDER (DESCONTAR STOCK)
router.post("/vender", async (req, res) => {
    const { carrito } = req.body;
    try {
        for (const item of carrito) {
            const producto = await Producto.findByPk(item.id);
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

// 4. ALERTAS DE STOCK BAJO
router.get("/alertas", async (req, res) => {
    try {
        const productosBajos = await Producto.findAll({
            where: {
                cantidad: { [Op.lte]: Sequelize.col('stock_minimo') }
            }
        });
        res.json(productosBajos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en alertas" });
    }
});

// 5. ELIMINAR PRODUCTO Y BORRAR IMAGEN FÍSICA
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // --- Lógica para borrar el archivo del disco duro ---
        if (producto.imagen) {
            // Construimos la ruta: subimos un nivel (..) y entramos a la ruta guardada
            const rutaImagen = path.join(__dirname, '..', producto.imagen);
            
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen); // Borra el archivo físicamente
                console.log("Archivo eliminado:", rutaImagen);
            }
        }

        await producto.destroy(); // Borra el registro de la base de datos
        res.json({ mensaje: "Producto e imagen borrados correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar" });
    }
});

module.exports = router;