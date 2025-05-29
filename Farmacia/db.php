<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // Deja vacío si no tienes contraseña
$dbname = 'farmacia_db';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
