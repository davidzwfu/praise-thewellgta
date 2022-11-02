<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Methods");

$hostname = "localhost";
$username = "thewellg_admin";
$database = "thewellg_praise";
$password = "JyBKQ3z#D2u[";
$connect = mysqli_connect($hostname, $username, $password, $database);

if (mysqli_connect_errno()) {
    die('<p>Failed to connect to MySQL</p>');
}
?>