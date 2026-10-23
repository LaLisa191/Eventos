require('dotenv').config();

const connectDB = require('./src/infrastructure/persistence/mongoose/connection');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// El servidor empieza a escuchar solo cuando la base de datos ya está conectada
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  });
