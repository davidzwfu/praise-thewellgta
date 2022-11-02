<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $song = mysqli_real_escape_string($connect, $_REQUEST['song']);
    $order = $_REQUEST['order'];
    $limit = $_REQUEST['limit'];
    $search = mysqli_real_escape_string($connect, $_REQUEST['search']);
    if (!empty($song))
        $song = "WHERE song = '$song'";
    if (!empty($limit))
        $limit = "LIMIT $limit";
    if (!empty($search))
        $song = "WHERE song LIKE '%$search%' OR title LIKE '%$search%'";

    $sql = "SELECT id,title,song,DATE_FORMAT(date, '%M %e') as short_date,size,file FROM songsheets
        $song ORDER BY $order $limit";

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