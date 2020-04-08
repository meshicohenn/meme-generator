'use strict'

function onInit() {
    createGallery();
    renderGalleryPage();
    // renderGallery();
}

function renderGalleryPage(){
    var strHTML = `
    <div class="gallery container flex justify-center flex-column">
        <div class="top-line flex align-center justify-center">
            <input id="search" class="search flex-grow" type="text" placeholder="search">
            <div class="keyWords flex-grow flex justify-center align-center">
                <span>funny &nbsp; </span>
                <span>animal &nbsp; </span>
                <span>men &nbsp; </span>
                <span>woman &nbsp; </span>
                <span>baby &nbsp; </span>
            </div>
        </div>
        <div class="photo-contianer grid">
            <div class="photo-gallery grid grid-container">
                

            </div>
        </div>
    </div>`;
    document.querySelector('.main-content').innerHTML = strHTML;
    renderGallery();
}

function renderGallery() {
    var imgs = getImgs();
    var strHTML = imgs.map((img,idx) => `<img class="meme-img" src="${img.url}" onclick="onSelectImg('${img.url}')">`);
    document.querySelector('.photo-gallery').innerHTML = strHTML.join('');
}

function renderKanvasPage(){
    var strHTML = `
    <div class="canvas-page container flex justify-center align-items">
        <div class="img-container flex">
        </div>
        <div class="tools-container">
        </div>
    </div>`
    document.querySelector('.main-content').innerHTML = strHTML;

}

function onSelectImg(url){
    renderKanvasPage();
    var strHTML = `
    <div class="canvas-container flex justify-center align-items">
        <canvas id="my-canvas" height="300" width="300" style="background-image: url(${url});" onclick="draw(event)"></canvas>
    </div>
    `
    document.querySelector('.img-container').innerHTML = strHTML;
}
