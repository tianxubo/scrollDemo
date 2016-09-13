/**
 * Created by txb on 2015/10/13.
 */
$("body").on("touchmove", function (event) {event.preventDefault();});
//js自动定位当前位置信息
///var city,accessToken,openID;
$("#loadImg").show();
var h1;
var prizeNum = document.querySelector(".title-num");
var divArray = new Array();
var geolocation = new BMap.Geolocation();
var geoc = new BMap.Geocoder();
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
        var pt = r.point;
        geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            var city = addComp.city;
            var accessToken = GetQueryString("accessToken");
            var openID = GetQueryString("openID");
            localStorage.setItem("accessToken",accessToken);
            localStorage.setItem("openID",openID);
            localStorage.setItem("city",city);
            askBusinessList(accessToken,openID,city);
            //alert(addComp.city);
        });
    }
    else {
        alert('failed'+this.getStatus());
    }
},{enableHighAccuracy: true});
//ajax请求；
function askBusinessList(accessToken,openID,city){
    var URL = "data/data.json";
    //var param = "{'accessToken':'"+accessToken+"','openID':'"+openID+"','city':'"+city+"'}";
    $.ajax({
        type: "post",
        url: URL,
        //contentType: "application/json",
        data: {
            "actionName":"getBusiness",
            "accessToken":"sd",
            "openID":"sdf",
            "city":"sdf"
        },
        contentType: "application/x-www-form-urlencoded",
        async: true,
        timeout:3000,
        dataType : 'json',
        success: function(data) {
            var datas = eval(data);
            //alert(json);
            if(datas.sErrorCode == "0"){
                var j = datas.sErrorData.length;
                var json = datas.sErrorData;
                var h = "";
                prizeNum.innerHTML = "<span>1</span><span>/"+j+"</span>";
                divArray.length = j;
                var doc = document;
                for(var i = 0;i<j;i++){
                    divArray[i] = "img"+i;
                    h += "<div id='"+divArray[i]+"' style='display:none'>"+
                        "<div class='prize-message'>"+
                        "<div class='prize-name'>"+
                        "<p>"+json[i].sProductName+"</p>"+
                        "<p class='prize-num'>共"+json[i].iSum+"份</p>"+
                        "</div>"+
                        "<div class='prize-price'>"+
                        "<span>￥"+json[i].fPrice+"</span>"+
                        "</div>"+
                        "</div>"+
                        "<div class='prize-img'>"+
                        "<img src='"+json[i].imgOneImage+"'>"+
                        "</div>"+
                        "<div class='prize-busi'>"+
                        "<div class='busi-info'>"+
                        "<i class='busi-name'></i>"+
                        "<span>"+json[i].sBusinessName+"</span>"+
                        "</div>"+
                        "<div class='busi-info'>"+
                        "<i class='busi-add'></i>"+
                        "<span>"+json[i].sAddress+"</span>"+
                        "</div>"+
                        "</div>"+
                        "<div class='submit-button'>"+
                        "<div class='button'><a href='shake.html?sBusinessName="
                        +json[i].sBusinessName+"&sProductName="+json[i].sProductName+"&fPrice="+json[i].fPrice
                        +"&img="+json[i].imgOneImage+"&iSum="+json[i].iSum+"&iSendout="
                        +json[i].iSendout+"&dt="+json[i].dtEndDate+"&busiID="+json[i].sBusinessID
                        +"&productID="+json[i].sBusProID+"'>马上去摇</a></div></div></div>";
                }
                var cardBody =  doc.querySelector("#card-body");

                //alert(h);
                cardBody.innerHTML = h;
                $("#loadImg").hide();
                setWidthHei(divArray[0],"card1",0.8*width,_Height,3);
                setWidthHei(divArray[1],"card2",0.75*width,_Height,2);
                setWidthHei(divArray[2],"card3",0.7*width,_Height,1);
                k_touch(divArray,"x",0,j);
            }else{
                alert("不好意思，出错了~~~请返回重新点击“指定摇”获取新的链接吧");
            };
            //slideDownStep2();
            /* for(var i = 0;i<j;i++){
             } */
        },
        complete:function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                alert("网络状态不好诶~~");
            };
        },
        error: function(err) {
            errormessage = "错啦！";
        }
    });
    return false;
}
//获取参数；
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]); return null;
}
//第一步：下拉过程
var width = window.innerWidth,
    height = window.innerHeight,
//doc = document;
    root = document.getElementById("root");
root.style.fontSize = width/10 + "px";
var _Height = 0.68*height;
var _contextt;
_contextt = document.getElementById("contextt");
_contextt.style.width = width + "px";
_contextt.style.height = height + "px";
//setWidthHei(divArray[0],"card1",0.8*width,_Height,3);
//setWidthHei(divArray[1],"card2",0.75*width,_Height,2);
//setWidthHei(divArray[2],"card3",0.7*width,_Height,1);

