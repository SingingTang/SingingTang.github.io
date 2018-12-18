

var interfaceUrl='https://app.pythe.cn'; //获取微信用户
var interfaceUrl2='https://auto.pythe.cn'; //接口
// var interfaceUrl3 = 'https://check.pythe.cn'; //线上地址
// var publicImgUrl='https://check.pythe.cn:446';
// var publicImgUrl2='https://app.pythe.cn:446';
var pytheInfoObj={
    setTime:2000,
    tips:'加载中'
};
var pytheLayOutObj={};
pytheLayOutObj.pytheLayOutFun=function(opt){
    opt=opt||pytheInfoObj ;
    $('.turnToLogin').hide();
    $('.turnToLogin').remove();
    var loaddingData2=$("<div class='turnToLogin lay-centent-content'>"+opt.tips+"</div>");
    $('body').append(loaddingData2);
    setTimeout(function(){
        $('.turnToLogin').hide();
        $('.turnToLogin').remove();
    },opt.setTime);

};

function checkCookieWXopenId(){
    console.log($.cookie('wxOpenId'))
    if($.cookie('wxOpenId') == null || $.cookie('wxOpenId') =='undefined'){
        var documentUrlCode=encodeURI(document.URL);
          window.location.assign('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx49e51570a28eef81&redirect_uri='+documentUrlCode+'&response_type=code&scope=snsapi_userinfo&state=0');

          function handleUrl() {
              var acceptUrl=document.URL;              
              var validObt={},getCode;
              if(acceptUrl.indexOf('?')!=-1){
                  acceptUrl=acceptUrl.split('?')[1] ;
                  acceptUrl=acceptUrl.split('&');
                  for(var i=0;i<acceptUrl.length;i++){
                     validObt[acceptUrl[i].split("=")[0]]=(acceptUrl[i].split("=")[1]);
                  };

                  getCode=validObt.code;  //获取code
                  
                  getMainValue(getCode);  //获取用户信息
                      
              };

          }  ; 

          // 通过code获取用户基本资料
          function getMainValue(code){
            $.ajax({
              type: 'POST',
              url: interfaceUrl+'/pythe-rest/rest/public/openId',
              data: JSON.stringify({
                    code: code
              }),
              async:false,
              dataType:"json",
              contentType:"application/json",
              timeout:5000,
              success: function(res){                 
                 
                $.cookie('wxOpenId',res.openid,{expires:7});
                                                   
              },

              error:function(err){
                pytheLayOutObj.pytheLayOutFun({
                     setTime:3000,
                     tips:'未知错误，请稍后重试'
                })   
              },
              complete:function(status){
                if (status == 'timeout') {
                   ajaxTimeOut.abort(); //取消请求
                   pytheLayOutObj.pytheLayOutFun({
                     setTime:3000,
                     tips:'请求超时，请稍后重试'
                   })
                }
              }
            });
          };
          handleUrl();  
    }
};






