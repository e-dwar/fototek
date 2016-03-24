
// Déclenche les traitements nécessaires au démarrage de l'application.

window.addEventListener('load', function () {
    var top, main, form;
    var showBtn, loginBtn, favBtn;
    form = document.forms['filters'];
    main = document.getElementById('main');
    top = document.getElementById('top');
    showBtn = document.getElementById('slideshow-show');
    favBtn = document.getElementById('favorites');
    loginBtn = top.querySelector('button');
    // charge et compile les templates html
    tpl.load();
    // initialise le comportement du form
    form.addEventListener('submit', onSubmit);
    // initialise le clic sur le bouton d'affichage du diaporama
    showBtn.addEventListener('click', onShowBtnClick);
    // initialise le clic sur les vignettes
    main.addEventListener('click', onMainClick);
    // connexion/déconnexion
    loginBtn.addEventListener('click', onLoginBtnClick);
    // affiche la phototèque personnelle
    if (!IS_GUEST) favBtn.addEventListener('click', onFavClick);
    // affiche les vignettes par défaut
    form.elements['submit'].click();
});
