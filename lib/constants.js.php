<?php
// Traduit les constantes PHP en variables Javascript et les imprime.

require_once('lib/constants.php');
echo "\n" . 'var ROOT = ' . json_encode(ROOT) . ';';
echo "\n" . 'var IS_GUEST = ' . json_encode(IS_GUEST) . ';';
echo "\n" . 'var USER_ID = ' . json_encode(USER_ID) . ';';
echo "\n" . 'var USER_LOGIN = ' . json_encode(USER_LOGIN) . ';';
echo "\n" . 'var ERR_UNKNOWN_ERROR = ' . json_encode(ERR_UNKNOWN_ERROR) . ';';
echo "\n" . 'var ERR_UNKNOWN_USER = ' . json_encode(ERR_UNKNOWN_USER) . ';';
echo "\n" . 'var ERR_MISSING_PARAMETER = ' . json_encode(ERR_MISSING_PARAMETER) . ';';
echo "\n" . 'var ERR_MISSING_LOGIN = ' . json_encode(ERR_MISSING_LOGIN) . ';';
echo "\n" . 'var ERR_MISSING_PASSWORD = ' . json_encode(ERR_MISSING_PASSWORD) . ';';
echo "\n" . 'var ERR_SEARCH_REQUEST = ' . json_encode(ERR_SEARCH_REQUEST) . ';';
echo "\n" . 'var ERR_COLLECTION_REQUEST = ' . json_encode(ERR_COLLECTION_REQUEST) . ';';
?>
