var ananaSdk = {
    location:'',
    adTag:'',
    adCb:null,
    getMoreGame: function ()
    {
        if (this.location == 'CN')
        {
            return "http://t.cn/RmLINnp";
        }
        else
        {
            return 'http://www.oopsfun.com';
        }
    },
    init:function(callback, errCallback, timeCallback)
    {
        ajaxGet('http://www.guolaiwanba.com/login/ad/ipGet.php', '', function (data) {
                var result = JSON.parse(data);
                var game = hotGames[result['country']];
                ananaSdk.location = result['country'];
                if (callback)
                    callback();
            },
            errCallback,
            timeCallback
            );
    },
    bottomAdStart: function()
    {
        adStart();
    },
    requestAFGAds: function(tag,cb)
    {
        this.adTag = tag;
        this.adCb = cb;
        h5gameRequestAds();
    },
    prepareAFGAds: function()
    {
        h5gameAd();
    }
};

function ajaxLoad(para) {
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    request.onreadystatechange = ajaxOnFocusResult;
    request.ontimeout = ajaxOntimeout;
    //request.onerror = ajaxOnerror;
    if (para['type'] == 'POST')
    {
        request.open("POST", para['url']);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 2000;
        request.send(para['data']);
    }
    else if (para['type'] == 'GET')
    {
        var url = para['url'];
        if (para['data'])
            url = genRequestUrl(url, para['data']);
        request.open('GET', url)
        request.timeout = 2000;
        request.send(null);
    }

    function ajaxOnFocusResult(evt) {
        if (evt.currentTarget.readyState == 4) {
            if ( evt.currentTarget.status == 200)
                para['success'](evt.currentTarget.responseText);
            else
            {
                if (para['error'])
                    para['error'](evt.currentTarget.statusText);
            }
        }
        // else
        // {
        //     console.log('error', request.statusText);
        //     if (para['error'])
        //         para['error'](request.statusText);
        // }
    }

    function  ajaxOntimeout(e) {
        if (para['timeout'])
            para['timeout']();
    }

    function  ajaxOnerror(e) {
        if (para['error'])
            para['error'](e.statusText);
    }
}

function genRequestUrl(url, queryParams) {
    if (url.indexOf('?') != -1)
        url += '?';
    var idx = 0;
    for (var key in queryParams) {
        var val = queryParams[key];
        if (idx !== 0) {
            url += '&';
        }
        if (val === undefined || val === null) {
            val = '';
        }
        url += key + '=' + val;
        idx++;
    }
    return url;
}

function ajaxGet(uri, para, success, error, timeout) {
    ajaxLoad({type:'GET', url: uri, data:para, success:success, error:error, timeout:timeout});
}

function  ajaxPost(uri, para, success, error, timeout) {
    ajaxLoad({type:'POST', url: uri, data:para, success:success, error:error, timeout:timeout});
}

function requestAccess(argname) //获取get的值
{
    var url = window.location.href;
    var arrStr = url.substring(url.indexOf("?")+1).split("&");
    for(var i = 0; i< arrStr.length; i++)
    {
        var loc = arrStr[i].indexOf(argname + "=");
        if(loc != -1)
        {
            return arrStr[i].replace(argname + "=", "").replace("?", "");
        }
    }
    return "";
}

/**
 * Created by Administrator on 2018/9/1.
 */

function randFactor(games, title)
{
    var w = [];
    for (var i = 0; i < games.length; i++)
    {
        if (games[i].title != title)
            w.push({w:games[i].weigh, index: i});
    }

    var sum = 0;
    for (var i = 0; i < w.length; i++)
    {
        sum += w[i].w;
    }
    var choose = Math.floor(Math.random() * sum);
    var n = 0;
    for (var i = 0; i < w.length; i++)
    {
        var m = n;
        n += w[i].w;
        if (choose >= m && choose < n)
        {
            return w[i].index;
        }
    }
    return 0;
}

function blinklink(){
    var flashit=document.getElementById('showMoreGames');
    if(flashit.style.fontSize=='0.7rem'){ //ملاحظة: ما تحصل عليه هنا بتنسيق rgb
        flashit.style.fontSize='1rem';
    }else{
        flashit.style.fontSize='.7rem';
    }
    timer=setTimeout("blinklink()",200);
}

function stoptimer(){
    clearTimeout(timer);
}

var base_url='http://game.baifumeiba.com/login/';
var focus_qrcode_default= base_url + 'ad/qrcode_for_moregame_258.jpg';
var focus_title_default='أكثر إثارة ، يرجى الاطلاع على الحساب الرسمي,<br />';
var moreGameDisplay = false; //من المحتمل أن يتسبب هذا الافتتاح في سوء فهم المستخدم ويصبح دليلًا إلزاميًا للانتباه

