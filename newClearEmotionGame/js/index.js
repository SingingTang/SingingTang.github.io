

var GAME = {



  init: function() {
    this.phrases = [];
    // 已经掉落的成语
    this.phraseNum = 0;
    // 当前分数
    this.curScore = 0;
    // 当前生命值
    this.curLife = CONFIG.lifeTotal;
    // 当前剩余提示次数
    this.curTip = CONFIG.tipTotal;
    this.wrongWord = {};
    this.rightWord = {};
    // console.dir(this.getPhraseLevel)
    this.initWXConfig();
    this.initPhraseArrayConfig(this.bindAction.bind(this));
    this.openid = getQueryString('code') || 'no';
    $('.warm-tip').text(this.openid);
    // 游戏进程
    this.status = '';

  },

  // 修改游戏的状态 
  setStatus: function(status) {
    switch (status) {
      // 开始游戏
      case 'start':
      // 初始化成语数组

      // 游戏结束
      case 'over':
        if(this.status === 'over') break;
        this.status = 'over';
        // $('.warm-tip').text('gameOver')
        this.gameOver();
        break;
    }
  },

  // 游戏结束
  gameOver: function() {
    // alert('in over');
    // 将分数，错词本，词本，openid存进cookie
    $.cookie('score', this.curScore);
    $.cookie('wrongWord', JSON.stringify(this.wrongWord));
    $.cookie('rightWord', JSON.stringify(this.rightWord));
    $.cookie('wxOpenId', JSON.stringify(this.openid))
    alert($.cookie('wrongWord'))
    alert($.cookie('rightWord'))
    // $('.warm-tip').text($.cookie('rightWord'));
    window.location.href = './challengeScorePage.html'
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
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx49e51570a28eef81', // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: [
            'startRecord', //判断当前客户端版本是否支持指定JS接口
            'stopRecord',
            'uploadVoice',
            'downloadVoice',
            'playVoice',
            'onMenuShareQZone',
            'hideToolbar'


          ] // 必填，需要使用的JS接口列表
        });
      },
      complete: function(status) {
        if (status == 'timeout') {
          ajaxTimeOut.abort(); //取消请求                     
        }
      }
    });
  },

  getPhraseLevel: function({
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
      timeout: 5000,
      success: (res) => {
        CONFIG[phraseArray] = res.data;
        callback && callback()
      },
    })
  },

  initPhraseArrayConfig: function(callback) {
    // 获取两个难度级别的成语
    // https://teacher.pythe.cn/pythe-auto-task/rest/chengyu/query/level
    var url = CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/chengyu/query/level';
    // 获取level1的成语
    this.getPhraseLevel({
      url: url,
      level: 1,
      phraseArray: 'phraseArrayLevel1',
      // 回调时修改游戏状态，设置为游戏
      callback: () => 
    })
    // 获取level2的成语
    this.getPhraseLevel({
      url: url,
      level: 2,
      phraseArray: 'phraseArrayLevel2',
    })

  },



  initPhrase: function() {
    // 初始化成语数组
    var phraseNode = document.querySelectorAll('.phrase');
    phraseNode.forEach(node => this.phrases.push(new Phrase({
      $node: $(node)
    }, this)))
    console.log(this.phraseNum)
  },

  // 按钮点击事件
  bindAction: function() {

    const self = this;

    $('.tip').click(() => {
      console.log('剩余提示  ' + self.curTip)
      // 判断剩余提示次数，如果小于1，说明没有提示机会了，则显示活动规则页面
      if (self.curTip < 1) {
        // 停止动画
        self.phrases.forEach(phrase => cancelAnimationFrame(phrase.animation))
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
      self.createPopup('tipContent')
    })

    $('.close').click((event) => {
      // 隐藏父元素内容
      $(event.target).parent().css('display', 'none');
      // 隐藏提示弹窗
      $('.popup-container').css('visibility', 'hidden');
      self.phrases.forEach(phrase => {
        // 如果当前的动画锁住了,则说明在进行别的动作
        if (phrase.animationLock) {
          return
        } else {
          phrase.animation = requestAnimationFrame(phrase.fall.bind(phrase));
        }
      })

      // 判断此时剩余的提示次数，如果没有提示，则提示按钮变成分享按钮
      if (self.curTip == 0) {
        $('.tip').css('display', 'none');
        $('.share').css('display', 'flex');
        // $('.tip img').attr('src', './images/btn_text_rule.png');
        // $('.tip img').attr('src', './images/popup_btn_share.png');
      }
    })

    // 游戏结束
    $('.popup-nolife .close').click(() => window.location.href = './clearEmotionGame.html')

    $('.quite-confirm').click(() => window.location.href = './clearEmotionGame.html')

    $('.quite').click(() => {
      self.stopAnimation();
      self.createPopup('quite');
    })

  },

  // 生成弹窗，参数，弹窗类型，有，tip, tipContent, share, quite
  createPopup: function(type) {
    // 
    switch (type) {
      case 'tip':
        // 显示提示弹窗
        // 设置title
        $('.popup-title img').attr('src', './images/popup_title_tip.png');
        // 显示提示弹窗
        $('.popup-container').css('visibility', 'visible');
        // 显示弹窗内容
        $('.phrase-container').css('display', 'flex');
        $('.popup-tip').css('display', 'flex')
        // $('.')
        this.phrases.forEach((item, index) => {
          // 停止动画
          cancelAnimationFrame(item.animation)
          // 将当前画面中的成语显示出来
          if (parseInt(item.$node.css('top')) > 92) {
            // 设置radio值
            var label = $($('.popup-tip .tip-phrase')[index]);
            label.parent().css('display', 'block')
            label.addClass('show');
            label.text(item.phrase.word)
          }
        });
        break;


      case 'tipContent':
        // 获取到具体被选中的成语的index
        var phraseIndex = parseInt($('input[type="radio"]:checked').attr('index'));
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
        // 显示内容
        $('.popup-tip-content .annotation').text('释义: ' + phrase.annotation);
        $('.popup-tip-content .pinyin').text('拼音: ' + phrase.pinyin);
        $('.popup-tip-content .tip-phrase-selected').css('display', 'block').text(phrase.word);
        break;

      case 'rule':
        console.log('rule')

        $('.popup-container').css('visibility', 'visible');
        $('.popup-title').attr('src', './images/popup_title_gamerule.png')
        $('.popup-rule').css('display', 'block')
        break;

      case 'nolife':
        $('.popup-container').css('visibility', 'visible');
        $('.popup-title').attr('src', './images/popup_title_nolife.png');
        $('.popup-nolife').css('display', 'flex');
        break;

      case 'quite':
        $('.popup-container').css('visibility', 'visible');
        $('.popup-title').attr('src', './images/popup_title_quite.png');
        $('.popup-quite').css('display', 'flex');
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
    console.log(this.curLife)
    // 如果生命值为0，则停止动画，出现分享界面
    if (this.curLife === 0) {
      // 没有血了
      console.log('没有血了');
      this.stopAnimation();
      // 出现血槽已空分享弹窗
      this.createPopup('nolife');
      return false;
    }

    this.curLife--;
    return true;

  },

  setCookie: function() {

  }

}


class Phrase {

  constructor(props, GAME) {
    this.GAME = GAME;
    this.$node = props.$node;
    this.animation = null;
    this.phrase = null;
    this.timeStart = '';
    this.timeEnd = '';
    this.animationLock = false;
    // 判断是否停止录音
    this.stop = false;
    // 绑定对应的事件函数，只能绑定一次
    this.$node.on({
      touchstart: this.onStartRecord.bind(this),
      touchend: this.onTouchEnd.bind(this),
    })
    this.init();


  }

  // 初始化成语的相关位置及文本信息
  init() {
    // 重设游戏参数
    this.reset();
    // 初始化的时候会删除动画
    cancelAnimationFrame(this.animation);
    this.fall();
  }

  reset() {

    // 每重置一次,则生成一个成语,则phraseNum+1
    this.GAME.phraseNum++;
    // 设置游戏进度条,
    $('.life-progress span').css('width', this.GAME.phraseNum / CONFIG.phraseNumTotal * 100 + '%');
    // 每10个成语中，会有一个是level2的
    let phraseArray = this.GAME.phraseNum % 10 == 0 ? CONFIG.phraseArrayLevel2 : CONFIG.phraseArrayLevel1;
    // 随机生成成语对象
    this.phrase = phraseArray[parseInt(Math.random() * phraseArray.length)];
    // 随机生成的文本
    let text = this.phrase.word;



    let gameWidth = CONFIG.gameWidth - 120;
    // 
    // 随机设置左边距
    // gameWidth = parseInt(Math.random() * gameWidth);
    // 产生随机的0或1
    var n = parseInt(Math.random() * 2);
    let left = parseInt(Math.random() * gameWidth / 2) + gameWidth / 2 * n;
    // let left = parseInt(Math.random() * gameWidth);
    // 随机设置上边距
    let top = parseInt(Math.random() * -300);
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
    this.$node.text(text);
    // 设置该节点的位置信息
    this.$node.css({
      left: left + 'px',
      top: top + 'px'
    })


  }


  // 下落函数
  fall() {

    if (this.GAME.curLife <= 0) {
      this.GAME.setStatus('over');
      cancelAnimationFrame(this.animation);
      return;
    }

    if (this.ifBootom()) {

      // console.log(this.GAME.curLife)

      // 停止动画
      cancelAnimationFrame(this.animation);
      // 将该读错的词语加进错词本
      var keys = Object.keys(this.GAME.wrongWord);

      this.GAME.wrongWord[keys.length] = {
        id: this.phrase.id,
        word: this.phrase.word
      };

      // 如果当前生命值为0，则游戏失败
      if (this.GAME.curLife <= 0) {
        // this.GAME.subCurLife();
        // 游戏结束，
        console.log('last life');

        return;
      }

      this.GAME.subCurLife();

      CONFIG.life.text(this.GAME.curLife);
      this.init()
      return
    }


    // 通过offset来设置其高度，可以更加精确
    let top = this.$node.offset().top;
    // 0.3为其每次下落的高度
    this.$node.offset({
      // top: top + 0.3
      top: top + 1
    })

    // if (parseInt(this.$node.css('top')) > 92) {
    //   this.GAME.phraseNum++;
    //   // 设置游戏进度条,
    //   $('.life-progress span').css('width', this.GAME.phraseNum / CONFIG.phraseNumTotal * 100 + '%');
    // }

    // 如果当前的top小于92，即不在游戏区域则隐藏
    if (parseInt(this.$node.css('top')) < 92) {
      this.$node.css('visibility', 'hidden')
    } else {
      this.$node.css('visibility', 'visible')
    }

    this.animation = requestAnimationFrame(this.fall.bind(this));

  }

  ifBootom() {
    // 如果到底，则成语的offsetHeight+height应该等于容器的offsetHeight+height
    if (this.$node.offset().top + parseInt(this.$node.height()) >= CONFIG.gameArea.offset().top + 92 + parseInt(CONFIG.gameArea.height())) {
      console.log('到底');
      return true;
    }
    return false;
  }

  onStartRecord(event) {



    var self = this;

    event.preventDefault();
    // 停止动画
    cancelAnimationFrame(self.animation);
    // 并且当touchend时才可以恢复动画
    self.animationLock = true;
    var text = this.$node.text();
    var id = $(event.target).prop('id');
    this.$node.empty();
    this.$node.text(this.phrase.word);
    $(event.target).append(`
      <style>
      #${id}::before {
        display: block; 
        background: url(./images/icon_protect_bg.gif); 
        background-size: cover 
      }
      </style>
      `);

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
  }

  onTouchStart(event) {
    var self = this;
    // 生成开始时间戳
    self.timeStart = new Date().getTime();

    setTimeout(self.onStartRecord.call(self, event), 200)

  }

  onTouchEnd(event) {

    // event.preventDefault();
    const self = this;

    var result = false;
    // 生成结束时间戳
    // this.timeEnd = new Date().getTime();
    // // 如果按住时间不够200ms，则不录音
    // var during = this.timeEnd - this.timeStart;
    // $('.test').text(during);
    // if (during < 200) {
    //   return;
    // }

    if (self.stop) {
      $('.warm-tip').text('已停止');
      return;
    } else {
      $('.warm-tip').text('未停止');
    }

    // 暂停录音
    wx.stopRecord({

      // 上传成功时
      success: function(res) {

        var localId = res.localId;
        $('.warm-tip').text('录音结束，发送中...');
        // 上传录音
        wx.uploadVoice({

          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示，0，不显示进度
          success: function(res) {
            // 返回音频的服务器端ID
            // var serverId = res.serverId;
            // 上传成功后进行音频校对
            // 音效
            var music = $('.music')[0];
            music.play();

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
      }

    });

  }

  onCheckRecord(serverId) {
    const self = this;
    // alert(self instanceof Phrase);
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
            self.$node.empty();
            self.$node.text(self.phrase.word);
            $('.warm-tip').text('对了  ' + self.$node.text())
            // 发送子弹
            $('.bullet').css('display', 'block');

            setTimeout(() => {
              $('.bullet').css('display', 'none');
              // 删除背景图片
              
              var oldClass = self.$node.prop('class').split(' ');
              if (oldClass.length > 1) {
                var oldBg = oldClass[1];
                // 删除原来的旧背景
                self.$node.removeClass(oldBg)
              }
              self.$node.append(`
              <style>
                #${id}::before {
                  display: block; 
                  background: url(./images/icon_boom.gif); 
                  background-size: cover 
                }
              </style>
              `);
              // 2秒后回复原状
              setTimeout(() => {
                // 分数加1
                CONFIG.score.text(++self.GAME.curScore);
                // 将对的词加进词本
                var keys = Object.keys(self.GAME.rightWord);

                self.GAME.rightWord[keys.length] = {
                  id: self.phrase.id,
                  word: self.phrase.word
                };
                // 设置新成语
                self.init();
              }, 2000);
            }, 666)


          } else {
            // $('.warm-tip').text('错了')
            // 恢复动画
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
    // alert(this instanceof Phrase);
    this.animationLock = false;
    this.animation = requestAnimationFrame(this.fall.bind(this));
    var id = this.$node.prop('id');
    // var text
    this.$node.append(`<style>#${id}::before{display: none}</style>`);
    // 修改指示牌上的文字
    this.$node.append(`<style>#${id}::after{content: '读音有误'}</style>`);
    setTimeout(() => this.$node.append(`<style>#${id}::after{content: '按住念词'}</style>`), 1000);
  }
}

GAME.init();