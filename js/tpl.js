
// Module de création et de stockage de modèles HTML réutilisables.

/** 
 * Le module <code>tpl</code> mémorise et gère
 * les modèles HTML du dossier <code>/tpl</code>.
 * Voir la fonction <code>parse</code> pour plus
 * de détails.
 */
var tpl = {};

/**
 * Elément <code>DIV</code> qui permet de transformer
 * un fragment de code HTML en élément du DOM via
 * l'attribut <code>innerHTML</code>.
 */
tpl.surrogate = document.createElement('div');

/** Stockage des modèles. */
tpl.table = {};

/**
 * Transforme un fragment de code HTML en fonction Javascript.
 * <code>parse</code> recherche les marqueurs d'emplacements de données
 * de la forme <code>{{nom_du_marqueur}}</code>, découpe le texte HTML
 * à chaque emplacement trouvé et retourne une fonction destinée à
 * placer les données dans les espaces ainsi créés. Exemple:
 * <pre>
 *     var f = tpl.parse('<b>{{pseudo}}</b>');
 *     f({ pseudo: 'Bob' });
 *     f({ pseudo: 'Bill' });
 *     // donne "<b>Bob</b>" puis "<b>Bill</b>"
 * </pre>
 * @param html Le fragment de code HTML à transformer.
 * @return une fonction qui permet d'injecter des données
 * à la place des marqueurs d'emplacements.
 */
tpl.parse = function (html) {
    var i = -1, tmp = [];
    html = html.split(/{{([^{}]+)}}/);
    while (++i < html.length) {
        if (i % 2) tmp.push('data["' + html[i] + '"]');
        else if (html[i]) tmp.push('"' + html[i].replace(/"/g, '\\"') + '"');
    }
    return new Function(
        'data', 'return [' + tmp.join() + '].join("");'
    );
}

/**
 * Transforme un code HTML en modèle et 
 * ajoute le modèle à la liste.
 * @param key Le nom du modèle.
 * @param html Le code HTML du modèle.
 */
tpl.add = function (key, html) {
    this.table[key] = this.parse(html);
}

/**
 * Injecte des données dans un modèle
 * et retourne le code HTML correspondant.
 * @param key Le nom du modèle.
 * @param data Les données à injecter dans le modèle.
 * @return Le code HTML contenant les nouvelles données.
 */
tpl.bind = function (key, data) {
    return this.table[key](data);
}

/**
 * Transforme un modèle en élément DOM.
 * @param key Le nom du modèle.
 * @param data Les données à injecter dans le modèle.
 * @return L'élément DOM contenant les nouvelles données.
 */
tpl.domify = function (key, data) {
    this.surrogate.innerHTML = tpl.bind(key, data);
    return this.surrogate.firstChild;
}

/**
 * Charge les modèles présents dans la page HTML et
 * les stocke dans la liste <code>table</code>.
 */
tpl.load = function () {
    var i;
    var head = document.lastChild.firstChild;
    var scripts = head.querySelectorAll('script[id^="tpl-"]');
    for (i = 0; i < scripts.length; i++) {
        this.add(
            scripts[i].id.substr(4), 
            scripts[i].textContent.replace(/\n+/g, ' ')
        );
    }
}
