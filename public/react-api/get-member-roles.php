<?php
require_once "config.php";
 
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT mr.id,mr.rid,mr.mid,r.role,m.name FROM members_roles mr 
        LEFT JOIN members m ON mr.mid = m.id 
        LEFT JOIN roles r ON mr.rid = r.id 
        ORDER BY r.id,m.name";
    
    if ($result = mysqli_query($connect, $sql)) {
        if (mysqli_num_rows($result) > 0) {
            $array = array();
            while ($row = mysqli_fetch_assoc($result)) {
                //array_push($array, $row);
                $array[$row['rid'].'/'.$row['role']][] = array('name'=>$row['name'],'id'=>$row['id']);
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