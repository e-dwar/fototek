<?php
/*
 * Ce script reçoit en mode GET l'url d'une image (sous licence CC)
 * Puis
 * - download de l'image dans le répertoire temporaire
 * - analyse des infos de base (taille, type)
 * - fabrique la vignette dans le répertoire temporaire
 * - renvoie en JSON les infos sur l'image ainsi que la vignette sous la forme d'une dataURL.
*/
require('config_upload.php');
header("Content-Type: application/json");
$url = filter_input(INPUT_GET, 'url_image', FILTER_SANITIZE_URL);
if (! $url){
    echo '{"error": true, "error_message" : "missing URL" }';
    exit;
}
$urlParts = parse_url($url);
if ($urlParts['scheme'] != 'http' && $urlParts['scheme'] != 'https'){
        // NB ceci est important pour la sécurité : bloquer les URL 'file//'
        // afin de ne pas permettre la lecture de fichiers 'internes' du site
    echo '{"error": true, "error_message" : "only http and https URL are allowed" }';
    exit;
}

// ----- config du proxy à utiliser sur webtp -----
$configContext = array(
        /*'http' => array(
                'proxy' => 'tcp://cache.univ-lille1.fr:3128',
                'request_fulluri' => true
        )*/
);
$context = stream_context_create($configContext);


// ----- download de l'image -----
$imageData = file_get_contents(
    $url,
    false,
    $context
);
if ($imageData === FALSE){
    echo '{"error": true, "error_message" : "download failed" }';
    exit;
}
  // fabrication d'un fichier temporaire pour l'image complète, dans le dossier syst des fichiers temporaires
  //   pas autorisé sur webtp : $temp_file = tempnam(sys_get_temp_dir(), 'image');
$temp_file = tempnam(TMP_IMG_DIR, 'image');
$ft = fopen($temp_file,"w");
fwrite($ft,$imageData);
fclose($ft);
    // image sauvegardée dans $temp_file
    
//-------   analyse des caractéristiques  de l'image  -------
//      et mémorisation dans la table associative $image

$taille = getimagesize($temp_file);  // width = taille[0]  height = taille[1] type = taille[2]

$image['url'] = $url;
$image['width'] = $taille[0];
$image['height'] = $taille[1];
$image['mimeType'] = image_type_to_mime_type ($taille[2]);

//----- chargement de l'image pour la bibliothèque GD  et destruction du fichier ------
switch ($taille[2]){
    case IMAGETYPE_JPEG :   
        $original = imagecreatefromjpeg($temp_file);
        break;;
    case IMAGETYPE_PNG :
        $original = imagecreatefrompng($temp_file);
        break;;
    case IMAGETYPE_GIF :
        $original = imagecreatefromgif($temp_file);
        break;;
    default :
        echo '{"error": true, "error_message" : "unsupported format" }';
        exit;     
}
    // destruction fichier tempo
unlink($temp_file);

//------ fabrication de la vignette --------

if ($image['width']>$image['height']){
    $largeur = MAX_SIZE;
    $ratio = MAX_SIZE / $image['width'];
    $hauteur = (integer) ($ratio * $image['height']);
}
else {
    $hauteur = MAX_SIZE;
    $ratio = MAX_SIZE / $image['height'];
    $largeur = (integer) ($ratio * $image['width']);
}

$nouvelle = imagecreatetruecolor($largeur, $hauteur);
imagecopyresampled($nouvelle,$original,0,0,0,0,$largeur,$hauteur, $image['width'], $image['height']);

ob_start();  // redirection du buffer de sortie pour récupérer le contenu binaire de l'image 
imagepng($nouvelle);
$thumbData = ob_get_clean(); // fin de redirection

$temp_output_file = tempnam(TMP_IMG_DIR, 'thumb-');
$file = fopen($temp_output_file,"w+");
fwrite($file,$thumbData);
fclose($file);
chmod($temp_output_file, 0766);
 //  la vignette est maintenant sauvegardée dans le répertoire temporaire

$image['fileName']=pathinfo($temp_output_file, PATHINFO_BASENAME);
$image['thumbUrlData'] = "data:image/jpeg;base64,".base64_encode($thumbData); 

echo json_encode($image);
?>
