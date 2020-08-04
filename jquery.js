const { contains } = require("jquery");

window.$ = window.jQuery = (selectorOrArrayOrTemplateOrDom) => {
    let elements;
    // 不同参数适配
    if (typeof selectorOrArrayOrTemplateOrDom === 'string' && selectorOrArrayOrTemplateOrDom.trim()[0] === "<") {
        const template = document.createElement('template');
        template.innerHTML = selectorOrArrayOrTemplateOrDom.trim();
        elements = [template.content.firstChild]
    } else if (typeof selectorOrArrayOrTemplateOrDom === 'string') {
        elements = document.querySelectorAll(selectorOrArrayOrTemplateOrDom);
    } else if (selectorOrArrayOrTemplateOrDom instanceof Array) {
        elements = selectorOrArrayOrTemplateOrDom;
    } else if (selectorOrArrayOrTemplateOrDom.nodeType === 1) {
        elements = [selectorOrArrayOrTemplateOrDom]
    } else if (selectorOrArrayOrTemplateOrDom.jquery === true) {
        elements = selectorOrArrayOrTemplateOrDom.elements;
    }
    // 创建原型
    const api = Object.create(jQuery.prototype);
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayOrTemplateOrDom.oldApi
    })
    return api;
}
jQuery.fn = jQuery.prototype = {
    constractor: jQuery,
    jquery: true,
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className);
        }
        return this
    },
    index() {
        let index;
        let childList = $(this.elements[0]).parent().children();
        $(childList).each((el, i) => {
            if (el === this.elements[0]) {
                index = i
            }
        })
        return index;
    },
    get(index) {
        return this.elements[index];
    },
    find(selector) {
        let elementList = [];
        for (let i = 0; i < this.elements.length; i++) {
            elementList.push(...this.elements[i].querySelectorAll(selector))
        }
        this._save(elementList);
        return jQuery(elementList);
    },
    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i);
        }
    },
    parent() {
        let parentList = new Array();
        this.each(function(item, i) {
            if (parentList.indexOf(item.parentNode) === -1) {
                parentList.push(item.parentNode);
            }
        })
        this._save(parentList);
        return jQuery(parentList);
    },
    siblings() {
        siblingList
        let siblingList = [],
            own = this.elements;
        this.each(el => {
            if (siblingList.indexOf(...$(el).parent().children().elements) === -1) {
                siblingList.push(...$(el).parent().children().elements);
            }
        })
        return siblingList.filter(el => {
            for (let item of own) {
                if (el === item) {
                    return;
                }
            }
            return el;
        })
    },
    print() {
        console.log(this.elements);
    },
    children() {
        let childrenList = new Array();
        this.each(function(item, i) {
            childrenList.push(...item.children);
        })
        this._save(childrenList);
        return jQuery(childrenList);
    },
    next() {
        let nextList = new Array();
        for (let i = 0; i < this.elements.length; i++) {
            let nodeNext = this.elements[i].nextSibling;
            while (nodeNext && nodeNext.nodeType === 3) {
                nodeNext = nodeNext.nextSibling;
            }
            nextList.push(nodeNext)
        }
        return jQuery(nextList);
    },
    previous() {
        let nextList = new Array();
        for (let i = 0; i < this.elements.length; i++) {
            let nodeNext = this.elements[i].previousSibling;
            while (nodeNext && nodeNext.nodeType === 3) {
                nodeNext = nodeNext.previousSibling;
            }
            nextList.push(nodeNext)
        }
        return jQuery(nextList);
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el));
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el))
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children);
        } else if (children instanceof HTMLCollection) {
            for (let item of children) {
                this.get(0).appendChild(item);
            }
        } else if (children.jquery === true) {
            console.log(this.get(0))
            children.each(node => this.get(0).appendChild(node));
        }
    },
    remove() {
        this.each(el => {
            el.parentNode.removeChild(el);
        })
        return this;
    },
    empty() {
        let childList = [];
        this.each(el => {
            for (let i = 0; i < el.children.length; i) {
                $([el.children[i]]).remove();
            }
        })
        return $(childList);
    },
    text(text) {
        if (text !== undefined) {
            this.each(el => {
                el.innerText = text;
            })
        } else {
            return this.elements[0].innerText
        }
    },
    html(html) {
        if (html !== undefined) {
            this.each(el => {
                el.innerHTML = html;
            })
        } else {
            if (elements[0]) {
                return this.elements[0].innerHTML
            }
        }
    },
    attr(name, value) {
        if (arguments.length === 1) {
            return this.elements[0].getAttribute(name);
        } else if (arguments.length === 2) {
            this.each(el => {
                el.setAttribute(name, value);
            })
        }
    },
    css(name, value) {
        if (arguments.length === 1) {
            if (typeof name === "string") {
                return this.elements[0].style[name];
            } else if (name instanceof Object) {
                const obj = name
                this.each(el => {
                    for (let key in obj) {
                        el.style[key] = obj[key];
                    }
                })
            }
        } else if (arguments.length === 2) {
            this.each(el => {
                el.style[name] = value;
            })
        }
    },
    on(event, selector, fn) {
        this.each(el => {
            el.addEventListener(event, function(e) {
                element = e.target;
                while (!(element.matches(selector))) {
                    if (el === element) {
                        element = null;
                        break;
                    }
                    element = element.parentNode;
                }
                element && fn(e)
            })
        })
    },
    off(event, fn) {
        this.each(el => {
            el.removeEventListener(event, fn);
        })
    },
    // 回到上一个jquery元素
    end() {
        return this.oldApi
    },
    _save(element) {
        element.oldApi = this
    },
}