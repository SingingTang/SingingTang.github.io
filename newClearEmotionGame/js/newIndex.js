var GAME = {



  init: function() {
    // alert('9 ' +JSON.stringify(CONFIG.phraseArrayLevel1))
    // alert('10 ' +JSON.stringify(CONFIG.phraseArrayLevel2));

    this.phrases = [];
    // 已经掉落的成语
    this.phraseNum = 0;
    // 当前分数
    this.curScore = 0;
    // 当前生命值
    this.curLife = CONFIG.lifeTotal;
    // 当前剩余分享提示次数
    this.curTipShare = CONFIG.tipShareTotal;
    this.reborn = 0;
    // 当前剩余提示次数
    this.curTip = CONFIG.tipTotal;
    this.wrongWord = {};
    this.errorWordId = [];
    this.correctWordId = [];
    this.rightWord = {};
    this.status = '';
    this.curRight = 0;

    CONFIG.gameWidth = $('.game').width();

    // console.dir(this.getPhraseLevel)
    this.id = getQueryString('id');

    // alert(this.id);
    this.initWXConfig();
    this.initPhrase();

    // this.openid = getQueryString('code') || 'no';
    // $('.warm-tip').text(this.openid);
    // 游戏进程

    $('.gameStartMusic')[0].play();


  },

  setWxShareInfo: function(wxWrite, dec, callback) {
    pageUrl = 'https://check.pythe.cn/newClearEmotionGame/clearEmotionGame.html';
    wx.ready(function() {
      var wxShareInfo = {
        title: wxWrite, // 分享标题
        desc: dec, // 分享描述
        link: pageUrl,
        imgUrl: 'https://check.pythe.cn/newClearEmotionGame/images/icon_xman.png', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function(res) {
          // alert(JSON.stringify(res))
          callback && callback();
        }
      }
      wx.onMenuShareTimeline(wxShareInfo);

      wx.onMenuShareAppMessage(wxShareInfo);

      wx.onMenuShareQQ(wxShareInfo);

      wx.onMenuShareWeibo(wxShareInfo);

      wx.onMenuShareQZone(wxShareInfo);

    })
  },

  // 修改游戏的状态 
  setStatus: function(status) {
    // alert('76')
    // alert(status);
    switch (status) {
      case 'over':
        if (this.status === 'over') break;
        this.status = 'over';
        // $('.warm-tip').text('gameOver')
        this.gameOver();
        break;
        // 暂停动画
      case 'stop':
        this.status = 'stop';
        this.stopAnimation();
        break;
        // 继续游戏
      case 'continue':
        this.status = 'continue';
        this.continueAnimation();
        break;
        // 获得一个新生命
      case 'reborn':
        this.status = 'reborn';
        // alert('97');
        // alert(this.curTip)
        this.reBorn()
        // this.continueAnimation();
        // alert('100');
        break;
      case 'playing':
        this.status = 'playing';
        break;
    }
  },

  reBorn: function() {
     this.setStatus('playing');
    // $('.popup-container').css('visibility', 'hidden');
    // $('.popup-nolife').css('display', 'none');
    // alert(this.status);
    // alert($('.popup-container').css('visibility'));
    this.phrases.forEach(phrase => {
      phrase.init();
    });
  },

  continueAnimation: function() {
    this.setStatus('playing');
    // $('.popup-container').css('visibility', 'hidden');
    // $('.popup-nolife').css('display', 'none');
    // alert(this.status);
    // alert($('.popup-container').css('visibility'));
    this.phrases.forEach(phrase => {
      cancelAnimationFrame(phrase.animation)
      requestAnimationFrame(phrase.fall.bind(phrase));
    });

  },

  // 上传词本
  updatePhrase: function(callback) {
    const self = this;
    $.ajax({
      url: CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/match/wcw/finish',
      type: 'POST',
      dataType: 'JSON',

      data: JSON.stringify({
        'error': self.errorWordId,
        'correct': self.correctWordId,
        'wxOpenId': $.cookie('wxOpenId')
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        callback && callback();
      },
      fail: function(res) {}
    });
  },
  // 上传分数
  updateScore: function(callback) {
    const self = this;
    // 将分数存进cookie
    $.cookie('score', self.curScore);
    // 上传分数
    $.ajax({
      url: CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/match/wcw/data/update',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        'wxOpenId': $.cookie('wxOpenId'),
        'score': self.curScore,
        'reborn': self.reborn
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        callback && callback();

      },
      fail: function(res) {}
    });
  },
  // 上传PK结果
  updatePk: function() {
    const self = this;
    $.ajax({
      url: CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/match/wcw/challenge/record',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        'challenger': $.cookie('wxOpenId'),
        'challengerScore': self.curScore,
        'defender': self.id
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        // alert(JSON.stringify(res));
        window.location.href = `./userPKChallengeScorePage.html?id=${self.id}`

      },
      fail: function(res) {}
    });
  },

  // 游戏结束
  gameOver: function() {

    const self = this;
    // 播放游戏结束音乐 
    $('.gameStartMusic')[0].pause();
    // 弹窗隐藏
    $('.popup-container').css('visibility', 'hidden');
    // 词块隐藏
    $('.phrase').css('display', 'none');
    $('.game-over').css('display', 'block');

    // 上传游戏结果
    setTimeout(() => {
      self.updateScore(() => {
        self.updatePhrase(() => {
          if (self.id) {
            self.updatePk()
          } else {
            window.location.href = './challengeScorePage.html'
          }
        })
      })
    }, 500)

  },

  // 调用微信录音接口
  initWXConfig: function() {
    $.ajax({
      url: CONFIG.interfaceUrl1 + '/pythe-rest/rest/link/share/signature',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        "url": document.URL
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        // alert('217 '+ JSON.stringify(res))
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx49e51570a28eef81', // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: [
            'checkJsApi',
            'startRecord', //判断当前客户端版本是否支持指定JS接口
            'stopRecord',
            'uploadVoice',
            'downloadVoice',
            'playVoice',
            'onMenuShareQZone',
            'onMenuShareTimeline', //分享好友
            'onMenuShareAppMessage', //分享好友


          ] // 必填，需要使用的JS接口列表
        });
      },
      fail: function() {
        // alert('fail');
      },
      complete: function(status) {
        if (status == 'timeout') {
          ajaxTimeOut.abort(); //取消请求                     
        }
      }
    });
  },


  initPhrase: function(callback) {
    // alert('301 ' + JSON.stringify(CONFIG['phraseArrayLevel2']))
    // 初始化成语数组
    var phraseNode = document.querySelectorAll('.phrase');
    // 设定游戏状态为开始
    this.setStatus('playing');
    phraseNode.forEach((node, index) => this.phrases.push(new Phrase({
      $node: $(node)
    }, this, index)))
    // callback &&　callback();
    this.bindAction();
  },

  // 按钮点击事件
  bindAction: function() {

    const self = this;

    $('.tip').click(() => {
      self.setStatus('stop')
      // 判断剩余提示次数，如果小于1，说明没有提示机会了，则显示活动规则页面
      if (self.curTip < 1) {
        // 停止动画
        // self.setStatus('stop')
        self.createPopup('rule');
        return;
      }
      // 判断当前页面中有没有成语，如果没有，直接返回，有，将其显示 
      var hasPhrase = self.phrases.some(phrase => parseInt(phrase.$node.css('top')) > 92);
      console.log(hasPhrase);

      if (!hasPhrase) return;
      // 显示提示弹窗
      self.createPopup('tip');
    });

    $('.tip-confirm').click((event) => {
      // 显示具体提示内容
      self.createPopup('tipContent');

    })

    $('.close').click((event) => {
      // 隐藏父元素内容
      $(event.target).parent().css('display', 'none');
      // 隐藏提示弹窗
      $('.popup-container').css('visibility', 'hidden');
      // 游戏继续
      self.setStatus('continue')

      // 判断此时剩余的提示次数，如果没有提示，则提示按钮变成分享按钮
      if (self.curTip == 0) {
        if (self.curTipShare > 0) {
          $('.tip').css('display', 'none');
          $('button.share').css('display', 'flex');
          $('button.share img').attr('src', `./images/btn_text_share_tips_${self.curTipShare}.png`)
        } else {
          // 如果此时的剩余分享次数为0
          $('.tip img').attr('src', './images/btn_text_rule.png');
          // $('.tip img').attr('src', './images/popup_btn_share.png');
        }

      }
    })
    // 提示分享 知道了，回到正常游戏
    $('.share-layer-know').click(() => {
      // layer消失
      $('.share.layer').css('display', 'none');
      this.setStatus('continue');
    })

    // 没有提示时，点击分享获取提示
    $('button.share').click(() => {
      // 游戏暂停
      self.setStatus('stop');
      // 出现提示layer
      $('.share.layer').css('display', 'block');
      // 在该页面设置分享获取一条生命值
      self.setWxShareInfo('万词王游戏', '请求再给我一个成语提示吧！', () => {
        // 分享提示次数-1
        self.curTipShare--;
        // 提示次数+1
        self.curTip++;
        // 按钮变成提示
        $('.tip').css('display', 'flex');
        $('button.share').css('display', 'none');
        // layer消失
        $('.share.layer').css('display', 'none');
        // 继续游戏
        self.setStatus('continue');
        // 后续再分享，没用
        self.setWxShareInfo('万词王游戏', '一起来挑战')
      });
    })

    // 没有生命值时的分享按钮
    $('.popup-nolife .share').click(() => {

    })

    $('.popup-tip .close').click(() => {
      // self.curTipShare--;
      $('.gameStartMusic')[0].play();
    })

    $('.popup-tip-content .close').click(() => {
      // self.curTipShare--;
      $('.gameStartMusic')[0].play();
    })

    // 游戏结束
    $('.popup-nolife .close').click(() => {
      self.setStatus('over')
    })

    // 分享提示中，知道了按钮
    $('.share-tip-btn').click(() => {
      // 隐藏提示内容 
      $('.share.layer').css('display', 'none');
      self.setStatus('continue');
    })

    $('.quite-confirm').click(() => self.setStatus('over'));

    $('.quite').click(() => {
      self.setStatus('stop');
      self.createPopup('quite');
    })

    $('.quite-cancel').click(() => {
      $('.popup-container').css('visibility', 'hidden');
      $('.popup-quite').css('display', 'none')
      self.setStatus('continue')
    })

    // 点击读拼音的按钮
    $('.pinyin-music-btn').click(() => {
      // 切换图片
      $('.pinyin-music-btn').css({
        'background': 'url(./images/pinyin_play.gif)',
        'background-size': 'cover'
      });
      // 停止背景音乐 
      $('.gameStartMusic')[0].pause();
      $('.pinyin-music')[0].play();
      setTimeout(() => {
        $('.gameStartMusic')[0].play();
        // $('.pinyin-music')[0].pause()
        $('.pinyin-music-btn').css({
          'background': 'url(./images/pinyin_play_btn.png)',
          'background-size': 'cover'
        });
      }, 3000)
    });

    $("input[type='radio']").each(function() {
      const self = this;
      $(this).click(function() {
        $('.tip-phrase img').attr('src', './images/btn_word_bg.png');
        // alert('点击')
        $(self).parent().children('label').children('img').attr('src', './images/btn_word_bg_select.png');

      });
    });


  },

  getPinyinMusic: function(text, callback) {
    var url = 'http://39.104.162.93:8005/tts?user_id=speech&domain=1&language=zh&speed=4&voice_name=1&text=' + text;
    // alert(url);
    $.ajax({
      url: url,
      type: 'GET',
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        // alert(res)
        callback && callback(res.data);
      },
      fail: function() {
        alert(' 446 fail');
      },
      complete: function(status) {
        // alert(JSON.stringify(status))
        if (status == 'timeout') {
          alert('timeout')
          ajaxTimeOut.abort(); //取消请求                     
        }
      }
    });
  },

  getAnnotation: function(id, callback) {
    var url = 'https://teacher.pythe.cn/pythe-auto-task/rest/chengyu/select';
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        'wordId': id
      }),
      contentType: 'application/json',
      timeout: 4000,
      success: function(res) {
        // alert(JSON.stringify(res.data))
        // alert(JSON.stringify(res.data))
        callback && callback(res.data.annotation, res.data.audio);
      },
      fail: function() {
        // alert(' 446 fail');
      },
      complete: function(status) {
        if (status == 'timeout') {
          alert('timeout')
          ajaxTimeOut.abort(); //取消请求                     
        }
      }
    });
  },

  // 根据当前所在位置即高度排序
  sortPhrase: function() {
    var sortP = [];
    var phraseTop = [];
    var phraseIndex = []
    const self = this;
    this.phrases.forEach((phrase, index) => {
      if (parseInt(phrase.$node.css('top')) > 92) {
        phraseTop.push(phrase);
        // phraseIndex.push(index)
      }
    })
    // alert('492 ' + phraseTop.length)
    // 降序排列
    phraseTop.sort((a, b) => {
      if (parseInt(a.$node.css('top')) > parseInt(b.$node.css('top'))) {
        return false
      } else {
        return true
      }
    })
    return phraseTop
  },

  // 生成弹窗，参数，弹窗类型，有，tip, tipContent, share, quite
  createPopup: function(type) {
    const self = this;
    switch (type) {
      case 'tip':
        // 停止音乐 
        $('.gameStartMusic')[0].pause()
        // 显示提示弹窗
        // 设置title
        $('.popup-title img').attr('src', './images/popup_title_tip.png');
        // 显示提示弹窗
        $('.popup-container').css('visibility', 'visible');
        // 显示弹窗内容
        $('.phrase-container').css('display', 'flex');
        $('.popup-tip').css('display', 'flex')
        var first = true;
        $('.popup-tip .tip-phrase').css('display', 'none')
        var radioIndex = 0;
        var sortP = self.sortPhrase();
        // $('.')
        sortP.forEach((item, index) => {
          // 停止动画
          cancelAnimationFrame(item.animation)

          // 将当前画面中的成语显示出来
          if (parseInt(item.$node.css('top')) > 92) {
            // 当前第一个可见元素

            // 设置radio值
            var label = $($('.popup-tip .tip-phrase')[radioIndex]);
            label.css('display', 'block');
            var input = $($('input[type="radio"]')[radioIndex]);
            input.attr('index', item.index)
            // input.attr('checked', 'checked');
            // input.pop('checked', 'checked')
            // alert(498)
            label.parent().css('display', 'flex')
            // label.addClass('show');
            label.children('.tip-phrase-text').text(item.phrase.word)

            radioIndex++;
          }

        });
        // 默认第一个选中
        $('input[type="radio"]').attr('checked', '')
        $('input[type="radio"]:checked').removeAttr('checked');
        $('.tip-phrase img').attr('src', './images/btn_word_bg.png');
        $($('input[type="radio"]')[0]).attr('checked', 'checked')
        $($('.tip-phrase img')[0]).attr('src', './images/btn_word_bg_select.png');
        // alert($($('.tip-phrase img')[0]).attr('src'))
        break;


      case 'tipContent':
        // 获取到具体被选中的成语的index
        // alert($('input[type="radio"]:checked'))
        // alert($('input[type="radio"]:checked').length)
        var input = $('input[type="radio"]:checked').length ? $('input[type="radio"]:checked') : $('input[type="radio"]')

        var phraseIndex = parseInt(input.attr('index'));
        // 取消选中状态
        $('input[type="radio"]:checked').removeAttr('checked');
        console.log(typeof phraseIndex);
        // 如果没有选中成语，直接返回
        if (phraseIndex !== phraseIndex) return;
        // 有选中，说明用掉一次提示机会剩余提示次数-1
        this.curTip--;
        // 隐藏掉提示弹窗
        $('.popup-tip').css('display', 'none');
        // 显示提示内容弹窗
        $('.popup-tip-content').css('display', 'block');
        // 获取具体的成语
        var phrase = this.phrases[phraseIndex].phrase;
        // 从后台获取成语的录音
        this.getPinyinMusic(phrase.word, (src) => {
          $('.pinyin-music source').attr('src', src);
          $('.pinyin-music-btn').click(() => {
            $('.pinyin-music').play();
          })
        })
        // 显示内容
        this.getAnnotation(phrase.id, (annotation, audio) => {
          // alert('557')
          $('.popup-tip-content .annotation').text('释义: ' + annotation);
          document.querySelector('.pinyin-music').src = audio;
          $('.popup-tip-content .pinyin-music source').attr('src', audio);
          $('.pinyin-music')[0].load();
        });
        $('.popup-tip-content .pinyin .pinyin').text('拼音: ' + phrase.pinyin);
        $('.popup-tip-content .tip-phrase-selected').css('display', 'block').text(phrase.word);
        break;

      case 'rule':
        $('.popup-container').css('visibility', 'visible');
        $('.popup-title').attr('src', './images/popup_title_gamerule.png')
        $('.popup-rule').css('display', 'block')
        break;

      case 'nolife':
        this.setStatus('stop');
        $('.popup-title img').attr('src', './images/popup_title_nolife.png');
        $('.popup-container').css('visibility', 'visible');
        $('.popup-title').attr('src', './images/popup_title_nolife.png');
        $('.nolife-text').text(`您有${CONFIG.rebornTotal - self.reborn}次翻身机会，分享即可获得一个生命值，继续游戏。冲吖!`)
        $('.popup-nolife').css('display', 'flex');

        // 在该页面设置分享获取一条生命值
        this.setWxShareInfo('快来帮我PK万词王！', '我被万词王攻击了！你们快来帮我怼他！', () => {
          // 停止游戏，生命值加1
          self.curLife = 1;
          // 复活次数加1
          self.reborn++;
          CONFIG.life.text(self.curLife);
          // 设置游戏进度条,
          $('.life-progress span').css('width', self.curLife / CONFIG.lifeTotal * 100 - 2 + '%');
          $('.popup-container').css('visibility', 'hidden');
          $('.popup-nolife').css('display', 'none');
          // 继续游戏
          // alert('625');
          self.setStatus('reborn');
          // self.setStatus('continue')
          // alert('629')
          // 后续再分享没用了
          self.setWxShareInfo('万词王游戏', '一起来挑战')
        });
        break;

      case 'quite':
        $('.popup-container').css('visibility', 'visible');
        $('.popup-title img').attr('src', './images/popup_title_quite.png');
        $('.popup-quite').css('display', 'flex');
        // alert('')
        break;

      default:
        console.log('default');

    }

  },

  stopAnimation: function() {
    this.phrases.forEach(phrase => cancelAnimationFrame(phrase.animation))
  },

  // 生命值减1
  subCurLife: function() {
    // 生命值小于1，不能减
    if (this.curLife < 1) {
      return;
    }
    this.curLife--;
    // 如果生命值为0，则停止动画，出现分享界面
    if (this.curLife <= 0) {
      // 没有血了
      // alert('没有血了');
      this.stopAnimation();
      // 判断当前可分享次数
      if (this.reborn === CONFIG.rebornTotal) {
        this.setStatus('over');
        return false;
      }
      // 出现血槽已空分享弹窗
      this.createPopup('nolife');
      return false;
    }
    return true;

  },
}


