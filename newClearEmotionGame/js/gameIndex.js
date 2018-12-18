// 防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function() {
  history.pushState(null, null, document.URL);
});

$('.gameStartMusic')[0].play();

//页面解析到当前为止所有的script标签
var js = document.scripts;
//js[js.length - 1] 就是当前的js文件的路径
js = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/") + 1);
console.log(document.scripts)
console.log(js);

console.log('hello');


// 根据屏幕高度设置游戏区域的大小
var width = $('.game-bg').width();
var height = $('.game-bg').height() - 92 - 53;


$('.game').css('backgroundSize', `${width}px ${height}px`);


$('.start-game').click(() => {
  // 开始游戏
  $('.instruction.layer').css('display', 'none');
  $('.game *').css('display', 'block');
  var script = document.createElement('script');
  script.src = './js/newIndex.js';
  $('body').append(script);
  // $('.music')[0].play();
  
});


getQueryString('code');

// 调用微信录音接口
let initWXConfig = function() {
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
      console.log(res.data.timestamp)
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
}

initWXConfig();

// document.addEventListener('WeixinJSBridgeReady', function() {
//   document.querySelector('.music').play()
//   // body...
// }, false)
var instructionArray = [$('.instruction1'), $('.instruction2'), $('.instruction3')];
// 记录当前进行到哪一步了
var step = 0;

$('.layer').click(() => {


  // alert(instructionArray.length);
  // 隐藏当前提示图片
  instructionArray[0].css('display', 'none');

  instructionArray.shift();
  instructionArray[0].css('display', 'block');

  // 到达最后一步
  if (instructionArray.length === 1) {

    $('.layer').unbind('click');
    console.log('最后一步')

    return;
  }


})



function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    if (name === 'code') {
      var code = unescape(r[2]);
      return getMainValue(code);
    }
    return unescape(r[2]);
  }
  return null;
}

function getMainValue(code) {
  $.ajax({
    type: 'POST',
    url: CONFIG.interfaceUrl1 + '/pythe-rest/rest/public/openId',
    data: JSON.stringify({
      code: code
    }),
    async: false,
    dataType: "json",
    contentType: "application/json",
    timeout: 5000,
    success: function(res) {
      saveUserDetail(res.unionid, res.openid, res.nickname, res.headimgurl);
      $.cookie('wxOpenId', res.openid, {
        expires: 7
      });
      // }
    },

    error: function(err) {
      //alert('error')
      pytheLayOutObj.pytheLayOutFun({
        setTime: 3000,
        tips: '未知错误，请稍后重试'
      })
    },
    complete: function(status) {
      //alert('159')
      if (status == 'timeout') {
        ajaxTimeOut.abort(); //取消请求
        pytheLayOutObj.pytheLayOutFun({
          setTime: 3000,
          tips: '请求超时，请稍后重试'
        })
      }
    }
  });
};

var pytheInfoObj = {
  setTime: 2000,
  tips: '加载中'
};

var pytheLayOutObj = {};

pytheLayOutObj.pytheLayOutFun = function(opt) {
  opt = opt || pytheInfoObj;
  $('.turnToLogin').hide();
  $('.turnToLogin').remove();
  var loaddingData2 = $("<div class='turnToLogin lay-centent-content'>" + opt.tips + "</div>");
  $('body').append(loaddingData2);
  setTimeout(function() {
    $('.turnToLogin').hide();
    $('.turnToLogin').remove();
  }, opt.setTime);

};


// 上传用户个人资料
function saveUserDetail(uniId, opId, userName, userPhoto) {
  $.ajax({
    type: 'POST',
    url: CONFIG.interfaceUrl2 + '/pythe-auto-task/rest/participant/save',
    data: JSON.stringify({
      match: 'CHENGYU',
      wxUnionId: uniId,
      wxOpenId: opId,
      wxName: userName,
      wxAvatar: userPhoto
    }),
    async: false,
    dataType: "json",
    contentType: "application/json",
    timeout: 5000,
    success: function(res) {
      if (res.status == 200) {
        console.log('上传头像成功')
      } else {
        pytheLayOutObj.pytheLayOutFun({
          setTime: 3000,
          tips: '微信获取头像失败'
        })
      }
    },

    error: function(err) {
      pytheLayOutObj.pytheLayOutFun({
        setTime: 3000,
        tips: '微信获取头像失败'
      })
    },
    complete: function(status) {
      if (status == 'timeout') {
        ajaxTimeOut.abort(); //取消请求
        pytheLayOutObj.pytheLayOutFun({
          setTime: 3000,
          tips: '微信获取头像超时，请稍后重试'
        })
      }
    }
  });
};