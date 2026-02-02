// models/database.js
const { Sequelize, DataTypes, Op } = require("sequelize");

// Asegúrate de crear esta base de datos 'MiNegocioDB' en tu pgAdmin primero
const sequelize = new Sequelize("MiNegocioDB", "postgres", "1234", {
  host: "127.0.0.1",
  dialect: "postgres",
  port: 5433,
  logging: false, // Para limpiar la consola
});

module.exports = { sequelize, DataTypes, Op };