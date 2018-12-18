var interfaceUrl = 'https://check.pythe.cn';
var pytheInfoObj={
    setTime:2000,
    tips:'加载中'
};
var pytheLayOutObj={};
pytheLayOutObj.pytheLayOutFun=function(opt){
    opt=opt||pytheInfoObj ;
    var loaddingData=$("<div class='lay-out-key' id='lay-out-key' style='display:block'><div class='lay-center-flex'><div class='lay-centent-content'>"+opt.tips+"</div></div></div>");
    $('.lay-out-key').remove();
    $('body').append(loaddingData);
    setTimeout(function(){
        $('.lay-out-key').hide();
        $('.lay-out-key').remove();
    },opt.setTime);

};

// 获取URL中的参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    if (name === 'code') {
      return unescape(r[2]);
    }
    return unescape(r[2]);
  }
  return null;
}

function isNum(str) {
  var str = str.split('');
  return str.every((s) => {
    return !isNaN(s)
  })
}

function sendVerifyCode(phone) {
  $.ajax({
    url: interfaceUrl + '/pythe-rest/rest/message/verification/',
    type: 'POST',
    dataType: 'JSON',
    data: JSON.stringify({
      'mobile': phone
    }),
    timeout: 4000,
    contentType: 'application/json',
    success: function(res) {
      console.log('success')
      console.dir(res)
    },
    fail: function(res) {
      console.log('fail')
    }
  });
}

function isInfoOk() {

  var info = getInfo();
  console.log(info)
  return info.every(item => {
    return !!item.trim()
  })

}

function changeSubmitBtnOpacity() {
  if (isInfoOk()) {
    $('.submit').css('opacity', '1');
  } else {
    $('.submit').css('opacity', '0.5');
  }
}

function getInfo() {
  var info = [];
  var inputs = $('input[type=text]');

  for (var i = 0; i < inputs.length; i++) {
    var value = $(inputs[i]).val();
    info.push(value);
  }
  return info;
}

function setTip(set, text) {
  switch (set) {
    case true:
      $('.tip').text(text).css('display', 'block');
      $('.code').css('margin-bottom', '40px');
      break;
    case false:
      $('.tip').text('').css('display', 'none');
      $('.code').css('margin-bottom', '0px')
      break;

  }
}

function toDowmload() {

  var userAgentInfo = navigator.userAgent.toLowerCase();
  console.log(userAgentInfo)
  if (userAgentInfo.indexOf('android') > 0) {
    location.href = 'http://app.qq.com/#id=detail&appid=1106272259';
  } else if (userAgentInfo.indexOf('win') > 0) {
    //location.href='https://www.pythe.cn/pythe.apk' ;
    location.href = 'http://sj.qq.com/myapp/detail.htm?apkName=com.dace.textreader';

  } else if (/(iPhone|iPad|iPod|iOS|mac)/i.test(userAgentInfo)) {
    location.href = "https://itunes.apple.com/cn/app/%E6%B4%BE%E7%9F%A5%E9%98%85%E8%AF%BB/id1264419204?mt=8";

  } else {
    location.href = 'http://sj.qq.com/myapp/detail.htm?apkName=com.dace.textreader';
    //alert('ÔÝÎÞ'+userAgentInfo+'°æ');
  }

};

function copy(message) { 
  console.log('copy')
  var input = document.createElement("input");
  input.disabled = 'disabled';
  input.style = "opacity: 0;position: absolute";      
  input.value = message;      
  document.body.appendChild(input);      
  input.select();     
  input.setSelectionRange(0, input.value.length), document.execCommand('Copy');   
  $('.copy-tip').css('display', 'block');
  setTimeout(() => $('.copy-tip').css('display', 'none'), 2000)
  document.body.removeChild(input);      
  // $.toast("复制成功", "text");
}

window.onscroll = function() {
  var marginBot = 1;
  if (document.documentElement.scrollTop) {
    marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
  } else {
    marginBot = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
  }
  if (marginBot <= 0) {
    $('.down').css('display', 'none');
  } else {
    $('.down').css('display', 'block');
  }
}


