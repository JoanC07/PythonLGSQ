create database login;
USE login; 

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(100) NOT NULL
);

select * from usuarios
-- Insertar algunos datos de ejemplo
INSERT INTO usuarios (username, password) VALUES ('usuario1', '123456');
INSERT INTO usuarios (username, password) VALUES ('usuario2', '123456');
INSERT INTO usuarios (username, password) VALUES ('usuario3', '123456');
INSERT INTO usuarios (username, password) VALUES ('usuario4', '123456');
INSERT INTO usuarios (username, password) VALUES ('usuario5', '123456');

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

    // --- CRUD Zoo ---

    // Obtener todos los zoos
    app.get('/api/zoos', async (req, res) => {
        const result = await pool.request().query("SELECT * FROM Zoo");
        res.json(result.recordset);
    });

    // Crear un nuevo zoo
    app.post('/api/zoos', async (req, res) => {
        const { nombre, ciudad, pais, tamano, presupuesto } = req.body;
        await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("ciudad", sql.VarChar, ciudad)
            .input("pais", sql.VarChar, pais)
            .input("tamano", sql.Decimal(10, 2), tamano)
            .input("presupuesto", sql.Decimal(10, 2), presupuesto)
            .query("INSERT INTO Zoo (nombre, ciudad, pais, tamano, presupuesto) VALUES (@nombre, @ciudad, @pais, @tamano, @presupuesto)");
        res.send("✅ Zoo agregado correctamente");
    });

    // Actualizar un zoo por ID
    app.put('/api/zoos/:id', async (req, res) => {
        const { id } = req.params;
        const { nombre, ciudad, pais, tamano, presupuesto } = req.body;
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.VarChar, nombre)
            .input("ciudad", sql.VarChar, ciudad)
            .input("pais", sql.VarChar, pais)
            .input("tamano", sql.Decimal(10, 2), tamano)
            .input("presupuesto", sql.Decimal(10, 2), presupuesto)
            .query("UPDATE Zoo SET nombre=@nombre, ciudad=@ciudad, pais=@pais, tamano=@tamano, presupuesto=@presupuesto WHERE id_zoo=@id");
        res.send("✅ Zoo actualizado correctamente");
    });

    // Eliminar un zoo por ID
    app.delete('/api/zoos/:id', async (req, res) => {
        const { id } = req.params;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Zoo WHERE id_zoo=@id");
        res.send("🗑️ Zoo eliminado correctamente");
    });

    // --- CRUD Especie ---

    // Obtener todas las especies
    app.get('/api/especies', async (req, res) => {
        const result = await pool.request().query("SELECT * FROM Especie");
        res.json(result.recordset);
    });

    // Obtener una especie por ID
    app.get('/api/especies/:id', async (req, res) => {
        const result = await pool.request()
            .input('id', sql.Int, +req.params.id)
            .query("SELECT * FROM Especie WHERE id_especie=@id");

        if (!result.recordset[0]) return res.status(404).send("❌ Especie no encontrada");
        res.json(result.recordset[0]);
    });

    // Crear nueva especie
    app.post('/api/especies', async (req, res) => {
        const { nombre_vulgar, nombre_cientifico, familia_pertenece, peligro_extincion } = req.body;

        await pool.request()
            .input('nombre_vulgar', sql.VarChar, nombre_vulgar)
            .input('nombre_cientifico', sql.VarChar, nombre_cientifico)
            .input('familia_pertenece', sql.VarChar, familia_pertenece)
            .input('peligro_extincion', sql.VarChar, peligro_extincion)
            .query(`
            INSERT INTO Especie (nombre_vulgar, nombre_cientifico, familia_pertenece, peligro_extincion)
            VALUES (@nombre_vulgar, @nombre_cientifico, @familia_pertenece, @peligro_extincion)
        `);

        res.send("✅ Especie agregada correctamente");
    });

    // Actualizar especie por ID
    app.put('/api/especies/:id', async (req, res) => {
        const { nombre_vulgar, nombre_cientifico, familia_pertenece, peligro_extincion } = req.body;

        const result = await pool.request()
            .input('id', sql.Int, +req.params.id)
            .input('nombre_vulgar', sql.VarChar, nombre_vulgar)
            .input('nombre_cientifico', sql.VarChar, nombre_cientifico)
            .input('familia_pertenece', sql.VarChar, familia_pertenece)
            .input('peligro_extincion', sql.VarChar, peligro_extincion)
            .query(`
            UPDATE Especie
            SET nombre_vulgar=@nombre_vulgar,
                nombre_cientifico=@nombre_cientifico,
                familia_pertenece=@familia_pertenece,
                peligro_extincion=@peligro_extincion
            WHERE id_especie=@id
        `);

        if (!result.rowsAffected[0]) return res.status(404).send("❌ Especie no encontrada");
        res.send("🔄 Especie actualizada correctamente");
    });

    // Eliminar especie por ID
    app.delete('/api/especies/:id', async (req, res) => {
        try {
            const result = await pool.request()
                .input('id', sql.Int, +req.params.id)
                .query("DELETE FROM Especie WHERE id_especie=@id");

            if (!result.rowsAffected[0]) return res.status(404).send("❌ Especie no encontrada");
            res.send("🗑️ Especie eliminada correctamente");
        } catch (err) {
            if (err?.number === 547) {
                return res.status(409).send("⚠️ No se puede eliminar: hay animales asociados.");
            }
            res.status(500).send("❌ Error eliminando especie");
        }
    });


    // --- CRUD Animal ---

    // Obtener todos los animales con relaciones
    app.get('/api/animales', async (req, res) => {
        const result = await pool.request().query(`
        SELECT a.*, z.nombre AS zoo_nombre, e.nombre_vulgar AS especie_nombre
        FROM Animal a
        JOIN Zoo z ON z.id_zoo = a.id_zoo
        JOIN Especie e ON e.id_especie = a.id_especie
        ORDER BY a.id_animal DESC
    `);
        res.json(result.recordset);
    });

    // Obtener un animal por ID
    app.get('/api/animales/:id', async (req, res) => {
        const result = await pool.request()
            .input('id', sql.Int, +req.params.id)
            .query("SELECT * FROM Animal WHERE id_animal=@id");

        if (!result.recordset[0]) return res.status(404).send("❌ Animal no encontrado");
        res.json(result.recordset[0]);
    });

    // Crear nuevo animal
    app.post('/api/animales', async (req, res) => {
        const {
            id_zoo, id_especie, identificacion,
            sexo, anio_nacimiento, pais_origen, continente
        } = req.body;

        await pool.request()
            .input('id_zoo', sql.Int, id_zoo)
            .input('id_especie', sql.Int, id_especie)
            .input('identificacion', sql.VarChar, identificacion)
            .input('sexo', sql.VarChar, sexo)
            .input('anio_nacimiento', sql.Date, anio_nacimiento || null)
            .input('pais_origen', sql.VarChar, pais_origen || null)
            .input('continente', sql.VarChar, continente || null)
            .query(`
            INSERT INTO Animal (id_zoo, id_especie, identificacion, sexo, anio_nacimiento, pais_origen, continente)
            VALUES (@id_zoo, @id_especie, @identificacion, @sexo, @anio_nacimiento, @pais_origen, @continente)
        `);

        res.send("✅ Animal creado correctamente");
    });

    // Actualizar animal por ID
    app.put('/api/animales/:id', async (req, res) => {
        const {
            id_zoo, id_especie, identificacion,
            sexo, anio_nacimiento, pais_origen, continente
        } = req.body;

        const result = await pool.request()
            .input('id', sql.Int, +req.params.id)
            .input('id_zoo', sql.Int, id_zoo)
            .input('id_especie', sql.Int, id_especie)
            .input('identificacion', sql.VarChar, identificacion)
            .input('sexo', sql.VarChar, sexo)
            .input('anio_nacimiento', sql.Date, anio_nacimiento || null)
            .input('pais_origen', sql.VarChar, pais_origen || null)
            .input('continente', sql.VarChar, continente || null)
            .query(`
            UPDATE Animal SET
                id_zoo=@id_zoo,
                id_especie=@id_especie,
                identificacion=@identificacion,
                sexo=@sexo,
                anio_nacimiento=@anio_nacimiento,
                pais_origen=@pais_origen,
                continente=@continente
            WHERE id_animal=@id
        `);

        if (!result.rowsAffected[0]) return res.status(404).send("❌ Animal no encontrado");
        res.send("🔄 Animal actualizado correctamente");
    });

    // Eliminar animal por ID
    app.delete('/api/animales/:id', async (req, res) => {
        const result = await pool.request()
            .input('id', sql.Int, +req.params.id)
            .query("DELETE FROM Animal WHERE id_animal=@id");

        if (!result.rowsAffected[0]) return res.status(404).send("❌ Animal no encontrado");
        res.send("🗑️ Animal eliminado correctamente");
    });

    // Arrancar servidor
    app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
}).catch(err => console.error("❌ Error de conexión:", err));
