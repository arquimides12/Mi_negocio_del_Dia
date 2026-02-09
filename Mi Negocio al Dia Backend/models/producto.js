const { sequelize, DataTypes } = require("./database");

const Producto = sequelize.define("producto", {
  // 1. Datos básicos del producto
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // 2. Precios (Usamos FLOAT para decimales)
  precio_compra: { 
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  precio_venta: { 
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },

  // 3. Stock y Alertas
  cantidad: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  stock_inicial: { // Para reportes de ganancias
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock_minimo: { 
    type: DataTypes.INTEGER,
    defaultValue: 5, 
  },

  // 4. Multimedia y Relaciones (Lo que faltaba)
  imagen: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  usuarioId: { 
    type: DataTypes.INTEGER,
    allowNull: false, // Obligatorio para que no se mezclen los inventarios
  }
});

module.exports = Producto;