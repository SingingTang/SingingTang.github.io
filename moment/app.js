// TODO: 用户名称需修改为自己的名称
var userName = 'singing';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和',
    avatar: './img/avatar2.png'
  },
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    }, {
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes: [],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  },
  reply: {
    hasLiked: false,
    likes: [],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for (var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}

/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var htmlText = ['<div class="reply-comment">'];
  for (var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}

/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}

/*
 *点击回复按钮弹出回复模板
 *@param {Boolean} hasLiked 是否点过赞
 *@return {String} 返回html字符串
 */
function replyPanelTpl(hasLiked) {
  var likeText = hasLiked ? '取消' : '点赞';
  var htmlText = [];
  htmlText.push('<div class="reply-panel">');
  htmlText.push('<div class="like">');
  htmlText.push('<i class="icon-like"></i>');
  htmlText.push('<span class="text-like">' + likeText + '</span>');
  htmlText.push('</div>');
  htmlText.push('<div class="comment">');
  htmlText.push('<i class="icon-comment"></i>');
  htmlText.push('<span class="text-comment">评论</span>');
  htmlText.push('</div>');
  htmlText.push('</div>');

  return htmlText.join('');
}


/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}

/**
 * 分享消息模板
 * @param {object} 分享消息的内容，包含图片和文字 
 * @return {string} 返回html字符串
 */
function shareTpl(share) {
  var htmlText = [];
  htmlText.push('<div class="item-share">');
  htmlText.push('<img class="share-img" src="' + share['pic'] + '">');
  htmlText.push('<p clss="share-tt">' + share['text'] + '</p>');
  htmlText.push('</div>');
  return htmlText.join('');
}


/**
 * 单图片消息模板
 * @param {object} 单图片消息的图片 
 * @return {string} 返回html字符串
 */
function onlyImgTpl(pics) {
  var htmlText = [];
  htmlText.push('<img class="item-only-img" src="' + pics[pics.length - 1] + '" >');
  return htmlText.join('');
}

/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(messageData, index) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="' + index + '">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch (content.type) {
    // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareTpl(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = onlyImgTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      contentHtml = '';
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push(replyPanelTpl(messageData.reply.hasLiked));
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push(commentPanelTpl());
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageHtml = [];
  for (var i = 0; i < data.length; i++) {
    messageHtml.push(messageTpl(data[i], i));
  }

  messageHtml = messageHtml.join('');

  $momentsList.html(messageHtml);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定

  // 评论输入框实时绑定
  $('.comment-text').on('input', function() {

    var $this = $(this);

    if ($this.val()) {

      // 如果内容不为空,则发送按钮背景为绿色,并且可用
      $('.comment-submit').css('background', '#44b00e');
      $('.comment-submit').attr('disabled', false);

    } else {

      // 如果内容为空,则发送按钮背景为灰色,不可用
      $('.comment-submit').css('background', '#808080cc');
      $('.comment-submit').attr('disabled', true);
    }

  });


  // 按下enter鍵自動提交評論
  $('.comment-text').on('keydown', function(event) {
    // 判斷按下的是否為enter鍵
    if (event.keyCode === 13) {
      commentSubmit($(this).siblings('.comment-submit'));
    }
  });

  // 将点击事件委托
  $page.on('click', function(event) {


    var $this = $(event.target);
    var className = $this.attr('class');


    switch (className) {

      // 弹出回复操作面板
      case 'item-reply':
        hidePanel();
        // 显示当前消息的回复操作面板
        $this.siblings('.reply-panel').css('width', '160px');

        break;

        // 点赞或取消赞
      case 'like':
      case 'icon-like':
      case 'text-like':

        changeLike($this.parents('.moments-item'));
        hidePanel();
        break;


        // 评论
      case 'comment':
      case 'icon-comment':
      case 'text-comment':
        hidePanel();
        // 展现当前消息的评论框
        $this.parents('.item-right').children('.comment-form').css('display', 'flex');
        // 让当前消息的评论框获得焦点
        $this.parents('.item-right').children('.comment-form').children('.comment-text')[0].focus();

        break;


        // 发送评论
      case 'comment-submit':

        commentSubmit($this);
        break;

      case 'comment-text':
        break;

        // 放大图片
      case 'pic-item':
      case 'item-only-img':
        hidePanel();
        // 获取页面
        var height = $page.height() + 'px';
        // 设置笼罩层的高度和显示
        $('.layer').css({
          'height': height,
          'display': 'block'
        });
        // 设置放大图片的地址
        $('.pic-enlarge').attr('src', $this.attr('src'));
        break;


        // 隐藏放大图片区域
      case 'layer':
      case 'pic-enlarge':
        hidePanel();
        $('.layer').css('display', 'none');
        break;

        // 如果点击的是其他区域,将隐藏掉所有的回复操作面板和评论框 
      default:
        hidePanel();


    }
  });

}

