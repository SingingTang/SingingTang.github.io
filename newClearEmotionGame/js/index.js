window.onload = function() {


    var begin = document.getElementById("begin");
    var score = document.getElementById("score");
    var against = document.getElementById("against");
    var game = document.getElementById("game");
    var PHRASE = [];
    // 存放Phrase类的数组
    var phrases = []
    var url = 'https://teacher.pythe.cn/pythe-auto-task/rest/chengyu/query/all'


    // 从返回数据中过过滤出成语数组并返回
    filterData = (dataArray) => dataArray.map((data) => data.word)

    // 通过ajax获取数据

    initConfig = () => {
        $.ajax({
            url: url,
            type: 'GET',

            success: function(res) {
                // 得到成语数组
                pHRASE = filterData(res.data)

                // 获取jquery元素
                var phrasesNodes = document.querySelectorAll('.phrase');
                // 生成相应的Phrase类
                phrasesNodes.forEach((node) => {
                    phrases.push(new Phrase({
                        $node: $(node)
                    }))
                })
                // 初始化每一个Phrase类
                phrases.map((phrase) => phrase.init())

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wx49e51570a28eef81', // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                    signature: res.data.signature,// 必填，签名
                    jsApiList: [
                            'startRecord',//判断当前客户端版本是否支持指定JS接口
                            'stopRecord',
                            'uploadVoice',
                            'downloadVoice',
                            'playVoice',
                            'onMenuShareQZone',
                            
                    ] // 必填，需要使用的JS接口列表
                 });    
            },

            error: function(err) {
                // $('.warm_tips').text(JSON.stringify(err))
            },

            complete: function(status) {
                // if (status == 'timeout') {
                //     ajaxTimeOut.abort(); //取消请求                     
                // }
            }
        });
    };
    initConfig();



}

class Phrase {

    constructor(props) {
        this.$node = props.$node;
        this.animation = null;
    }

    // 初始化成语的相关位置及文本信息
    init() {
        // 获取页面的宽度和高度
        let gameWidth = $('#game').width() - PHRASEWIDTH;
        // 随机生成的文本
        let text = PHRASE[parseInt(Math.random() * PHRASE.length)]
        // 随机设置左边距
        let left = parseInt(Math.random() * gameWidth);
        // 随机设置上边距
        let top = parseInt(Math.random() * Math.random() * -600)
        // 设置该节点的文本
        this.$node.text(text);
        // 设置该节点的位置信息
        this.$node.css({
            left: left + 'px',
            top: top + 'px'
        })
        $('.test').text('logging')
        this.$node.on({
            touchstart: this.onTouchStart,
            touchend: this.onTouchEnd
        })
        this.$node.mousedown(() => console.log('down'));
        this.$node.mouseup(() => this.onMouseUp())
        this.fall()
    }

    // 下落函数
    fall() {

        if (this.ifBootom()) {
            // 删除动画
            cancelAnimationFrame(this.animation);
            // 重新设置新的成语
            this.init()
            return
        }

        // 通过offset来设置其高度，可以更加精确
        let top = this.$node.offset().top;
        // 0.3为其每次下落的高度
        this.$node.offset({
            top: top + 0.3
        })
        // console.log(parseInt(this.$node.css('top')) )
        // 如果当前的top小于0，则隐藏
        if (parseInt(this.$node.css('top')) < 0) {
            this.$node.css('visibility', 'hidden')
        } else {
            this.$node.css('visibility', 'visible')
        }
        this.animation = requestAnimationFrame(this.fall.bind(this));
        // 下落时判断是否到底
    }

    ifBootom() {
        // 如果到底，则成语的offsetHeight+height应该等于容器的offsetHeight+height
        if (this.$node.offset().top + parseInt(this.$node.height()) >= $(game).offset().top + parseInt($(game).height())) {
            // this.animation = null
            return true;
        }
        return false;
    }

    test() {
        $('.start_record').on({
            // 按住开始录音
            touchstart: function(e) {
                e.preventDefault();
                wx.startRecord({
                    success: function(res) {
                        $('.warm_tips').text('调起录音成功，录音中...');
                    },
                    fail: function(err) {
                        $('.warm_tips').text(JSON.stringify(err));
                    }
                });
            },

            touchend: function() {
                // 暂停录音
                wx.stopRecord({
                    success: function(res) {
                        var localId = res.localId;
                        $('.warm_tips').text('录音结束，发送中...');
                        // 上传录音
                        wx.uploadVoice({
                            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function(res) {
                                var serverId = res.serverId; // 返回音频的服务器端ID  
                                // 上传成功后进行音频校对                
                                $.ajax({
                                    type: 'POST',
                                    url: interfaceUrl2 + '/pythe-auto-task/rest/audio/iat',
                                    data: JSON.stringify({
                                        mediaId: serverId,
                                        wordId: keyWordId,
                                        word: keyWordTxt
                                    }),
                                    dataType: "json",
                                    contentType: "application/json",
                                    timeout: 5000,
                                    beforeSend: function() {
                                        $('.warm_tips').text('录音上传中...,请耐心等候');
                                    },
                                    success: function(res) {
                                        if (null != res) {
                                            if (res.status == 200) {
                                                $('.warm_tips').text("好棒！读音正确！" + JSON.stringify(res));
                                            } else {
                                                $('.warm_tips').text("读错了哟！仍需加油！" + JSON.stringify(res));
                                            }
                                        } else {
                                            $('.warm_tips').text(JSON.stringify(res));
                                        }


                                    },

                                    error: function(err) {
                                        $('.warm_tips').text(JSON.stringify(err));

                                    },

                                    complete: function() {
                                        // $('.warm_tips').text('提交完成');
                                        if (status == 'timeout') {
                                            ajaxTimeOut.abort(); //取消请求                             
                                            $('.warm_tips').text('网络状态不好');
                                        }
                                    }
                                });
                            },

                            fail: function(err) {
                                $('.warm_tips').text('未检测到声源')
                            }
                        })
                    },

                    fail: function(err) {
                        $('.warm_tips').text(JSON.stringify(err))
                    }

                });
            },

            touchCancel: function() {
                $('.warm_tips').text('录音中断，请重新开始');
                wx.stopRecord({
                    success: function(res) {
                        $('.warm_tips').text('录音中断，请重新开始');
                    }
                })
            }
        });
    }

    onTouchStart(event) {
        event.preventDefault();
        $('.test').text('touchstart')
        cancelAnimationFrame(this.animation);
        wx.startRecord({
            success: function(res) {
                $('.warm-tip').text('调起录音成功，录音中...');
            },
            fail: function(err) {
                $('.warm-tip').text(JSON.stringify(err));
            }
        });
        $('.test').text('start_record')
        
    }

    onTouchEnd () {
        // $('.warm-tip').text('end')
        this.animation = requestAnimationFrame(this.fall.bind(this));

    }

    onMouseUp() {
        this.animation = requestAnimationFrame(this.fall.bind(this));
    }
}