class Phrase {

  constructor(props, GAME, index) {
    this.GAME = GAME;
    this.$node = props.$node;
    this.animation = null;
    this.phrase = null;
    this.timeStart = '';
    this.timeEnd = '';
    this.animationLock = false;
    // 判断是否停止录音
    this.stop = false;
    // 是否出现在页面中
    this.show = false;
    // 是否读错过
    this.wrong = false;
    // 对应的哪个成语块元素
    this.index = index;
    // 绑定对应的事件函数，只能绑定一次
    this.$node.on({
      touchstart: this.onStartRecord.bind(this),
      touchend: this.onTouchEnd.bind(this),
    })
    this.init();
  }

  // 初始化成语的相关位置及文本信息
  init() {
    // 
    // if(this.GAME.status === 'stop') {

    // // }
    // alert('init')
    // 重设游戏参数
    this.reset();
    // 初始化的时候会删除动画
    cancelAnimationFrame(this.animation);
    this.fall();
  }

  reset() {
    // 每重置一次,则生成一个成语,则phraseNum+1
    this.GAME.phraseNum++;
    $('.warm-tip').text(this.GAME.phraseNum);
    // alert(this.GAME.phraseNum)
    // 重置时，设show为false
    this.show = false;
    // 初始为不可见状态
    this.$node.css('visibility', 'hidden');
    // 设置游戏进度条,
    $('.life-progress span').css('width', this.GAME.curLife / CONFIG.lifeTotal * 100 - 2 + '%');
    // 每10个成语中，会有一个是level2的
    let phraseArray = this.GAME.phraseNum % 10 == 0 ? CONFIG.phraseArrayLevel2 : CONFIG.phraseArrayLevel1;
    // 随机生成成语对象
    var index = parseInt(Math.random() * phraseArray.length);
    this.phrase = phraseArray[index];
    // 删除被选中的成语
    phraseArray.splice(index, 1);
    // alert(CONFIG.phraseArrayLevel1.length)
    // 随机生成的文本
    let text = this.phrase.word;

    let gameWidth = CONFIG.gameWidth - 120;
    // 
    // 随机设置左边距
    // gameWidth = parseInt(Math.random() * gameWidth);
    // 产生随机的0或1
    var n = parseInt(Math.random() * 4);
    let left = parseInt(Math.random() * gameWidth / 4) + gameWidth / 4 * n;
    // let left = parseInt(Math.random() * gameWidth);
    // 随机设置上边距
    let top = parseInt(Math.random() * -200);
    // 如果是第一个成语，直接落下
    this.GAME.phraseNum === 1 && (top = 92);
    // top = 180;

    // 随机设置成语的背景图片
    var bg = CONFIG.phraseBg[parseInt(Math.random() * 4) % CONFIG.phraseBg.length]
    var oldClass = this.$node.prop('class').split(' ');
    if (oldClass.length > 1) {
      var oldBg = oldClass[1];
      // 删除原来的旧背景
      this.$node.removeClass(oldBg)
    }
    // 随机设定类，通过类来控制背景图片
    this.$node.addClass(bg);
    // 设置该节点的文本
    this.$node.children('.phrase-text').text(text);
    // 保护层不可见
    this.$node.children('.phrase-layer').css('display', 'none');
    // console.log('可见性 ' + this.$node.children('.phrase-layer').css('display'))
    // this.$node.text(text);
    // 设置该节点的位置信息
    this.$node.css({
      left: left + 'px',
      top: top + 'px'
    })


  }


