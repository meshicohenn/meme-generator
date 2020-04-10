'use strict'
const SIZE = 18;


var gKeywords = {
    'happy': 12,
    'funny puk': 1
}

var gImgs = Array(SIZE).fill({});

var gMeme = {};
var gCtx;
var gCanvas;
var gCurrentUrl;

var gCurrentLineIdx = -1;

function createCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
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
        strokeFrameText();
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
        return img = createImg(idx, '/img/' + ++idx + '.jpg', 'popo');
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
            txt: 'first', size: 16, align: 'left', color: 'white',
            bordercolor: 'black', font: 'Impact', border: 2,
            offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 4
        }]
    };
}

function addLine() {
  
    if (gMeme.lines.length === 2) {
        return console.log('cant add more lines :(');
    }

    gMeme.lines.push({
        txt: 'first', size: 16, align: 'left', color: 'white',
        bordercolor: 'black', font: 'Impact', border: 2,
        offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 1.2
    })
    gMeme.selectedLineIdx++;
}

function ChangeFontSize(diff) {
    if (!gMeme.lines || gMeme.lines.length === 0) return; //T.D add modal alert
    console.log(diff);

    var line = getDetailsLine();
    line.size += diff;
}

function changeText(text) {
    if (!gMeme.lines || gMeme.lines.length === 0) return console.log('cannot changing text');
    //T.D add modal alert
    var line = getDetailsLine();

    line.txt = text;
    // console.log( gMeme.lines[gCurrentLineIdx].txt);
    // drawText();
}

function getDetailsLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

// function changeLineIdx() {
//     // var lineIdx = gCurrentLineIdx + diff;
//     // if (lineIdx < 0 || lineIdx > 1) {
//     //     return console.log('cannot adding line');
//     // }
//         // strokeFrameText(x, y, line);

//     gCurrentLineIdx++;
// }

function switchLines() {
    // if (gCurrentLineIdx == -1) return console.log('there is no line to switch with');
    // debugger
    var lineIdx = gMeme.selectedLineIdx + 1;
    if (lineIdx > gMeme.lines.length - 1) {
        return gMeme.selectedLineIdx = 0;
    }
    gMeme.selectedLineIdx++;
}

function changeAlign(align) {
    var line = getDetailsLine();
    line.align = align;
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

function drawText(line) {
   
    var x = line.offsetX;
    var y = line.offsetY;
    // debugger
    gCtx.strokeStyle = line.bordercolor;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}` + 'px ' + `${line.font}`;;
    gCtx.textAlign = line.align;
    gCtx.lineWidth = line.border;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
    console.log('gCtx.width', gCtx.measureText(line.txt).width);
    console.log('gCtx.height', parseInt(gCtx.font));


    // drawImg();
}

function strokeFrameText() {

    var line = getDetailsLine();
    gCtx.strokeStyle = line.bordercolor;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}` + 'px ' + `${line.font}`;;
    gCtx.textAlign = line.align;
    gCtx.lineWidth = line.border;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
    var x = line.offsetX;
    var y = line.offsetY;
    var width = gCtx.measureText(line.txt).width + 8;
    var height = parseInt(gCtx.font) * 1.286;
    var xPos = x - 4;
    var yPos = y - (height / 1.3);
    gCtx.strokeRect(xPos, yPos, width, height);

}