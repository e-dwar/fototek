
// Fonctions Javascript spécifiques à la connexion utilisateur.

/**
 * Gère le clic sur les boutons de connextion/déconnexion.
 * @param ev L'instance de l'événement déclenché.
 */
function onLoginBtnClick (ev) {
    var popup, form, hideBtn;
    if (IS_GUEST) {
        popup = document.getElementById('login');
        if (popup) {
            popup.style.display = 'block';
            popup.querySelector('input').focus();
        }
        else {
            popup = tpl.domify('login');
            hideBtn = popup.querySelector('.popup-hide');
            hideBtn.addEventListener('click', hideLoginForm);
            document.body.appendChild(popup);
            form = document.forms['login'];
            form.addEventListener('submit', onLoginSubmit);
        }
    }
    else {
        window.location = ROOT + '?logout';
    }
}

/**
 * Masque le formulaire de connexion.
 */
function hideLoginForm () {
    var popup = document.getElementById('login');
    var p = popup.querySelector('p');
    p.style.visibility = 'hidden';
    popup.style.display = 'none';
}

/**
 * Intercèpte la soumission du formulaire de
 * login et envoie les données en Ajax.
 * @param ev L'instance de l'évènement déclenché.
 */
function onLoginSubmit (ev) {
    var popup = document.getElementById('login');
    var p = popup.querySelector('p');
    var login = popup.querySelector('input');
    var xhr = new XMLHttpRequest();
    var data = getLoginInfo();
    ev.preventDefault();
    p.style.visibility = 'hidden';
    data = serialize(data);
    xhr.open('POST', ROOT + 'api/auth.php', true); 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.responseText);
        if (data.status !== 'ok') {
            p.textContent = getErrorMsg(data.code);
            p.style.visibility = 'visible';
            login.focus();
        }
        else {
            window.location = ROOT;
        }
    });
    xhr.addEventListener('error', function () {
        p.textContent = getErrorMsg(ERR_UNKNOWN_ERROR);
        p.style.visibility = 'visible';
    });
    xhr.send(data || null);
}

/**
 * Collecte les données saisies dans le formulaire de connexion.
 * @return Un objet dont les paires clé/valeur correspondent à 
 * l'état courant des champs du formulaire de connexion.
 */
function getLoginInfo () {
    var input, data = {};
    var form = document.forms['login'];
    input = form.elements['login'];
    if (input.value) data.login = input.value;
    input = form.elements['password'];
    if (input.value) data.password = input.value;
    input = form.elements['signup'];
    data.signup = !!input.checked;
    return data;
}













