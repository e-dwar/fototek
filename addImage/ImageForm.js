//-----   "Classe" Dialogue -----
function noAction(ev){
    ev.preventDefault();
}

function Dialogue(container, action){
    this.container = container;
    this.form = container.querySelector('form');
    this.form.dialogue = this;
    this.message = container.querySelector('.message');
    this.action = action;
    this.form.addEventListener("submit",noAction);
    this.activate();
 
    this.message.defaultDisplay = document.defaultView.getComputedStyle(this.message).display;
    this.container.defaultDisplay = document.defaultView.getComputedStyle(this.container).display;  
}
Dialogue.prototype.setMessage = function(s){
    this.message.innerHTML = s;
}
Dialogue.prototype.hideMessage = function(){
    this.message.style.display="none";
}
Dialogue.prototype.showMessage = function(){
    this.message.style.display = this.message.defaultDisplay;
}
Dialogue.prototype.desactivate = function(){
    this.form.removeEventListener("submit",this.action);
    this.form.ok.disabled=true;
    //this.form.addEventListener("submit",noAction);   
}
Dialogue.prototype.activate = function(){
    this.form.addEventListener("submit",this.action);
    this.form.ok.disabled=null;
}
Dialogue.prototype.hide = function(){
    this.container.style.display="none";
}
Dialogue.prototype.show = function(){
    this.container.style.display = this.container.defaultDisplay;
}

//------ variables globales  et initialisation ------

var dialURL;
var dialInfos;

function lancement(){
    dialURL = new Dialogue(document.querySelector("section#sectionURL"),
                           sendImageUrl
                          );
    dialInfos = new Dialogue(document.querySelector("section#sectionInfos"),
                           sendInfos
                          );
    dialInfos.hide();
    addFields(dialInfos.form);
    dialInfos.form.cancel.addEventListener("click",cancel);
}


window.addEventListener("load",lancement);

//------ gestionnaires d'évènements ---------------

function cancel(ev){  // declenché par le bouton cancel du formulaire du dialogue Infos
    dialInfos.form.reset();
    dialInfos.hide();
    dialURL.show();
    dialURL.activate();
    dialURL.form.seset();
}

function sendImageUrl(ev){  // declenché par l'évènement submit du formulaire du dialogue URL
    ev.preventDefault();
    var urlImage = this["url_image"].value;
    //var target = "downloadImage.php";
    var xhr = new XMLHttpRequest();
    xhr._target = "downloadImage.php?url_image="+encodeURI(urlImage);   // ajout d'une prop sur l'objet pour recupérer l'url lors de l'ev load.
    xhr.open("GET",xhr._target,true);
    xhr.addEventListener("load",receiveImage);
    xhr.addEventListener('error',errorURL);
    xhr.send();

    this.dialogue.setMessage("Attente...");
    this.dialogue.showMessage();
    this.dialogue.desactivate();
   
    return false;    
}
function sendInfos(ev){  // declenché par l'évènement submit du formulaire du dialogue Infos
    ev.preventDefault();
    var args="";
    for (var i=0; i< this.length; i++){
        args+= this[i].name + '=' + encodeURI(this[i].value) +'&';
    }
    var xhr = new XMLHttpRequest();
    xhr._target = 'recordImage.php';
    xhr.open('post',xhr._target,true);
    xhr.addEventListener('load',acquitImage);
    xhr.addEventListener('error',errorInfos);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    xhr.send(args);
    
    this.dialogue.setMessage("Attente...");
    this.dialogue.showMessage();
    this.dialogue.desactivate();
    
}
function errorURL(ev){
          dialURL.setMessage('Accès impossible à ' + this._target);  
}
function errorInfos(ev){
          dialInfos.setMessage('Accès impossible à ' + this._target);  
}

function receiveImage(ev){  // declenché par la reception (via XHR) des infos de base d'image et de la vignette
    var imageInfos;
    try {
        imageInfos = JSON.parse(this.responseText);
    } catch(e) {
        dialURL.setMessage('Erreur service ' + this._target + ':</br><pre>'+this.responseText+'</pre>');
        return;
    }
    if (imageInfos.error) {
        dialURL.setMessage(imageInfos.error_message);
    }
    else {
        dialURL.setMessage('');
        dialURL.hide();
        dialInfos.hideMessage();
        fillForm(dialInfos.form,imageInfos);
        dialInfos.show();
        dialInfos.activate();
     }
}

function acquitImage(ev){  // declenché par la réception (via XHR) de la confirmation d'enregistrement
    var result;
    try {
        result = JSON.parse(this.responseText); 
    } catch(e) {
        dialInfos.setMessage('Erreur service ' + this._target + ':</br><pre>'+this.responseText+'</pre>');
        return;
    }
    if (result.error) {
        dialInfos.setMessage(result.error_message);
    } else {
        dialInfos.setMessage("image enregistrée");
        dialInfos.desactivate();
    }
    
}

//-----  fonctions utilitaires pour fabriquer puis pré-remplir le formulaire ---------

function makeItemInput(type,name,labelText,value,disabled){
    var item = document.createElement('li');
    var label = document.createElement('label');
    label.setAttribute('for',name);
    label.innerHTML = '<span>'+labelText+'</span>';
    var input = document.createElement('input');
    input.setAttribute('type',type);
    input.setAttribute('name',name);
    input.setAttribute('id',name);
    if (value!=null) {
        input.value = value;
    }
    if (disabled) {
        //input.disabled="disabled";
        input.readOnly="readonly";
    }
    input.setAttribute('required','required');
    item.appendChild(label);
    item.appendChild(input);
    return item;
}

function addFields(form){
    var ul = document.createElement('ul');
    var item = document.createElement('li');
    item.classList.add('image');
    ul.appendChild(item);
    ul.appendChild(makeItemInput('url','url','URL', null, true ));
    ul.appendChild(makeItemInput('url','url_flickr','URL Flickr', null, false ));
    ul.appendChild(makeItemInput('text','size','Taille', null, true ));
    ul.appendChild(makeItemInput('text','mime_type','type MIME', null, true ));
    ul.appendChild(makeItemInput('text','tmp_thumbnail','fichier temporaire', null, true ));
    ul.appendChild(makeItemInput('text','author','Auteur', null, false ));
    ul.appendChild(makeItemInput('url','url_author','URL auteur', null, false ));
    ul.lastChild.lastChild.removeAttribute('required');
    ul.appendChild(makeItemInput('text','licence','Licence (CC)', null, false ));
    ul.lastChild.lastChild.setAttribute('placeholder','BY ?? ??');
    ul.appendChild(makeItemInput('text','title','Titre', null, false ));
    ul.appendChild(makeItemInput('text','categories','Catégories', null, false ));
    ul.lastChild.lastChild.setAttribute('placeholder','cat1, cat2, cat3 ...');
    ul.appendChild(makeItemInput('text','keywords','Mots Clefs', null, false ));
    ul.lastChild.lastChild.setAttribute('placeholder','mot1, mot2, mot3 ...');
    form.insertBefore(ul,form.firstChild);
}

function fillForm(form,image){
    var item = form.querySelector('li.image');
    while (item.firstChild)
        item.removeChild(item.firstChild);
    var img = new Image();
    img.src = image.thumbUrlData;
    item.appendChild(img);
    form.url.value = image.url;
    form.size.value = image.width+"x"+image.height;
    form.mime_type.value = image.mimeType;
    form.tmp_thumbnail.value = image.fileName;
}














