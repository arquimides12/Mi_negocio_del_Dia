# Antes de empezar, asegúrate de tener instalado:

- Node.js (Versión 16 o superior)

- postgres (O el motor de base de datos que estés usando) 

Instalar las dependencias:
```bash
Instalar las dependencias:
```

El servidor actualmente está configurado para correr en la IP: 192.168.1.18.
Si tu IP cambia, asegúrate de actualizarla en el archivo principal (index.js o app.js) y en el Frontend. 

## Para iniciar el servidor en modo desarrollo:

```bash
node index.js
```

```bash
http://192.168.1.18:3000 
```

Aquí es donde manejamos el servidor y las fotos. Abre la terminal ahí y ejecuta: 

```bash
npm install express mysql2 cors multer
```
-no te olvides crear la carpera uploads 