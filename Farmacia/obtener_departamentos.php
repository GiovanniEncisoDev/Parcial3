<?php
header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT * FROM departamentos";
$result = $conn->query($sql);

$departamentos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $departamentos[] = $row;
    }
}

echo json_encode($departamentos);
?>
