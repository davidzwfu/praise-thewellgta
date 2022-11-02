<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $month = $_REQUEST["month"];
    $year = $_REQUEST["year"];

    $sql = "SELECT s.rid,s.mid,s.date,m.name,r.role FROM schedule_save s 
    LEFT JOIN members m ON m.id = s.mid
    LEFT JOIN roles r ON r.id = s.rid
    WHERE MONTH(date) = $month AND YEAR(date) = $year ORDER BY date,rid";
    
    if ($result = mysqli_query($connect, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $groups = array('Leader'=>'Vocals','Vocal'=>'Vocals','Keys'=>'Instruments','Guitar'=>'Instruments','Cajon'=>'Instruments','Sound'=>'Tech','Elec'=>'Instruments','Cello'=>'Instruments','Violin'=>'Instruments');
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                //array_push($array, $row);
                $array[$row['date'].$row['rid'].'/'.$row['role']] = array('name'=>$row['name'],'mid'=>$row['mid'],'rid'=>$row['rid'],'date'=>$row['date']);
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