var token = "MTI2NDk3OjE1ODQ3NzUyNTUwNzU6M2NiZmY3NjIwM2IzZGQzOTU4NWM2NzA2YzUwOWFkMjk";
var userType = "儿童";

// if(!window.localStorage){
// 	alert("您的浏览器版本不兼容本网站，请升级版本或者更换其他浏览器");
// }else{
// 	var storage=window.localStorage;
// 	token = storage.token;
// 	userType = storage.userType;
// }

var storage = window.localStorage;
storage.setItem("token",'MTI2NDk3OjE1ODQ3NzUyNTUwNzU6M2NiZmY3NjIwM2IzZGQzOTU4NWM2NzA2YzUwOWFkMjk=');
storage.setItem('userType', '儿童')
storage.setItem('user', 'PYxj2MTgH3x+JoZYPfBQZKNtotB/S7VzeEBEv5TdmVBMURj4scDg/2CX5rphg8BIZbgcCPmh1bxfLyLuR1gKXjzd0eGjP1y3FGAvgsIWvzcWUuXuY3pisE65BSG+PfYUIqnOm67IgSEzWXHjylsNjD4iGb5uvphX9hXa3MqwZ7GJzseBLKXMn99+KtrWUAt8GDFTs5DVtbqziio2j38O0ic8kluPWazAidrbGmReVPQbVU8J3ACMtct8jEL4HmpRt9PRNHO3i1XZnfOCAIRUjSSSqWDczGjRdw/dfUeUGVMgM9isgiWJ01Q0SedeuPvbwnVcrFSUHI9nQomM8Kd81GBDvfmeea+O4uY910ZSWJ96aFoxocpwodktp4/X8xGJUJZSN/MD1mxSOAY7u6ErvHFU48/XMInwHiXGPCFz4lQGXhu4vfJ00SDzF/MeSRdKAa9clwbW8ERFdMDzb0TqDcuB7YEz7TF4fGOXZ0AEKUMETpW0C3YeyW56aSwyfgDjSAV0kEI3f37bHQG6jisLjYY+5VsY8uEYjBi/IUYkyu4/xlgPjzziJq0paic1wQEeZvRbgsv4l6KahmvGsVlmclz2bJjz+x4fCxpMqBQmserbAX+xweMXFc0CIlrlYKb/iUNu9jpM2FPPHhQMJwJPOU6C2broJd80JhFocd5L7ig1Yy1bRO48hDAj87taTZhjFXDg2oDxhOZi8FARN+iQ5F5bPsTpDY1fcAX2pbYdIff6/XUXSd4W3TKshSwKTUUnmEyCBquGzPqKW4yo6jr3m2l0lMka8adebx4Vx/9G8L3ZbSUC8bw1md/dtABsKBLDyq4AI5xzR8KEnXU6yr3rDOgAPfqzNrmxjSt8uFeC37n1Pp+8lfmEXVOng95tUL9Qf88Jp2VKPpYPoWR+3w9LZ/0uSzX3AeEvhDpKaAXlLQiED18I5gTaZQs09NMDRdmuzqBlkitIi+rSrQ3FtjSIf4WAxCSWnlhRgxjD5uSwz8P9iITYPsGMiq8XeKyo597K6y7wnp+Yk24jyA0/uZ0ilc7aKltC3jZsBeai0vaFZwZdIxzavxSWuOypRsyeiaTA1vr/eObAxz6I5R6K9WVHXYuk1TmQ1rjj5i8Vcx76SAS3WEE7rxmf5XmYWKxe0L7+ig/pZYqsJ8Eo85tcCfWwapRu//QxlEHYNYhp8zpb9b53npfrAvMAMgCz4NT3JwDeqgDNCA1YQkPrVYn2sQvokZ7wGVXcoQTwmT0yX8Mcc0u84e6jOcVYE6hgBLsKpwrndXQtnJ/ut/Ss15BwXmQInsbiZmCN14ui8YSNRkOD4yg2fH6Ux1LYsaLHsDzMjSOB')

console.log("token? = "+storage.token+" userType="+storage.userType);

/**
 * 退出登录
 * @returns
 */
function logout(){
	 getDataFromService("/login/logout","POST","",function(res){
		 if(res.code !=1 ){
            layer.msg(res.msg);
         }else{
        	var storage=window.localStorage;
        		storage.removeItem("UID");
        		storage.removeItem("user");
        		storage.removeItem("token");
        		storage.removeItem("userType");
        		window.location.href = "/login.html";//跳转到登录页面
         }
	   });
}
/**
 * 显示用户信息
 * @param user
 * @returns
 */
