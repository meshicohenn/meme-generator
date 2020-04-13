'use strict'
const SIZE = 25;

var gImgs = Array(SIZE).fill({});
var gImgsAfterFilter = [];
var gMark = {};

var gMeme = {};
var gCurrentUrl;
var gMemsToStorage;
var gIsFilterOn = false;

//drag&drop properties
var gIsDrag = false;
var startX;
var startY;
var offsetX;
var offsetY;


function filterBy(key) {
    if (!key) {
        return gIsFilterOn = false;
    }
    gIsFilterOn = true;
    gImgsAfterFilter = gImgs.filter((img) => {
        if (img.keywords.includes(key)) return img;
    });
}

function addDatakeywords() {
    gImgs[0].keywords = ['trump', 'angry', 'government', 'red'];
    gImgs[1].keywords = ['sweet', 'dog', 'brown'];
    gImgs[2].keywords = ['sweet', 'dog', 'bed', 'white'];
    gImgs[3].keywords = ['sweet', 'cat', 'keyboard', 'grey'];
    gImgs[4].keywords = ['sweet', 'angry', 'baby', 'green'];
    gImgs[5].keywords = ['trump', 'angry', 'government', 'red'];
    gImgs[6].keywords = ['sweet', 'surprise', 'baby', 'brown'];
    gImgs[7].keywords = ['clown', 'smile', 'purple'];
    gImgs[8].keywords = ['sweet', 'smile', 'baby', 'green'];
    gImgs[9].keywords = ['obama', 'smile', 'government', 'brown'];
    gImgs[10].keywords = ['sport', 'brown'];
    gImgs[11].keywords = ['hect', 'youdid', 'grey'];
    gImgs[12].keywords = ['brad', 'wine', 'youdid', 'handsome'];
    gImgs[13].keywords = ['sunglasses', 'angry', 'brown'];
    gImgs[14].keywords = ['movie', 'brown'];
    gImgs[15].keywords = ['moviw', 'red'];
    gImgs[16].keywords = ['putin', 'angry', 'government', 'red'];
    gImgs[17].keywords = ['toy-story', 'woddy', 'green', 'red'];
    gImgs[18].keywords = ['dog', 'sweet', 'red'];
    gImgs[19].keywords = ['blue'];
    gImgs[20].keywords = ['blue'];
    gImgs[21].keywords = ['red'];
    gImgs[22].keywords = ['brown'];
    gImgs[23].keywords = ['brown'];
    gImgs[24].keywords = ['trump', 'angry', 'government'];
}

function clearMark() {
    gIsDownload = true;
    drawImg();
}

function getImgs() {
    if (gIsFilterOn) {
        return gImgsAfterFilter;
    }
    return gImgs;
}

function setGlobalUrl(id) {
    var img = gImgs.find((img) => img.id === id);
    gCurrentUrl = img.url;
}

//T.D improve - to return gImgs directly
function createGallery() {
    var imgs = getImgs();
    imgs = imgs.map((img, idx) => {
        return img = createImg(idx, 'img/' + ++idx + '.jpg', 'popo');
    });
    gImgs = imgs;
    addDatakeywords();
}

function createImg(id, url, keywords) {
    return {
        id: id,
        url: url,
        keywords: keywords
    }
}

function createMeme(imgId) {
    if (!imgId) {
        gImgs.push({ id: 'imgUp', url: gCurrentUrl });
    }
    gMeme = {
        imgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            txt: 'what on your mind?', size: 16, align: 'left', color: 'white',
            bordercolor: 'black', font: 'Impact', border: 2,
            offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 8
        }]
    };
}

function addLine() {
    if (gMeme.lines.length + 1 > 8) return console.log('cannoe add more lines');//T.D modal
    gMeme.selectedLineIdx++;
    gMeme.lines.push({
        txt: 'what on your mind?', size: 16, align: 'left', color: 'white',
        bordercolor: 'black', font: 'Impact', border: 2,
        offsetX: gCanvas.width / 4, offsetY: gCanvas.height / 8 * (gMeme.selectedLineIdx + 1)
    })
}

function getDetailsLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function changeFontSize(diff) {
    var line = getDetailsLine();
    line.size += diff;
}

function changeText(text) {
    var line = getDetailsLine();
    line.txt = text;
}

function switchLines() {
    var lineIdx = gMeme.selectedLineIdx + 1;
    if (lineIdx > gMeme.lines.length - 1) {
        return gMeme.selectedLineIdx = 0;
    }
    gMeme.selectedLineIdx++;
}

function changeAlign(align) {
    var line = getDetailsLine();
    var widthTxt = gCtx.measureText(line.txt).width + 8;
    line.align = align;
    switch (line.align) {
        case 'left':
            line.offsetX = 10;
            break;
        case 'center':
            line.offsetX = gCanvas.width / 2 - (widthTxt / 2);
            break;
        case 'right':
            line.offsetX = gCanvas.width - 10 - widthTxt;
        default:
            break;
    }
}

