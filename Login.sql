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
