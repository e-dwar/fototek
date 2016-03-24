<?php
// Fonctions liées à la connexion utilisateur.

require_once ('constants.php');
require_once ('conn.php');

function randomSalt () {
    $s = '';
    $chars = array_merge (
        array (46, 47), // . /
        range (48, 57), // 0-9
        range (65, 90), // A-Z
        range (97, 122) // a-z
    );
    for ($i = 0; $i < 22; $i++) {
        $s .= chr ($chars[rand (0, count ($chars) - 1)]);
    }
    return '$2a$10$' . $s;
}

function infoPersonne ($login) {
    global $conn;
    $stmt = $conn->prepare ('select * from projet.users where login=:login');
    $stmt->bindValue (':login', $login);
    $stmt->execute ();
    return $stmt->fetch (PDO::FETCH_ASSOC);
}

function addUser ($login, $password) {
    global $conn;
    $stmt=$conn->prepare ('insert into projet.users (login,password) values (:login, :password)');
    $stmt->bindValue (':login', $login);
    $stmt->bindValue (':password', crypt ($password, randomSalt ()));
    return $stmt->execute ();
}

/*
  Si login et password sont corrects, alors 
  le résultat est une instance d'Identite décrivant cet utilisateur
  Sinon le résultat vaut null
*/
function authentifie ($login, $password) {
    $user = infoPersonne ($login);
    $valid = $user && crypt ($password, $user['password']) == $user['password'];
    return $valid ? $user : null;
}

/*
 Verifie l'authentification 
 La fonction se termine normalement
 - Si l'état de la session indique que l'authentification a déjà eu lieu
 - Si des paramètres login/password corrects ont été fournis
 Après exécution correcte,  $_SESSION['user'] contient l'identité de l'utilisateur
 Dans tous les autres cas, une exception est déclenchée
*/
function controleAuthentification () {
    if (isset($_SESSION['user'])) return true;
    $login = inputFilterString('login');
    $password = inputFilterString('password');
    $user = authentifie($login, $password);
    if (!$user) { 
        $_SESSION['error'] = ERR_UNKNOWN_USER;
        throw new Exception('login/password incorrects');
    }
    unset($_SESSION['error']);
    unset($user['password']);
    $_SESSION['user'] = $user;
}


function inputFilterString ($name, $requis = true) {
    $v = filter_input(INPUT_POST, $name, FILTER_SANITIZE_STRING);
    if ($requis && $v == NULL) {
        switch ($name) {
            case 'login':       $_SESSION['error'] = ERR_MISSING_LOGIN; break;
            case 'password':    $_SESSION['error'] = ERR_MISSING_PASSWORD; break;
            default:            $_SESSION['error'] = ERR_MISSING_PARAMETER; break;
        }
        throw new Exception("argument $name est requis");
    }
    return $v;
}

?>