  // 下落函数
  fall() {

    if (this.ifBootom()) {
      // 停止动画
      cancelAnimationFrame(this.animation);
      // 将该读错的词语加进错词本
      this.GAME.errorWordId.push(this.phrase.id)
      $('.warm-tip').text(this.GAME.errorWordId)
      // 生命值减1
      this.GAME.subCurLife();
      CONFIG.life.text(this.GAME.curLife);
      // 当前的游戏状态为stop时
      // if (this.GAME.status === 'stop') {
      //   return;
      // }
      // if (this.GAME.status === 'playing') {
      //   this.init();
      // }
      this.init()
      return
    }

    if(this.GAME.status != 'playing') {
      return;
    }

    // 通过offset来设置其高度，可以更加精确
    let top = this.$node.offset().top;
    // 每对4个词加速
    var topIncrease = parseInt(this.GAME.curRight / 4) * 0.1 + 0.3;

    // 0.3为其每次下落的高度
    this.$node.offset({
      top: top + topIncrease
      // top: top + 2

    })

    // 如果当前为不可见状态时，且top>92，改变可见性
    if (this.show === false && parseInt(this.$node.css('top')) > 92) {

      // 此时，让光晕可见，且1秒之后设为不可见
      $('.halo').css('display', 'block').attr('src', './images/halo.gif');
      setTimeout(() => $('.halo').css('display', 'none').attr('src', ''), 1000);
      this.show = true;
      this.$node.css('visibility', 'visible')
    }


    this.animation = requestAnimationFrame(this.fall.bind(this));

  }

