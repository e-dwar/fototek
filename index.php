<!--
Page principale.
-->
<?php 
session_start();
require_once('lib/constants.php'); 
if (isset($_GET['logout'])) {
    session_destroy();
    unset($_SESSION['user']);
    header('Location: ' . ROOT);
    exit;
}
require_once('lib/data.php');
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Fototek</title>
        <meta charset="utf-8" />
        <link href="index.css?t=<?php echo TIMESTAMP; ?>" rel="stylesheet" type="text/css" />
        <script><?php require('lib/constants.js.php'); ?></script>
        <script type="text/html" id="tpl-thumb"><?php require('tpl/thumb.php'); ?></script>
        <script type="text/html" id="tpl-slideshow"><?php require('tpl/slideshow.php'); ?></script>
        <script type="text/html" id="tpl-login"><?php require('tpl/login.php'); ?></script>
        <script type="text/html" id="tpl-more"><?php require('tpl/more.php'); ?></script>
        <script src="js/tpl.js?t=<?php echo TIMESTAMP; ?>"></script>
        <script src="js/imgs.js?t=<?php echo TIMESTAMP; ?>"></script>
        <script src="js/fun.js?t=<?php echo TIMESTAMP; ?>"></script>
        <script src="js/login.js?t=<?php echo TIMESTAMP; ?>"></script>
        <script src="js/slideshow.js?t=<?php echo TIMESTAMP; ?>"></script>
        <script src="js/index.js?t=<?php echo TIMESTAMP; ?>"></script>
    </head>
    <body<?php if (IS_GUEST) echo ' class="guest"'; ?>>
        <div id="top" class="toolbar">
            <span>Bienvenue sur Fototek<?php
            if (!IS_GUEST) echo ' <b>' . USER_LOGIN . '</b>';
            ?>.</span>
            <div class="buttons">
                <?php if (IS_GUEST) { ?>
                    <button type="button">Connexion</button>
                <?php } else { ?>
                    <button type="button">Déconnexion</button>
                <?php } ?>
            </div>
        </div>
        <div id="filters">
            <?php require('filters.inc.php'); ?>
        </div>
        <div id="info" class="toolbar">
            Résultats: <span id="info-count">0</span>
            <div class="buttons">
                <?php if (!IS_GUEST) { ?>
                    <button type="button" id="favorites">Ma phototèque</button>
                <?php } ?>
                <button type="button" id="slideshow-show">Diaporama</button>
            </div>
        </div>
        <div id="main"></div>
    </body>
</html>