var hotGames = {'CN': [
        
    ],
    'OTHER': [
       
    ],
    'NO_ADSENSE': [
	
    ]
};


function launch(hotGame) {

    window.setTimeout(function () {

        var template = '<div id="gotoPlay" style="margin:2px;">'
 	    + '<div align="center" style="font-size: 10px;color: dimgrey">advertisement</div>'
            + '<a id="bottomGo" target="_blank" href="{{link}}" style=" display: flex; background: #fff; padding: .6rem .75rem .3rem; font: 20px/1.5 Arial, Helvetica, sans-self, &quot;Microsoft YaHei&quot;; box-sizing: border-box; text-decoration: none;"> <div style="box-sizing: border-box;"> <img src="{{imageUrl}}" style=" width: 2.8rem; height: 2.8rem; border-radius: .25rem; "> </div> <div style=" margin-left: .5rem; line-height: 1; display: flex; flex-direction: column; color: #999; text-align: left; box-sizing: border-box; flex: 1; -webkit-box-orient: vertical; "> <p style=" font-size: .9rem; color: #333; box-sizing: border-box; margin: .5em 0; "><span>{{title}}</span></p> <p style=" font-size: .7rem; box-sizing: border-box; margin: .2em 0; ">{{description}}</p> </div> <span style="display: inline-block; font-size: 1rem; color: #1381f1; border: .05rem solid currentColor; white-space: nowrap; -o-border-radius: .15rem; -moz-border-radius: .15rem; -webkit-border-radius: .15rem; border-radius: .15rem; line-height: 1; padding: .3rem .45rem; margin: auto 0;" id="showMoreGames">更多游戏</span></a>'
            + '</div><div id="moreGameBox" class="mask show-box" style="display: none;"><div class="show-box-container"> <div class="box-head"></div><div class="box-body"><h1 id="focus_title">更多精彩,就在这里<br /> 亲٩(๑❛ᴗ❛๑)۶ 拜托你啦♪</h1><img id="focus_qrcode" src="' + base_url + 'ad/qrcode_for_moregame_258.jpg"/><p class="info">长按识别二维码</p> </div> </div> </div>'
            + '<style>'
            + '.mask { position: fixed; z-index: 9999; width: 100%; height: 100%; left: 0; top: 0; background: rgba(0, 0, 0, .8); }'
            + '.show-box .show-box-container { position: absolute; z-index: 10000; background: #fff; width: 80%; left: 50%; top: 50%; -o-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%); font-size: .7rem; text-align: center; max-width: 17rem; padding-bottom: .5rem; -webkit-animation: fadeInDown .3s linear; animation: fadeInDown .3s linear; -o-border-radius: .25rem; -moz-border-radius: .25rem; -webkit-border-radius: .25rem; border-radius: .25rem; }'
            + '.show-box .box-head { position: relative; padding: .4rem 0; margin-bottom: 1rem !important; height: 2rem; font-size: 1rem; color: #333; background-color: #3997EE; }'
            + '.show-box .box-body { color: #333; font-size: .8em; text-align: center; }'
            + '.show-box .box-body img { width: 60%; }'
            + '.show-box .box-body .info { color: #999; }'
            + '</style>';
        // var template = '<a id="bottomGo" href="{{link}}" style=" display: flex; background: #fff; padding: .6rem .75rem .3rem; font: 20px/1.5 Arial, Helvetica, sans-self, &quot;Microsoft YaHei&quot;; box-sizing: border-box; text-decoration: none;"> <div style="box-sizing: border-box;"> <img src="{{imageUrl}}" style=" width: 2.8rem; height: 2.8rem; border-radius: .25rem; "> </div> <div style=" margin-left: .5rem; line-height: 1; display: flex; flex-direction: column; color: #999; text-align: left; box-sizing: border-box; flex: 1; -webkit-box-orient: vertical; "> <p style=" font-size: .9rem; color: #333; box-sizing: border-box; margin: .5em 0; "><span>{{title}}</span></p> <p style=" font-size: .7rem; box-sizing: border-box; margin: .2em 0; ">{{description}}</p> </div> <span style="display: inline-block; font-size: 1rem; color: #1381f1; border: .05rem solid currentColor; white-space: nowrap; -o-border-radius: .15rem; -moz-border-radius: .15rem; -webkit-border-radius: .15rem; border-radius: .15rem; line-height: 1; padding: .3rem .45rem; margin: auto 0;" id="showMoreGames">更多游戏</span></a>';

        //var random = (new Date()).getMilliseconds() % hotGames.length;
        var random = randFactor(hotGame, document.title);
        var game = hotGame[random];

        if (game.title == 'google_adsense') {
            document.getElementById('ad').innerHTML = '<div align="center" style="margin:4px; font-size: 13px;color: dimgrey">advertisement</div>';
            (adsbygoogle = window.adsbygoogle || []).push({});
        } else {
            var html = template;

            for (var i in game) {
                if (game.hasOwnProperty(i)) {
                    html = html.replace('{{' + i + '}}', game[i]);
                }
            }

            document.getElementById('ad').innerHTML = html;

            var button = document.getElementById('showMoreGames');
            if (moreGameDisplay) {
                if (button.addEventListener) {
                    button.addEventListener('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        if (game.qrcode && game.more) {
                            if (game.qrcode_guide)
                                document.getElementById('focus_title').innerHTML = game.qrcode_guide;
                            document.getElementById('focus_qrcode').src = game.qrcode;
                        } else {
                            document.getElementById('focus_title').innerHTML = focus_title_default;
                            document.getElementById('focus_qrcode').src = focus_qrcode_default;
                        }

                        document.getElementById('moreGameBox').style.display = 'block';
                    });
                    document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
                        document.getElementById('moreGameBox').style.display = 'none';
                    });
                } else {
                    button.attachEvent('click', function (event) {
                        event = window.event || event;
                        event.cancelBubble = true;
                        event.returnValue = false;
                        if (game.qrcode && game.more) {
                            if (game.qrcode_guide)
                                document.getElementById('focus_title').innerHTML = game.qrcode_guide;
                            document.getElementById('focus_qrcode').src = game.qrcode;
                        } else {
                            document.getElementById('focus_title').innerHTML = focus_title_default;
                            document.getElementById('focus_qrcode').src = focus_qrcode_default;
                        }

                        document.getElementById('moreGameBox').style.display = 'block';
                    });
                    document.getElementsByTagName('body')[0].attachEvent('click', function (event) {
                        document.getElementById('moreGameBox').style.display = 'none';
                    });
                }

                if (game.qrcode) {
                    var aUrl = document.getElementById('bottomGo');
                    if (aUrl.addEventListener) {
                        aUrl.addEventListener('click', function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            if (game.qrcode_guide)
                                document.getElementById('focus_title').innerHTML = game.qrcode_guide;
                            document.getElementById('focus_qrcode').src = game.qrcode;
                            document.getElementById('moreGameBox').style.display = 'block';
                        });
                        document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
                            document.getElementById('moreGameBox').style.display = 'none';
                        });
                    } else {
                        aUrl.attachEvent('click', function (event) {
                            event = window.event || event;
                            event.cancelBubble = true;
                            event.returnValue = false;
                            if (game.qrcode_guide)
                                document.getElementById('focus_title').innerHTML = game.qrcode_guide;
                            document.getElementById('focus_qrcode').src = game.qrcode;
                            document.getElementById('moreGameBox').style.display = 'block';
                        });
                        document.getElementsByTagName('body')[0].attachEvent('click', function (event) {
                            document.getElementById('moreGameBox').style.display = 'none';
                        });
                    }
                }

            } else {
                button.style.display = 'none';
            }

            //blinklink();
        }

    }, 300);
    //window.onresize=autodivheight;
    //autodivheight();
};

