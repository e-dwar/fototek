<?php
/*
 * Ce script reçoit en mode POST l'*ensemble* des informations concernant une image
 * y compris le nom temporaire du fichier vignette
 * Seule l'URL auteur est facultative (comme indiqué dans le sujet)
 *
 * Renvoie {"ok":true} en cas de succès
 * et {"error":true,"error_message":"..."} en cas d'échec
 *
 * IL FAUT
 *    * 1 - adapter le fichier de configuration config_upload.php
 *    * 2 - compléter la méthode saveToDataBase() de la classe Image
 *    *     pour enregistrer l'image dans votre photothèque
 * 
 */
require('../lib/conn.php');
 
require('config_upload.php');

class InputException extends Exception { }

function argFilter($name, $method, $filter, $requis=TRUE){
  $v = filter_input($method, $name, $filter);
  if ( $requis && $v == NULL )
    throw new InputException('{"error": true, "error_message" : "missing '.$name.'" }');
 return $v;
}

class Image {
    public $url;
    public $url_author = NULL;
    public $tmp_thumbnail;  // nom fichier provisoire
    public $thumbnail;      // nom fichier définitif
    public $author;
    public $licence;
    public $title;
    public $size;
    public $mime_type;
    public $categories;
    public $keywords;
    public function __construct(){ // contruction à partir des paramètres reçus
        try{
            $this->url = argFilter('url', INPUT_POST, FILTER_SANITIZE_URL);
            $this->url_author = argFilter('url_author', INPUT_POST, FILTER_SANITIZE_URL,FALSE);
            $this->url_flickr = argFilter('url_flickr', INPUT_POST, FILTER_SANITIZE_URL,FALSE);
            $this->tmp_thumbnail = argFilter('tmp_thumbnail', INPUT_POST, FILTER_SANITIZE_URL);
            $this->author = argFilter('author', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->licence = argFilter('licence', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->title = argFilter('title', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->size = argFilter('size', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->mime_type = argFilter('mime_type', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->categories = argFilter('categories', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->keywords = argFilter('keywords', INPUT_POST, FILTER_SANITIZE_STRING);
            $this->categories = preg_split('!\s*,\s*!',trim($this->categories));
            $this->keywords = preg_split('!\s*,\s*!',trim($this->keywords));
        }
        catch (InputException $e) {
            echo $e->getMessage();
            exit;
        }
        // verification du nom de fichier vignette (important : sécurité)
        if (  $this->tmp_thumbnail != pathinfo($this->tmp_thumbnail,PATHINFO_BASENAME)  // doit être un simple basename
            ||
              ! file_exists(TMP_IMG_DIR.$this->tmp_thumbnail)  // doit exister dans le rep temporaire
            ||
              ! preg_match('/thumb\-/',$this->tmp_thumbnail)  // doit commencer par thumb-
           ){
          echo '{"error": true, "error_message" : "incorrect filename" }';
          exit;
        }
        $this->thumbnail  = $this->tmp_thumbnail.'.jpg';
    }
    private function moveThumbnail(){
        return rename(TMP_IMG_DIR.$this->tmp_thumbnail,THUMBNAILS_DIR.$this->thumbnail);
    }
    
    public function save(){
        if (!$this->saveToDataBase())
            return false;
        return $this->moveThumbnail();
    }
    
    public function saveToDataBase(){ /* renvoyer true uniquement en cas de succès */
        // mémoriser les infos image dans la base
        // à compléter
        global $conn;
        $sql = 'insert into projet.images (url, page, title, thumbnail, licence, author, size, mime_type, category, keywords) ';
        $sql .= 'values (:url, :page, :title, :thumbnail, :licence, :author, :size, :mime_type, :category, :keywords)';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':url', $this->url);
        $stmt->bindValue(':page', $this->url_flickr);
        $stmt->bindValue(':title', $this->title);
        $stmt->bindValue(':licence', implode('-', explode(' ', $this->licence)));
        $stmt->bindValue(':thumbnail', $this->thumbnail);
        $stmt->bindValue(':author', $this->author);
        $stmt->bindValue(':size', $this->size);
        $stmt->bindValue(':mime_type', $this->mime_type);
        $stmt->bindValue(':category', '.' . implode('.', $this->categories) . '.');
        $stmt->bindValue(':keywords', '.' . implode('.', $this->keywords) . '.');
        return $stmt->execute();
    }
}
$image = new Image();
if ($image->save())
    echo '{"ok":true}';
?>
