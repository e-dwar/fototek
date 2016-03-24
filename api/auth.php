<?php
// Webservice de connexion utilisateur.

session_start();
unset($_SESSION['user']);
require_once('../lib/constants.php');
require_once('../lib/auth.php');
try {
    // Création du compte et chargement de la session
    if (isset($_POST['signup']) && $_POST['signup'] === 'true') {
        if (addUser($_POST['login'], $_POST['password'])) {
            $_SESSION['user'] = infoPersonne($_POST['login']);
        }
        else {
            throw new Exception(
                'Unable to add user (' .
                'login=' . $_POST['login'] . '&' .
                'password=' . $_POST['password'] . ').'
            );
        }
    }
    // Vérification des informations de connexion
    else {
        controleAuthentification();
    }
    $data = array(
        'status' => 'ok',
        'datetime' => time()
    );
}
catch (Exception $e) {
    $data = array(
        'status' => 'error',
        'code' => $_SESSION['error'],
        'datetime' => time()
    );
}
echo json_encode($data);
?>
