<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" dir="ltr">
    <head>
        <meta charset="UTF-8" />
        <title>Ajout d'image à la photothèque</title>
        <link rel="stylesheet" href="ImageForm.css" />
        <script src="ImageForm.js"></script>
        <style>
            
        </style>
    </head>
    <body>

        <section id="sectionURL">
            <form id="imageUrl"  method="post" enctype="multipart/form-data" >
                <fieldset>
                    <legend>Nouvelle image</legend>
                    <label for="url_image"><span>URL de l'image</span></label>
                    <input type="url" name="url_image" id="url_image" />
                    <button type="submit" name="ok">Valider</button>
                </fieldset>
            </form>
            <div class="message"></div>
        </section>
        <section id="sectionInfos">
            <form id="meta"  method="post" enctype="multipart/form-data" >
                <button type="submit" name="ok">Ajouter cette image</button>
                <button type="button" name="cancel">Annuler</button>
            </form>
            <div class="message"></div>

        </section>

    </body>
</html>