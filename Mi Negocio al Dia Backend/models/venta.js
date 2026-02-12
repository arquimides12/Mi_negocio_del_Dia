const { sequelize, DataTypes } = require("./database");

const Venta = sequelize.define("venta", {
  fecha: {
    type: DataTypes.DATEONLY, 
    defaultValue: DataTypes.NOW
  },
  total_venta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ganancia_total: { 
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productos_vendidos: { 
    type: DataTypes.JSON, 
    allowNull: false
  },
  // Agregamos esto explícitamente para que Sequelize no se queje
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Venta;