/**
 * 隐藏函数
 */
function hidePanel() {
  // 隐藏所有的评论框
  $('.comment-form').css('display', 'none');
  // 隐藏所有的回复操作按钮
  $('.reply-panel').css('width', '0');
}

/**
 * 評論函数
 * @param {object} 提交按鈕 
 */
function commentSubmit(target) {
  var $this = target;
  // 生成新的评论html代码
  var commentHtml = '<div class="comment-item">' +
    '<a class="reply-who" href="#">' +
    userName +
    '</a>：' +
    $this.siblings('.comment-text').val() +
    '</div>';
  // 找到当前消息的回复评论
  var $replyComment = $this.parents('.item-right').find('.reply-comment');

  // 如果没有评论列表,需要新建一个评论列表框
  if (!$replyComment.length) {

    var replyCommentHtml = '<div class="reply-comment"></div>';
    var $replyZone = $this.parents('.item-right').find('.reply-zone');

    // 新建一个评论列表框
    $replyZone.append(replyCommentHtml);
    $replyComment = $replyZone.children('.reply-comment');


  }

  // 添加新评论
  $replyComment.append(commentHtml);
  // 删除掉输入框里的文字
  $this.siblings('.comment-text').val('');
  // 隐藏评论框
  $('.comment-form').css('display', 'none');

  // 修改消息体,增加当前消息的一条评论
    var index = $this.parents('.moments-item').attr('data-index');
    data[index].reply.comments.push({
      author: userName,
      text: $this.siblings('.comment-text').val()
    });
    console.log(data[index].reply.comments);
}


/**
 * 点赞函数
 * @param {object} 点赞目标 
 */
function changeLike($target) {
  // 点赞的消息索引
  var index = $target.attr('data-index');
  // 修改data中的点赞状态
  var like = data[index].reply.hasLiked;
  // 若原来没有点赞，则点赞，
  if (!like) {
    // 修改本人的点赞状态
    data[index].reply.hasLiked = !like;
    // 修改点赞人列表
    data[index].reply.likes.push(userName);
  }
  // 如果原来点赞，则取消点赞
  else {
    // 修改本人的点赞状态 
    data[index].reply.hasLiked = !like;
    // 在点赞人列表中删除本人
    var likeIndex = data[index].reply.likes.indexOf(userName); //找到本人在点赞列表中的索引
    data[index].reply.likes.splice(likeIndex, 1); // 删除
  }


  // 删除原来的点赞列表
  $target.find('.reply-like').remove();
  // 重新渲染点赞列表 
  $target.find('.reply-zone').prepend(likesHtmlTpl(data[index].reply.likes));
  // 修改点赞面板中的文字
  var text = data[index].reply.hasLiked ? '取消' : '点赞';
  $target.find('.text-like').html(text);

}

/**
 * 评论框模板
 * @return {String} 返回html字符串
 */
function commentPanelTpl() {
  var htmlText = [];
  htmlText.push('<form class="comment-form" onsubmit="return false;">');
  htmlText.push('<input type="text" placeholder="评论" class="comment-text">');
  htmlText.push('<button type="button" class="comment-submit" disabled=true>发送</button>')
  htmlText.push('</form>');
  return htmlText.join('');
}


/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();