function parseUrl(url) {
    var parse = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
    var result = {
        'schema': parse[2],
        'host': parse[3],
        'path': parse[4],
        'query': parse[5],
        'anchor': parse[6]
    };

    return result;
}

function adStart()
{
    var urlParams = parseUrl(window.location.href);
    var adsense_url = ['baifumeiba.com','guolaiwanba.cn'];
    var adsense_flag = 0;
    for (var i in adsense_url)
    {
        if (urlParams['host'].indexOf(adsense_url[i]) >= 0)
        {
            adsense_flag = 1;
            break;
        }
    }
    if (!adsense_flag)
    {
        var game = hotGames['NO_ADSENSE'];
        if (game) {
            launch(game);
        } else {
            launch(hotGames['OTHER']);
        }
        return;
    }

    if (ananaSdk.location == "")
    {
        ajaxGet('http://www.guolaiwanba.com/login/ad/ipGet.php', '', function (data) {
                var result = JSON.parse(data);
                var game = hotGames[result['country']];
                ananaSdk.location = result['country'];
                if (game) {
                    launch(game);
                } else {
                    launch(hotGames['OTHER']);
                }
            },
            null,
            function (e) {
                launch(hotGames['OTHER']);
            });
    }
    else
    {
        var game = hotGames[ananaSdk.location];
        if (game) {
            launch(game);
        } else {
            launch(hotGames['OTHER']);
        }
    }
}

var videoContent = {currentTime:0};
//videoContent = document.getElementById('contentElement');
var adDisplayContainer;
var adsLoader;
var adsManager;
var adsRequest;

