<?php
include 'db.php';

$sql = "SELECT * FROM departamentos";
$result = $conn->query($sql);

$departamentos = [];

while ($row = $result->fetch_assoc()) {
    $departamentos[] = $row;
}

echo json_encode($departamentos);
?>