  ifBootom() {

    // 如果到底，则成语的offsetHeight+height应该等于容器的offsetHeight+height
    if (this.$node.offset().top + parseInt(this.$node.height()) >= CONFIG.gameArea.offset().top + 92 + parseInt(CONFIG.gameArea.height())) {
      return true;
    }
    return false;
  }

  onStartRecord(event) {

    var self = this;

    event.preventDefault();
    // 停止动画
    cancelAnimationFrame(self.animation);

    // 开始录音
    wx.startRecord({
      success: function(res) {
        $('.warm-tip').text('调起录音成功，录音了...');
        self.stop = false;
        setTimeout(self.onTouchEnd.bind(self), 4000);
      },
      fail: function(err) {
        $('.warm-tip').text('调起录音失败');
        // $('.warm-tip').text(JSON.stringify(err));
      }
    });

    $('.gameStartMusic')[0].pause();
    // 保护层显示
    self.$node.children('.phrase-layer').css({
      'background': 'url(./images/icon_protect_bg.gif)',
      'background-size': 'cover',
      'display': 'block'
    })

    // 并且当touchend时才可以恢复动画
    self.animationLock = true;

  }

  onTouchEnd(event) {

    const self = this;


    var result = false;

    if (self.stop) {
      $('.warm-tip').text('已停止');
      return;
    } else {
      $('.warm-tip').text('未停止');
    }

    // 播放音乐特效
    $('.music')[0].play();
    // 发送子弹
    $('.bullet').css('display', 'block');
    // alert('854')
    // 子弹666ms后消失
    setTimeout(() => {
      $('.bullet').css('display', 'none')
    }, 1000)

    // 暂停录音
    wx.stopRecord({

      // 上传成功时
      success: function(res) {

        var localId = res.localId;
        // $('.warm-tip').text('录音结束，发送中...');
        // 上传录音
        wx.uploadVoice({

          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示，0，不显示进度
          success: function(res) {

            // 校验录音
            self.onCheckRecord(res.serverId)
          },

          fail: function(err) {
            // 恢复动画
            self.regainFall();
            $('.warm-tip').text('上传失败 331');
          }
        })
      },
      fail: function(err) {
        // 恢复动画
        self.regainFall();
        $('.warm-tip').text('操作有点快，请重新说话');
      },
      complete: () => {
        self.stop = true;
        // 播放音乐
        $('.music')[0].play();
        // $('.bullet').css('display', 'none');

        $('.gameStartMusic')[0].play();
      }

    });

  }

