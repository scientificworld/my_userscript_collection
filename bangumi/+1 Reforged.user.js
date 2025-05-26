// ==UserScript==
// @name         +1 Reforged
// @namespace    https://github.com/scientificworld
// @version      0.1
// @description  *
// @author       cureDovahkiin & scientificworld
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*
// ==/UserScript==

/*
document.querySelectorAll(".dropdown > ul").forEach(function(e) {
  e.insertAdjacentHTML("afterbegin", '<li><a href="javascript:void(0);">+1</a></li>');
})
*/

(function () {
  const $mainForm = $('#ReplyForm')
    , $form_action = $mainForm.attr('action')
    , $lastview_timestamp = $mainForm.find('[name=lastview]')
    , $formhash = $mainForm.find('[name=formhash]').val();
  $('div[class=action] > .icon').each(function () {
    const paramas = this.onclick.toString().split(',')
    const [type, topic_id, post_id, sub_reply_id, sub_reply_uid, post_uid] = paramas
    if (sub_reply_id == 0) {
      const counter = $(this).parents('.row_reply').find('.sub_reply_collapse').length,
        data = {
          topic_id: topic_id,
          related: post_id,
          sub_reply_uid: sub_reply_uid,
          post_uid: post_uid,
          content: `+${counter + 1}`,
          related_photo: 0,
          lastview: $lastview_timestamp.val(),
          formhash: $formhash,
          submit: 'submit'
        }
      const plus = document.createElement('a'),
        action = document.createElement('div')
      plus.innerHTML = '+1'
      $(plus).click(function () {
        $(this).removeAttr('onclick').text('').removeClass('reply-plus-one').addClass('reply-plus-loading')
        $.ajax({
          type: 'POST',
          url: $form_action + '?ajax=1',
          data: data,
          dataType: 'json',
          success: json => {
            $('div.subreply_textarea').remove()
            $(this).remove()
            chiiLib.ajax_reply.insertJsonComments('#comment_list', json)
            $lastview_timestamp.val(json.timestamp)
          },
        })
        return false
      }).addClass('reply-plus-one')
      $(action).append(plus).addClass('action')
      $(this).parent().after(action)
    }
  })
})();
