'use strict'

var gImgId;

function onInit() {
    createGallery();
    renderGalleryPage();
    // renderGallery();
}

function renderGalleryPage() {

    document.querySelector('.gallery').style.display = 'flex';
    renderGallery();
}

function renderGallery() {
    var imgs = getImgs();
    var strHTML = imgs.map((img) => `<img class="meme-img" src="${img.url}" onclick="onSelectImg(${img.id})">`);
    document.querySelector('.photo-gallery').innerHTML = strHTML.join('');
}

function renderCanvasPage() {
    document.querySelector('.canvas-page').style.display = 'flex';
    drawImg();
}

function renderCanvasText() {
    drawImg();
}

function onSelectImg(id) {
    setGlobalUrl(id);
    document.querySelector('.gallery').style.display = 'none';
    renderCanvasPage();
    createCanvas();
    gImgId = id;
    // debugger
    createMeme(id);
    setGlobalUrl(id);
    // drawImg();
}

function onChangeAlign(align) {
    changeAlign(align);
    renderCanvasText();
}

function onChangeFontFamely(font) {
    var elFont = document.querySelector('.font-list');
    changeFontFamely(elFont.value);
    renderCanvasText();
}

function onAddText() {
    addLine();
    renderCanvasText();
}

function onChangeText(text) {
    changeText(text);
    renderCanvasText();
}

function onChangeFontSize(diff) {
    ChangeFontSize(diff);
    renderCanvasText();
}

function onDeleteBorder() {
    deleteBorder();
    renderCanvasText();
}

function onShowColorChange(className) {
    document.querySelector('.' + className).click();
}

function onChangeBorderColor(value) {
    changeBorderColor(value);
    renderCanvasText();
}

function onChangeColor(value) {
    changeColor(value);
    renderCanvasText();
}

function onChangeLineLocation(diff){
    changeLineLocation(diff);
    renderCanvasText();
}

function onSwitchText(){
    switchLines();
    renderCanvasText();
}