﻿function convertFirstLetterToUpperCase(text) {    return text.charAt(0).toUpperCase() + text.slice(1);}/// Converts given texts all words to pascal casefunction PascalCase(text) {    var wordChar = text.split(' ');    wordChar.forEach(function (word, i) {        word = word.toLowerCase();        wordChar[i] = word.charAt(0).toUpperCase() + word.slice(1);    });    text = wordChar.join(' ');    return text;}//function CamelCase(text) {//    var wordChar = text.split(' ');//    wordChar.forEach(function (word, i) {//        word = word.toLowerCase();//        var letterChar = word.split('');//        letterChar[0] = letterChar[0].toUpperCase();//        word = letterChar.join('');//        wordChar[i] = word;//    });//    text = wordChar.join(' ');//    return text;//}function convertToShortDate(dateString) {    const shortDate = new Date(dateString).toLocaleDateString('en-US');    return shortDate;}