function setWidthHei(id,cls,w,h,x){
    var doc = document;
    var ids = doc.getElementById(id);
    //ids.setAttribute("style","");
    ids.style.width = w + "px";
    ids.style.height = h + "px";
    ids.style.display = "block";
    ids.style.zIndex = x;
    ids.setAttribute("class",cls);
    //addClass(ids, cls);
}
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}
//第二步：下拉，然后松开，
function slideDownStep2(x,y,z,h1,h2,h3){
    var doc = document;
    var slideDown1 = doc.getElementById(x);
    var slideDown2 = doc.getElementById(y);
    var slideDown3 = doc.getElementById(z);
    slideDown1.innerHTML = h1;
    slideDown2.innerHTML = h2;
    slideDown3.innerHTML = h3;
}
//第四步：卡片轮播效果
function slideDownStep4(id,_rotate,_left,_bottom,w,h,isop){
    var doc = document;
    var slideDown1 = doc.getElementById(id);
    var style = slideDown1.style;
    var	_bottomdege = Math.atan(w/h),
        _line = w/Math.sin(_bottomdege);
    _finalline = _line*Math.sin(_rotate/360*Math.PI),
        _finaldege = (90-_rotate/2)/180*Math.PI-_bottomdege;
    //var _pidege = _finaldege/180*Math.PI;
    var myx = _left - Number(_finalline*Math.sin(_finaldege)),
        myy = _bottom - Number(_finalline*Math.cos(_finaldege));
    style.transform = "rotate(-"+_rotate+"deg)";
    style.webkitTransform = "rotate(-"+_rotate+"deg)";
    style.left =myx + "px";
    style.bottom = myy + "px";
    if(isop){
        style.opacity = 5/_rotate;
    }
    //slideDownStep1(x + "<br>" + Math.sin(Math.PI/6) +"<b r>"+ddd + "<br>" + bbb);
};
//滑动刷新调用
//contentId表示对其进行事件绑定，way==>x表示水平方向的操作，y表示竖直方向的操作
function k_touch(contentId,way,num,count){
    var doc = document;
    //slideDownStep1(num);
    var _start = 0,
        _end = 0,
        _content = doc.getElementById(contentId[num]);
    _content.addEventListener("touchstart",touchStart,false);
    _content.addEventListener("touchmove",touchMove,false);
    _content.addEventListener("touchend",touchEnd,false);
    function touchStart(event){
        //var touch = event.touches[0]; //这种获取也可以，但已不推荐使用

        var touch = event.targetTouches[0];
        if(way == "x"){
            _start = touch.screenX;
        }else{
            _start = touch.screenY;
        }
    }
    function touchMove(event){
        event.preventDefault();
        var touch = event.targetTouches[0];
        if(way == "x"){
            _end = (_start - touch.clientX);
            if(count-num >= 2 && _end>5){
                if(_end < 90){
                    $("#"+contentId[num]).css("-webkit-transition", "transform 0s");
                    $("#"+contentId[num+1]).css("-webkit-transition", "transform 0s");
                    slideDownStep4(contentId[num],_end/3, width/10, 120, 0.8*width, _Height,false);
                    if(count-num >= 2){
                        slideDownStep4(contentId[num+1],_end/7, 0.125*width, 126, 0.75*width, _Height,true);
                    }
                }
            }else if(count-num <= 2 && _end > 5){
            };
        }else{
            _end = (_start - touch.clientY);
            //下滑才执行操作
        };

    }
    function touchEnd(event){
        if(_end > 10){
            if(count-num >= 2){
                $("#"+contentId[num]).removeAttr("style");
                $("#"+contentId[1+num]).removeAttr("style");
                $("#"+contentId[2+num]).removeAttr("style");
                _content.style.zIndex = 1000;
                $("#"+contentId[num]).removeClass('animationShow').addClass('animationLeft').fadeOut();
                if(count-num > 3){
                    setWidthHei(contentId[1+num],"card1",0.8*width,_Height,3);
                    setWidthHei(contentId[2+num],"card2",0.75*width,_Height,2);
                    setWidthHei(contentId[3+num],"card3",0.7*width,_Height,1);
                    //nextArray(num,count);
                }else if(count-num == 3){
                    setWidthHei(contentId[1+num],"card1",0.8*width,_Height,3);
                    setWidthHei(contentId[2+num],"card2",0.75*width,_Height,2);
                }else if(count-num == 2){
                    setWidthHei(contentId[1+num],"card1",0.8*width,_Height,3);
                    //nextArray(num,count);
                }
                prizeNum.innerHTML = "<span>"+(num+2)+"</span><span>/"+count+"</span>";
                nextArray(num,count);
            }
        }else if(_end < -10){
            if(num > 0 && num < count-1){
                setWidthHei(contentId[num-1],"card1",0.8*width,_Height,3);
                setWidthHei(contentId[num],"card2",0.75*width,_Height,2);
                setWidthHei(contentId[1+num],"card3",0.7*width,_Height,1);
                prizeNum.innerHTML = "<span>"+num+"</span><span>/"+count+"</span>";
                if(num+2<=count-1){
                    var last = document.getElementById(contentId[num+2]);
                    last.style.display = "none";
                }
            }else if(num == count-1){
                setWidthHei(contentId[num-1],"card1",0.8*width,_Height,3);
                setWidthHei(contentId[num],"card2",0.75*width,_Height,2);
                prizeNum.innerHTML = "<span>"+num+"</span><span>/"+count+"</span>";
            }
            $("#"+contentId[num-1]).removeClass('animationShow').addClass('animationShow').fadeIn();
        }

    };
}

//获取卡片数量
function nextArray(n,count){
    if( n<=count-2 ){
        n += 1;
        k_touch(divArray,"x",n,count);
    }
};
//client / clientY：// 触摸点相对于浏览器窗口viewport的位置
//pageX / pageY：// 触摸点相对于页面的位置
//screenX /screenY：// 触摸点相对于屏幕的位置
//identifier： // touch对象的unique ID