<?php
require_once "config.php";

$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $id = mysqli_real_escape_string($connect, trim($request->id));

    $sql = "SELECT file FROM songsheets WHERE id = $id LIMIT 1";
    
    if ($result = mysqli_query($connect, $sql)) {
        $row = mysqli_fetch_row($result);
        $path = $row[0];
        $folder = explode("/", $path)[0];

        unlink("../files/$path");
        if (rmdir("../files/$folder")) {
            $sql = "DELETE FROM songsheets WHERE id = $id LIMIT 1";
            if (!mysqli_query($connect, $sql))
                echo mysqli_error($connect);
        }
        else
            echo "Delete file failed";

    }
    else
        echo mysqli_error($connect);

    //header('Content-Type: application/json');
    //echo json_encode($response);
}
mysqli_close($connect);

?>