window.onload = () => {
  var timer = null;
  var interval = 60;

  var share = getQueryString('share');
  var correctComUrl=document.URL;
  var correctComId={};
  var paramPart={};
  var shareVal;
  // 从url中获取传过来的作文id
  if(correctComUrl.indexOf('?')!=-1){
      correctComUrl=correctComUrl.split('?')[1];
      correctComUrl=correctComUrl.split('&');
      for(var i=0;i<correctComUrl.length;i++){
         correctComId[(correctComUrl[i].split('='))[0]]=(correctComUrl[i].split('=')[1]);
      }
      shareVal=correctComId.share;             
  };
  if (shareVal==0) {
    $('.download').css('display', 'none')
  }

 
  var clipboard = new Clipboard('.copy-btn');

  clipboard.on('success', function(e) {
    $('.copy-tip').css('display', 'block');
    setTimeout(() => $('.copy-tip').css('display', 'none'), 2000)
    document.body.removeChild(input);  
  });

  clipboard.on('error', function(e) {

  });



  // 点击报名
  $('.sign-up-btn').click(() => {
    // 获取URL中的参数
    var studentId = getQueryString('studentId');
    var taskId = getQueryString('taskId');
    
      // 发送报名数据
      // $.ajax({
      //   url: interfaceUrl + '/pythe-rest/rest/insert/prepare/speak/sign',
      //   type: 'POST',
      //   dataType: 'JSON',
      //   data: JSON.stringify({
      //     'taskId': taskId,
      //     'studentId': studentId
      //   }),
      //   timeout: 4000,
      //   contentType: 'application/json',
      //   success: function(res) {
      //     console.log('ok');
      //     // 显示弹窗
      //     $('.sign-up-ok-layer').css('display', 'flex');
      //   },
      //   fail: function(res) {
      //     console.log('fail')
      //   }
      // });
      window.location.href='userSignUP.html'
   
  })

  // 点击关闭
  $('.sign-up-ok-layer .close').click(() => {
    $('.sign-up-ok-layer').css('display', 'none');
  })

  // 点击机构合作
  $('.org-btn').click(() => {
    window.location.href = './org_data_info.html'
  })

  // 发送验证码
  $('.get-verify-code').click(() => {
    isInfoOk();
    if ($('.get-verify-code').css('opacity') !== '1') {
      return;
    }
    if (timer) {
      return;
    }
    console.log('可以')
    var phone = $('.phone').val();
    $.ajax({
      url: interfaceUrl + '/pythe-rest/rest/message/verification/',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        'mobile': phone
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        console.log(res)
        // 设置提示信息
        setTip(res.status !== 200, '验证码发送失败，请检查手机号码是否正确');

        // 成功发送验证码,设置倒计时60s后才可以再次发送
        interval = 60;
        if (res.status === 200) {
          // 设置倒计时60秒
          timer = setInterval(() => {
            $('.get-verify-code span').text(`( ${interval} )s`);
            if (interval === 0) {
              // 清除定时器
              clearInterval(timer);
              timer = null;
              $('.get-verify-code span').text('发送验证码');
            } else {
              interval--;
            }
          }, 1000)
        } else {
          $('.get-verify-code span').text('重新发送')
        }

      },
      fail: function(res) {
        console.log('fail')
      }
    });
    // console.log(value);
  })

  // 下载
  $('.download').click(() => {
    toDowmload()
  })

  $('.phone').on("input", function(e) {

    changeSubmitBtnOpacity();
    //获取input输入的值
    var value = e.target.value;
    $('.get-verify-code').css('opacity', '0.5')
    if (value.trim()) {
      // 如果全为数字
      if (isNum(value)) {
        $('.get-verify-code').css('opacity', '1')
      }
    } else {
      console.log('空')
    }
    console.log(e.target.value);
  });

  $('.name').on('input', changeSubmitBtnOpacity);
  $('.org').on('input', changeSubmitBtnOpacity);
  $('.verify-code').on('input', changeSubmitBtnOpacity);

  $('.submit').click((event) => {
    event.preventDefault();
    if ($('.submit').css('opacity') !== '1') {
      return;
    }
    var info = getInfo();
    $.ajax({
      url: interfaceUrl + '/pythe-rest/rest/org/activity/record',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify({
        'name': info[0],
        'phone': info[1],
        'verificationCode': info[2],
        'org': info[3]
      }),
      timeout: 4000,
      contentType: 'application/json',
      success: function(res) {
        if (res.status === 200) {
          window.location.href = './org_data_submit.html'
        } else if(res.status === 300){
          pytheLayOutObj.pytheLayOutFun({
            setTime:5000,
            tips:res.msg
          })              
        }else {
          setTip(true, '验证码错误')
        }
      },
      fail: function(res) {
        console.log('fail')
      }
    });
  })

}