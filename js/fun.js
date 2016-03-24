
// Fonctions génériques ou liées à l'interface générale.

/**
 * Gère le clic sur le bouton d'affichage du diaporama.
 */
function onShowBtnClick () {
    showSlideshow();
}

/**
 * Intercèpte la soumission du formulaire de
 * recherche et envoie les données en Ajax.
 * @param ev L'instance de l'événement déclenché.
 */
function onSubmit (ev) {
    ev.preventDefault();
    selectImages(0, true);
}

/**
 * Gère le clic sur les boutons des favoris.
 * @param ev L'instance de l'événement déclenché.
 */
function onFavClick (ev) {
    var form = document.forms['filters'];
    var collection = form.elements['collection'];
    var submit = form.elements['submit'];
    collection.value = USER_ID;
    submit.click();
}

/**
 * Gère le clic sur les vignettes.
 * @param ev L'instance de l'événement déclenché.
 */
function onMainClick (ev) {
    var id, frame, el;
    if (el = closest(ev.target, isClickableArea)) {
        if (isA(el, 'button')) {
            selectImages(imgs.size(), false);
        }
        else {
            frame = closest(el, isFrame);
            id = +frame.id.split('-')[1];
            if (isA(el, 'a')) toggleOwned(id);
            else showSlideshow(id);
        }
    }
}
 
/**
 * Récupère en Ajax les images correspondant aux critères de recherche.
 * @param offset Le début de la page à récupérer en BDD.
 * @param reload <code>true</code> pour recharger les images.
 */
function selectImages (offset, reload) {
    var xhr = new XMLHttpRequest();
    var data = getFilters();
    data.offset = offset;
    data = serialize(data);
    xhr.open('POST', ROOT + 'api/images.php', true); 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', function () {
        var infos, data;
        data = JSON.parse(this.responseText);
        if (data.status === 'ok') {
            imgs.setTotal(data.total);
            if (reload) imgs.load(data.results);
            else imgs.append(data.results);
            info = document.getElementById('info-count');
            info.textContent = imgs.getTotal();
            refreshThumbs();
        }
        else {
            alert(getErrorMsg(ERR_SEARCH_REQUEST));
        }
    });
    xhr.addEventListener('error', function () {
        alert(getErrorMsg(ERR_SEARCH_REQUEST));
    });
    xhr.send(data || null);
}

/**
 * Collecte les données saisies dans le formulaire de recherche.
 * @return Un objet dont les paires clé/valeur correspondent à 
 * l'état courant des champs du formulaire de recherche.
 */
function getFilters () {
    var i, j, name, input, checkboxes;
    var form = document.forms['filters'];
    var data = {};
    for (i = 0; i < form.elements.length; i++) {
        input = form.elements[i];
        if ('category author collection'.indexOf(input.name) !== -1) {
            if (input.value) {
                data[input.name] = input.value;
            }
        }
        else if (input.name === 'keywords[]') {
            data['keywords'] = [];
            checkboxes = form.elements[input.name];
            for (j = 0; j < checkboxes.length; j++) {
                if (checkboxes[j].checked) {
                    data['keywords'].push(checkboxes[j].value);
                }
            }
        }
    }
    return data;
}
 
/**
 * Demande l'ajout ou la suppression de l'image pour une collection.
 * @param id L'identifiant de l'image en BDD.
 */
function toggleOwned (id) {
    var xhr = new XMLHttpRequest();
    var vars = [];
    if (id = parseInt(id, 10)) vars.push('id=' + id);
    xhr.open('GET', ROOT + 'api/manageCollection.php?' + vars.join('&'), true); 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', function () {
        var data, image;
        data = JSON.parse(this.responseText);
        if (data.status === 'ok') {
            image = imgs.select(id);
            image.owned = !image.owned;
            refreshOwned(image);
        }
        else {
            alert(getErrorMsg(ERR_COLLECTION_REQUEST));
        }
    });
    xhr.addEventListener('error', function () {
        alert(getErrorMsg(ERR_COLLECTION_REQUEST));
    });
    xhr.send(null);
}

/**
 * Rafraîchit l'affichage des vignettes
 * en fonction des données passées en paramètre.
 */
