import mysql from 'mysql2/promise';

const main = async () => {
  try {
    // Crear la conexión a la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',  // si no usas contraseña, déjalo vacío
      port: 3306,
      database: 'db_20100192',  // Asegúrate de que el nombre de la base de datos esté correcto
    });

    // Realizar la consulta SQL
    const [peliculas] = await connection.query('SELECT * FROM peliculas');
    console.log(peliculas); // Imprimir el resultado de la consulta

    // Cerrar la conexión
    await connection.end();
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
  }
};

// Ejecutar la función principal
main();
