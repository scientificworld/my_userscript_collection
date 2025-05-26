// ==UserScript==
// @name            RemoveOpenInUserContextMenu
// @description     删除链接右键菜单中在身份标签页打开的选项
// @author          scientificworld
// @charset         utf-8
// @compatibility   Firefox 100
// @version         2025-05-07
// ==/UserScript==

(function () {
	"use strict";
	document.querySelector("#context-openlinkinusercontext-menu").remove();
})();
