-- Crear la base de datos 
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

/*  Agregar mas  */

INSERT INTO peliculas (titulo, director, genero, anio) VALUES
  ('Riddick', 'David Twohy', 'Ciencia Ficción', 2013),
  ('Kingsman: El Servicio Secreto', 'Matthew Vaughn', 'Acción', 2014),
  ('Misión Imposible: Repercusión', 'Christopher McQuarrie', 'Acción', 2018),
  ('Godzilla', 'Gareth Edwards', 'Ciencia Ficción', 2014);

/*  Consultas  */

-- Todas las películas de acción
SELECT * FROM peliculas WHERE genero = 'Acción';

-- Películas dirigidas por "Christopher Nolan"
SELECT * FROM peliculas WHERE director = 'Christopher Nolan';

-- Películas del año 2014
SELECT * FROM peliculas WHERE anio = 2014;

-- Títulos que contienen la palabra "Godzilla"
SELECT * FROM peliculas WHERE titulo LIKE '%Godzilla%';

-- Películas ordenadas por año (más reciente primero)
SELECT * FROM peliculas ORDER BY anio DESC;

/*  Actualizar  */
-- Corregir el título de "Interestelar" a "Interstellar"
UPDATE peliculas
SET titulo = 'Interstellar'
WHERE titulo = 'Interestelar';

-- Cambiar el género de "Kingsman" a "Comedia de Acción"
UPDATE peliculas
SET genero = 'Comedia de Acción'
WHERE titulo LIKE '%Kingsman%';

-- Cambiar el año de "Riddick" a 2014
UPDATE peliculas
SET anio = 2014
WHERE titulo = 'Riddick';


/*  Eliminar  */
-- Eliminar la película "Godzilla"
DELETE FROM peliculas
WHERE titulo = 'Godzilla';

-- Eliminar todas las películas de 2013
DELETE FROM peliculas
WHERE anio = 2013;

/* Modificar tabla */
ALTER TABLE peliculas
ADD imagen VARCHAR(255),
ADD url VARCHAR(255);

/* Agregar datos nuevos */
UPDATE peliculas
SET imagen = 'https://example.com/johnwick.jpg',
    url = 'https://www.youtube.com/watch?v=2AUmvWm5ZDQ'
WHERE titulo = 'John Wick';

UPDATE peliculas
SET imagen = 'https://example.com/interestellar.jpg',
    url = 'https://www.youtube.com/watch?v=zSWdZVtXT7E'
WHERE titulo = 'Interstellar';

/* Verificar */
-- Ver estructura
DESCRIBE peliculas;

-- Ver los nuevos campos con los datos actualizados
SELECT titulo, imagen, url FROM peliculas;
