<?php 
// Connexion à la base de données.

require ('config.php');
try {
    $conn = new PDO (
        'pgsql:host=' . $host . ';dbname=' . $dbname, $dblogin, $dbpass
    );
}
catch (Exception $e) {
    echo $e->getMessage ();
    exit;
}
