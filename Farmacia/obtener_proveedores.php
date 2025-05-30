<?php
include 'db.php';

$sql = "SELECT * FROM proveedores";
$result = $conn->query($sql);

$proveedores = [];

while ($row = $result->fetch_assoc()) {
    $proveedores[] = $row;
}

echo json_encode($proveedores);
?>