function h5gameAd() {
    var adDisplayContainer =
        new google.ima.AdDisplayContainer(
            document.getElementById('adContainer'),
            videoContent);
//var adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'));
// Must be done as the result of a user action on mobile
    adDisplayContainer.initialize();

// Re-use this AdsLoader instance for the entire lifecycle of your page.
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

// Add event listeners
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

//<div id="adContainer" style="display:none; position: absolute;top:0px;left: 0px;width:100%;height:87%;z-index:999;"></div>


// An event listener to tell the SDK that our content video
// is completed so the SDK can play any post-roll ads.
//var contentEndedListener = function() {adsLoader.contentComplete();};
//videoContent.onended = contentEndedListener;

// Request video ads.
    adsRequest = new google.ima.AdsRequest();
//adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=skippablevideo_image&client=ca-games-pub-3932234672445376&description_url=http%3A%2F%2Fwww.fromgame.com&videoad_start_delay=0&hl=zh_CN&overlay=0';
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
    adsRequest.adTagUrl='https://googleads.g.doubleclick.net/pagead/ads?ad_type=skippablevideo_image&client=ca-games-pub-3599398066322967&description_url=http%3A%2F%2Fwww.oopsfun.com&videoad_start_delay=0&hl=en';
// Specify the linear and nonlinear slot sizes. This helps the SDK to
// select the correct creative if multiple are returned.
    //var height = document.body.clientHeight * 0.87;
    //var width = document.body.clientWidth;

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 400;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 400;
    //adsRequest.linearAdSlotWidth = width;
    //adsRequest.linearAdSlotHeight = height;
    //adsRequest.nonLinearAdSlotWidth = width;
    //adsRequest.nonLinearAdSlotHeight = height / 3;


// requestAds();
}

function onAdError(adErrorEvent) {
    console.log("adError");

    document.getElementById("adContainer").style.display = "none";

    // Handle the error logging and destroy the AdsManager
    console.log(adErrorEvent.getError());
    adsManager.destroy();
}

function h5gameRequestAds() {
	if (!adsLoader)
	{
		console.log('ads load fail');
		return;
	}
	document.getElementById("adContainer").style.display = "block";
    adsLoader.requestAds(adsRequest);
}


function onAdsManagerLoaded(adsManagerLoadedEvent) {
    console.log("ADLoad");

    // document.getElementById("adContainer").style.display = "block";
    // Get the ads manager.
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoContent);  // See API reference for contentPlayback

    // Add listeners to the required events.
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);

    // Listen to any additional events, if necessary.
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CLICK,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.SKIPPED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.START,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.USER_CLOSE,
        onAdEvent);

    var o = document.getElementById("adContainer");
    var h = o.offsetHeight; //高度
    var w = o.offsetWidth; //宽度
    try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(w, h, google.ima.ViewMode.FULLSCREEN);
        // Call start to show ads. Single video and overlay ads will
        // start at this time; this call will be ignored for ad rules, as ad rules
        // ads start when the adsManager is initialized.
        adsManager.start();
    } catch (adError) {

        // An error may be thrown if there was a problem with the VAST response.
        // Play content here, because we won't be getting an ad.
        // videoContent.play();
    }
}

function onContentPauseRequested() {
    // This function is where you should setup UI for showing ads (e.g.
    // display ad timer countdown, disable seeking, etc.)
    //videoContent.removeEventListener('ended', contentEndedListener);
    //videoContent.pause();
}

function onContentResumeRequested() {
     console.log("adResumeRequested");
    // videoContent.addEventListener('ended', contentEndedListener);
    // videoContent.play();
    document.getElementById("adContainer").style.display="none";
}

function onAdEvent(adEvent) {
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = adEvent.getAd();
    console.log(adEvent.type);
    if (!ananaSdk.adCb)
        return;
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to
            // determine whether the ad is a video ad or an overlay.
            ananaSdk.adCb(ananaSdk.adTag, "loaded");
            break;
        case google.ima.AdEvent.Type.STARTED:
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.
            ananaSdk.adCb(ananaSdk.adTag, "started");
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            ananaSdk.adCb(ananaSdk.adTag, "complete");
            break;
        case google.ima.AdEvent.Type.CLICK:
            ananaSdk.adCb(ananaSdk.adTag, "click");
            break;
        case google.ima.AdEvent.Type.SKIPPED:
            ananaSdk.adCb(ananaSdk.adTag, "skipped");
            break;
        case google.ima.AdEvent.Type.START:
            ananaSdk.adCb(ananaSdk.adTag, "start");
            break;
        case google.ima.AdEvent.Type.USER_CLOSE:
            ananaSdk.adCb(ananaSdk.adTag, "user_close");
    	    document.getElementById("adContainer").style.display="none";
            break;
    }
}

