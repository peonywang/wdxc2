var mySwiper = new Swiper('.swiper-container', {
	// 如果需要前进后退按钮
	navigation : {
		nextEl : '.swiper-button-next',
		prevEl : '.swiper-button-prev',
	},
	observer : true,
	observeParents : true,
});

//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

//自定义参数的属性
//宝丽放大：自定义尺寸（0.50*0.76m以内）
//丽捷放大：自定义尺寸（1.2*3m以内）
/*宝丽放大	12690
宝丽放大	24734
宝丽放大	24735
丽捷放大	24768
丽捷放大	24769*/
var allSize = {
	"24734":[{"width":"0.5", "height":"0.76"} ],
	"24735":[{"width":"0.5", "height":"0.76"} ],
	"24768":[{"width":"1.2", "height":"3"} ],
	"24769":[{"width":"1.2", "height":"3"} ]
}

/**
 * 选中的当前组合ID数组
 */
var attrValueIds = new Array();
/**
 * 选择的当前组合ID
 */
var groupID;
/**
 * 选择的当前组合价格
 */
var currentPrice = 0;

var buyTimes =1;

var productId,currentClassid;

var customMultiple = 1;

//价格默认不可见
var price_visible = false;
//是否VIP
var isVIP = false;
$(function() {
	$("#header").load('/pages/com/header.html?v=2020-02-26', function() {
		$("#header a[name=order]").addClass('act');
	});
	$("#footer").load('/pages/com/footer.html?v=2020-02-26');
	
	
	layer.load();
	productId = HASH['productId'];
	
	if(!isEmpty(productId)){
		
		getDataFromService("https://www.yl123.cn/product/getProduct","GET","id="+productId,function(res){
			
			//判断用户权限
			// if(localUser != undefined){
				
			// 	if(localUser.memberLevel != 0 && localUser.memberLevel != 6){
			// 		isVIP = true;
			// 	}
				
			// 	if(localUser.is_sub == 0){
			// 		price_visible = true;//主账号有所有权限
			// 	}else{
			// 		//登录子账号，判断是否满足权限显示价格
			// 		$.each(localUser.permission_list,function(i,permission){
			// 			if(permission.identification == "price_visible"){
			// 				price_visible = true;
			// 				return false;
			// 			}
			// 		});
			// 	}
			// }
			
			if(res.code == 1){
				currentClassid = res.obj.productClassid;
				
				if(currentClassid == 37){
					
					//获取样品额度数
					getDataFromService("/user/userInfo", "GET", "", function(res) {
						if(res.code == 1){
							$("#SampleNum").html(res.obj.sample_num);
						}
					});
					$("#sampleTiShi").show();
					$("#myProductTiShi").hide();
				}
				else if(currentClassid == 41){
					$("#myProductTiShi").show();
				}
				else{
					$("#myProductTiShi").hide();
					$("#sampleTiShi").hide();
				}
				
				$("#online_href").attr("href","/pages/order/online_order.html?classid="+currentClassid);
				
				getDataFromService("https://www.yl123.cn/productClass/getProductClass","GET","state=1&type=menu",function(res){
					
					if(res.code == 1){
						$("#orderMenu").html("");
						
						var _menu = '<div class="tit">产品类目</div>'+
									'<div class="menuD">';
						$.each(res.obj,function(index,classObj){
							_menu += '<a href="javascript:void(0);" id="class_'+classObj.id+'"  onclick="selectClass('+classObj.id+')">'+classObj.name+'</a>';
							if(currentClassid == classObj.id){
								$("#currentClassName").text(classObj.name);
							}
						});
						_menu += '<a href="javascript:void(0);"  id="class_0" onclick="selectClass(0)">我的收藏</a>';
						_menu += '</div>';
						
						$("#orderMenu").html(_menu);
						
						//选中样式
						$(".menuD a").each(function(){
							$(this).removeClass("act");
						});
						
						$("#class_"+currentClassid).addClass("act");
						
						layer.closeAll();
					}
				});
				showProductView(res.obj);
			}
		})
	}
	else{
		console.log("未获取到正确的产品ID参数！");
		return;
	}
	
	//备注
	$(document).on("keypress", "#remark", function (e) {
		$("#textAraeLength").text((200-this.value.length)+"/200");
        if (e.keyCode == 8) {
            return true;
        }
        else {
            var len = $(this).data("maxlength") || 0;
            if (len > 0) {
                if(this.value.length > len){
                	layer.msg("文字超出限制");
                	return false;
                }
            }
        }
        return true;
    });
    $(document).on("paste", "#remark", function () {
    	$("#textAraeLength").text((200-this.value.length)+"/200");
        var len = $(this).data("maxlength") || 0;
        if (len > 0) {
            if((this.value.length + event.clipboardData.getData('Text').length) > len){
            	layer.msg("复制文字超出长度限制");
            	return false;
            }
        }
        return true;
    });
    $(document).on("keyup input", "#remark", function (e) {
    	
    	$("#textAraeLength").text((200-this.value.length)+"/200");
    	
        var keyCode = e.keyCode || e.which || e.charCode;
        if ( keyCode == 8) {
        	//return true;
        }
        else {
            var len = $(this).data("maxlength") || 0;
            if (len > 0) {
                if (this.value.length > len) {
                    //this.value = com.cutStr(this.value, len, "");
                    layer.msg("输入文字超出长度限制");
                    //return false;
                }
            }
            //return true;
        }
    });
	
	$(".close2").click(function() {
		$(this).parents(".tan").hide();
	});
	
	$(".subtract").click(function() {
		// 数量加减
		var numObj = $("#num");
		var num = numObj.val() == ""?0:numObj.val();
		if (num > 1) {
			if(buyTimes >1){
				num = parseInt(num)-parseInt(buyTimes);
				numObj.val(num);
			}else{
				numObj.val(--num);
			}
			reSetPrice(num);
		}
	});
	$(".add").click(function() {
		// 数量加减
		var numObj = $("#num");
		var num = numObj.val() == ""?0:numObj.val();
		if(buyTimes >1){
			num = parseInt(num) + parseInt(buyTimes);
			numObj.val(num);
		}else{
			numObj.val(++num)
		}
		reSetPrice(num);
	});

});


