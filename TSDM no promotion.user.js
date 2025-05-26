// ==UserScript==
// @name         TSDM no promotion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.tsdm39.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(() => {
        window.openTsRecommend = nul => void(nul);
    })).observe(document.getElementById("append_parent"), { subtree: true, childList: true });;
})();