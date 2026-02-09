const express = require("express");
const app = express();
const { sequelize } = require("./models/database");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Importado para verificar carpetas

// Importar rutas
const rutasProducto = require("./routes/producto");
const rutasVenta = require("./routes/venta");
const rutasAuth = require("./routes/auth");

app.use(express.json());
app.use(cors());

// --- VERIFICACIÓN DE CARPETA UPLOADS ---
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log("Carpeta 'uploads' creada automáticamente.");
}

// --- SERVIR IMÁGENES ESTÁTICAS ---
app.use('/uploads', express.static(uploadsPath));

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
        // alter: true sincroniza los nuevos campos (usuarioId, imagen) automáticamente
        await sequelize.sync({ alter: true }); 
        console.log("Conexión exitosa a la Base de Datos 'MiNegocioDB'");
        
        // Usamos 0.0.0.0 para que sea accesible desde cualquier dispositivo en la red local
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Sistema escuchando en: http://192.168.1.18:${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos: ", error);
    }          
};

start();