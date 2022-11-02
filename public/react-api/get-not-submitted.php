<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $month = $_REQUEST["month"];
    $year = $_REQUEST["year"];

    $sql = "SELECT name FROM members WHERE id NOT IN (SELECT mid FROM availability 
        WHERE MONTH(date) = $month AND YEAR(date) = $year) ORDER BY name";
    
    if ($result = mysqli_query($connect, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($array, $row);
            }
            echo json_encode($array);
            mysqli_free_result($result);
        } 
    }
    else {
        echo "ERROR: Could not execute $sql. " . mysqli_error($connect);
    }

}
mysqli_close($connect);

?>