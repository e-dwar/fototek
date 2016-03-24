<?php
// Fonctions liées aux requêtes SQL.

require_once('conn.php');
require_once('constants.php');

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

// Gère l'ajout ou la suppression de l'image dans la collection de l'utilisateur.
function manageCollection () {
    global $conn;
    $sql = 'select * from projet.collections where id_image = :id and id_user=:user'; 
    $stmt = $conn->prepare($sql);       
    $stmt->bindValue(':id', $_GET['id'], PDO::PARAM_INT);        
    $stmt->bindValue(':user', USER_ID, PDO::PARAM_INT);
    $stmt->execute();        
    $collection = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (sizeof($collection) < 1) {
        $sql2 = 'insert into projet.collections (id_image, id_user) values (:id, :user)';   
    } 
    else {
        $sql2 = 'delete from projet.collections where id_image = :id and id_user = :user';
    }
    $stmt = $conn->prepare($sql2);
    $stmt->bindValue(':id', $_GET['id'], PDO::PARAM_INT);        
    $stmt->bindValue(':user', USER_ID, PDO::PARAM_INT);
    if (!$stmt->execute()) {
        throw new Exception('manageCollection() error.');
    }
}

// Sélectionne les images dans la BDD
// correspondant aux critères passés en POST.
function selectImages () {
    $sql = mkImagesQuery();
    $stmt = mkStmt($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Compte les images dans la BDD
// correspondant aux critères passés en POST.
function countImages () {
    $sql = mkImagesQuery(true);
    $stmt = mkStmt($sql, true);
    $stmt->execute();
    return $stmt->fetchColumn();
}

// Farbique la chaîne de requête SQL.
function mkImagesQuery ($count = false) {
    $where = 'where';
    $sql = 'select';
    if ($count) {
        $sql .= ' count(*)';
    }
    else {
        $sql .= ' id, licence, author, url, thumbnail, title, size, mime_type, category, keywords';
        if (IS_GUEST) {
            $sql .= ', FALSE as owned';
        }
        else {
            $sql .= ', case when (';
            $sql .= 'select count(*) from projet.collections where id_image = id and id_user = ' . USER_ID;
            $sql .= ') = 1 then TRUE else FALSE end as owned';
        }
    }
    $sql .= ' from projet.images left join projet.collections on (';
    $sql .= 'id = id_image and id_user' . (
        isset($_POST['collection']) ? ' = :collection' : (
            IS_GUEST ? ' is NULL' : ' = ' . USER_ID
        )
    );
    $sql .= ')';
    if (isset($_POST['category'])) {
        $sql .= ' ' . $where . ' category like :category || \'%\'';
        $where = 'and';
    }
    if (isset($_POST['author'])) {
        $sql .= ' ' . $where . ' author like \'%\' || :author || \'%\'';
        $where = 'and';
    }
    if (isset($_POST['collection'])) {
        $sql .= ' ' . $where . ' id_user = :collection';
        $where = 'and';
    }
    if (isset($_POST['keywords'])) {
        $markers = array();
        foreach ($_POST['keywords'] as $i => $keywords) {
            $markers[] = ':keywords' . $i;
        }
        // keywords like '%.' || :keywords0 || '.%' and keywords like '%.' || :keywords1 || '.%' and keywords like '%.' || :keywords2 || '.%'
        $sql .= ' ' . $where . ' keywords like \'%.\' || ' . implode(' || \'.%\' and keywords like \'%.\' || ', $markers) . ' || \'.%\'';
        $where = 'and';
    }
    if (!$count) {
        $sql .= ' order by title';
        $sql .= ' limit ' . PAGE_SIZE . ' offset :offset';
    }
    return $sql;
}

// Créé l'object PDOStatement
function mkStmt ($sql, $count = false) {
    global $conn;
    $stmt = $conn->prepare($sql);
    if (isset($_POST['category'])) {
        $stmt->bindValue(':category', $_POST['category']);
    }
    if (isset($_POST['author'])) {
        $stmt->bindValue(':author', $_POST['author']);
    }
    if (isset($_POST['collection'])) {
        $stmt->bindValue(':collection', $_POST['collection'], PDO::PARAM_INT);
    }
    if (isset($_POST['keywords'])) {
        foreach ($_POST['keywords'] as $i => $keyword) {
            $stmt->bindValue(':keywords' . $i, $keyword);
        }
    }
    if (!$count) {
        $stmt->bindValue(':offset', $_POST['offset'], PDO::PARAM_INT);
    }
    return $stmt;
}

// Retourne un utilisateur.
function selectUser ($id) {
    global $conn; 
    $sql = 'select login, id from projet.users';
    $sql .= ' where id = :id order';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}


// Retourne la liste des noms des utilisateurs.
function selectUsers () {
    global $conn; 
    $sql = 'select login, id from projet.users order by login';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Retourne la liste des auteurs des images.
function selectAuthors () {
    global $conn; 
    $sql = 'select distinct author';
    $sql .= ' from projet.images';
    $sql .= ' where author is not NULL';
    $sql .= ' order by author';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return pluck($stmt->fetchAll(PDO::FETCH_ASSOC), 'author');
}

// Retourne la liste des mots-clés.
function selectKeywords () {
    global $conn;
    $sql = 'select distinct';
    $sql .= ' regexp_split_to_table(trim(both \'.\' from keywords), \'\\.\')';
    $sql .= ' as keyword from projet.images';
    $sql .= ' order by keyword';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return pluck($stmt->fetchAll(PDO::FETCH_NUM), 0);
}

// Retourne la liste des catégories.
function selectCategories () {
    global $conn;
    $sql = 'select distinct category as name,';
    $sql .= ' trim(both \'.\' from category) as trimmed';
    $sql .= ' from projet.images';
    $sql .= ' order by category';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Retourne un tableau ne contenant que clé `$k` du tableau `$a`.
function pluck ($a, $k) {
    $b = array();
    foreach ($a as $sub) $b[] = $sub[$k];
    return $b;
}


