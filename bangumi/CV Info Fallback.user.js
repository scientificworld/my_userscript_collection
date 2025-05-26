// ==UserScript==
// @name         CV Info Fallback
// @version      1.0
// @description  在角色没有关联CV的情况下，自动检测Infobox中的信息并显示
// @author       scientificworld
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// ==/UserScript==

(function() {
    async function getCVInfo(url) {
        return await fetch(`https://api.bgm.tv/v0/characters/${url.split("/").at(-1)}`)
            .then(resp => resp.json())
            .then(resp => {
                var info, cv;
                info = resp.infobox.find(arr => ["声优", "CV"].includes(arr.key.toUpperCase()));
                if (!info) return null;
                if (typeof info.value == "object") {
                    cv = info.value.map(item => {
                        title = document.querySelector(".nameSingle > a");
                        if (!item.k || title.href.includes(item.k) || title.innerHTML == item.k)
                            return item.v;
                    }).filter(item => item !== undefined);
                    if (cv.length == 0) return null;
                }
                else cv = info.value;
                return cv;
            });
    }
    [].forEach.call(document.querySelectorAll(".user > .userContainer"), async element => {
        if (!element.querySelector(".tip_j > a")) {
            cv = await getCVInfo(element.querySelector("a").href);
            if (cv) {
                if (typeof cv == "object") cv = cv.join("<span class=\"tip_j\"> / </span>");
                element.querySelector(".tip_j").insertAdjacentHTML(
                    "beforeend",
                    `CV: <span class="fakeLink">${cv}</span>`
                );
            }
        }
    });
    [].forEach.call(document.querySelectorAll(".light_odd > .clearit"), async element => {
        if (!element.querySelector(".actorBadge")) {
            cv = await getCVInfo(element.querySelector("a").href);
            if (cv) {
                if (typeof cv == "string") cv = new Array(cv);
                cv.forEach(item => {
                    element.insertAdjacentHTML(
                        "beforeend",
                        `<div class="actorBadge clearit">
                        <img src="//lain.bgm.tv/pic/crt/s/" class="avatar ll" width="32" height="32">
                        <p><a class="l">${item}</a></p>
                        </div>`
                    );
                });
            }
        }
    });
})();
