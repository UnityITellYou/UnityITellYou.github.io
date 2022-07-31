/*!
 * Bootstrap-Dark-5 v1.1.3 (https://vinorodrigues.github.io/bootstrap-dark-5/)
 * Copyright 2021 Vino Rodrigues
 * Licensed under MIT (https://github.com/vinorodrigues/bootstrap-dark-5/blob/main/LICENSE.md)
 */

"use strict";
class DarkMode {
    constructor() {
        this._hasGDPRConsent = false;
        this.cookieExpiry = 365;
        if (document.readyState === 'loading') {
            document.addEventListener("DOMContentLoaded", function () {
                DarkMode.onDOMContentLoaded();
            });
        }
        else {
            DarkMode.onDOMContentLoaded();
        }
    }
    get inDarkMode() {
        return DarkMode.getColorScheme() == DarkMode.VALUE_DARK;
    }
    set inDarkMode(val) {
        this.setDarkMode(val, false);
    }
    get hasGDPRConsent() {
        return this._hasGDPRConsent;
    }
    set hasGDPRConsent(val) {
        this._hasGDPRConsent = val;
        if (val) {
            const prior = DarkMode.readCookie(DarkMode.DATA_KEY);
            if (prior) {
                DarkMode.saveCookie(DarkMode.DATA_KEY, "", -1);
                localStorage.setItem(DarkMode.DATA_KEY, prior);
            }
        }
        else {
            const prior = localStorage.getItem(DarkMode.DATA_KEY);
            if (prior) {
                localStorage.removeItem(DarkMode.DATA_KEY);
                DarkMode.saveCookie(DarkMode.DATA_KEY, prior);
            }
        }
    }
    get documentRoot() {
        return document.getElementsByTagName("html")[0];
    }
    static saveCookie(name, value = "", days = 365) {
        let exp = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            exp = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + exp + "; SameSite=Strict; path=/";
    }
    saveValue(name, value, days = this.cookieExpiry) {
        if (this.hasGDPRConsent) {
            DarkMode.saveCookie(name, value, days);
        }
        else {
            localStorage.setItem(name, value);
        }
        return;
    }
    static readCookie(name) {
        const n = name + "=";
        const parts = document.cookie.split(";");
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (part.startsWith(n)) {
                return part.substring(n.length);
            }
        }
        return "";
    }
    readValue(name) {
        if (this.hasGDPRConsent) {
            return DarkMode.readCookie(name);
        }
        else {
            const ret = localStorage.getItem(name);
            return ret ? ret : "";
        }
    }
    eraseValue(name) {
        if (this.hasGDPRConsent) {
            this.saveValue(name, "", -1);
        }
        else {
            localStorage.removeItem(name);
        }
    }
    getSavedColorScheme() {
        const val = this.readValue(DarkMode.DATA_KEY);
        return val ? val : "";
    }
    getPreferedColorScheme() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return DarkMode.VALUE_DARK;
        }
        else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
            return DarkMode.VALUE_LIGHT;
        }
        else {
            return "";
        }
    }
    setDarkMode(darkMode, doSave = true) {
        const nodeList = document.querySelectorAll("[data-" + DarkMode.DATA_SELECTOR + "]");
        if (nodeList.length == 0) {
            if (!darkMode) {
                this.documentRoot.classList.remove(DarkMode.CLASS_NAME_DARK);
                this.documentRoot.classList.add(DarkMode.CLASS_NAME_LIGHT);
            }
            else {
                this.documentRoot.classList.remove(DarkMode.CLASS_NAME_LIGHT);
                this.documentRoot.classList.add(DarkMode.CLASS_NAME_DARK);
            }
        }
        else {
            for (let i = 0; i < nodeList.length; i++) {
                nodeList[i].setAttribute("data-" + DarkMode.DATA_SELECTOR, darkMode ? DarkMode.VALUE_DARK : DarkMode.VALUE_LIGHT);
            }
        }
        if (doSave)
            this.saveValue(DarkMode.DATA_KEY, darkMode ? DarkMode.VALUE_DARK : DarkMode.VALUE_LIGHT);
    }
    toggleDarkMode(doSave = true) {
        let dm;
        const node = document.querySelector("[data-" + DarkMode.DATA_SELECTOR + "]");
        if (!node) {
            dm = this.documentRoot.classList.contains(DarkMode.CLASS_NAME_DARK);
        }
        else {
            dm = node.getAttribute("data-" + DarkMode.DATA_SELECTOR) == DarkMode.VALUE_DARK;
        }
        this.setDarkMode(!dm, doSave);
    }
    resetDarkMode() {
        this.eraseValue(DarkMode.DATA_KEY);
        const dm = this.getPreferedColorScheme();
        if (dm) {
            this.setDarkMode(dm == DarkMode.VALUE_DARK, false);
        }
        else {
            const nodeList = document.querySelectorAll("[data-" + DarkMode.DATA_SELECTOR + "]");
            if (nodeList.length == 0) {
                this.documentRoot.classList.remove(DarkMode.CLASS_NAME_LIGHT);
                this.documentRoot.classList.remove(DarkMode.CLASS_NAME_DARK);
            }
            else {
                for (let i = 0; i < nodeList.length; i++) {
                    nodeList[i].setAttribute("data-" + DarkMode.DATA_SELECTOR, "");
                }
            }
        }
    }
    static getColorScheme() {
        const node = document.querySelector("[data-" + DarkMode.DATA_SELECTOR + "]");
        if (!node) {
            if (darkmode.documentRoot.classList.contains(DarkMode.CLASS_NAME_DARK)) {
                return DarkMode.VALUE_DARK;
            }
            else if (darkmode.documentRoot.classList.contains(DarkMode.CLASS_NAME_LIGHT)) {
                return DarkMode.VALUE_LIGHT;
            }
            else {
                return "";
            }
        }
        else {
            const data = node.getAttribute("data-" + DarkMode.DATA_SELECTOR);
            return ((data == DarkMode.VALUE_DARK) || (data == DarkMode.VALUE_LIGHT)) ? data : "";
        }
    }
    static updatePreferedColorSchemeEvent() {
        let dm = darkmode.getSavedColorScheme();
        if (!dm) {
            dm = darkmode.getPreferedColorScheme();
            if (dm)
                darkmode.setDarkMode(dm == DarkMode.VALUE_DARK, false);
        }
    }
    static onDOMContentLoaded() {
        let pref = darkmode.readValue(DarkMode.DATA_KEY);
        if (!pref) {
            pref = DarkMode.getColorScheme();
            if (!pref) {
                pref = darkmode.getPreferedColorScheme();
            }
        }
        const dm = (pref == DarkMode.VALUE_DARK);
        darkmode.setDarkMode(dm, false);
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
                DarkMode.updatePreferedColorSchemeEvent();
            });
        }
    }
}
DarkMode.DATA_KEY = "bs.prefers-color-scheme";
DarkMode.DATA_SELECTOR = "bs-color-scheme";
DarkMode.VALUE_LIGHT = "light";
DarkMode.VALUE_DARK = "dark";
DarkMode.CLASS_NAME_LIGHT = "light";
DarkMode.CLASS_NAME_DARK = "dark";
const darkmode = new DarkMode();
//# sourceMappingURL=darkmode.js.map