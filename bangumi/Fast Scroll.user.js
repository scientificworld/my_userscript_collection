window.scrollToTop = function() {
	window.scrollTo(0, 0);
}
window.scrollToBottom = function() {
	window.scrollTo(0, document.body.scrollHeight);
}
document.querySelector('#dock > div > ul').insertAdjacentHTML(
	'beforeend',
	'<li class="last">| <a onclick="scrollToTop()">顶部</a> | <a onclick="scrollToBottom()">底部</a></li>'
);
