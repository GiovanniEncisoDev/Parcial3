-- Crear la base de datos (con prefijo válido)
CREATE DATABASE db_20100192;

-- Usar la base de datos
USE db_20100192;

-- Crear tabla "peliculas"
CREATE TABLE peliculas (
  idPelicula SMALLINT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150),
  director VARCHAR(50),
  genero VARCHAR(30),
  anio YEAR,
  PRIMARY KEY(idPelicula)
);

-- Insertar datos en la tabla
INSERT INTO peliculas (titulo, director, genero, anio)
VALUES 
  ('John Wick', 'Chad Stahelski', 'Acción', 2014),
  ('Interestelar', 'Christopher Nolan', 'Ciencia Ficción', 2014),
  ('El Contador (The Accountant)', 'Gavin O\'Connor', 'Suspenso', 2016),
  ('Titanes del Pacífico (Pacific Rim)', 'Guillermo del Toro', 'Ciencia Ficción', 2013),
  ('Guerra Sin Reglas / El Ministerio de la Guerra Sucia (The Ministry of Ungentlemanly Warfare)', 'Guy Ritchie', 'Acción', 2024),
  ('Nadie (Nobody)', 'Ilya Naishuller', 'Acción', 2021);

-- Verificar los datos
SELECT * FROM peliculas;
