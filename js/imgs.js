
// Module de gestion des données liées aux résultats de recherche.

/** 
 * Le module <code>imgs</code> mémorise et gère
 * les données relatives aux images répondant
 * aux critères de recherche. Il joue aussi le
 * rôle d'itérateur.
 */
var imgs = {};

/** 
 * Stockage des données (portion
 * de la table `images` en BDD).
 */
imgs.table = [];

/** Position de l'itérateur. */
imgs.idx = 0;

/** Nombre d'images correspondant à la recherche. */
imgs.total = 0;

/**
 * Charge les données fournies en paramètre dans
 * la liste <code>table</code>. À partir de ces
 * données la fonction fabrique des éléments DOM
 * stockés dans la liste au même endroit.
 * @param data Un tableau de données dont chaque
 * élément représente une image.
 */
imgs.load = function (data) {
    var i, idx, table, kw, cat, re;
    this.rewind();
    table = new Array(data.length);
    for (i = 0; i < data.length; i++) {
        idx = this.indexOf(data[i].id);
        if (idx != -1) {
            table[i] = this.table[idx];
            table[i].owned = data[i].owned;
        }
        else {
            re = /^\.|\.$/g;
            kw = data[i].keywords;
            cat = data[i].category;
            table[i] = data[i];
            table[i].dom = {};
            table[i].url = data[i].url;//.replace(/\w(\.[^.]+)$/, 'o$1');
            table[i].keywords = kw.replace(re, '').split('.').join(' + ');
            table[i].category = cat.replace(re, '').split('.').join('/');
            table[i].dom.thumb = tpl.domify('thumb', table[i]);
        }
    }
    this.table = table;
}

/**
 * Ajoute les données fournies en paramètre dans
 * la liste <code>table</code>. À partir de ces
 * données la fonction fabrique des éléments DOM
 * stockés dans la liste au même endroit.
 * @param data Un tableau de données dont chaque
 * élément représente une image.
 */
imgs.append = function (data) {
    var i, l, kw, cat, re;
    for (i = 0; i < data.length; i++) {
        l = this.size();
        re = /^\.|\.$/g;
        kw = data[i].keywords;
        cat = data[i].category;
        this.table.push(data[i]);
        this.table[l].dom = {};
        this.table[l].url = data[i].url;//.replace(/\w(\.[^.]+)$/, 'o$1');
        this.table[l].keywords = kw.replace(re, '').split('.').join(' + ');
        this.table[l].category = cat.replace(re, '').split('.').join('/');
        this.table[l].dom.thumb = tpl.domify('thumb', this.table[l]);
    }
}

/**
 * Retrouve l'indice d'un jeu de données à partir
 * de son <code>id</code> de BDD.
 * @param id L'identifiant du jeu de données recherché.
 * @return L'indice du jeu de données recherché,
 * <code>-1</code> si l'identifiant n'existe pas.
 */
imgs.indexOf = function (id) {
    var i;
    for (i = 0; i < this.size(); i++) {
        if (this.table[i].id == id) {
            return i;
        }
    }
    return -1;
}

/**
 * Donne le nombre d'images stockées.
 * @return Le nombre d'images stockées.
 */
imgs.size = function () {
    return this.table.length;
}

/**
 * Fournit les données correspondant à l'id fournit.
 * @param id L'identifiant des données souhaitées.
 * @return Les données correspondant à l'id fournit
 * ou <code>null</code>.
 */
imgs.select = function (id) {
    return this.get(this.indexOf(id));
}

/**
 * Fournit les données à l'indice <code>i</code>.
 * @param i L'indice des données souhaitées.
 * @return Les données à l'indice <code>i</code>
 * ou <code>null</code>.
 */
imgs.get = function (i) {
    return this.table[i] || null;
}

/**
 * Fournit les données à la position marquée par l'itérateur.
 * @return Les données à la position marquée par l'itérateur.
 */
imgs.curr = function () {
    return this.get(this.idx);
}

/**
 * Fournit les données à la position marquée par
 * l'itérateur puis incrémente son indice.
 * @param loop <code>true</code> pour revenir au début
 * quand l'itérateur atteint la fin de la liste.
 * @return Les données à la position marquée par l'itérateur.
 */
imgs.next = function (loop) {
    var item = this.curr();
    if (this.idx < this.size()) this.idx++;
    if (loop) this.norm();
    return item;
}

/**
 * Fournit les données à la position marquée par
 * l'itérateur puis décrémente son indice.
 * @param loop <code>true</code> pour aller à la fin
 * quand l'itérateur atteint le début de la liste.
 * @return Les données à la position marquée par l'itérateur.
 */
imgs.prev = function (loop) {
    var item = this.curr();
    if (this.idx >= 0) this.idx--;
    if (loop) this.norm();
    return item;
}

/**
 * Normalise l'indice de l'itérateur (corrige
 * l'indice quelque soit sa valeur, pour le 
 * faire entrer dans les bornes du tableau).
 */
imgs.norm = function () {
    var n = this.size();
    this.idx = (n + this.idx % n) % n;
}

/**
 * Replace l'indice au début de la liste.
 */
imgs.rewind = function () {
    this.idx = 0;
}

/**
 * Vérifie si la liste contient ou non des données.
 * @return <code>true</code> si la liste contient des
 * données, <code>false</code> sinon.
 */
imgs.isEmpty = function () {
    return this.size() === 0;
}

/**
 * Applique une nouvelle valeur à <code>idx</code>.
 * @param idx La nouvelle valeur à appliquer.
 */
imgs.setIdx = function (idx) {
    this.idx = idx;
}

/**
 * Applique une nouvelle valeur à <code>total</code>.
 * @param total La nouvelle valeur à appliquer.
 */
imgs.setTotal = function (total) {
    this.total = total;
}

/**
 * Donne le nombre d'images correspondant à la recherche.
 */
imgs.getTotal = function () {
    return this.total;
}




