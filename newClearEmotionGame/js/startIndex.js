window.onload = () => {

  var start = false;
  // alert('加载')
  // 所有需要加载的资源个数
  let resourceTotalNum = 0;
  let resourceLoadedNum = 0;
  let rate = 0;

  // 优先加载的图片资源
  var imagesFirst = ['./images/loading_progress.png', './images/loading_bg.png', './images/loading_xman.gif'];

  // 图片地址数组
  var imagesSecond = ['./images/instruction3.png', './images/instruction1.png', './images/instruction2.png', './images/btn_text_quite.png', './images/btn_text_tips.png', './images/btn_word_bg.png', './images/game-bg.png', './images/icon_life.png', './images/icon_score.png', './images/icon_tank.png', './images/icon_xman.png', './images/start_game.png', './images/page-bg.png', './images/life_progress.png', './images/x_man.png', './images/start_game.png', './images/share_tip.png', './images/share_tip_btn.png', './images/share_line.png', './images/popup_title_tip.png', './images/popup_title_quite.png', './images/popup_title_nolife.png', './images/popup_fish.png', './images/popup_btn_startgame.png', './images/popup_btn_share.png', './images/popup_btn_continue.png', './images/popup_btn_confirm.png', './images/popup_btn_close.png', './images/popup_btn.png', './images/popup_bg.png', './images/icon_protect_bg.gif', './images/icon_boom.gif', './images/game_word_bg_1.png', './images/game_word_bg_2.png', './images/game_word_bg_3.png', './images/game_word_bg_4.png', './images/popup_btn_quite.png', './images/pinyin_play.gif', './images/pinyin_play_btn.png'];

  var js = ['./js/jweixin-1.4.0.js', './js/compositionDetail.js', './js/jquery.cookie.js'];
  // var audios = ['./gameOverMusic.mp3', './bullet_music.mp3', './gameStartMusic.mp3']
  var audios = ['./bullet_music.mp3']

  resourceTotalNum = (imagesFirst.length + imagesSecond.length + js.length);

  onload = () => {
    resourceLoadedNum++;
    rate = resourceLoadedNum / resourceTotalNum;
    // $('.rate').text('已加载 ' + rate);
    $('.text').text('已加载 ' + rate);
    $('.loading-progress').css('width', rate * 100 + '%')
    if (rate === 1 && start) {
      // setTimeout( () => reDirection, 300);
      // setTimeout(() => reDirection(), 300);
      $('.prepare').css('display', 'none');
      $('.ready').css('display', 'block');
      var script = document.createElement('script');
      script.src = './js/gameIndex.js';
      $('body').append(script);

    }
  }

  createImagesFirst = (images) => {
    images.forEach((image, index, images) => {
      var imgNode = document.createElement('img');
      imgNode.src = image;
      imgNode.onload = () => {
        resourceLoadedNum++;
        if ((index + 1) === images.length) {
          // getPhraseLevel
          initPhraseArrayConfig(() => {
            // 再去加载JS和图片资源
            // console.log(JSON.stringify(CONFIG.phraseArrayLevel2))
            createJs(js);
            createImages(imagesSecond)
          })
        }
      }
    })
  }


  // 加载js资源函数
  createJs = (js) => {
    js.forEach(item => {
      var script = document.createElement('script');
      script.src = item;
      document.body.append(script)
      script.onload = onload;
    })
  }


  // 加载图片资源函数
  function createImages(images) {
    images.forEach((image, index) => {
      var imgNode = document.createElement('img');
      imgNode.src = image;
      imgNode.onload = onload;
    })
  }


  function createAudio(audios, callback) {
    console.log(audios);
    audios.forEach(item => {
      var node = document.createElement('audio');
      node.src = item;
      document.body.append(node);
      // $('.text').text('cancreate')
      node.onloadstart = function() {
        $('.text').text('start');
      }
      node.play();
      node.onprogress = () => {
        $('.text').text('onprogress');
      }
    })
  }

  // 从后台获取成语
  function getPhraseLevel({
    url,
    level,
    phraseArray,
    callback
  }) {
    console.log('getPhraseLevel')
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify({
        level: level
      }),
      dataType: 'json',
      contentType: 'application/json',
      timeout: 10000,
      success: (res) => {
        // alert(JSON.stringify(res.data));
        CONFIG[phraseArray] = res.data;
        // alert(JSON.stringify(CONFIG[phraseArray]))
        // alert('success')
        callback && callback()
      },
      fail: (res) => {
        // alert('fail');
      }
    })
  }

  function initPhraseArrayConfig(callback) {
    // 获取两个难度级别的成语
    // https://teacher.pythe.cn/pythe-auto-task/rest/chengyu/query/level
    var url = CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/chengyu/query/level';
    // 获取level1的成语
    getPhraseLevel({
      url: url,
      level: 1,
      phraseArray: 'phraseArrayLevel1',
      callback: () => {
        // 再获取level2的成语
        getPhraseLevel({
          url: url,
          level: 2,
          phraseArray: 'phraseArrayLevel2',
          callback: () => {
            callback && callback();
          }
        })
      }
    })
    // 获取level2的成语


  }



  createImagesFirst(imagesFirst);


  // 点击开始游戏才加载后面需要的图片，以及js文件
  $('#start').click(() => {
    start = true;
    // $('.gameStartMusic')[0].play();
    // 显示layer
    $('.loading.layer').css('display', 'block');
    if (rate < 1) {
      return;
    }
    $('.prepare').css('display', 'none');
    $('.ready').css('display', 'block');
    var script = document.createElement('script');
    script.src = './js/gameIndex.js';
    $('body').append(script);
    // setTimeout(() => reDirection(), 300);
    // window.location.href = './gameInstruction.html'

  })

  // 跳转
  // function reDirection() {
  //   console.log('redirect')
  //   var appid = 'wx49e51570a28eef81';
  //   var redirect_uri = encodeURIComponent(document.URL);
  //   var response_type = 'code';
  //   var scope = 'snsapi_userinfo';
  //   // 获取原来URl中的isPK和id值
  //   var id = getQueryString('id');
  //   if (id) {

  //     var id = getQueryString('id');
  //     redirect_uri += `?id=${id}`
  //   } else {

  //   }
  //   $('.prepare').css('display', 'none');
  //   $('.ready').css('display', 'block');
  //   // 加载newIndex.js文件
  //   var script = document.createElement('script');
  //   script.src = './js/newIndex.js';
  //   $('body').append(script);
  //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&#wechat_redirect`
  // }

  // 获取URL中的参数
  // function getQueryString(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  //   var r = window.location.search.substr(1).match(reg);
  //   if (r != null) {
  //     return unescape(r[2]);
  //   }
  //   return null;
  // }


  function onCanplay() {
    this.seekable = this.audio.seekable && this.audio.seekable.length > 0;

    if (this.seekable) {
      this.timer = setInterval(this.onProgress.bind(this), 500);
    }

    var name = this.list[this.index].name || '',
      time = this.list[this.index].time || '';

    this.trigger('canplay', time, name, this.list[this.index]);
  }

  function onProgress() {
    if (this.audio && this.audio.buffered !== null && this.audio.buffered.length) {
      this.duration = this.audio.duration === Infinity ? null : this.audio.duration;
      this.load_percent = ((this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration) * 100).toFixed(4);
      if (isNaN(this.load_percent)) {
        this.load_percent = 0;
      }

      if (this.load_percent >= 100) {
        this.clearLoadProgress();
      }

      this.trigger('progress', this.load_percent);
    }
  }

  // 对于play触发后才开始加载
  function play() {
    if (!this.seekable) {
      this.timer = setInterval(this.onProgress.bind(this), 500);
    }
    this.audio.play();
  }

}