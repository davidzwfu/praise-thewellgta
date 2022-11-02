<?php
require_once "config.php";
 
$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $rid = mysqli_real_escape_string($connect, trim($request->rid));
    $mid = mysqli_real_escape_string($connect, trim($request->mid));
    
    $sql = "INSERT IGNORE INTO members_roles (rid,mid) VALUES ('$rid','$mid')";

    if (!mysqli_query($connect, $sql)) {
        echo mysqli_error($connect);
    }

    //header('Content-Type: application/json');
    //echo json_encode($response);
}
mysqli_close($connect);

?>