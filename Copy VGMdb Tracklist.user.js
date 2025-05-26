// ==UserScript==
// @name         Copy VGMdb Tracklist
// @namespace    http://tampermonkey.net/
// @version      2024-09-15
// @description  try to take over the world!
// @author       You
// @match        https://vgmdb.net/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vgmdb.net
// @grant        none
// ==/UserScript==

window.copyTracklist = function(track, disc) {
    let tracklist = "";
    document.querySelectorAll(`span#${track} table.role`)[disc].querySelectorAll("td:nth-child(2)").forEach(function(e) {
        tracklist += e.innerText + "\n";
    });
    tracklist = tracklist.trim();
    navigator.clipboard.writeText(tracklist).then(function() {
        alert(`Copied tracklist of disc ${disc + 1} to the clipboard.`);
    });
}

document.querySelectorAll("span.tl").forEach(function(e) {
    e.querySelectorAll("span > b").forEach(function(ele, i) {
        ele.addEventListener("click", function() {
            copyTracklist(e.id, i);
        });
    });
});