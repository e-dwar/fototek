<?php
// Webservice de recherche d'images.

session_start();
header('Content-type: application/json');
require('../lib/fun.php');
try {
    $records = selectImages();
    $count = countImages();
    $status = 'ok';
}
catch (Exception $e) {
    $records = array();
    $count = 0;
    $status = 'error';
}
echo json_encode(array(
    'datetime' => time(),
    'status' => $status,
    'results' => $records,
    'total' => $count
));
?>
