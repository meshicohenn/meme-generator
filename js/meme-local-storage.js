'use strict';

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key);
    if(val !== 'undefined') return JSON.parse(val);
    return false;
}