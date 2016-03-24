<div class="popup" id="login">
    <div>
        <div class="popup-top">
            Connexion
            <div class="buttons">
                <button type="button" class="popup-hide">X</button>
            </div>
        </div>
        <div class="popup-main">
            <p>&nbsp;</p>
            <form name="login" method="POST" action="api/auth.php">
                <div>
                    <label>Identifiant</label>
                    <input type="text" name="login" autofocus required />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input type="password" name="password" required />
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="signup" />
                        Créer le compte
                    </label>
                </div>
                <div>
                    <input type="submit" value="Valider" />
                </div>
            </form>
        </div>
    </div>
</div>
<!--
Boîte de dialogue de connexion utilisateur.
-->
