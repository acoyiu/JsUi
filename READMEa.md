# JsUi

#### This was a JavaScript Declarative UI mini tool developed for side projects, but then found that it's interesting and good for my Javascript colleagues to get the concept of other declarative ui tool for mobile development, therefore being placed here for any reason you want to view it ^^".

## Preview:
```javascript
Mount(
    document.body,
    () =>
        Box(
            Center(
                Column(
                    Img('./assets/mag.png'),
                    Input('text')
                        .Attribute({ placeholder: 'Search Google or type a URL' })
                        .Css({ width: '50vw' })
                        .Event('change', inputUpdate),
                    Row(
                        Img('./assets/s01.png'),
                        Img('./assets/s02.png'),
                        Img('./assets/s03.png'),
                    )
                )
            )
        )
);
```
<br/>

## To view it:
##### Simply clone the repo and then start http server
<br/>

## To try it:
```html
<!-- in html -->
<script src="./jsui.js"></script>
```
```javascript
const {
    Mount,
    Fixed,
    Absolute,
    Column,
    Row,
    Center,
    Box,
    Img,
    Txt,
    Input,
    _reactive,
    _reactor, _R, // _R === _reactor
} = window.TheJsUi;
```
<br/>

## To exam it:
```javascript
Mount( mounting_dom_obj, function_that_return_ui );

// e.g.:
Mount(
    document.body,
    () => Box()
);


Fixed()          // ()=> fixed_div
Absolute()       // ()=> absolute_div

Column()         // ()=> flex_column_div
Row()            // ()=> flex_div

Box()            // ()=> width_height_100_div
Center()         // ()=> just_align_center_div

Img('path')      // ()=> image_dom_tag
Txt('text')      // ()=> p_dom_tag

Input(typeString, buttonText = '') // ()=> input_dom_tag

_reactive(value) // ()=> reactive_value_for_use_in_UI_JS

_reactor || _R   // A global obj store for all state
```
<br/>

## Conditional showing
```javascript
const foo = _reactive(true);
_R.bar = false;

Box(
    foo.value && _R.bar
    ? Img('img/path/img1.jpg')
    : Img('img/path/img2.jpg')
)
```
<br/>

## List showing
```javascript
const imgArray = _R.imgArray = [
    ['./assets/s07.jpg', 'Text A'],
    ['./assets/s07.jpg', 'Text B'],
];

const imgArray2 = _R.imgArray2 = [
    { iPath: './assets/s07.jpg', sText: 'Text A' },
    { iPath: './assets/s07.jpg', sText: 'Text B' },
];

Center(
    ...imgArray.map(
        el => ImgButtonComponent(
            el[0],
            el[1]
        )
    ),
    ...imgArray2.map(
        el => ImgButtonComponent(
            el.iPath,
            el.sText
        )
    ), 
),
```
<br/>

## Attribute, Style(CSS) & Event
```javascript
Row(
    // set attribute, class, css style and add event on input element
    Input('text')
        .Attribute({ class: 'input class', placeholder: 'Search Google or type a URL' })
        .Css({ outline: 'none' })
        .Event('change', inputUpdate)
)
    .Css({ height: '2rem' }) // make the row div height 2rem
```