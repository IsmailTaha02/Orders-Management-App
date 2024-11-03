<?php
// config.php
$host = 'localhost';  // Your database host
$db = 'Orders';  // Your database name
$user = 'root';  // Your database user
$pass = '';  // Your database password


$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


?>
