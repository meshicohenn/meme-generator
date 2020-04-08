'use strict'
const SIZE = 18;

var gKeywords = {
    'happy': 12,
    'funny puk': 1
}

var gImgs = Array(SIZE).fill({});
//  [{
//     id: 1,
//     url: 'img/popo.jpg',
//     keywords: ['happy']
// }];

var gMeme =
{
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines:
        [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' }]
}

function getImgs() {
    return gImgs;
}

function createGallery() {
    var imgs = getImgs();
    console.log(imgs);
    imgs = imgs.map((img, idx) => {
        return img = createImg(idx, '/img/' + ++idx + '.jpg', 'popo');
    });
    console.log(imgs);
    gImgs = imgs;

}

function createImg(id, url, keywords) {
    return {
        id: id,
        url: url,
        keywords: keywords
    }
}