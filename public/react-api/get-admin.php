<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $month = $_REQUEST["month"];
    $year = $_REQUEST["year"];

    $sql = "SELECT r.id as rid,r.role,a.date,a.mid,DATE_FORMAT(date, '%M %e') as short_date,name FROM availability a 
        LEFT JOIN members m ON m.id = a.mid 
        LEFT JOIN members_roles mr ON mr.mid = a.mid 
        LEFT JOIN roles r ON r.id = mr.rid 
        WHERE MONTH(date) = $month AND YEAR(date) = $year AND DAY(date) != 0 AND r.role != 'Sound' ORDER BY date,r.id,name";
    
    if ($result = mysqli_query($connect, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $groups = array('Leader'=>'Vocals','Vocal'=>'Vocals','Keys'=>'Instruments','Guitar'=>'Instruments','Cajon'=>'Instruments',
            'Sound'=>'Tech','Elec'=>'Instruments','Cello'=>'Instruments','Violin'=>'Instruments','Drums'=>'Instruments','Bass'=>'Instruments');
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                //array_push($array, $row);
                $array[$row['date']][$groups[$row['role']]][$row['rid'].'/'.$row['role']][] = array('name'=>$row['name'],'mid'=>$row['mid'],'rid'=>$row['rid']);
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