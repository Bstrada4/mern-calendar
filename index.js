const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Crear el servidor de express
const app = express();

//BASE DE DATOS
dbConnection();

//CORS
app.use(cors());

// Directorio público - middleware ( funcion que se ejecuta cuando alguien hace una peticion a mi servidor)
app.use( express.static('public')); 

// Lectura y parseo del Body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'));
// TODO CRUD: Eventos


app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo ${ process.env.PORT }` );
});