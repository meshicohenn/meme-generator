'use strict'

function onInitMyMems(){
    serviceLoadFromStorage();
}

function serviceLoadFromStorage(){
    var memsFromStorage = loadFromStorage('mems');
    var strHTML = memsFromStorage.map((img) => `<img class="meme-img" onclick="onSelectImg('${img}')" src="${img}">`);
    document.querySelector('.img-container').innerHTML = strHTML.join('');
}

function onSelectImg(img){
    debugBase64(img);
}

function debugBase64(base64URL){
    var win = window.open();
    win.document.write(`<iframe src="${base64URL}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
}