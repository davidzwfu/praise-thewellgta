<?php
require_once "config.php";

$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $id = mysqli_real_escape_string($connect, trim($request->id));
    
    $sql = "DELETE FROM members_roles WHERE id = $id LIMIT 1";

    if (!mysqli_query($connect, $sql)) {
        echo mysqli_error($connect);
    }

    //header('Content-Type: application/json');
    //echo json_encode($response);
}
mysqli_close($connect);

?>