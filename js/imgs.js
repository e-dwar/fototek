
// Module de gestion des donn�es li�es aux r�sultats de recherche.

/** 
 * Le module <code>imgs</code> m�morise et g�re
 * les donn�es relatives aux images r�pondant
 * aux crit�res de recherche. Il joue aussi le
 * r�le d'it�rateur.
 */
var imgs = {};

/** 
 * Stockage des donn�es (portion
 * de la table `images` en BDD).
 */
imgs.table = [];

/** Position de l'it�rateur. */
imgs.idx = 0;

/** Nombre d'images correspondant � la recherche. */
imgs.total = 0;

/**
 * Charge les donn�es fournies en param�tre dans
 * la liste <code>table</code>. � partir de ces
 * donn�es la fonction fabrique des �l�ments DOM
 * stock�s dans la liste au m�me endroit.
 * @param data Un tableau de donn�es dont chaque
 * �l�ment repr�sente une image.
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
 * Ajoute les donn�es fournies en param�tre dans
 * la liste <code>table</code>. � partir de ces
 * donn�es la fonction fabrique des �l�ments DOM
 * stock�s dans la liste au m�me endroit.
 * @param data Un tableau de donn�es dont chaque
 * �l�ment repr�sente une image.
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
 * Retrouve l'indice d'un jeu de donn�es � partir
 * de son <code>id</code> de BDD.
 * @param id L'identifiant du jeu de donn�es recherch�.
 * @return L'indice du jeu de donn�es recherch�,
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
 * Donne le nombre d'images stock�es.
 * @return Le nombre d'images stock�es.
 */
imgs.size = function () {
    return this.table.length;
}

/**
 * Fournit les donn�es correspondant � l'id fournit.
 * @param id L'identifiant des donn�es souhait�es.
 * @return Les donn�es correspondant � l'id fournit
 * ou <code>null</code>.
 */
imgs.select = function (id) {
    return this.get(this.indexOf(id));
}

/**
 * Fournit les donn�es � l'indice <code>i</code>.
 * @param i L'indice des donn�es souhait�es.
 * @return Les donn�es � l'indice <code>i</code>
 * ou <code>null</code>.
 */
imgs.get = function (i) {
    return this.table[i] || null;
}

/**
 * Fournit les donn�es � la position marqu�e par l'it�rateur.
 * @return Les donn�es � la position marqu�e par l'it�rateur.
 */
imgs.curr = function () {
    return this.get(this.idx);
}

/**
 * Fournit les donn�es � la position marqu�e par
 * l'it�rateur puis incr�mente son indice.
 * @param loop <code>true</code> pour revenir au d�but
 * quand l'it�rateur atteint la fin de la liste.
 * @return Les donn�es � la position marqu�e par l'it�rateur.
 */
imgs.next = function (loop) {
    var item = this.curr();
    if (this.idx < this.size()) this.idx++;
    if (loop) this.norm();
    return item;
}

/**
 * Fournit les donn�es � la position marqu�e par
 * l'it�rateur puis d�cr�mente son indice.
 * @param loop <code>true</code> pour aller � la fin
 * quand l'it�rateur atteint le d�but de la liste.
 * @return Les donn�es � la position marqu�e par l'it�rateur.
 */
imgs.prev = function (loop) {
    var item = this.curr();
    if (this.idx >= 0) this.idx--;
    if (loop) this.norm();
    return item;
}

/**
 * Normalise l'indice de l'it�rateur (corrige
 * l'indice quelque soit sa valeur, pour le 
 * faire entrer dans les bornes du tableau).
 */
imgs.norm = function () {
    var n = this.size();
    this.idx = (n + this.idx % n) % n;
}

/**
 * Replace l'indice au d�but de la liste.
 */
imgs.rewind = function () {
    this.idx = 0;
}

/**
 * V�rifie si la liste contient ou non des donn�es.
 * @return <code>true</code> si la liste contient des
 * donn�es, <code>false</code> sinon.
 */
imgs.isEmpty = function () {
    return this.size() === 0;
}

/**
 * Applique une nouvelle valeur � <code>idx</code>.
 * @param idx La nouvelle valeur � appliquer.
 */
imgs.setIdx = function (idx) {
    this.idx = idx;
}

/**
 * Applique une nouvelle valeur � <code>total</code>.
 * @param total La nouvelle valeur � appliquer.
 */
imgs.setTotal = function (total) {
    this.total = total;
}

/**
 * Donne le nombre d'images correspondant � la recherche.
 */
imgs.getTotal = function () {
    return this.total;
}




