<?php
include('config.php');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Allow all origins. You can restrict this to a specific origin if needed.
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$entity = $_GET['entity'] ?? null;

if ($entity === 'items') {
    $sql = "SELECT * FROM Items";
    $stmt = $conn->query($sql);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Encode the image data to base64 if it exists
    foreach ($items as &$item) {
        if (isset($item['ItemImage']) && $item['ItemImage']) {
            $item['ItemImage'] = base64_encode($item['ItemImage']);
        }
    }
    unset($item); // Unset reference to avoid potential issues

    echo json_encode($items, JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode(["error" => "Invalid entity"]);
    exit;
}
?>
