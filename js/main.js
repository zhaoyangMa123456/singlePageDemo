/**
 * Created by mzy on 2018/3/26.
 */
$(function () {
    var winHeight = $(window).height()
    var winWidth = $(window).width()
    var rate = winHeight / winWidth
    if (rate > 1.8) {
        $('.wrap').addClass('lgger')
    } else if (rate > 1.7778) {
        $('.wrap').addClass('lg')
    }
    console.log(rate);
    window.onload = function () {
        $("#dianliang").click(function () {
            click();
        });
        window.alert = function (name) {
            var iframe = document.createElement("IFRAME");
            iframe.style.display = "none";
            iframe.setAttribute("src", 'data:text/plain');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(name);
            iframe.parentNode.removeChild(iframe);
        }
        setTimeout(function () {
            $(".swiper-wrapper").css("height",winHeight);
            $(".swiper-slide").css("height",winHeight);
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                onSlideChangeEnd: function(swiper) {
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                    console.log(swiper);
                    console.log(swiper.activeIndex);
                    if (swiper.activeIndex === 7) {
                        console.log(111);
                        console.log($('#call'));
                        $('.page_08 .pic').addClass('active')
                    } else {
                        console.log(2);
                        $('.page_08 .pic').removeClass('active')
                    }
                },
                onInit: function(swiper) { //Swiper2.x的初始化是onFirstInit
                    swiperAnimateCache(swiper); //隐藏动画元素
                    setTimeout(function(){
                        swiperAnimate(swiper); //初始化完成开始动画
                    },100);
                }
            });
            $('#main').css('opacity', '1')
            $('.arrow_wl').css('top', winHeight-30)
            $('#loading').css('display', 'none')
        }, 80)
//获取当前点赞数量并且设置分享
        // $.ajax({
        //     url: getHost() + "/share/yearthumbs.do?type=0",
        //     type: "post",
        //     dataType: "json",
        //     success: function (res) {
        //         if (res.flag) {
        //             $("#spancount").html(res.thumbs);
        //             shareCount = res.thumbs;
        //             share();
        //         } else {
        //             alert(res.msg);
        //         }
        //     }
        // });
        /*****************************
         * 自动播放音乐
         */
        var bgAudio = new Audio();
        bgAudio.loadStatus = 'unload';
        bgAudio.loop = true;
        function loadAudio(audio, url, callback) {
            audio.src = url;
            audio.load();
            audio.addEventListener('canplay', function () {
                bgAudio.loadStatus = 'loaded';
                callback();
            });
            audio.addEventListener('loadstart', function () {
                bgAudio.loadStatus = 'loading';
            });
        }
        function playAudio() {
            if (bgAudio.loadStatus === 'unload') {
                loadAudio(bgAudio, 'media/bg.mp3', function () {
                    playAudio();
                });
                return 1;
            }

            bgAudio.play();
        }
        function stopAudio() {
            bgAudio.pause();
        }
        bgAudio.addEventListener('playing', function (e) {
            $('#music').addClass('play');
        });
        bgAudio.addEventListener('pause', function (e) {
            $('#music').removeClass('play');
        });

        $('body').one('touchstart', function () {
            playAudio();
            $('#music').on('touchstart', function (e) {
                console.log(22);
                if (bgAudio.paused) {
                    playAudio();
                    return 0;
                }
                console.log(111);
                stopAudio();
                return 1;
            });
        });

        var shareCount = 0;

        function getHost() {
            var js = "main.js";
            var scripts = document.getElementsByTagName("script");
            var path = "";
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if (src.indexOf(js) != -1) {
                    path = src;
                    break;
                }
            }
            var ss = path.split("/");
            ss.length = ss.length - 3;
            path = ss.join("/");
            return path;
        }


        function share() {
            $.ajax({
                url: getHost() + "/rzht_yk/jsapi_signature",
                data: {url: window.location.href},
                type: "post",
                dataType: "json",
                success: function (data) {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature, // 签名
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            'onMenuShareTimeline',       // 分享到朋友圈接口
                            'onMenuShareAppMessage',  //  分享到朋友接口
                            'onMenuShareQQ',         // 分享到QQ接口
                            'onMenuShareWeibo',      // 分享到微博接口
                            'onMenuShareQZone'         //分享到QQ空间
                        ]
                    });
                }
            });
            wx.error(function (res) {
                alert("接口处理失败" + JSON.stringify(res))
            });
            setWxParams();
        }

        function setWxParams() {
            var position = window.localStorage.getItem("mPosition");
            var title = position ? "我是第" + position + "位为易大宗打Call的人！" : "快来为易大宗打Call！";
            var params = {

                title: title,   // 分享标题
                link: window.location.href,  // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                desc: "已经有" + shareCount + "位为易大宗打Call的人", // 分享描述
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            };
            wx.ready(function () {
                wx.onMenuShareTimeline(params);
                wx.onMenuShareAppMessage(params);
                wx.onMenuShareQQ(params);
                wx.onMenuShareWeibo(params);
                wx.onMenuShareQZone(params);
            });
        }

        function click() {
            $.ajax({
                url: getHost() + "/share/yearthumbs.do?type=1",
                type: "post",
                dataType: "json",
                success: function (res) {
                    if (res.flag) {
                        window.localStorage.setItem("mPosition", res.thumbs);
                        alert("感谢您为易大宗打Call，您是第" + res.thumbs + "位为易大宗打Call的人");
                        setWxParams();
                        $("#spancount").html(res.thumbs);
                        shareCount = res.thumbs;
                    } else {
                        alert(res.msg);
                    }
                }
            });
        }
    }
})