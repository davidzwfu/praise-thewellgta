<?php
require_once "config.php";
 
$title = mysqli_real_escape_string($connect, trim($_POST['title']));
$song = mysqli_real_escape_string($connect, trim($_POST['song']));
$size = $_POST['size'];
if (!empty($title) && !empty($song) && $_FILES['file']) {
    $folder = uniqid();
    $path = $folder . "/" . $_FILES['file']['name'];
    $upload = "../files/" . $path;
    mkdir("../files/$folder");

    if (move_uploaded_file($_FILES['file']['tmp_name'], $upload)) {
        $sql = "INSERT INTO songsheets (title,song,size,date,file) VALUES ('$title','$song','$size',NOW(),'$path')";

        if (!mysqli_query($connect, $sql)) {
            echo mysqli_error($connect);
        }
    }
    else
        echo "Upload failed: " . $_FILES["file"]["error"];

}
else
    echo "Missing inputs";

mysqli_close($connect);

// header('Content-Type: application/json');
// echo json_encode($response);

?>