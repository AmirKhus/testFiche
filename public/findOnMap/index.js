var Autocomplete = function () {
    console.log("hi parnisha")
    "use strict";
    const t = (t, e) => {
        for (let s in e) "addClass" === s ? t.classList.add(e[s]) : "removeClass" === s ? t.classList.remove(e[s]) : t.setAttribute(s, e[s])
    }, e = (t, e) => e.value = (t => t.firstElementChild || t)(t).textContent.trim(), s = (t, e) => {
        t.scrollTop = t.offsetTop - e.offsetHeight
    }, i = (t, e) => {
        t.setAttribute("aria-activedescendant", e || "")
    }, h = (t, e, s, i) => {
        const h = i.previousSibling, r = h ? h.offsetHeight : 0;
        if ("0" == t.getAttribute("aria-posinset") && (i.scrollTop = t.offsetTop - ((t, e) => {
            const s = document.querySelectorAll("#" + t + " > li:not(." + e + ")");
            let i = 0;
            return [].slice.call(s).map(t => i += t.offsetHeight), i
        })(e, s)), t.offsetTop - r < i.scrollTop) i.scrollTop = t.offsetTop - r; else {
            const e = t.offsetTop + t.offsetHeight - r;
            e > i.scrollTop + i.offsetHeight && (i.scrollTop = e - i.offsetHeight)
        }
    }, r = 27, o = 13, n = 38, l = 40, a = 9;
    return class {
        constructor(c, d) {
            // console.log("hi parnisha")
            let {
                delay: u = 500, clearButton: m = !0, howManyCharacters: p = 1, selectFirst: L = !1, insertToInput: v = !1, showAllValues: x = !1, cache: f = !1, disableCloseOnSelect: g = !1, classGroup: A, classPreventClosing: b, classPrefix: y, ariaLabelClear: C, onSearch: S, onResults: E = (() => {
                }), onSubmit: T = (() => {
                }), onOpened: B = (() => {
                }), onReset: k = (() => {
                }), onRender: w = (() => {
                }), onClose: I = (() => {
                }), noResults: R = (() => {
                }), onSelectedItem: F = (() => {
                })
            } = d;
            var O;
            this.init = () => {
                const {resultList: e, root: s} = this;
                this.clearbutton(), ((e, s, i, h, r) => {
                    t(s, {
                        id: i,
                        tabIndex: "0",
                        role: "listbox"
                    }), t(h, {addClass: r + "-results-wrapper"}), h.insertAdjacentElement("beforeend", s), e.parentNode.insertBefore(h, e.nextSibling)
                })(s, e, this.outputUl, this.resultWrap, this.prefix), s.addEventListener("input", this.handleInput), this.showAll && s.addEventListener("click", this.handleInput), this.onRender({
                    element: s,
                    results: e
                })
            }, this.cacheAct = (t, e) => {
                const s = this.root;
                this.cache && ("update" === t ? s.setAttribute(this.cacheData, e.value) : "remove" === t ? s.removeAttribute(this.cacheData) : s.value = s.getAttribute(this.cacheData))
            }, this.handleInput = t => {
                let {target: e, type: s} = t;
                if ("true" === this.root.getAttribute("aria-expanded") && "click" === s) return;
                const i = e.value.replace(this.regex, "\\$&");
                this.cacheAct("update", e);
                const h = this.showAll ? 0 : this.delay;
                clearTimeout(this.timeout), this.timeout = setTimeout(() => {
                    this.searchItem(i.trim())
                }, h)
            }, this.reset = () => {
                var e;
                t(this.root, {
                    "aria-owns": this.id + "-list",
                    "aria-expanded": "false",
                    "aria-autocomplete": "list",
                    "aria-activedescendant": "",
                    role: "combobox",
                    removeClass: "auto-expanded"
                }), this.resultWrap.classList.remove(this.isActive), (0 == (null == (e = this.matches) ? void 0 : e.length) && !this.toInput || this.showAll) && (this.resultList.innerHTML = ""), this.index = this.selectFirst ? 0 : -1, this.onClose()
            }, this.searchItem = t => {
                this.value = t, this.onLoading(!0), function (t, e) {
                    void 0 === t && (t = !1), t && (t.classList.remove("hidden"), t.addEventListener("click", e))
                }(this.cBtn, this.destroy), 0 == t.length && this.clearButton && this.cBtn.classList.add("hidden"), this.characters > t.length && !this.showAll ? this.onLoading() : this.onSearch({
                    currentValue: t,
                    element: this.root
                }).then(e => {
                    const s = this.root.value.length, i = e.length;
                    this.matches = Array.isArray(e) ? [...e] : JSON.parse(JSON.stringify(e)), this.onLoading(), this.error(), 0 == i && 0 == s && this.cBtn.classList.add("hidden"), 0 == i && s ? (this.root.classList.remove("auto-expanded"), this.reset(), this.noResults({
                        element: this.root,
                        currentValue: t,
                        template: this.results
                    }), this.events()) : (i > 0 || (t => t && "object" == typeof t && t.constructor === Object)(e)) && (this.index = this.selectFirst ? 0 : -1, this.results(), this.events())
                }).catch(() => {
                    this.onLoading(), this.reset()
                })
            }, this.onLoading = t => this.root.parentNode.classList[t ? "add" : "remove"](this.isLoading), this.error = () => this.root.classList.remove(this.err), this.events = () => {
                const {root: t, resultList: e} = this;
                t.addEventListener("keydown", this.handleKeys), t.addEventListener("click", this.handleShowItems), ["mousemove", "click"].map(t => {
                    e.addEventListener(t, this.handleMouse)
                }), document.addEventListener("click", this.handleDocClick)
            }, this.results = e => {
                t(this.root, {
                    "aria-expanded": "true",
                    addClass: this.prefix + "-expanded"
                }), this.resultList.innerHTML = 0 === this.matches.length ? this.onResults({
                    currentValue: this.value,
                    matches: 0,
                    template: e
                }) : this.onResults({
                    currentValue: this.value,
                    matches: this.matches,
                    classGroup: this.classGroup
                }), this.resultWrap.classList.add(this.isActive);
                const i = this.classGroup ? ":not(." + this.classGroup + ")" : "";
                this.itemsLi = document.querySelectorAll("#" + this.outputUl + " > li" + i), this.selectFirstEl(), this.onOpened({
                    type: "results",
                    element: this.root,
                    results: this.resultList
                }), (e => {
                    for (let s = 0; s < e.length; s++) t(e[s], {
                        role: "option",
                        tabindex: "-1",
                        "aria-selected": "false",
                        "aria-setsize": e.length,
                        "aria-posinset": s
                    })
                })(this.itemsLi), s(this.resultList, this.resultWrap)
            }, this.handleDocClick = t => {
                let {target: e} = t, s = null;
                (e.closest("ul") && this.disable || e.closest("." + this.prevClosing)) && (s = !0), e.id === this.id || s || this.reset()
            }, this.selectFirstEl = () => {
                const {index: e, activeList: s, selectedOption: h, selectFirst: r, root: o} = this;
                if (this.remAria(document.querySelector("." + s)), !r) return;
                const {firstElementChild: n} = this.resultList,
                    l = this.classGroup && this.matches.length > 0 && r ? n.nextElementSibling : n;
                t(l, {id: h + "-0", addClass: s, "aria-selected": "true"}), this.onSelected({
                    index: e,
                    element: o,
                    object: this.matches[e]
                }), i(o, h + "-0")
            }, this.setAttr = (t, e) => {
                for (let s in e) "addClass" === s ? t.classList.add(e[s]) : "removeClass" === s ? t.classList.remove(e[s]) : t.setAttribute(s, e[s])
            }, this.handleShowItems = () => {
                const {root: e, resultWrap: i, resultList: h, isActive: r} = this;
                h.textContent.length > 0 && !i.classList.contains(r) && (t(e, {
                    "aria-expanded": "true",
                    addClass: this.prefix + "-expanded"
                }), i.classList.add(r), s(h, i), this.selectFirstEl(), this.onOpened({
                    type: "showItems",
                    element: e,
                    results: h
                }))
            }, this.handleMouse = t => {
                t.preventDefault();
                const {target: e, type: s} = t, i = e.closest("li"), h = null == i ? void 0 : i.hasAttribute("role"),
                    r = this.activeList, o = document.querySelector("." + r);
                i && h && ("click" === s && this.getTextFromLi(i), "mousemove" !== s || i.classList.contains(r) || (this.remAria(o), this.setAria(i), this.index = this.indexLiSelected(i), this.onSelected({
                    index: this.index,
                    element: this.root,
                    object: this.matches[this.index]
                })))
            }, this.getTextFromLi = t => {
                console.log("getTextFromLi")
                const {root: s, index: i, disable: h} = this;
                t && 0 !== this.matches.length ? (e(t, s), this.onSubmit({
                    index: i,
                    element: s,
                    object: this.matches[i],
                    results: this.resultList
                }), h || (this.remAria(t), this.reset()), this.clearButton && this.cBtn.classList.remove("hidden"), this.cacheAct("remove")) : !h && this.reset()
            }, this.indexLiSelected = t => Array.prototype.indexOf.call(this.itemsLi, t), this.handleKeys = t => {
                const {root: s} = this, {keyCode: h} = t, c = this.resultWrap.classList.contains(this.isActive),
                    d = this.matches.length + 1;
                switch (this.selectedLi = document.querySelector("." + this.activeList), h) {
                    case n:
                    case l:
                        if (t.preventDefault(), d <= 1 && this.selectFirst || !c) return;
                        h === n ? (this.index < 0 && (this.index = d - 1), this.index -= 1) : (this.index += 1, this.index >= d && (this.index = 0)), this.remAria(this.selectedLi), d > 0 && this.index >= 0 && this.index < d - 1 ? (this.onSelected({
                            index: this.index,
                            element: s,
                            object: this.matches[this.index]
                        }), this.setAria(this.itemsLi[this.index]), this.toInput && c && e(this.itemsLi[this.index], s)) : (this.cacheAct(), i(s));
                        break;
                    case o:
                        this.getTextFromLi(this.selectedLi);
                        break;
                    case a:
                    case r:
                        t.stopPropagation(), this.reset()
                }
            }, this.setAria = e => {
                const s = this.selectedOption + "-" + this.indexLiSelected(e);
                t(e, {
                    id: s,
                    "aria-selected": "true",
                    addClass: this.activeList
                }), i(this.root, s), h(e, this.outputUl, this.classGroup, this.resultList)
            }, this.remAria = e => {
                console.log("hi parnisha")
                e && t(e, {id: "", removeClass: this.activeList, "aria-selected": "false"})
            }, this.clearbutton = () => {
                if (!this.clearButton) return;
                const {cBtn: e} = this;
                t(e, {
                    class: this.prefix + "-clear hidden",
                    type: "button",
                    "aria-label": this.clearBtnAriLabel
                }), this.root.insertAdjacentElement("afterend", e)
            }, this.destroy = () => {
                const {root: t} = this;
                this.clearButton && this.cBtn.classList.add("hidden"), t.value = "", t.focus(), this.resultList.textContent = "", this.reset(), this.error(), this.onReset(t), t.removeEventListener("keydown", this.handleKeys), t.removeEventListener("click", this.handleShowItems), document.removeEventListener("click", this.handleDocClick)
            }, this.id = c, this.root = document.getElementById(c), this.onSearch = (O = S, Boolean(O && "function" == typeof O.then) ? S : t => {
                let {currentValue: e, element: s} = t;
                return Promise.resolve(S({currentValue: e, element: s}))
            }), this.onResults = E, this.onRender = w, this.onSubmit = T, this.onSelected = F, this.onOpened = B, this.onReset = k, this.noResults = R, this.onClose = I, this.delay = u, this.characters = p, this.clearButton = m, this.selectFirst = L, this.toInput = v, this.showAll = x, this.classGroup = A, this.prevClosing = b, this.clearBtnAriLabel = C || "clear text from input", this.prefix = y ? y + "-auto" : "auto", this.disable = g, this.cache = f, this.outputUl = this.prefix + "-" + this.id + "-results", this.cacheData = "data-cache-auto-" + this.id, this.isLoading = this.prefix + "-is-loading", this.isActive = this.prefix + "-is-active", this.activeList = this.prefix + "-selected", this.selectedOption = this.prefix + "-selected-option", this.err = this.prefix + "-error", this.regex = /[|\\{}()[\]^$+*?.]/g, this.timeout = null, this.resultWrap = document.createElement("div"), this.resultList = document.createElement("ul"), this.cBtn = document.createElement("button"), this.init()
        }
    }
}();