function reSetPrice(num){
	console.log("price="+currentPrice);
	if(param == true){
		var parameter1 = $("#parameter1").val();
		var parameter2 = $("#parameter2").val();
		if(!isEmpty(parameter1) && !isEmpty(parameter2)){
			var totalPrice =currentPrice*customMultiple;
			totalPrice = totalPrice.toFixed(2)*num;
			$("#totalPrice").text(totalPrice.toFixed(2));
		}
	}else{
		var totalPrice = num*currentPrice;
		$("#totalPrice").text(totalPrice.toFixed(2));
	}
}
/**
 * 输入购买数量时重新计算价格
 * @param node
 * @returns
 */
function reSetNum(node){
	if (node.value.length == 1) {
		node.value = node.value.replace(/[^1-9]/g, '')
	} else {
		node.value = node.value.replace(/\D/g, '')
	}
	if(parseInt(node.value)%buyTimes !=0){
		node.value = parseInt(node.value)*buyTimes;
	}
	reSetPrice(node.value);
}

/**
 * 点选类别
 * @param classid
 * @returns
 */
function selectClass(classid){
	location.href = "online_order.html?classid="+classid;
}

function showProductView(product){
	
	$(".dis").text("制作说明："+product.productNote);
	$(".proId").text("产品ID:"+product.id);
	
	var _hasImg = '';
	
	
	var GMXZ = '不限';
	//购买级别 0 不限  1铜牌会员以上  2银牌合约会员以上  3金牌合约会员以上  4白金合约会员以上 5钻号合约会员以上 7皇冠合约会员以上 8金冠合约会员以上
	if(product.buy_level == 1){
		GMXZ = '铜牌会员以上';
	}else if(product.buy_level == 2){
		GMXZ = '银牌会员以上';
	}else if(product.buy_level == 3){
		GMXZ = '金牌会员以上';
	}else if(product.buy_level == 4){
		GMXZ = '白金会员以上';
	}else if(product.buy_level == 5){
		GMXZ = '钻号会员以上';
	}else if(product.buy_level == 7){
		GMXZ = '皇冠会员以上';
	}else if(product.buy_level == 8){
		GMXZ = '金冠会员以上';
	}
	
	//图片
	_hasImg += '<label>'+
	            '<input type="radio" id="pid_'+product.id+'"  CHECK name="p_name" value="1">'+
	            '<span>'+product.productName+(product.buy_level > 0 ? ('<i>'+GMXZ+"</i>"):"")+'<span class="checkI" onclick="showPreview(\''+product.images_pre+'\')">[图]</span></span>'+
	        '</label>';
	
	_hasImg = _hasImg.replace("CHECK",'checked="checked"');
	$(".hasImg").append(_hasImg);
	
	$(".o_m_main li").each(function(index,node){
		if(index > 0){
			$(this).remove();
		}
	});
	
	$.each(product.studioProductAttributeNameList,function(index,attrName){
		var _li = ''+
		'<li>'+
            '<div class="tit">'+attrName.attrName+'</div>'+
            '<div class="nr">';
				$.each(attrName.spaValueList,function(v_index,attrValue){
					_li+='<label>'+
		                    '<input type="radio" CHECK name="p_value'+index+'" onclick="checkThis('+index+','+attrValue.id+')" value="'+attrValue.id+'">'+
		                    '<span id="attrv_'+attrValue.id+'">'+attrValue.name+'</span>'+
		                '</label>';
					
					
					if(v_index == 0){
						_li = _li.replace("CHECK",'checked="checked"');
						attrValueIds.push(attrValue.id);
						if(index == product.studioProductAttributeNameList.length-1){
							checkThis(index,attrValue.id)
						}
					}else{
						_li = _li.replace("CHECK",'');
					}
				});
		  _li += ''+     
            '</div>'+
        '</li>';
		$(".o_m_main").append(_li);
	});
}


