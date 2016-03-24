
// Fonctions Javascript spécifiques au diaporama.

/*
 * Affiche le diaporama.
 */
function showSlideshow (id) {
	var slideshow, hideBtn, next, prev, img;
    if (!imgs.isEmpty()) {
    	slideshow = document.getElementById('slideshow');
        if (!slideshow) {
            slideshow = tpl.domify('slideshow');
            document.body.appendChild(slideshow);
            hideBtn = slideshow.querySelector('.popup-hide');
            next = document.getElementById('slideshow-next');
            prev = document.getElementById('slideshow-prev');
            hideBtn.addEventListener('click', onSlideshowHide);
            next.addEventListener('click', nextSlide);
            prev.addEventListener('click', nextSlide);
            img = slideshow.querySelector('#slideshow-slide img');
            img.addEventListener('load', function () {
                this.parentNode.className = '';
            });
        }
        if (id) {
            imgs.setIdx(imgs.indexOf(id));
        }
        else {
            imgs.rewind();
        }
        slideshow.style.display = 'block';
        refreshSlide(imgs.curr());
    }
}

/**
 * Masque le diaporama et remet l'itérateur à zéro.
 */
function onSlideshowHide (ev) {
    var popup = document.getElementById('slideshow');
    popup.style.display = 'none';
    imgs.rewind();
}

/**
 * Passe à l'image suivante ou précédente.
 * @param ev L'instance de l'événement déclenché.
 */
function nextSlide (ev) {
    if (ev.target.id === 'slideshow-next') {
        imgs.next(true);
    } 
    else {
        imgs.prev(true);
    }
    refreshSlide(imgs.curr());
}

/**
 * Rafraîchit l'affichage avec les données de l'image souhaitée.
 * @param data Les données correspondant à l'image à afficher.
 */
function refreshSlide (data) {
    var unknown = '<span style="color:red">non renseignées</span>';
    var popup = document.getElementById('slideshow');
    var slide = document.getElementById('slideshow-slide');
    var img = slide.querySelector('img');
    var licence = popup.querySelector('#slideshow-licence img');
    slide.className = 'loading';
    img.setAttribute('src', data.url);
    img.setAttribute('alt', data.title);
    licence.setAttribute('src', 'img/CC ' + data.licence + '.png');
    licence.setAttribute('alt', 'CC ' + data.licence);
    popup.querySelector('#slideshow-title').textContent = data.title;
    popup.querySelector('#slideshow-author').innerHTML = data.author || unknown;
    popup.querySelector('#slideshow-size').innerHTML = data.size || unknown;
    popup.querySelector('#slideshow-mime').innerHTML = data.mime_type || unknown;
    popup.querySelector('#slideshow-category').innerHTML = data.category || unknown;
    popup.querySelector('#slideshow-keywords').innerHTML = data.keywords || unknown;
}