function refreshThumbs () {
    var i, main, image, a;
    main = document.getElementById('main');
    empty(main);
    while (image = imgs.next()) {
        refreshOwned(image);
        main.appendChild(image.dom.thumb);
    }
    if (imgs.size() !== imgs.getTotal()) {
        main.appendChild(tpl.domify('more'));
    }
    imgs.rewind();
}

/**
 * Rafraîchit l'affichage des "x" et "+"
 * en fonction des données passées en paramètre.
 */
function refreshOwned (image) {
    image.dom.thumb.className = (
        image.owned ? 'frame owned' : 'frame'
    );
    if (!IS_GUEST) {
        image.dom.thumb.querySelector('a').title = (
            image.owned ? 'Retirer de' : 'Ajouter à'
        ) + ' la phototèque';
    }
}

/**
 * Transforme un objet en chaîne de variables HTTP.
 * @param data L'objet à transformer.
 * @return data Une chaîne de variables HTTP.
 */
function serialize (data) {
    var i, k, queryString = [];
    for (k in data) {
        if (data[k] instanceof Array) {
            for (i = 0; i < data[k].length; i++) {
                queryString.push(k + '[]=' + data[k][i]);
            }
        }
        else {
            queryString.push(k + '=' + data[k]);
        }
    }
    return queryString.join('&');
}

/**
 * Donne le message d'erreur correspondant
 * au code fournit et destiné à l'utilisateur.
 * @param code Le code de l'erreur.
 * @return Le message d'erreur.
 */
function getErrorMsg (code) {
    var std = { 
        techpb: 'Un problème technique est survenu',
        retry: 'veuillez refaire un essai' 
    };
    switch (code) {
        case ERR_UNKNOWN_USER: return 'Les informations fournies sont incorrectes.';
        case ERR_MISSING_LOGIN: return 'Veuillez renseigner votre identifiant.';
        case ERR_MISSING_PASSWORD: return 'Veuillez renseigner votre mot de passe.';
        case ERR_SEARCH_REQUEST: return tpl.parse('{{techpb}}, impossible d\'effectuer la recherche, {{retry}}.')(std);
        case ERR_COLLECTION_REQUEST: return tpl.parse('{{techpb}}, impossible de modifier votre phototèque, {{retry}}.')(std);
        default: return tpl.parse('{{techpb}}, {{retry}}.')(std);
    }
}

/**
 * Vérifie qu'un élément fait partie des zones cliquables de la liste des vignettes.
 * @param el L'élément à vérifier.
 * @return <code>true</code> si l'élément est cliquable, <code>false</code> sinon.
 */
function isClickableArea (el) {
    return isA(el, 'a') || isA(el, 'button') || hasClass(el, 'thumb');
}

/**
 * Vérifie qu'un élément possède la classe <code>.frame</code>.
 * @param el L'élément à vérifier.
 * @return <code>true</code> si l'élément possède
 * la classe <code>.frame</code>, <code>false</code> sinon.
 */
function isFrame (el) {
    return hasClass(el, 'frame');
}

/**
 * Vérifie qu'un élément est du type fournit.
 * @param el L'élément à vérifier.
 * @param tagName Le type à comparer.
 * @return <code>true</code> si l'élément est
 * du type fournit, <code>false</code> sinon.
 */
function isA (el, tagName) {
    return !!(el && el.tagName) && (
        el.tagName.toLowerCase() === tagName.toLowerCase()
    );
}

/**
 * Vérifie qu'un élément possède la classe fournie.
 * @param el L'élément à vérifier.
 * @param cls La classe CSS.
 * @return <code>true</code> si l'élément possède
 * la classe, <code>false</code> sinon.
 */
function hasClass (el, cls) {
    return !!(el && el.className) && (
        el.className.indexOf(cls) !== -1
    );
}

/**
 * Supprime tous les fils d'un noeud du DOM.
 * @param el L'élément à vider.
 */
function empty (el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

/**
 * Recherche le plus proche parent d'un noeud du DOM
 * répondant au critère fournit.
 * @param el L'élement dont on cherche le parent.
 * @param fn La fonction de comparaison.
 * @return L'élément trouvé ou <code>undefined</code>.
 */
function closest (el, fn) {
    return el && (
        fn(el) ? el : closest(el.parentNode, fn)
    );
}