  onCheckRecord(serverId) {
    const self = this;
    // alert('950')
    $.ajax({
      type: 'POST',
      url: CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/audio/iat',
      data: JSON.stringify({
        mediaId: serverId,
        // 成语ID
        wordId: self.phrase['id'],
        // 成语
        word: self.phrase.word
      }),
      dataType: "json",
      contentType: "application/json",
      timeout: 5000,
      beforeSend: function() {
        $('.warm-tip').text('录音上传中...,请耐心等候');
      },
      success: function(res) {
        if (null != res) {
          if (res.status == 200) {
            $('.warm-tip').text('读对了');
            // 读对了，则设置爆炸效果，爆炸结束再生成新的成语

            var id = self.$node.prop('id');
            $('.warm-tip').text('对了  ')

            // 对的词数加1
            self.GAME.curRight++;

            // 加分数 
            // 如果第一次读对则加80，否则加50
            self.GAME.curScore += self.wrong ? 50 : 80;
            CONFIG.score.text(self.GAME.curScore);
            self.GAME.correctWordId.push(self.phrase.id)

            // 设置爆炸效果
            self.$node.children('.phrase-layer').css({
              'background': 'url(./images/icon_boom.gif)',
              'background-size': 'cover',
              'display': 'block'
            })

            $('.music')[0].play();
            // 2秒后回复原状
            setTimeout(() => {

              self.init();
            }, 1000);

          } else {
            // 读错设置为true
            self.wrong = true;
            self.regainFall();
            $('.warm-tip').text("读错了哟！仍需加油！" + JSON.stringify(res));
          }
        } else {
          // 恢复动画
          self.regainFall();
          $('.warm-tip').text('402');
        }


      },

      error: function(err) {
        // 恢复动画
        // alert('错了')
        self.regainFall();
        $('.warm-tip').text('发生错误 412');

      },

      complete: function() {
        if (status == 'timeout') {
          ajaxTimeOut.abort(); //取消请求                             
          $('.warm-tip').text('网络状态不好');
        }

      }
    });
  }

  regainFall() {
    // if(this.GAME.status != 'playing') {
    //   return;
    // }
    // alert(this.GAME.status)
    // alert('1035')
    this.animationLock = false;
    this.animation = requestAnimationFrame(this.fall.bind(this));
    var id = this.$node.prop('id');
    // 保护层消失
    this.$node.children('.phrase-layer').css({
      'background': 'url(./images/icon_protect_bg.gif)',
      'background-size': 'cover',
      'display': 'none'
    });
    // this.$node.append(`<style>#${id}::before{display: none}</style>`);
    // 修改指示牌上的文字
    this.$node.children('.phrase-indicator').text('读音有误');
    // this.$node.append(`<style>#${id}::after{content: '读音有误'}</style>`);
    setTimeout(() => this.$node.children('.phrase-indicator').text('长按读词'), 1000);
  }


}

GAME.init();