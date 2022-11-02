<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT id,role FROM roles ORDER BY role";
    
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