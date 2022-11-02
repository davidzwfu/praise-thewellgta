<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $month = $_REQUEST["month"];
    $year = $_REQUEST["year"];

    $sql = "SELECT date,s.rid,s.mid,DATE_FORMAT(date, '%M %e') as short_date,name,role,icon FROM schedule s 
        LEFT JOIN members m ON m.id = s.mid LEFT JOIN roles r ON r.id = s.rid 
        WHERE MONTH(date) = '$month' AND YEAR(date) = '$year' ORDER BY date,s.rid";
    
    if ($result = mysqli_query($connect, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $groups = array('Leader'=>'Vocals','Vocal'=>'Vocals','Keys'=>'Instruments','Guitar'=>'Instruments','Cajon'=>'Instruments',
            'Sound'=>'Tech','Elec'=>'Instruments','Cello'=>'Instruments','Violin'=>'Instruments','Drums'=>'Instruments','Bass'=>'Instruments');
            $colors = array('Vocals'=>'purple','Instruments'=>'pink','Tech'=>'primary');
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                //array_push($array, $row);
                $array[$row['date']][$groups[$row['role']]][] = array($row['name'], $row['icon']);
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