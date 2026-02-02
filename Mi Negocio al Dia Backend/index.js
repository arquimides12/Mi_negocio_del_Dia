const express = require("express");
const app = express();
const { sequelize } = require("./models/database");
const cors = require("cors");
const path = require("path"); // <--- IMPORTANTE: Necesario para las rutas de archivos

// Importar rutas
const rutasProducto = require("./routes/producto");
const rutasVenta = require("./routes/venta");
const rutasAuth = require("./routes/auth");

app.use(express.json());
app.use(cors());

// --- ESTA ES LA LÍNEA CLAVE PARA LAS IMÁGENES ---
// Permite que la App acceda a la carpeta donde se guardan las fotos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("API Mi Negocio al Día - Funcionando"); 
});

// Usar rutas
app.use('/producto', rutasProducto);
app.use('/venta', rutasVenta);
app.use('/auth', rutasAuth);
 
const start = async () => {
    try {
        // alter: true actualiza la base de datos sin borrar lo que ya tienes
        await sequelize.sync({ alter: true }); 
        console.log("Conexión exitosa a la Base de Datos 'MiNegocioDB'");
        app.listen(PORT, () => {
            console.log(`Sistema escuchando en: http://192.168.1.18:${PORT}`);
        });
    } catch (error) {
        console.log("Error al conectar a la base de datos: " + error);
    }          
};

start();