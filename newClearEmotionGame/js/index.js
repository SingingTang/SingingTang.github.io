console.log('hello');
let playing = () => {

  console.log('hello');
  var begin = document.getElementById("begin");
  var score = $('.score span');
  var life = $('.life span');
  var against = document.getElementById("against");
  var phraseNode = document.querySelectorAll('.phrase')
  var tipPhrases = $('.tip-container .tip-phrase')
  // 记录下生成了多少个成语
  var phraseNum = 0;
  var phraseTotal = 30;
  var game = document.querySelector(".game");
  // 从后台获取到的成语数组
  var PHRASEARRAYLEAVEL1 = [];
  var PHRASEARRAYLEAVEL2 = [];
  var tipCount = 2;
  var totalLife = 5;
  // 存放Phrase类的数组
  var phrases = []
  var url = 'https://teacher.pythe.cn/pythe-auto-task/rest/chengyu/query/all';
  var interfaceUrl = 'https://check.pythe.cn';
  var interfaceUrl2 = 'https://teacher.pythe.cn';
  var phraseBg = ['phrase-bg1', 'phrase-bg2', 'phrase-bg3', 'phrase-bg4']


  // 从返回数据中过过滤出成语数组并返回
  // filterData = (dataArray) => dataArray.map((data) => { console.log(data); data.word })


  // 调用微信录音接口
  initWXConfig = () => {
    $.ajax({
      url: interfaceUrl + '/pythe-rest/rest/link/share/signature',
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

          ] // 必填，需要使用的JS接口列表
        });
      },

      error: function(err) {
        $('.warm-tip').text(JSON.stringify(err))
      },

      complete: function(status) {
        if (status == 'timeout') {
          ajaxTimeOut.abort(); //取消请求                     
        }
      }
    });
  };


  // 调用成语接口，获取成语
  initPhraseConfig = () => {
    // 获取level1的成语
    $.ajax({
      type: 'POST',
      url: interfaceUrl2 + '/pythe-auto-task/rest/chengyu/query/level',
      data: JSON.stringify({
        level: 1,
      }),
      dataType: "json",
      contentType: "application/json",
      timeout: 5000,
      success: function(res) {
        PHRASEARRAYLEAVEL1 = res.data;

        // 获取level2的成语
        $.ajax({
          type: 'POST',
          url: interfaceUrl2 + '/pythe-auto-task/rest/chengyu/query/level',
          data: JSON.stringify({
            level: 2
          }),
          dataType: "json",
          contentType: "application/json",
          timeout: 5000,
          success: function(res) {
            PHRASEARRAYLEAVEL2 = res.data;
            // 初始化成语数组
            phraseNode.forEach(node => phrases.push(new Phrase({
              $node: $(node)
            })))

            phrases.forEach(phrase => phrase.init())

          },

          error: function(err) {
            $('.warm-tip').text(JSON.stringify(err));
            $('.test').text('发生错误');

          },

          complete: function() {
            if (status == 'timeout') {
              ajaxTimeOut.abort(); //取消请求                             
              $('.warm-tip').text('网络状态不好');
            }

          }
        });

      },

      error: function(err) {
        $('.warm-tip').text(JSON.stringify(err));
        $('.test').text('发生错误');

      },

      complete: function() {
        if (status == 'timeout') {
          ajaxTimeOut.abort(); //取消请求                             
          $('.warm-tip').text('网络状态不好');
        }

      }
    });


  }



  // 初始化游戏
  initGameConfig = () => {

    initWXConfig();
    initPhraseConfig();
    // 绑定游戏开始按钮
    $(begin).click(() => {
      console.log('click')
      // 加载资源，如图片资源
      var imgs = $('img');
      var sum = 0;
      console.log(imgs);
      imgs.each(img => {
        var img = $(img);
        console.log(img);
        img.load(() => console.log(sum++))
      })
    })


    // 提示按钮点击事件
    $('.tip-button').click(() => {
      // 判断剩余提示次数，如果小于1，说明没有提示机会了，
      if (tipCount < 1) {
        alert('提示次数不够');
        return;
      }
      $('.tip-container').css('visibility', 'visible');
      // 停止动画 
      phrases.forEach((item, index) => {

        // 停止动画
        cancelAnimationFrame(item.animation)
        // 将当前画面中的成语显示出来
        if (parseInt(item.$node.css('top')) > 0) {
          // 设置radio值
          var label = $(tipPhrases[index]);
          label.toggleClass('show');
          label.append(item.phrase.word)
          // console.log( $('.tip-container .tip-phrase')[index])
          // $('.tip-container .tip-phrase')[index].value(index);
          console.log(index);
        }
      });
    });


    $('.tip-confirm').click(() => {
      // 判断剩余提示次数，如果小于1，说明没有提示机会了，
      if (tipCount < 1) {
        alert('提示次数不够');
      }
      // 选择一个成语
      if (!$("input[name='tip']:checked").length) {
        alert('请选择一个要提示的成语');
        return
      }

      var index = $("input[name='tip']:checked").attr('index');
      var tipContent = phrases[index].phrase.pinyin;
      tipCount--;
      $('.tip-content').val(tipContent)
      console.log(tipContent)


    })


    $('.return-game').click(() => {
      $('.tip-container').css('visibility', 'hidden');
      // 重新启动动画
      phrases.forEach(item => {
        console.dir(item);
        item.animation = requestAnimationFrame(item.fall.bind(item))
      })
    })

  }

  initGameConfig();

  // initGameConfig();

  class Phrase {

    constructor(props) {
      this.$node = props.$node;
      this.animation = null;
      this.phrase = null;
      this.timeStart = '';
      this.timeEnd = '';
      // 绑定对应的事件函数，只能绑定一次
      this.$node.on({
        touchstart: this.onTouchStart.bind(this),
        touchend: this.onTouchEnd.bind(this),
        touchCancel: this.onTouchCancel.bind(this)

      })

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
      phraseNum++;
      let phraseArray = phraseNum % 10 == 0 ? PHRASEARRAYLEAVEL2 : PHRASEARRAYLEAVEL1;
      // 设置游戏进度条
      $('.life-progress img').css('width', phraseNum/phraseTotal*100 + '%');
      // 获取页面的宽度和高度
      let gameWidth = $('.game').width() - PHRASEWIDTH;
      // console.log($('.game').width());
      // 随机生成成语对象
      this.phrase = phraseArray[parseInt(Math.random() * phraseArray.length)];
      // 随机生成的文本
      let text = this.phrase.word;
      // 随机设置左边距
      let left = parseInt(Math.random() * gameWidth);
      // 随机设置上边距
      let top = parseInt(Math.random() * Math.random() * -600)
      // 如果是第一个成语，直接落下
      phraseNum === 1 && (top = 92)
      var bg = phraseBg[parseInt(Math.random() * 4) % phraseBg.length]
      console.log(bg);
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

      if (this.ifBootom()) {
        // 重新设置新的成语
        cancelAnimationFrame(this.animation);
        // 生命值减1
        var curLife = parseInt(life.text());
        if(curLife === 1){
          life.text('游戏失败');
          return;
        }
        life.text(curLife - 1);
        this.init()
        return
      }

      // 通过offset来设置其高度，可以更加精确
      let top = this.$node.offset().top;
      // 0.3为其每次下落的高度
      this.$node.offset({
        top: top + 0.3
        // top: top + 3
      })

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
      if (this.$node.offset().top + parseInt(this.$node.height()) >= $(game).offset().top + 92 + parseInt($(game).height())) {
        // this.animation = null
        return true;
      }
      return false;
    }

    onStartRecord(event) {

      var self = this;

      event.preventDefault();
      // 停止动画
      cancelAnimationFrame(self.animation);
      // 生成屏障
      // var barrier = $(document.createElement('span'));
      // barrier.addClass('barrier');
      // $(event.target).parent().toggleClass('barrier');
      // 修改父元素的位置
      // $('.phrase-barrier').addClass('barrier');
      // $('.phrase-barrier').css({
      //   'left': $(event.target).css('left'),
      //   'top': $(event.target).css('top')
      // })
      var id = $(event.target).prop('id');
      $(event.target).append(`<style>#${id}::before{display: block}</style>`);
      // 开始录音
      wx.startRecord({
        success: function(res) {
          $('.warm-tip').text('调起录音成功，录音了...');

        },
        fail: function(err) {
          $('.test').text('调起录音失败');
          $('.warm-tip').text(JSON.stringify(err));
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

      event.preventDefault();
      const self = this;
      // this.$node.toggleClass('barrier');
      // alert('end');
      // 用于标记是否说对
      var result = false;
      // 生成结束时间戳
      this.timeEnd = new Date().getTime();
      // 如果按住时间不够200ms，则不录音
      var during = this.timeEnd - this.timeStart;
      $('.test').text(during);
      if (during < 200) {
        return;
      }

      // 暂停录音
      wx.stopRecord({

        // 上传成功时
        success: function(res) {
          $('.test').text('停止录音');

          var localId = res.localId;
          $('.warm-tip').text('录音结束，发送中...');
          // 上传录音
          wx.uploadVoice({

            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示，0，不显示进度
            success: function(res) {
              // 返回音频的服务器端ID
              var serverId = res.serverId;
              // 上传成功后进行音频校对  
              $.ajax({
                type: 'POST',
                url: interfaceUrl2 + '/pythe-auto-task/rest/audio/iat',
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
                      // 说对了
                      $('.warm-tip').text("好棒！读音正确！" + JSON.stringify(res));
                      // 分数+1
                      var curScore = parseInt(score.text())
                      score.text(curScore + 1)
                      // 重新设置成语
                      self.init()
                    } else {
                      // 恢复动画
                      self.animation = requestAnimationFrame(self.fall.bind(self));
                      var id = $(event.target).prop('id');
                      $(event.target).append(`<style>#${id}::before{display: none}</style>`);
                      // 修改指示牌上的文字
                      $(event.target).append(`<style>#${id}::after{content: '读音有误'}</style>`);
                      setTimeout(() => $(event.target).append(`<style>#${id}::after{content: '按住念词'}</style>`), 1000);
                      $('.warm-tip').text("读错了哟！仍需加油！" + JSON.stringify(res));
                    }
                  } else {
                    // 恢复动画
                    self.animation = requestAnimationFrame(self.fall.bind(self));
                    var id = $(event.target).prop('id');
                    $(event.target).append(`<style>#${id}::before{display: none}</style>`);
                    // self.$node.css({ 
                    //   'left': self.$node.parent().css('left'),
                    //   'top': self.$node.parent().css('top') })
                    $('.warm-tip').text(JSON.stringify(res));

                  }


                },

                error: function(err) {
                  // 恢复动画
                  self.animation = requestAnimationFrame(self.fall.bind(self));
                  var id = $(event.target).prop('id');
                  $(event.target).append(`<style>#${id}::before{display: none}</style>`);
                  // self.$node.css({ 
                  //     'left': self.$node.parent().css('left'),
                  //     'top': self.$node.parent().css('top') })
                  $('.warm-tip').text(JSON.stringify(err));
                  $('.test').text('发生错误');

                },

                complete: function() {
                  // 恢复动画
                  // self.animation = requestAnimationFrame(self.fall.bind(self));
                  if (status == 'timeout') {
                    ajaxTimeOut.abort(); //取消请求                             
                    $('.warm-tip').text('网络状态不好');
                  }

                }
              });
            },

            fail: function(err) {
              // 恢复动画
              self.animation = requestAnimationFrame(self.fall.bind(self));
              var id = $(event.target).prop('id');
              $(event.target).append(`<style>#${id}::before{display: none}</style>`);
              // self.$node.css({ 
              //         'left': self.$node.parent().css('left'),
              //         'top': self.$node.parent().css('top') })
              $('.warm-tip').text(JSON.stringify(err));
            }
          })
        },
        fail: function(err) {
          // 恢复动画
          self.animation = requestAnimationFrame(self.fall.bind(self));
          var id = $(event.target).prop('id');
          $(event.target).append(`<style>#${id}::before{display: none}</style>`);
          $('.test').text('操作有点快，请重新说话');
        },
        complete: () => {

        }

      });

    }

    onTouchCancel() {
      $('.warm-tip').text('录音中断，请重新开始');
      wx.stopRecord({
        success: function(res) {
          $('.warm-tip').text('录音中断，请重新开始');
        }
      })
    }

  }

}

playing();