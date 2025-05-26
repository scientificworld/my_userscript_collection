// ==UserScript==
// @name         一緒に跳ねよう！
// @namespace    https://github.com/scientificworld
// @version      2.1
// @description  条目官网信息变为可点击链接
// @author       scientificworld
// @match        *://bgm.tv/subject/*
// @match        *://bgm.tv/person/*
// @match        *://bgm.tv/character/*
// @match        *://bangumi.tv/subject/*
// @match        *://bangumi.tv/person/*
// @match        *://bangumi.tv/character/*
// @match        *://chii.in/subject/*
// @match        *://chii.in/person/*
// @match        *://chii.in/character/*
// @grant        none
// ==/UserScript==

String.prototype.findIndex = function(s) {
    let r = this.indexOf(s);
    if (r === -1) return this.length;
    else return r;
};

(function() {
    Array.from(document.querySelectorAll("#infobox > li")).forEach(function(item) {
        let key = item.childNodes[0], value = item.childNodes[1];
        if (
            (/^\/subject\/.+?/.test(location.pathname) && (key.textContent.startsWith("官方网站") || key.textContent.startsWith("官网")))
            || (/^\/(person|character)\/.+?/.test(location.pathname) && key.textContent.startsWith("引用来源"))
        ) {
            let origin = value.textContent;
            let link = origin, text = origin;
            let start = Math.min(origin.findIndex("http://"), origin.findIndex("https://"));
            if (start === origin.length) start = 0, link = "http://" + origin;
            else link = origin.slice(start), text = link;
            if (link.includes(".")) origin = `${origin.slice(0, start)}<a href="${link}" class="l">${text}</a>`;
            key.insertAdjacentHTML("afterend", origin);
            value.remove();
        }
    });
})();
