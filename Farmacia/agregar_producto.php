<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$codigo = $data->codigo;
$nombre = $data->nombre;
$precio = $data->precio;
$cantidad = $data->cantidad;
$depto = $data->depto_codigo;
$proveedor = $data->proveedor_codigo;

$sql = "INSERT INTO productos (codigo, nombre, precio, cantidad, depto_codigo, proveedor_codigo)
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdiss", $codigo, $nombre, $precio, $cantidad, $depto, $proveedor);

if ($stmt->execute()) {
    echo "Producto agregado correctamente";
} else {
    echo "Error al agregar producto";
}
?>
