<?php
require_once "config.php";

$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $month = mysqli_real_escape_string($connect, trim($request->month));
    $year = mysqli_real_escape_string($connect, trim($request->year));
    $selected = $request->selected;

    $sql = "INSERT INTO schedule_save (date,mid,rid) VALUES ";
    foreach ($selected as $row) {
        $sql .= "('$row->date','$row->mid','$row->rid'),";
    }
    $sql = rtrim($sql, ',');
    
    $sql2 = "DELETE FROM schedule_save WHERE MONTH(date) = $month AND YEAR(date) = $year";
    if (!mysqli_query($connect, $sql2)) {
        echo mysqli_error($connect);
    }

    if (count($selected) > 0) {
        if (!mysqli_query($connect, $sql)) {
            echo mysqli_error($connect);
        }
    }

    //header('Content-Type: application/json');
    //echo json_encode($response);
}
mysqli_close($connect);

?>