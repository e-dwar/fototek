<!--
Formulaire de recherche.
-->
<?php require_once('lib/fun.php'); ?>
<?php require_once('lib/data.php'); ?>
<form name="filters" method="POST" action="api/images.php">
    <div>
        <label>Phototèque</label>
        <select name="collection">
            <option value="">Toutes</option>
            <?php 
            foreach ($users as $user) {
                echo '<option value="' . $user['id'] . '">' . $user['login'] . '</option>';
            }
            ?>
        </select>
    </div>
    <div>
        <label>Auteur</label>
        <select name="author">
            <option value="">Tous</option>
            <?php 
            foreach ($authors as $author) {
                echo '<option value="' . $author . '">' . $author . '</option>';
            } 
            ?>
        </select>
    </div>
    <div>
        <label>Catégorie</label>
        <select name="category">
            <option value="">Toutes</option>
            <?php 
            foreach ($categoriesTree as $name => $sub) {
                echo '<option value=".' . $name . '.">' . ucfirst($name) . '</option>';
                foreach ($sub as $subname) {
                    echo '<option value=".' . $name . '.' . $subname . '.">&nbsp;&bull; ' . ucfirst($subname) . '</option>';
                }
            } 
            ?>
        </select>
    </div>
    <div id="filters-keywords">
        <fieldset class="checkboxes">
            <legend>Mots-clés</legend>
            <?php 
            $count = count($keywords);
            $mid = ceil($count / 2);
            for ($i = 0; $i < $count; $i++) {
                $j = $i % 2 ? $mid + floor($i / 2) : $i / 2;
            ?>
                <div>
                    <label>
                    <input type="checkbox" name="keywords[]" value="<?php echo $keywords[$j]; ?>" />
                    <?php echo ucfirst($keywords[$j]); ?></label>
                </div>
            <?php 
            } 
            ?>
        </fieldset>
    </div>
    <div style="text-align: center">
        <input name="submit" type="submit" value="Appliquer les critères" />
    </div>
</form>
