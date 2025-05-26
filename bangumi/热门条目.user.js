// ==UserScript==
// @name         热门条目
// @version      1.0
// @description  在首页侧边栏中显示热门条目
// @author       scientificworld
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// ==/UserScript==

(async function() {
    'use strict';
    let parser = new DOMParser();
    let dom = parser.parseFromString(await (await fetch("https://bgm.tv", { credentials: "omit" })).text(), "text/html");
    const color = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    document.querySelector("#home_calendar").insertAdjacentHTML(
        "afterend",
        `<div id="home_hotsubject" class="sort ui-draggable">
<div class="sidePanelHome">
<h2 class="subtitle">热门条目</h2>
<ul class="calendarMini"></ul>
</div>
</div>`
    );
    let ul = document.querySelector("#home_hotsubject ul");
    let counter = 0;
    dom.querySelectorAll(".featuredItems > .clearit").forEach(item => {
        ul.insertAdjacentHTML(
            "beforeend",
            `<li class="clearit week ${color[counter % 7]}">
<h3>${item.querySelector("a.l").innerHTML}</h3>
<div class="coverList clearit"></div>
</li>`);
        let div = ul.querySelectorAll(".coverList")[counter++];
        item.querySelectorAll(".mainItem").forEach(i => {
            div.insertAdjacentHTML(
                "beforeend",
                `<a href="${i.querySelector("a").href}" title="" class="thumbTip" data-original-title="${i.querySelector(".title").innerHTML}">
<img src="${i.querySelector(".image").style.backgroundImage.replace(/"|url\(|\)/gi, "").replace("400", "100x100")}" loading="lazy" width="48" height="48"></a>`
            );
        });
    });
    $("#home_hotsubject").find("a.thumbTip").tooltip({ html: true });
})();
