import mysql from 'mysql2/promise';

const main = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: '20100192',
  });

  try {
    const [peliculas] = await connection.query('SELECT * FROM peliculas');
    console.log(peliculas);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
};

main();
