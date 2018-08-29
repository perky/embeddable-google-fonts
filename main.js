const fetch = require("node-fetch");

const kCSSFontFacePattern = /(@font\-face {[\s\S]*?})/g;
const kCSSUrlPattern = /url\((https.+?)\)/;

function embedGoogleFonts({fonts, styleNode}) {
    let fontQuery = fonts.join('|').replace(/ /g, '+');
    let googleFontUrl = 'https://fonts.googleapis.com/css?family=' + fontQuery;
    return fetch(googleFontUrl).then(cssResponse => {
        return cssResponse.text();
    }).then(cssText => {
        let fontFaces = kCSSFontFacePattern.exec(cssText);
        let embedFontPromises = [];
        while (fontFaces != null) {
            embedFontPromises.push(embedFont(fontFaces[1]));
            fontFaces = kCSSFontFacePattern.exec(cssText);
        }
        return Promise.all(embedFontPromises);
    }).then(results => {
        styleNode.innerHTML += results.join('\n');
        return true;
    });
}

function fontToDataURLViaBlob(fontUrl) {
    return fetch(fontUrl).then(fontResponse => {
        return fontResponse.blob();
    }).then(fontBlob => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(fontBlob);
        });
    });
}

function fontToDataURLViaBuffer(fontUrl) {
    return fetch(fontUrl).then(fontResponse => {
        return Promise.all([
            Promise.resolve(fontResponse.headers.get('content-type')),
            fontResponse.buffer()]);
    }).then(fontBuffer => {
        let b64 = fontBuffer[1].toString('base64');
        return 'data:' + fontBuffer[0] + ';base64,' + b64;
    });
}

function embedFont(fontFace) {
    let fontUrlMatch = kCSSUrlPattern.exec(fontFace);
    let promise;
    if (typeof FileReader !== 'undefined') {
        promise = fontToDataURLViaBlob(fontUrlMatch[1]);
    } else {
        promise = fontToDataURLViaBuffer(fontUrlMatch[1]);
    }
    return promise.then(dataURL => {
        return fontFace.replace(fontUrlMatch[1], dataURL);
    });
}

export {embedGoogleFonts};