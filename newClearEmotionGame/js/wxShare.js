﻿
// https://check.pythe.cn/newClearEmotionGame/clearEmotionGame.html
// 游戏链接
var publicUrlBefore = 'https://app.pythe.cn' + '/newClearEmotionGame';

var pageUrl = '';

function setWxShare() {

    $.ajax({
        url: interfaceUrl + '/pythe-rest/rest/link/share/signature',
        type: 'POST',
        dataType: 'JSON',
        data: JSON.stringify({
            "url": document.URL
        }),
        timeout: 4000,
        contentType: 'application/json',
        async: false,
        success: function(res) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx49e51570a28eef81', // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                signature: res.data.signature, // 必填，签名
                jsApiList: [
                    'checkJsApi', //判断当前客户端版本是否支持指定JS接口
                    'onMenuShareTimeline', //分享好友
                    'onMenuShareAppMessage',
                    'closeWindow' //分享好友


                ] // 必填，需要使用的JS接口列表
            });


        },

        error: function(err) {
            //alert(JSON.stringify(err))
        },

        complete: function(status) {
            if (status == 'timeout') {
                ajaxTimeOut.abort(); //取消请求

            }
        }
    });

};


function setWxShareInfo() {
    pageUrl = publicUrlBefore + '/clearEmotionGame.html';
    wx.ready(function() {
        var wxShareInfo = {
            title: '挑战万词王', // 分享标题
            desc: '万词王即将输出一波成语攻击，让我们一起来对抗他吧！', // 分享描述
            link: pageUrl,
            imgUrl: publicUrlBefore + '/images/icon_xman.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function(res) {
                // alert(JSON.stringify(res))
            }
        }
        wx.onMenuShareTimeline(wxShareInfo);

        wx.onMenuShareAppMessage(wxShareInfo);

        wx.onMenuShareQQ(wxShareInfo);

        wx.onMenuShareWeibo(wxShareInfo);

        wx.onMenuShareQZone(wxShareInfo);

    });
};

function setPKShareInfo(wxWrite, dec) {
    // alert($.cookie('wxOpenId'))
    pageUrl = publicUrlBefore + '/pkChallengeShare.html?id=' + $.cookie('wxOpenId');
    wx.ready(function() {
        var wxShareInfo = {
            title: wxWrite, // 分享标题
            desc: dec, // 分享描述
            link: pageUrl,
            imgUrl: publicUrlBefore + '/images/icon_xman.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // alert('分享成功')
            }
        }
        wx.onMenuShareTimeline(wxShareInfo);

        wx.onMenuShareAppMessage(wxShareInfo);

        wx.onMenuShareQQ(wxShareInfo);

        wx.onMenuShareWeibo(wxShareInfo);

        wx.onMenuShareQZone(wxShareInfo);

    });
}