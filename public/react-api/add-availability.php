<?php
require_once "config.php";

$postdata = file_get_contents("php://input");
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $id = mysqli_real_escape_string($connect, trim($request->id));
    $month = mysqli_real_escape_string($connect, trim($request->month));
    $year = mysqli_real_escape_string($connect, trim($request->year));
    $dates = $request->dates;

    if ($id == '')
        return http_response_code(400);

    if (count($dates) > 0) {
        $sql = "INSERT IGNORE INTO availability (mid,date) VALUES ";
        for ($x = 0; $x < count($dates); $x++) {
            $date = $dates[$x];
            $sql .= "('$id','$date'),";
        }
        $sql = rtrim($sql, ',');
        $sql2 = "DELETE FROM availability WHERE mid = $id AND MONTH(date) = $month AND YEAR(date) = $year AND date NOT IN (" . implode(',', $dates) . ")";
    }
    else {
        $sql = "INSERT INTO availability (mid, date) VALUES ('$id', '$year-$month-00')";
        $sql2 = "DELETE FROM availability WHERE mid = $id AND MONTH(date) = $month AND YEAR(date) = $year";
    }

    mysqli_query($connect, $sql2);
    if (mysqli_query($connect, $sql2)) {
        if (!mysqli_query($connect, $sql)) {
            echo mysqli_error($connect);
        }
    }
    else {
        echo mysqli_error($connect);
    }

    //header('Content-Type: application/json');
    //echo json_encode($response);
}
mysqli_close($connect);

?>