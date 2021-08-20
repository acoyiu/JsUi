(() => {
    function Mount(mountTarget, domCreateFunction) {

        let latestDom = domCreateFunction();
        setTimeout(() => requestAnimationFrame(() => mountTarget.appendChild(latestDom)), 10);


        Mount.updateMounted = () => {
            const updateDom = domCreateFunction();
            // console.log('updateDom', updateDom);
            // console.log('latestDom', latestDom);
            // console.log('latestDom.parentElement', latestDom.parentElement);
            Mount.compareDom(updateDom);
        };


        Mount.compareDom = newDom => {
            if (
                newDom.nodeName !== latestDom.nodeName ||
                newDom.children.length !== latestDom.children.length
            ) {
                Mount.updateEle(newDom, latestDom);
                return;
            }

            Array.from(newDom.children).forEach((child, childIndex) => {
                Mount.compareEle(child, latestDom.children[childIndex]);
            });
        };


        Mount.compareEle = (newEle, oldEle) => {
            if (newEle.children.length !== oldEle.children.length) {
                Mount.updateEle(newEle, oldEle);
                return;
            }

            if (newEle.children.length < 1) {

                const checkList = Array.from(newEle.attributes).map(el => el.nodeName);
                if (checkList.length > 0) {
                    const isSomeAttributeDifferent = checkList.some(attributeName => {
                        return newEle.getAttribute(attributeName) !== oldEle.getAttribute(attributeName)
                    });
                    if (isSomeAttributeDifferent) {
                        Mount.updateEle(newEle, oldEle);
                        console.log('c');
                        return;
                    }
                }

                // if innerHTML text not match, update dom
                if (newEle.innerHTML !== oldEle.innerHTML) {
                    Mount.updateEle(newEle, oldEle);
                    console.log('d');
                    return;
                }
            }
            else {
                Array.from(newEle.children).forEach((child, childIndex) => {
                    Mount.compareEle(child, oldEle.children[childIndex]);
                });
            }
        };


        Mount.updateEle = (eleNew, eleOld) => {
            eleOld.parentElement.replaceChild(eleNew, eleOld);
        };


        {
            // add default css ?
            const classNameToAdd = `Mounting`;
            mountTarget.classList.add(classNameToAdd);
            mountTarget.innerHTML += `
            <style>
                .${classNameToAdd}, .${classNameToAdd} * {
                    padding: 0;
                    margin: 0;
                }
    
                .${classNameToAdd} * {
                    position: 'relative';
                }
            </style>
            `;
        }
    }


    function _createEle(typeTxt) {
        return document.createElement(typeTxt);
    }


    function _addCss(element, cssTheObj) {
        for (const cssName in cssTheObj) {
            const cssValue = cssTheObj[cssName];
            element.style[cssName] = cssValue;
        }
    }

    function _addAttribute(element, attiObj) {
        for (const attributeName in attiObj) {
            const attiValue = attiObj[attributeName];
            if (attributeName === 'id') {
                element.setAttribute('id', attiValue);
            }
            else if (attributeName === 'class') {
                element.setAttribute('class', attiValue);
            }
            else {
                element.dataset[attributeName] = attiValue;
            }
        }
    }

    // function _applyCssObjToAllChildren(cssObject, childrenArray) {
    //     childrenArray.forEach(domEl => {
    //         console.log(domEl, cssObject);
    //         _addCss(domEl, cssObject);
    //         if (domEl.children.length > 0)
    //             _applyCssObjToAllChildren(
    //                 cssObject,
    //                 Array.from(
    //                     domEl.children
    //                 )
    //             );
    //     });
    // }
    function _functionFactory(domObject) {
        domObject.Css = function (cssObject) {
            // for all children inside
            if (
                arguments.length === 1 &&
                typeof arguments[0] === 'object'
            ) {
                _addCss(domObject, cssObject);
                return domObject;
            }

            // for querySelector
            else if (
                arguments.length == 2 &&
                typeof arguments[0] === 'string' &&
                typeof arguments[1] === 'object'
            ) {
                const [selector, cssObj] = arguments;
                Array.from(domObject.querySelectorAll(selector)).forEach(el => _addCss(el, cssObj));
                return domObject;
            }


            else {
                throw new Error('No function override found.');
            }
        };
        domObject.Attribute = attibuteObj => {
            _addAttribute(domObject, attibuteObj);
            return domObject;
        };
        // domObject.CssInherit = function () {
        //     // for all children inside
        //     if (
        //         arguments.length === 1 &&
        //         typeof arguments[0] === 'object'
        //     ) {
        //         _applyCssObjToAllChildren(
        //             arguments[0],
        //             Array.from(
        //                 domObject.children
        //             )
        //         );
        //     }


        //     // for specific type of children inside
        //     else if (
        //         arguments.length == 2 &&
        //         typeof arguments[0] === 'string' &&
        //         typeof arguments[1] === 'object'
        //     ) {
        //         const [selector, cssObj] = arguments;
        //         Array.from(domObject.querySelectorAll(selector)).forEach(el => _addCss(el, cssObj));
        //     }


        //     else {
        //         // throw new Error('No function override found.');
        //     }

        //     return domObject;
        // };

        return domObject;
    }


    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


    function Absolute() {
        const nav = _createEle('nav');
        nav.dataset.type = 'Absolute';
        _addCss(nav, { position: 'absolute' });
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    nav.appendChild(args);
                }
            }
        );
        return _functionFactory(nav);
    }

    function Fixed() {
        const nav = _createEle('nav');
        nav.dataset.type = 'Fixed';
        _addCss(nav, { position: 'fixed' });
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    nav.appendChild(args);
                }
            }
        );
        return _functionFactory(nav);
    }


    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


    function Column() {
        const div = _createEle('div');
        div.dataset.type = 'Column';
        _addCss(div, { display: 'flex', flexDirection: 'column', });
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    div.appendChild(args);
                }
            }
        );
        return _functionFactory(div);
    }


    function Row() {
        const div = _createEle('div');
        div.dataset.type = 'Row';
        _addCss(div, { display: 'flex', });
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    div.appendChild(args);
                }
            }
        );
        return _functionFactory(div);
    }


    function Box() {
        const diviv = _createEle('div');
        diviv.dataset.type = 'Box';
        _addCss(
            diviv,
            {
                width: '100%',
                height: '100%',
            });
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    diviv.appendChild(args);
                }
            }
        );
        return _functionFactory(diviv);
    }


    function Center() {
        const sectionTag = _createEle('section');
        sectionTag.dataset.type = 'Center';
        _addCss(
            sectionTag,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }
        );
        Array.from(arguments).forEach(
            args => {
                if (args.nodeName) {
                    sectionTag.appendChild(args);
                }
            }
        );
        return _functionFactory(sectionTag);
    }


    function Txt() {
        const pTag = _createEle('p');
        pTag.dataset.type = 'Txt';
        Array.from(arguments).forEach(
            args => {
                const checkingValue = args.value || args;
                switch (typeof checkingValue) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        pTag.innerHTML = checkingValue;
                        break;
                }
            }
        );
        return _functionFactory(pTag);
    }


    function Input(typeString, buttonText) {
        const inputTag = _createEle('input');
        inputTag.dataset.type = 'Input';
        inputTag.setAttribute('type', typeString);
        inputTag.setAttribute('value', buttonText);
        _addCss(
            inputTag,
            {
                width: '100%',
                height: '100%',
            }
        );
        return _functionFactory(inputTag);
    }


    function Img() {
        const imgTag = _createEle('img');
        imgTag.dataset.type = 'Img';
        imgTag.setAttribute('src', arguments[0].value || arguments[0]);
        return _functionFactory(imgTag);
    }


    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const proxyHandler = {
        get: function (obj, prop) { return obj[prop]; },
        set: function (obj, prop, value) {
            console.log('');
            obj[prop] = value;
            if (prop === 'value' && Mount.updateMounted) Mount.updateMounted();
            return obj[prop];
        }
    };


    function _reactive(passingIn) {
        if (Array.isArray(passingIn)) {
            passingIn = passingIn.map(value => _reactive(value));
            return new Proxy(
                {
                    value: passingIn,
                    _isReactive: true,
                },
                proxyHandler
            );
        }
        else {
            switch (typeof passingIn) {
                case 'number':
                case 'string':
                case 'boolean':
                    return new Proxy(
                        {
                            value: passingIn,
                            _isReactive: true,
                        },
                        proxyHandler
                    );
                case 'boolean':
                    Object.keys(passingIn).forEach(keyName => {
                        passingIn[keyName] = _reactive(passingIn[keyName]);
                    });
                    break;
                default:
                    throw new Error('No type inferred.');
            }
        }
    }


    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    Object.defineProperty(Array.prototype, 'forEachReturn', {
        value: function (cb) {
            this.forEach((curVal, windex) => this[windex] = cb(curVal));
            return this;
        },
    });

    window.TheJsUi = {
        Mount,
        Absolute,
        Fixed,
        Column,
        Row,
        Center,
        Box,
        Img,
        Txt,
        Input,
        _reactive,
    };


    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


    // const
    //     tarTxt = _reactive('gheuorh'),
    //     imgPath = _reactive('./pic.jpg'),
    //     soImage = _reactive([
    //         './so1.jpg',
    //         './so2.jpg',
    //         './so3.jpg',
    //     ]);

    // Mount(
    //     document.body,
    //     () =>
    //         Column(


    //         )
    //     /**
    //      * Available Function
    //      * [
    //         Column,
    //         Row,
    //         Center,
    //         Box,
    //         Img,
    //         Txt,
    //         Input,
    //         Fixed, 
    //         Absolute,

    //         _reactive,

    //         all.Css()


    //         let soImage = _reactive([
    //             './so1.jpg',
    //             './so2.jpg',
    //             './so3.jpg',
    //         ]);

    //         ...soImage.value.map(path =>
    //             Img(path)
    //         ),

    //         ...soImage.value.map(path => {
    //             return [
    //                 Img(path),
    //                 Txt(tarTxt2),
    //             ];
    //         }).flat(),
    //      */

    // );
})();