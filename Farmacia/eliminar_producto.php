<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
$codigo = $data->codigo;

$sql = "DELETE FROM productos WHERE codigo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $codigo);

if ($stmt->execute()) {
    echo "Producto eliminado";
} else {
    echo "Error al eliminar producto";
}
?>
