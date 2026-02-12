const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { sequelize } = require("./models/database");
const Producto = require("./models/producto");
const Venta = require("./models/venta");

const rutasProducto = require("./routes/producto");
const rutasVenta = require("./routes/venta"); 
const rutasAuth = require("./routes/auth");

app.use(express.json());

// CORS abierto para que tu celular siempre pueda entrar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

app.use('/uploads', express.static(uploadsPath));

app.use('/producto', rutasProducto);
app.use('/venta', rutasVenta);
app.use('/auth', rutasAuth);

// Lógica de ventas
app.post('/procesar-venta', async (req, res) => {
    const { items, usuarioId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ mensaje: "El carrito está vacío" });

    const t = await sequelize.transaction();
    try {
        let totalVentaCalculado = 0;
        let gananciaTotalCalculada = 0;
        const detalleParaHistorial = [];

        for (const item of items) {
            const producto = await Producto.findOne({ where: { id: item.id, usuarioId: usuarioId } });
            if (!producto) throw new Error(`Producto con ID ${item.id} no encontrado.`);

            const cantidadActual = Number(producto.cantidad);
            const cantidadAVender = Number(item.cantidad);

            if (cantidadActual < cantidadAVender) throw new Error(`Stock insuficiente para ${producto.nombre}`);

            totalVentaCalculado += (Number(producto.precio_venta) * cantidadAVender);
            gananciaTotalCalculada += (Number(producto.precio_venta) - Number(producto.precio_compra)) * cantidadAVender;

            detalleParaHistorial.push({
                nombre: producto.nombre,
                cantidad: cantidadAVender,
                precio: producto.precio_venta
            });

            producto.cantidad = cantidadActual - cantidadAVender;
            await producto.save({ transaction: t });
        }

        await Venta.create({
            fecha: new Date(),
            total_venta: totalVentaCalculado,
            ganancia_total: gananciaTotalCalculada,
            productos_vendidos: detalleParaHistorial,
            usuarioId: usuarioId
        }, { transaction: t });

        await t.commit();
        res.json({ mensaje: "Venta procesada con éxito" });
    } catch (error) {
        if (t) await t.rollback();
        res.status(400).json({ mensaje: error.message });
    }
});

const PORT = 3000;
const start = async () => {
    try {
        await sequelize.sync({ alter: true }); 
        console.log("🚀 Base de Datos Sincronizada.");
        
        // Al usar '0.0.0.0' el servidor acepta conexiones de CUALQUIER IP que tenga la PC
        app.listen(PORT, '0.0.0.0', () => {
            console.log("-------------------------------------------------");
            console.log(` SERVIDOR ACTIVO EN PUERTO: ${PORT}`);
            console.log(` Si estás en CASA usa: http://192.168.1.18:${PORT}`);
            console.log(`Si estás en la U usa la IP que te dé el ipconfig`);
            console.log("-------------------------------------------------");
        });
    } catch (error) {
        console.error("Error al iniciar servidor:", error);
    }
};

start();