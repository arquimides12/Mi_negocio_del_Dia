// models/usuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./database'); // Se agregaron las llaves { } para corregir el TypeError

const Usuario = sequelize.define('Usuario', {
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false // Obligatorio según tu diseño de registro
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Asegura que cada cuenta esté ligada a un número único
  },
  fechaNacimiento: {
    type: DataTypes.STRING, 
    allowNull: false // Formato dd/mm/aaaa solicitado en Figma
  },
  nombreEmpresa: {
    type: DataTypes.STRING,
    allowNull: false // Nombre de la empresa para administrar el negocio
  },
  codigoPin: {
    type: DataTypes.STRING(6), // Campo para validar los 6 dígitos del SMS
    allowNull: true
  },
  verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Por defecto inicia sin verificar hasta que ponga el PIN
  }
}, {
  timestamps: true // Registra automáticamente fecha de creación y actualización
});

module.exports = Usuario;
