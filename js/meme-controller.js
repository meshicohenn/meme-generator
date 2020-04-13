'use strict'

var gImgId;
var gCtx;
var gCanvas;
var gIsDownload = false;

function onInit() {
    createGallery();
    renderGalleryPage();
}

function createCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    //drag&drop --> move to mouseEvent
    var BB = gCanvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
    //drag&drop --> hammer
    dragAndDropTouchStart();
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

function drawImg(url) {
    var img = new Image();
    if (!url) {
        var url = gCurrentUrl;
    }
    img.src = url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,width,height
        gMeme.lines.forEach((line) => {
            drawText(line);
        });
        if (!gIsDownload) strokeFrameText();
    }
}

function drawText(line) {
    var x = line.offsetX;
    var y = line.offsetY;

    gCtx.beginPath();
    gCtx.strokeStyle = line.bordercolor;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}` + 'px ' + `${line.font}`;
    gCtx.lineWidth = line.border;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
    gCtx.closePath();
}

function strokeFrameText() {
    //only if is not move!! update the positions in gMark
    if (!gIsDrag) {
        var positions = getPositionRecMark();
        setRectMarkText(positions.xPos, positions.yPos, positions.width, positions.height);
    }
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(109, 82, 233, 0.20)';
    gCtx.lineWidth = 1
    gCtx.rect(gMark.x, gMark.y, gMark.width, gMark.height);
    gCtx.stroke();
    gCtx.fill();
    gCtx.closePath()
}

function getPositionRecMark(line) {
    if (!line) {
        var line = getDetailsLine();
    }
    var x = line.offsetX;
    var y = line.offsetY;

    gCtx.font = `${line.size}` + 'px ' + `${line.font}`;
    var width = gCtx.measureText(line.txt).width + 8;
    var height = parseInt(gCtx.font) * 1.286;
    var xPos = x - 4;
    var yPos = y - (height / 1.3);
    return { xPos, yPos, width, height };
}

function onSelectImg(id) {
    setGlobalUrl(id);
    document.querySelector('.gallery').style.display = 'none';
    createCanvas();
    gImgId = id;
    createMeme(id);
    setGlobalUrl(id);
    renderCanvasPage();
}

function onChangeAlign(align) {
    changeAlign(align);
    renderCanvasText();
}

function onChangeFontFamely() {
    var elFont = document.querySelector('.font-list');
    changeFontFamely(elFont.value);
    renderCanvasText();
}

function onAddText() {
    document.querySelector('.txt-input').value = '';
    addLine();
    renderCanvasText();
}

function onChangeText(text) {
    changeText(text);
    renderCanvasText();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
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

function onChangeLineLocation(diff) {
    changeLineLocation(diff);
    renderCanvasText();
}

function onSwitchText() {
    switchLines();
    renderCanvasText();
}

function onDelete() {
    deleteLineCanvas();
    renderCanvasText();
}

function onDownload(elLink) {
    var imgContent = gCanvas.toDataURL();
    elLink.href = imgContent;
    elLink.download = 'MyMeme.jpg'
    // debugger
    gIsDownload = false;
    drawImg();
}

function onSaveCanvas() {
    serviceSaveToStorage(gCanvas);
    document.querySelector('.modal').style.display = 'block';
}

function backToGallery() {
    document.querySelector('.canvas-page').style.display = 'none';
    onInit();
}

function onSearch(value) {
    filterBy(value);
    renderGallery();
}

function onMouseDown(event) {
    dragAndDropMouseDown(event);
    markCurrText(event);
}

function onMouseUp(event) {
    dragAndDropMouseUp(event);
}

function onMouseMove(event) {
    dragAndDropMouseMove(event);
}

function onCloseModal() {
    document.querySelector('.modal').style.display = 'none';
}


function renderUploadImg(img) {
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.canvas-page').style.display = 'flex';
    console.log('url', img);
    createCanvas();
    gCurrentUrl = img;
    createMeme();
    drawImg(img);
}

function onUpload(ev) {
    loadImageFromInput(ev, renderUploadImg)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function (event) {
        onImageReady(event.target.result)
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}
