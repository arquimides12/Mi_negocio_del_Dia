const { sequelize } = require("./models/database");

// IMPORTANTE: Aquí importamos los modelos nuevos para que Sequelize los reconozca.
// Ya no es solo 'producto', ahora también incluimos 'venta'.
require("./models/producto");
require("./models/venta");

const iniciar = async () => {
  try {
    // 1. Verificar conexión
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");

    // 2. Sincronizar modelos con la base de datos
    // force: true -> BORRA las tablas si existen y las crea desde cero (Ideal para la primera vez).
    // Si ya tienes datos reales y no quieres borrarlos, cambia a { alter: true }
    await sequelize.sync({ force: true });

    console.log("---------------------------------------------");
    console.log("TABLAS CREADAS CORRECTAMENTE:");
    console.log("1. Productos (con stock y precios)");
    console.log("2. Ventas (para facturación y estadísticas)");
    console.log("---------------------------------------------");
    
    // Terminar el proceso con éxito
    process.exit(0);
  } catch (error) {
    console.error("Error al crear las tablas:", error);
    process.exit(1);
  }   
};

iniciar();