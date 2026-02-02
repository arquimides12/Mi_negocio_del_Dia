const express = require("express");
const router = express.Router();
const Venta = require("../models/venta");
const Producto = require("../models/producto");
const { sequelize, Op } = require("../models/database");

// Registrar una Venta (Factura Simple)
router.post("/", async (req, res) => {
    const t = await sequelize.transaction(); // Usamos transacción por seguridad
    try {
        const { items } = req.body; // items es un array: [{id: 1, cantidad: 2}, ...]
        let totalVenta = 0;
        let gananciaTotal = 0;
        let detallesFactura = [];

        for (const item of items) {
            const prod = await Producto.findByPk(item.id, { transaction: t });
            
            if (!prod || prod.cantidad < item.cantidad) {
                await t.rollback();
                return res.status(400).json({ "mensaje": `Stock insuficiente para: ${prod ? prod.nombre : 'Item desconocido'}` });
            }

            // Cálculos
            const subtotal = prod.precio_venta * item.cantidad;
            const costo = prod.precio_compra * item.cantidad;
            
            totalVenta += subtotal;
            gananciaTotal += (subtotal - costo);

            // Guardar detalle para factura
            detallesFactura.push({
                nombre: prod.nombre,
                cantidad: item.cantidad,
                precio_unit: prod.precio_venta,
                subtotal: subtotal
            });

            // Descontar inventario
            await prod.decrement('cantidad', { by: item.cantidad, transaction: t });
        }

        // Crear registro de venta
        const nuevaVenta = await Venta.create({
            total_venta: totalVenta,
            ganancia_total: gananciaTotal,
            productos_vendidos: detallesFactura
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ "mensaje": "Venta exitosa", "factura": nuevaVenta });

    } catch (error) {
        await t.rollback();
        console.log("ERROR VENTA: " + error);
        res.status(500).json({ "mensaje": "Error al procesar la venta" });
    }
});

// Obtener Estadísticas (Diarias, Semanales)
router.get("/estadisticas", async (req, res) => {
    try {
        const hoy = new Date();
        const hace7dias = new Date(new Date().setDate(hoy.getDate() - 7));

        // Ventas de la última semana
        const ventasRecientes = await Venta.findAll({
            where: {
                fecha: {
                    [Op.gte]: hace7dias 
                }
            }
        });

        // Sumar totales
        let totalSemana = 0;
        let gananciaSemana = 0;
        ventasRecientes.forEach(v => {
            totalSemana += v.total_venta;
            gananciaSemana += v.ganancia_total;
        });

        res.json({
            periodo: "Últimos 7 días",
            ventas_totales: totalSemana,
            ganancia_neta: gananciaSemana,
            cantidad_ventas: ventasRecientes.length
        });
    } catch (error) {
        res.status(500).json({ "mensaje": "Error en estadísticas" });
    }
});

module.exports = router;