<?php
// Webservice d'ajout ou de suppression d'image dans une phototèque.

session_start();
require('../lib/fun.php');
header('Content-type: application/json');
try {
    manageCollection();
    $status = 'ok';
}
catch (Exception $e) {
    $status = 'error';
}
echo json_encode(array(
    'datetime' => time(),
    'status' => $status
));
?>