function changeFontFamely(font) {
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
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.selectedLineIdx + 1 > gMeme.lines.length - 1) {
        return gMeme.selectedLineIdx = 0;
    }
}

function setRectMarkText(x, y, width, height) {
    gMark = {
        x: x,
        y: y,
        width: width,
        height: height,
        isDragging: false
    }
}

function serviceSaveToStorage(canvas) {
    var imgContent = canvas.toDataURL();

    var mems = loadFromStorage('mems');
    if (!mems) mems = [];

    mems.push(imgContent);
    saveToStorage('mems', mems);
}

//drag&drop
function dragAndDropMouseDown(ev) {
    // tell the browser we're handling this mouse event
    offsetX = gCanvas.offsetLeft;
    offsetY =  gCanvas.offsetTop;

    ev.preventDefault();
    ev.stopPropagation();

    // get the current mouse position
    var mouseX = parseInt(ev.clientX - offsetX);
    var mouseY = parseInt(ev.clientY - offsetY);

    // test each rect to see if mouse is inside
    // gIsDrag = false;
    if (mouseX > gMark.x && mouseX < gMark.x + gMark.width 
            && mouseY > gMark.y && mouseY < gMark.y + gMark.height) {
        // if yes, set that rects isDragging=true
        gIsDrag = true;
        gMark.isDragging = true;
    }
    // save the current mouse position
    startX = mouseX;
    startY = mouseY;
}

function dragAndDropMouseUp(ev) {
    // tell the browser we're handling this mouse event
    ev.preventDefault();
    ev.stopPropagation();

    // clear all the dragging flags
    gIsDrag = false;
    gMark.isDragging = false;
}

function dragAndDropMouseMove(ev) {
    // if we're dragging anything...
    if (gIsDrag) {

        // tell the browser we're handling this mouse event
        ev.preventDefault();
        ev.stopPropagation();

        // get the current mouse position
        var mouseX = parseInt(ev.clientX - offsetX);
        var mouseY = parseInt(ev.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var distanceX = mouseX - startX;
        var distanceY = mouseY - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove

        if (gMark.isDragging) {
            gMark.x += distanceX;
            gMark.y += distanceY;
        }
        var line = getDetailsLine();
        line.offsetX = gMark.x + 4;
        line.offsetY = gMark.y + (gMark.height / 1.3);;

        // redraw the scene with the new rect positions
        drawImg();

        // reset the starting mouse position for the next mousemove
        startX = mouseX;
        startY = mouseY;

    }
}

function markCurrText(e) {
    e.preventDefault();
    e.stopPropagation();

    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    // var line = getDetailsLine();
    gMeme.lines.forEach((line, idx) => {

        var positions = getPositionRecMark(line);
        // debugger
        if (mouseX > positions.xPos && mouseX < positions.xPos + positions.width && mouseY > positions.yPos && mouseY < positions.yPos + positions.height) {
            gMeme.selectedLineIdx = idx;
            drawImg();
        }
    })
}

//drag for 
function dragAndDropTouchStart() {
    var hammertouch = new Hammer(gCanvas);

    hammertouch.on('tap', function (e) {
        if (e.pointerType === 'mouse') return;

        var offsetX = e.srcEvent.offsetX;
        var offsetY = e.srcEvent.offsetY;

        gMeme.lines.forEach((line, idx) => {
            var positions = getPositionRecMark(line);
            console.log('positions', positions);

            if (offsetX > positions.xPos && offsetX < positions.xPos + positions.width
                && offsetY > positions.yPos && offsetY < positions.yPos + positions.height) {
                gMeme.selectedLineIdx = idx;
                drawImg();
            }
        });
    });
    hammertouch.on('pan', function (e) {
        if (e.pointerType === 'mouse') return;

        var offsetX = e.srcEvent.offsetX;
        var offsetY = e.srcEvent.offsetY;


        gMeme.lines.forEach((line, idx) => {
            var positions = getPositionRecMark(line);

            if (offsetX > positions.xPos && offsetX < positions.xPos + positions.width
                && offsetY > positions.yPos && offsetY < positions.yPos + positions.height) {
                gMeme.selectedLineIdx = idx;
                drawImg();
            }
        });
        var line = getDetailsLine();
        var posRect = getPositionRecMark(line);

        line.offsetX = offsetX - (posRect.width / 2);
        line.offsetY = offsetY;

        drawImg();
    });
}


// function validateLimitsOfCanvas(text) {
//     var txt;
//     var line = getDetailsLine();
//     // if(!line) return;
//     (text) ? txt = text : txt = line.txt;
//     var x = line.offsetX;
//     if (x + gCtx.measureText(txt).width - 5 > gCanvas.width) {
//         console.log('your text is too long');
//         return true;
//     }
//     return false;
// }