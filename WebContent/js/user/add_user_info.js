var countdownCount = 60;
var countdownIndex;
var parentUserid = 0;
$(function(){
	 getDataFromService("/login/userInfo","GET","id="+HASH["id"],function(res){
     	if(res.code == 1){
     		var user = res.obj;
     		if(user.userPid == 125471){
     			parentUserid = 125471;
     		}else{
     			$("#parentUserid").val(user.userPid);
     		}
     	}else{
     		layer.msg(res.msg);
     	}
     });
	$(".btnAn").eq(0).click(function(){
		
		
		var realName = $("#realName").val();
		if(isEmpty(realName)){
			layer.msg("姓名不能为空");
			return;
		}
		
		var phone = $("#phone").val();
		console.log("发送验证码"+phone);
		
		if(isEmpty(phone)){
			layer.msg("手机号不能为空");
			return;
		}
		
		getDataFromService("/msm/sendMessage","GET","phone="+phone,function(result){
			console.log(result);
			if(result.code == 1){
				layer.msg("验证码发送成功");
				countdownCount = 60;
				$(".btnAn").eq(0).attr("disabled","disabled");
				$(".btnAn").eq(0).css("background","grey");
				$(".btnAn").eq(0).text("60s");
				countdownIndex = setInterval(countdown, 1000);
			}else{
				layer.msg(result.msg);
			}
		});
	});
	
	$(".btnAn").eq(1).click(function(){
		
		var realName = $("#realName").val();
		if(isEmpty(realName)){
			layer.msg("姓名不能为空");
			return;
		}
		//校验验证码是否正确
		var msmCode = $("#msmCode").val();
		if(isEmpty(msmCode)){
			layer.msg("验证码不能为空");
			return;
		}
		var phone = $("#phone").val();
		if(isEmpty(phone)){
			layer.msg("手机号不能为空");
			return;
		}
		
		var companyName = $("#companyName").val();
		if(isEmpty(companyName)){
			layer.msg("公司名不能为空");
			return;
		}
		var province = $("#prov").val();
		if(isEmpty(province)){
			layer.msg("省份不能为空");
			return;
		}
		province = $("#prov").find("option:selected").text();
		var city = $("#city").val();
		if(isEmpty(city)){
			layer.msg("城市不能为空");
			return;
		}
		city = $("#city").find("option:selected").text();
		
		var country = $("#country").val();
		if(isEmpty(country)){
			layer.msg("地区不能为空");
			return;
		}
		country = $("#country").find("option:selected").text();
		
		var address = $("#address").val();
		if(isEmpty(address)){
			layer.msg("详细地址不能为空");
			return;
		}
		if(isEmpty($("#parentUserid").val())){
			layer.msg("邀请码不能为空");
			return;
		}
		
		var type = '';
		$("input[name='myType']:checked").each(function(i,v){
			if(type != ''){
				type += "-";
			}
			type += $(v).val();
		});
		
		console.log(type);
		
		if(isEmpty(type)){
			layer.msg("类型最少选中一个");
			layer.closeAll();
			return;
		}
		layer.load();
		
		getDataFromService("/msm/checkMsm","GET","code="+msmCode+"&phone="+phone,function(result){
			//console.log(result);
			
			if(result.code == 1){
				console.log("验证码正确");
				
				var params = {};
				params.realName=realName;
				params.phone=phone;
				params.companyName=companyName;
				params.type=type;
				params.province = province;
				params.city = city;
				params.area = country;
				params.address = address;
				params.userPid = $("#parentUserid").val();
				
				params.id=HASH["id"];
				
				
				console.log(params);
				
				getDataFromService("/login/updateUser","POST",JSON.stringify(params),function(result){
					//console.log(result);
					layer.closeAll();
					if(result.code == 1){
						
						layer.open({
							  type: 1,
							  title:'提示',
							  btn:false,
							  closeBtn:0,
							  area: '30%', //宽高
							  content: '<div style="margin: 2% 5%;" class="loginD">'+
							  			'<div class="regist" style="font-size: 16px;line-height: 35px;padding: 15px;text-align: center;">'+
								  			'<p>您的注册信息已经提交成功！</p>'+
								  			'<p>等待人工审核通过，请确保您的手机畅通。</p>'+
								  			'<div class="btnD">'+
								  				'<button type="button" onclick="toIndex()" class="btnAn" style="line-height: 1.5rem;margin-top: .9rem;">返回首页</button>'+
								  			'</div>'+
							  			'</div>'+
							  		   '</div>'
							}
						);
						interval_index = setInterval(checkUserState, 1000);
					}else{
						layer.closeAll();
						layer.msg(result.msg);
					}
				});
			}else{
				layer.closeAll();
				layer.msg(result.msg);
			}
		});
		
	});
});
var times = 0;
var interval_index;

/**
 * 等待审核时，刷新用户状态
 * @returns
 */
function checkUserState(){
	getDataFromService("/login/state","GET","userid="+HASH["id"],function(result){
		//console.log(result);
		if(result.code == 1){
			
			var user = result.obj;
            
			if(user.accountState == 0){
				
				var storage=window.localStorage;
	            storage.token = result.msg;
	            storage.user=user;
				location.href = "index.html";
			}
			
		}else{
			times ++;
			$("#times").text((120-times)+"s");
			if(times >= 120){
				clearInterval(interval_index);
				
				
				layer.alert("二维码过期，请刷新页面",function(){
					layer.closeAll();
					location.href = location.href;
				},function(){console.log(2);});
				
			}
		}
		
	});
}

function toIndex(){
	location.href = "/login.html";
}

function countdown(){
	countdownCount -- ;
	$(".btnAn").eq(0).text(countdownCount+"s");
	if(countdownCount <= 0){
		clearInterval(countdownIndex);
		$(".btnAn").eq(0).removeAttr("disabled");
		$(".btnAn").eq(0).css("background","#2672d0");
		$(".btnAn").eq(0).text("重新获取验证");
	}
}