/**
 * 点选产品属性
 * @param index
 * @param value
 * @returns
 */
var param = false;
function checkThis(index,value){
	
	if(!price_visible){
		console.log("无看价格的权限");
		return;
	}
	
	$(".info").show();
	
	
	attrValueIds[index] = value;
	var groupIds = attrValueIds.join(",");
	layer.load();
	getDataFromService("/product/getProductGroup","GET","productsId="+groupIds+"&isShelves=1",function(res){
		layer.closeAll();
		console.log(res.obj);
		if(res.code == 1){
			var group = res.obj;
			
			$(".proId").text("产品ID:"+group.productId+"_"+group.id);
			
			if(group.isShelves != 1){
				console.log("您选中的商品已经下架");
				return;
			}
			currentPrice = res.price;
			buyTimes = res.obj.buyTimes;
			groupID = group.id;
			$("#price").text(group.price.toFixed(2));
			$("#memberPrice").text(group.memberPrice.toFixed(2));
			
			var totalPrice = res.price*res.obj.buyTimes;
			$("#totalPrice").text(totalPrice.toFixed(2));
			
			$("#num").val(res.obj.buyTimes);
			
			
			var attrValueName = $("#attrv_" + value).html();
			
			if(typeof allSize[groupID] != "undefined" && allSize[groupID] != "undefined" ){/*}
			
			if(attrValueName.indexOf("自定义") == 0){*/
				param = true;
				
				//宝丽放大：自定义尺寸（0.50*0.76m以内）
				//丽捷放大：自定义尺寸（1.2*3m以内）
				var width = Number(allSize[groupID][0].width);
				var height = Number(allSize[groupID][0].height);
				$("#zdyInfo").html("自定义尺寸长宽在"+width+"mx"+height+"m以内");
				
				var parameter1 = $("#parameter1").val();
				var parameter2 = $("#parameter2").val();
				if(!isEmpty(parameter1) && !isEmpty(parameter2)){
					customMultiple = parameter1*parameter2;
					
					var totalPrice =  isVIP?group.memberPrice*res.obj.buyTimes*customMultiple:res.price*res.obj.buyTimes*customMultiple;
					$("#totalPrice").text(totalPrice.toFixed(2));
					// 售价
					var price = group.price.toFixed(2)*customMultiple;
					$("#price").text(price.toFixed(2));
					// 会员价
					var memberPrice = group.memberPrice.toFixed(2)*customMultiple;
					$("#memberPrice").text(memberPrice.toFixed(2));
				}
				
				layer.open({
					type:1,
					area:["350px","240px"],
					title: '请输入自定义尺寸',
					content: $("#layerInput"),
					btn:['确认尺寸','取消'],
					yes: function(layero,index){
						var totalPrice = $("#totalPrice").text();
						var parameter1 = $("#parameter1").val();
						var parameter2 = $("#parameter2").val();
						customMultiple = parameter1*parameter2;
						customMultiple = customMultiple.toFixed(2);
						
						if(!isEmpty(parameter1) && !isEmpty(parameter2)){
							if(parameter1 > width || parameter1 < 0 || parameter2 > height || parameter2 < 0){
								layer.msg("可自定义尺寸（"+width+"m~"+height+"m以内）");
								return;
							}else{
								var totalPrice =  res.price*res.obj.buyTimes*customMultiple;
								$("#totalPrice").text(totalPrice.toFixed(2));
								// 单价
								var price = group.price.toFixed(2)*customMultiple;
								$("#price").text(price.toFixed(2));
								// 会员价
								var memberPrice = group.memberPrice.toFixed(2)*customMultiple;
								$("#memberPrice").text(memberPrice.toFixed(2));
							}
						}
						$(".layui-layer-shade").remove();
						layer.closeAll();
					},end: function () {
						//无论是确认还是取消，只要层被销毁了，end都会执行，不携带任何参数。layer.open关闭事件
						$(".layui-layer-shade").remove();
			        }
				});
			}else{
				param = false;
//				$("#parameter1").val("");
//				$("#parameter2").val("");
//				customMultiple = 1;
			}
		}else{
			layer.msg(res.msg);
		}
		
	});
}

