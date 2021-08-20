# JsUi

#### This was a JavaScript Declarative UI mini tool developed for side projects, but then found that it's interesting and good for my Js colleagues to pick up other declarative ui tool for mobile development, therefore being placed here for any reason you want to view it ^^".

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
                    Img('./assets/mic.png'),
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