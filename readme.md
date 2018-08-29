# Embeddable Google Fonts

Embed Google fonts inside an SVG element. This allows SVGs to use Google Fonts, even when offline. Useful for when you want to embed an SVG inside a canvas or convert to PNG.

## Example
```html
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" id="svg-1">
    <defs><style type="text/css"></style></defs>
    <rect x="10" y="10" width="100" height="150" fill="#a44"/>
    <foreignObject x="10" y="10" width="100" height="150">
        <div xmlns="http://www.w3.org/1999/xhtml">
            Here is a <strong style="font-family: 'Uncial Antiqua'">Google Font</strong> that is <em>embedded</em>.
        </div>
    </foreignObject>
</svg>
```
Make sure your SVG already has a style definition at the top.

```javascript
var svgNode = document.getElementById('svg-1');
var svgStyle = svgNode.querySelector('defs > style');
embedGoogleFonts({
    fonts: ['Uncial Antiqua'],
    styleNode: svgStyle
}).then(_ => {
    console.log('Finished embedding fonts');
});
```
![Result](readme_images/example.png)