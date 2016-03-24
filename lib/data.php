<?php
// Récupère en BDD les données nécessaires à l'affichage initial de la page.

require_once('constants.php'); 
require_once('fun.php');
$users = selectUsers();
$authors = selectAuthors();
$categories = selectCategories();
$keywords = selectKeywords();
$categoriesTree = array();
foreach ($categories as $category) {
    $slices = explode('.', $category['trimmed']);
    if (!isset($categoriesTree[$slices[0]])) $categoriesTree[$slices[0]] = array();
    if (count($slices) > 1) $categoriesTree[$slices[0]][] = $slices[1];
}
?>
