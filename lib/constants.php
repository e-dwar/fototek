<?php
// Constantes PHP.

define('PAGE_SIZE', 20);
define('TIMESTAMP', time());
define('URL', 'http://' . $_SERVER[HTTP_HOST] . $_SERVER[REQUEST_URI]);
define('ROOT', '/');
define('IS_GUEST', !isset($_SESSION['user']));
define('USER_ID', IS_GUEST ? null : $_SESSION['user']['id']);
define('USER_LOGIN', IS_GUEST ? null : $_SESSION['user']['login']);

define('ERR_UNKNOWN_ERROR', 0);
define('ERR_UNKNOWN_USER', 1);
define('ERR_MISSING_PARAMETER', 10);
define('ERR_MISSING_LOGIN', 11);
define('ERR_MISSING_PASSWORD', 12);
define('ERR_SEARCH_REQUEST', 20);
define('ERR_COLLECTION_REQUEST', 21);
?>
