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
            if (attributeName === 'class') {
                element.setAttribute('class', attiValue);
            } else {
                element.dataset[attributeName] = attiValue;
            }
        }
    }

    function _functionFactory(domObject) {
        domObject.Css = cssObject => {
            _addCss(domObject, cssObject);
            return domObject;
        };
        domObject.Attribute = attibuteObj => {
            _addAttribute(domObject, attibuteObj);
            return domObject;
        };
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
            });
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
                switch (typeof args.value) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        pTag.innerHTML = args.value;
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
            obj[prop] = value;
            if (prop === 'value' && Mount.updateMounted) Mount.updateMounted();
            return obj[prop];
        }
    };


    function _reactive(passingIn) {
        return new Proxy(
            {
                value: passingIn,
                _isReactive: true,
            },
            proxyHandler
        );
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