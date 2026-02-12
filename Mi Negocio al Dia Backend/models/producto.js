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

  // 2. Precios
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
  stock_inicial: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock_minimo: { 
    type: DataTypes.INTEGER,
    defaultValue: 5, 
  },

  // 4. Multimedia y Relaciones
  imagen: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  usuarioId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // 5. Lógica de Negocio (Estado)
  // 'activo': Suma al dinero en reportes y se puede vender.
  // 'pasivo': Deja de sumar al dinero y se oculta de la venta.
  estado: {
    type: DataTypes.ENUM('activo', 'pasivo'),
    defaultValue: 'activo'
  }
});

module.exports = Producto;