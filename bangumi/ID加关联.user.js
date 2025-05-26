// ==UserScript==
// @name         ID加关联
// @version      2.0
// @description  直接通过条目/角色/人物ID添加关联
// @author       scientificworld
// @match        https://bgm.tv/subject/*/add_related/*
// @match        https://bgm.tv/character/*/add_related/*
// @match        https://bgm.tv/person/*/add_related/*
// ==/UserScript==

window.ukagakaSpeech = function(text) {
    document.getElementById('robot_balloon').innerHTML = text;
    chiiLib.ukagaka.presentSpeech('', true);
};

window.fetchWithToken = async function(url) {
    if (localStorage.hasOwnProperty('bgmapi_token'))
        return fetch(url, {
            'headers': { 'Authorization': `Bearer ${localStorage.getItem('bgmapi_token')}` }
        })
        .then(response => {
            if (!response.ok) {
                alert('Access Token 可能已过期或设置错误，请重新生成。');
                localStorage.removeItem('bgmapi_token');
            }
            return response;
        });
    else return fetch(url);
}

window.convertResponse = async function(response, type, path = '', self = 0, current = -1) {
    var result = {
        id: response.id.toString(),
        name: response.name,
        name_cn: type >= 0 ? response.name_cn : '',
        img: (response.images.large == '' ? 'https://bgm.tv/img/info_only_m.png' : response.images.large)
            .replace('cover/l', 'cover/g').replace('crt/l', 'crt/s')
    };
    if (type < 0) {
        result.relatSubjects = [];
        if (self > 0) {
            await fetch(`https://api.bgm.tv/v0/${path}/${self}/subjects`)
                .then(response => response.json())
                .then(async response => {
                    await Promise.all(response.map(async item => {
                        var relation = await fetchWithToken(`https://api.bgm.tv/v0/subjects/${item.id}`)
                            .then(response => response.json());
                        if (relation.type == current)
                            result['relatSubjects'].push(await convertResponse(relation, 0));
                    }));
                });
        }
    } else result.type_id = response.type.toString();
    return result;
};

window.appendRelateSubject = function(id) {
    const mapping = {'anime': 2, 'book': 1, 'music': 3, 'game': 4, 'real': 6};
    var mode = document.getElementById('sbjSearchMod').value, type = 0, path = 'subjects', self = 0, current = -1;
    if (mode.includes('character')) {
        type = -1;
        path = 'characters';
    } else if (mode.includes('person')) {
        type = -2;
        path = 'persons';
    }
    fetchWithToken(`https://api.bgm.tv/v0/${path}/${id}`)
        .then(response => {
            if (!response.ok) {
                ukagakaSpeech('啊哦 你所指定的条目看起来不存在…');
                throw '';
            }
            return response;
        })
        .then(response => response.json())
        .then(async response => {
            if (mode.includes('-')) {
                path = 'characters';
                self = (type == -2) ? window.location.pathname.split('/')[2] : id;
                current = mapping[mode.split('-')[1]];
            }
            response = await convertResponse(response, type, path, self, current);
            if (type < 0) {
                subjectList[id] = response;
                addRelateSubject(response.id, 'searchResult');
            } else {
                if (mapping[mode] != response.type_id) {
                    ukagakaSpeech('你似乎选错了条目类型…请选择正确的类型后重试。');
                    return;
                }
                subjectList = [response];
                addRelateSubject('0', 'submitForm');
            }
        });
};

(function() {
    document.getElementById('subjectName').setAttribute('placeholder', '输入关键词');
    document.getElementById('findSubject').insertAdjacentHTML(
        'afterend',
        `<br><br>
        <input type="text" id="subjectId" value="" class="searchInputL" style="width:235px;" placeholder="输入ID" onkeydown="if (event.keyCode == 13) appendRelateSubject(this.value);">
        <input type="button" id="findSubjectById" class="searchBtnL" value="添加" onclick="appendRelateSubject(document.getElementById('subjectId').value);">`
    );
    document.getElementsByClassName("inputBtn")[0].insertAdjacentHTML(
        'beforebegin',
        `<a href="javascript:void(0);" id="setAccessToken" class="chiiBtn rr" onclick="localStorage.setItem('bgmapi_token', prompt('输入你的 Access Token\\n可从 https://next.bgm.tv/demo/access-token/create 获得'));">设置令牌</a>`
    );
})();
