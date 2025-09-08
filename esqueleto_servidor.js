// server.js
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
    user: 'sa',                // cambia por tu usuario de SQL Server
    password: '123456789',     // cambia por tu contraseña
    server: 'DESKTOP-BJP2BFE\\MSSQLSERVER07',  // cambia por el nombre de tu instancia
    database: 'Ejercicio_angular',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Conexión a SQL Server
sql.connect(dbConfig).then(pool => {
    if (pool.connected) console.log("✅ Conectado a SQL Server");

    // --- CRUD ---

    // Obtener todos los documentos-tabla
    app.get('/api/nombre_api', async (req, res) => {
        const result = await pool.request().query("SELECT * FROM tabla");
        res.json(result.recordset);
    });

    // Crear un nuevo dato-tabla
    app.post('/api/nombre_api', async (req, res) => {
        const { nombre, ciudad, otros_campos } = req.body;
        await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("ciudad", sql.VarChar, ciudad)
            .input("otros_campos", sql.VarChar, otros_campos)
            .query("INSERT INTO Tabla (nombre, ciudad, otros_campos) VALUES (@nombre, @ciudad, @otros_campos)");
        res.send("✅ Dato agregado correctamente");
    });

    // Actualizar un dato-tabla por ID
    app.put('/api/nombre_api/:id', async (req, res) => {
        const { id } = req.params;
        const { nombre, ciudad, otros_campos } = req.body;
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.VarChar, nombre)
            .input("ciudad", sql.VarChar, ciudad)
            .input("otros_campos", sql.VarChar, otros_campos)
            .query("UPDATE Tabla SET nombre=@nombre, ciudad=@ciudad, otros_campos=@otros_campos WHERE id=@id");
        res.send("✅ Dato actualizado correctamente");
    });

    // Eliminar un item de tabla por ID
    app.delete('/api/nombre_api/:id', async (req, res) => {
        const { id } = req.params;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Tabla WHERE id=@id");
        res.send("🗑️ Dato eliminado correctamente");
    });

    // Arrancar servidor
    app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
}).catch(err => console.error("❌ Error de conexión:", err));
