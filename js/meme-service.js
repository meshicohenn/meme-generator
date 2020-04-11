'use strict'
const SIZE = 18;


var gKeywords = {
    'happy': 12,
    'funny puk': 1
}

var gImgs = Array(SIZE).fill({});

var gIsDownload = false;
var gMeme = {};
var gCtx;
var gCanvas;
var gCurrentUrl;
var gMemsToStorage;

var gCurrentLineIdx = -1;

function createCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    // checkScreenSize();
    gCtx = gCanvas.getContext('2d');
    // resizeCanvas();
}

function clearMark() {
    gIsDownload = true;
    drawImg();
}

function drawImg() {
    var img = new Image();
    var url = gCurrentUrl;
    img.src = url;
    // debugger
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,width,height
        gMeme.lines.forEach((line) => {
            drawText(line);
        });
        if (!gIsDownload) strokeFrameText();
    }
}

function getImgs() {
    return gImgs;
}

function setGlobalUrl(id) {
    var img = gImgs.find((img) => img.id === id);
    gCurrentUrl = img.url;
}

function createGallery() {
    var imgs = getImgs();
    imgs = imgs.map((img, idx) => {
        return img = createImg(idx, 'img/' + ++idx + '.jpg', 'popo');
    });
    gImgs = imgs;

}

function createImg(id, url, keywords) {
    return {
        id: id,
        url: url,
        keywords: keywords
    }
}

function createMeme(imgId) {
    //T.D to check if is exist in the storage
    gMeme = {
        imgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            txt: '', size: 16, align: 'left', color: 'white',
            bordercolor: 'black', font: 'Impact', border: 2,
            offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 8
        }]
    };
}

function addLine() {

    if (gMeme.lines.length + 1 > 8) return console.log('cannoe add more lines');
    // debugger
    gMeme.selectedLineIdx++;

    gMeme.lines.push({
        txt: '', size: 16, align: 'left', color: 'white',
        bordercolor: 'black', font: 'Impact', border: 2,
        offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 8 * (gMeme.selectedLineIdx + 1)
    })
    console.log('gMeme.selectedLineIdx', gMeme.selectedLineIdx, gCanvas.height / 8 * gMeme.selectedLineIdx + 1);

}

function ChangeFontSize(diff) {
    if (!gMeme.lines || gMeme.lines.length === 0) return; //T.D add modal alert
    console.log(diff);

    var line = getDetailsLine();
    line.size += diff;
}

function changeText(text) {
    // if (!gMeme.lines || gMeme.lines.length === 0) 
    //T.D add modal alert
    var line = getDetailsLine();

    if (validateLimitsOfCanvas(text)) {
        return console.log('cannot changing text');
    }
    line.txt = text;
}

function getDetailsLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function switchLines() {
    // if (gCurrentLineIdx == -1) return console.log('there is no line to switch with');
    // debugger
    var lineIdx = gMeme.selectedLineIdx + 1;
    if (lineIdx > gMeme.lines.length - 1) {
        return gMeme.selectedLineIdx = 0;
    }
    // if()
    gMeme.selectedLineIdx++;
}

function changeAlign(align) {
    var line = getDetailsLine();
    line.align = align;
    switch (line.align) {
        case 'left':
            line.offsetX = 10;
            break;
        case 'center':
            line.offsetX = gCanvas.width / 2;;
            break;
        case 'right':
            line.offsetX = gCanvas.width - 10 - gCtx.measureText(line.txt).width;
        default:
            break;
    }
}

function changeFontFamely(font) {
    console.log(font);
    console.log(line);
    var line = getDetailsLine(font);
    line.font = font;
}

function deleteBorder() {
    var line = getDetailsLine();
    line.border = 0;
}

function changeBorderColor(value) {
    var line = getDetailsLine();
    line.bordercolor = value;
}

function changeColor(value) {
    var line = getDetailsLine();
    line.color = value;
}

function changeLineLocation(diff) {
    var line = getDetailsLine();
    line.offsetY += diff;
}

function deleteLineCanvas() {
    // debugger
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.selectedLineIdx + 1 > gMeme.lines.length - 1) {
        return gMeme.selectedLineIdx = 0;
    }
}

function drawText(line) {

    var x = line.offsetX;
    var y = line.offsetY;

    gCtx.beginPath();
    gCtx.strokeStyle = line.bordercolor;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}` + 'px ' + `${line.font}`;;
    gCtx.lineWidth = line.border;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);

    // console.log('gCtx.width', gCtx.measureText(line.txt).width);
    // console.log('gCtx.height', parseInt(gCtx.font));
    gCtx.closePath()

}

function strokeFrameText() {
    var line = getDetailsLine();
    var x = line.offsetX;
    var y = line.offsetY;
    var width = gCtx.measureText(line.txt).width + 8;
    var height = parseInt(gCtx.font) * 1.286;
    var xPos = x - 4;
    var yPos = y - (height / 1.3);
    gCtx.beginPath()
    gCtx.strokeStyle = 'black';
    gCtx.strokeRect(xPos, yPos, width, height);
    gCtx.closePath()

}

function validateLimitsOfCanvas(text) {
    var txt;
    var line = getDetailsLine();
    // if(!line) return;
    (text) ? txt = text : txt = line.txt;
    var x = line.offsetX;
    if (x + gCtx.measureText(txt).width - 5 > gCanvas.width) {
        console.log('your text is too long');
        return true;
    }
    return false;
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    console.log(imgContent)

    elLink.href = imgContent
    gIsDownload = true;
    drawImg();
}

function serviceSaveToStorage() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    // debugger
    var loadMemsFromStorage = loadFromStorage('mems');
    if (!loadMemsFromStorage) loadMemsFromStorage = [];
    loadMemsFromStorage.push(imgContent);
    saveToStorage('mems', loadMemsFromStorage);
}

function checkScreenSize() {
    var width = window.outerWidth;
    if (width < 500) {
        gCanvas.width = 300;
        gCanvas.height = 300;
    }
}
