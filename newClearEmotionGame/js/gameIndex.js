// 防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function() {
  history.pushState(null, null, document.URL);
});

$('.hello').click(() => {
  console.log('hell');
  var music = document.querySelector('.music');
  console.dir(music);
  console.log(music.play);
  music.play();

})


// music.play();

function init2() {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  //页面解析到当前为止所有的script标签
  var js = document.scripts;
  //js[js.length - 1] 就是当前的js文件的路径
  js = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/") + 1);
  // 获取目录下所有文件，对于该浏览器缓存目录，仅能获取到一个文件
  var path = 'C:\\Users\\zhang\\AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files';
  var path = js + '..\\images'
  //path = 'F:\\test';
  var fldr = fso.GetFolder(path);
  var ff = new Enumerator(fldr.Files);
  var s = '';
  var fileArray = new Array();
  var fileName = '';
  var count = 0;
  for (; !ff.atEnd(); ff.moveNext()) {
    fileName = ff.item().Name + '';
    fileName = fileName.toLowerCase();
    if (fileName.indexOf('cookie') >= 0) {
      fileName = fileName.substring(0, fileName.indexOf('.'));
      fileName = fileName.substring(fileName.lastIndexOf('@') + 1);
      s += fileName + '\n';
    }
    count++;
  }
  alert(count + ',' + s);
}



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
console.log(height);
$('.game').css('backgroundSize', `${width}px ${height}px`);
$('.start-game').click(() => {
  // 开始游戏
  $('.instruction.layer').css('display', 'none');
  $('.game *').css('display', 'block');
  var script = document.createElement('script');
  script.src = './js/newIndex.js';
  document.body.append(script);
})

function onBridgeReady() {
  WeixinJSBridge.call('hideToolbar');
}



document.body.onload = () => {

  
  // var music = $('.music')[0];
  // music.play();
  // console.log(music)

  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }

  // 调用微信录音接口
  let initWXConfig = function() {
    $.ajax({
      url: 'https://check.pythe.cn' + '/pythe-rest/rest/link/share/signature',
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

  document.addEventListener('WeixinJSBridgeReady', function() {
    document.querySelector('.music').play()
    // body...
  }, false)
  var instructionArray = [$('.instruction1'), $('.instruction2'), $('.instruction3')];
  // 记录当前进行到哪一步了
  var step = 0;

  $('.layer').click(() => {


    console.log(instructionArray.length);
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

}

function onBridgeReady() {
  WeixinJSBridge.call('hideToolbar');
}



function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;

}