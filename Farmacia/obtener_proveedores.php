<?php
header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT * FROM proveedores";
$result = $conn->query($sql);

$proveedores = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $proveedores[] = $row;
    }
}

echo json_encode($proveedores);
?>