function showUserInfo(user){
	//console.log(user);
	if(user.accountState == 0){
			if(isEmpty(user.logoName)){
				$(".logo").html('<img src="/images/logo2.png" alt="影楼采购网" style="    cursor: pointer;" onclick="javascript:location.href=\'/index.html\'">');
			}else{
				$(".logo").html(user.logoName);
			}
			
			//console.log(user);
			$("#login").hide();
			$("#userImg").attr("src",user.headImageUrl);
			$("#userImg").show();
			$("#nickname").text(user.nickName);
			if(user.preStore != null){
				$("#userPriceBalance").text(user.preStore.userPriceBalance);
			}
			
			var isShowuserPriceBalance = false;
			if(user.is_sub == 0){
				isShowuserPriceBalance = true;
			}else{
				 //登录子账号，判断是否有登录权限
				$.each(user.permission_list,function(i,permission){
					if(permission.identification == "user_prestore"){
						isShowuserPriceBalance = true;
						return false;
					}
				});
			}
			if(!isShowuserPriceBalance){
				$("#heardMoney").hide();
			}
			
			var levelNum = user.memberLevel;
			if(levelNum == 0){
				$("#levelNum").text("[普通用户]");
			}else if(levelNum == 6){
				$("#levelNum").text("[新手会员]");
			}else if(levelNum == 1){
				$("#levelNum").text("[铜牌会员]");
			}else if(levelNum == 2){
				$("#levelNum").text("[银牌合约会员]");
			}else if(levelNum == 3){
				$("#levelNum").text("[金牌合约会员]");
			}else if(levelNum == 4){
				$("#levelNum").text("[白金合约会员]");
			}else if(levelNum == 5){
				$("#levelNum").text("[钻石合约会员]");
			}else if(levelNum == 7){
				$("#levelNum").text("[皇冠合约会员]");
			}else if(levelNum == 8){
				$("#levelNum").text("[金冠合约会员]");
			}
		}
}
/**
 * ajax
 * @param type
 * @param data
 * @param callBack
 */
function dataFromService(ajaxUrl,type,data,callBack) {
	
    $.ajax({
        type: type,
        dataType: "json",
        //contentType:"application/json",
        url: ajaxUrl,
        headers: {
            'Authorization' : token
        },
        data:data,
        success:function (res) {
            callBack(res);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        	// console.log("异常错误："+textStatus);
        	// if(XMLHttpRequest.status ==401) {
        	// 	layer.closeAll();
        	// 	layer.msg("您无权限进行此操作，请联系您的上级负责人");
        	// }else if(XMLHttpRequest.status ==403) {
        	// 	location.href = "/login.html";
			// }
			callBack(res);
		}
    });
}
/**
 * ajax异步请求
 * @param type
 * @param data
 * @param callBack
 */
function getDataFromService(ajaxUrl,type,data,callBack) {
    $.ajax({
        type: type,
        dataType: "json",
        contentType:"application/json",
        url: ajaxUrl,
        headers: {
            'auth-token' : token
        },
        data:data,
        success:function (res) {
            callBack(res);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown, res){
        	console.log("异常错误："+textStatus);
        	// if(XMLHttpRequest.status ==401) {
        	// 	layer.closeAll();
        	// 	layer.msg("您无权限进行此操作，请联系您的上级负责人");
        	// }else if(XMLHttpRequest.status ==403) {
        	// 	location.href = "/login.html";
			// }//9
			callBack(res);
		}
    });
}
/**日期格式化*/
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**URL参数解析*/
var parseUrlHandler= function (url, isEncode) {
    var isEncode = isEncode || false, reg = /([^=&?]+)=([^=&?]+)/g, obj = {}, url = url;
    url.replace(reg, function () {
        var arg = arguments;
        obj[arg[1]] = isEncode ? decodeURIComponent(arg[2]) : arg[2];
    });
    return obj;
};
var HASH = parseUrlHandler(window.location.href, true);

var aseKey = "ajxycjpd854d74d1"     //秘钥必须为：8/16/32位

	
/**
 * 加密
 * @param message
 * @returns
 */
function getStringByAscEncrypt(message){
	var encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
	  mode: CryptoJS.mode.ECB,
	  padding: CryptoJS.pad.Pkcs7
	}).toString();
	return encrypt;
}
/**
 * 解密
 * @param message
 * @returns
 */
function getStringByAscDecrypt(message){
	var decrypt = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
	  mode: CryptoJS.mode.ECB,
	  padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8);
	return decrypt;
}

/***
 * 判断空字符串
 * @param obj
 * @returns
 */
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == "undefined" || obj == null || obj == ""){
        return true;
    }else if(obj.replace(/(^\s*)|(\s*$)/g, "").length ==0){
        return true;
    }else{
    	return false;
    }
}

/**
 * 判断是否是数字
 * @param input
 * @returns
 */
function isNumber(params){
	var reg = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 

	if(!reg.test(params)){
		return false;
	}
	return true;
}
/**
 * 获取Cookie
 * @param cookie_name
 * @returns
 */
function getCookie(cookie_name)
{
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度
  
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1)
    {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
        var cookie_end = allcookies.indexOf(";", cookie_pos);
  
        if (cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
  
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
    }
    return value;
}