/**
 * 添加购物车
 * @returns
 */
function addCart(){
	if(currentClassid == 37){
		layer.confirm("每位用户都有一次免费领取样品的机会，用户领取免费样品以后，必须今后该产品有两次以上的成交订单，系统才会自动解锁并自动添加一次免费领样机会，" +
				"用户可以继续领取其它免费样品，以此类推；如果领取的免费样品今后没有回购下单，那么该账号今后将不能再参与平台其它免费样品领取及其它相关活动，" +
				"所有请大家精心挑选领取自己实际所需要的样品。",{title:'友情提醒',btn:['好的我知道了']},function(){
			
			layer.load();
			var parameter1 = $("#parameter1").val();
			var parameter2 = $("#parameter2").val();
			
			var remark = $("#remark").val();
			if(param == true){
				if(isEmpty(parameter1) || isEmpty(parameter2)){
					layer.closeAll();
					layer.alert("自定义值不能为空");
					return;
				}
				remark = remark + "(自定义尺寸 长  宽:"+parameter1+"(m) 高:"+parameter2+"(m))"
			}else{
				parameter1 = 1;
				parameter2 = 1;
			}
			var number = $("#num").val();
			if(number < 1){
				$("#num").val(1);
				number = 1;
			}
			
			console.log("添加购物车："+groupID+" ,数量："+number);
			var group = {};
			group.groupId = groupID;
			group.count = number; 
			group.remark = remark;
			group.customMultiple = customMultiple;
			getDataFromService("/car/addItemsToCar","POST",JSON.stringify(group),function(res){
				layer.closeAll();
				if(res.code == 1){
					location.href = "/pages/shopCart/shopCart.html";
				}else{
					layer.msg(res.msg);
				}
			});
		},function(){
			layer.closeAll();
		});
		
	}else{
		layer.load();
		var parameter1 = $("#parameter1").val();
		var parameter2 = $("#parameter2").val();
		
		var remark = $("#remark").val();
		if(param == true){
			if(isEmpty(parameter1) || isEmpty(parameter2)){
				layer.closeAll();
				layer.alert("自定义值不能为空");
				return;
			}
			remark = remark + "(自定义尺寸 长  宽:"+parameter1+"(m) 高:"+parameter2+"(m))"
		}else{
			parameter1 = 1;
			parameter2 = 1;
		}
		var number = $("#num").val();
		if(number < 1){
			$("#num").val(1);
			number = 1;
		}
		
		console.log("添加购物车："+groupID+" ,数量："+number);
		var group = {};
		group.groupId = groupID;
		group.count = number;
		group.remark = remark;
		group.customMultiple = customMultiple;
		getDataFromService("/car/addItemsToCar","POST",JSON.stringify(group),function(res){
			layer.closeAll();
			if(res.code == 1){
				location.href = "/pages/shopCart/shopCart.html";
			}else{
				layer.msg(res.msg);
			}
		});
	}
	
	
}

/**
 * 预览图片
 * @param images_pre
 * @returns
 */
function showPreview(images_pre,productid){
	
	if(!isEmpty(images_pre)){
		
		$("#imageDiv .swiper-wrapper").html("");
		
		$.each(images_pre.split(","),function(index,imgUrl){
			$("#imageDiv .swiper-wrapper").append('<div class="swiper-slide"><img src="'+imgUrl+'" alt="pro"></div>');
		});
		
	}
	$("#toBuy").attr("onclick","changeView("+productid+")");
	$("#imageDiv").show();
	mySwiper.update();//更新弹窗内的轮播图
	mySwiper.slideTo(0, 0);//切换到第指定slider
	
	
}
/**
 * 视频播放
 */
function showVideo(url,images_pre,productid){
	$("#imageDiv .swiper-wrapper").html("");
	$("#imageDiv .swiper-wrapper").append('<video style="margin-left: 12%;width: 80%;height: 50%;" src="'+url+'" controls="controls"></video>');
	
	if(!isEmpty(images_pre)){
		$.each(images_pre.split(","),function(index,imgUrl){
			$("#imageDiv .swiper-wrapper").append('<div class="swiper-slide"><img src="'+imgUrl+'" alt="pro"></div>');
		});
	}
	$("#toBuy").attr("onclick","changeView("+productid+")");
	$("#imageDiv").show();
	mySwiper.update();//更新弹窗内的轮播图
	mySwiper.slideTo(0, 0);//切换到第指定slider
	
}

