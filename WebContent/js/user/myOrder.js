
//加载页面数据
var pageNum = 1; 
var pageSize = 10;
var is_return_visit=0;//是否已回访
var is_after_sales = 0;//是否售后 0：普通订单  1：售后未处理 2：售后处理中 3：售后已处理
var is_problem = 0;//是否问题件订单 0：普通订单 1：问题件订单 2：已重新上传

//订单状态数组
var orderState = new Array();


var uploading = JSON.parse(localStorage.getItem("uploading"));

$(function() {
	

	var storage = window.localStorage;
	storage.setItem("token",'MTI2NDk3OjE1ODQ3NzUyNTUwNzU6M2NiZmY3NjIwM2IzZGQzOTU4NWM2NzA2YzUwOWFkMjk=');
	storage.setItem('userType', '儿童')
	storage.setItem('user', 'PYxj2MTgH3x+JoZYPfBQZKNtotB/S7VzeEBEv5TdmVBMURj4scDg/2CX5rphg8BIZbgcCPmh1bxfLyLuR1gKXjzd0eGjP1y3FGAvgsIWvzcWUuXuY3pisE65BSG+PfYUIqnOm67IgSEzWXHjylsNjD4iGb5uvphX9hXa3MqwZ7GJzseBLKXMn99+KtrWUAt8GDFTs5DVtbqziio2j38O0ic8kluPWazAidrbGmReVPQbVU8J3ACMtct8jEL4HmpRt9PRNHO3i1XZnfOCAIRUjSSSqWDczGjRdw/dfUeUGVMgM9isgiWJ01Q0SedeuPvbwnVcrFSUHI9nQomM8Kd81GBDvfmeea+O4uY910ZSWJ96aFoxocpwodktp4/X8xGJUJZSN/MD1mxSOAY7u6ErvHFU48/XMInwHiXGPCFz4lQGXhu4vfJ00SDzF/MeSRdKAa9clwbW8ERFdMDzb0TqDcuB7YEz7TF4fGOXZ0AEKUMETpW0C3YeyW56aSwyfgDjSAV0kEI3f37bHQG6jisLjYY+5VsY8uEYjBi/IUYkyu4/xlgPjzziJq0paic1wQEeZvRbgsv4l6KahmvGsVlmclz2bJjz+x4fCxpMqBQmserbAX+xweMXFc0CIlrlYKb/iUNu9jpM2FPPHhQMJwJPOU6C2broJd80JhFocd5L7ig1Yy1bRO48hDAj87taTZhjFXDg2oDxhOZi8FARN+iQ5F5bPsTpDY1fcAX2pbYdIff6/XUXSd4W3TKshSwKTUUnmEyCBquGzPqKW4yo6jr3m2l0lMka8adebx4Vx/9G8L3ZbSUC8bw1md/dtABsKBLDyq4AI5xzR8KEnXU6yr3rDOgAPfqzNrmxjSt8uFeC37n1Pp+8lfmEXVOng95tUL9Qf88Jp2VKPpYPoWR+3w9LZ/0uSzX3AeEvhDpKaAXlLQiED18I5gTaZQs09NMDRdmuzqBlkitIi+rSrQ3FtjSIf4WAxCSWnlhRgxjD5uSwz8P9iITYPsGMiq8XeKyo597K6y7wnp+Yk24jyA0/uZ0ilc7aKltC3jZsBeai0vaFZwZdIxzavxSWuOypRsyeiaTA1vr/eObAxz6I5R6K9WVHXYuk1TmQ1rjj5i8Vcx76SAS3WEE7rxmf5XmYWKxe0L7+ig/pZYqsJ8Eo85tcCfWwapRu//QxlEHYNYhp8zpb9b53npfrAvMAMgCz4NT3JwDeqgDNCA1YQkPrVYn2sQvokZ7wGVXcoQTwmT0yX8Mcc0u84e6jOcVYE6hgBLsKpwrndXQtnJ/ut/Ss15BwXmQInsbiZmCN14ui8YSNRkOD4yg2fH6Ux1LYsaLHsDzMjSOB')
	
	
	$("#header").load('/pages/com/header.html?v=2020-01-10', function() {
		$("#header a[name=myOrder]").addClass('act');
	});

	$("#userMenu").load('/pages/com/userMenu.html?v=2020-01-10', function() {
		$("#userMenu a[name=myOrder]").addClass('act');
	});
	$("#footer").load('/pages/com/footer.html?v=2020-01-10');
	
	// 切换
	$(".tag").delegate('span', 'click', function() {
		if ($(this).not(".act")) {
			//0问题件 1 未支付、2已支付、3制作中、4已发货、5已签收
			var _index = $(this).index();
			$(this).addClass('act').siblings('span').removeClass('act');
			
			orderState = new Array();
			
			$("#wait").hide();
			$("#over").hide();
			is_return_visit = 0;
			is_problem = 0;
			is_after_sales=0;
			
			if(_index == 5){
				signOrder(1);//已签收订单列表
			}
			else if(_index == 1){
				noPayOrder(1);//未支付订单列表
			}
			else{
				if(_index == 0){
					orderState.push(4);
					orderState.push(5);
					orderState.push(6);
					is_problem = 1;//问题件订单列表
					$("#wait").show();
					$("#over").show();
				}else if(_index == 2){
					orderState.push(1);
					orderState.push(2);//已支付订单列表
				}else if(_index == 3){
					orderState.push(4);
					orderState.push(5);
					orderState.push(6);//生产中订单列表
				}else if(_index == 4){
					orderState.push(7);//已发货订单列表
				}else if(_index == 6){
					orderState.push(9);//已收货订单列表
				}else if(_index == 7){
					orderState.push(7);
					is_after_sales = 1;//售后订单列表
					$("#wait").show();
					$("#over").show();
				}else if(_index == 8){
					is_return_visit = 1;
					orderState.push(7);
					orderState.push(9);//已回访记录
				}
				getMyOrder(1);
			}
		}
	});
	
	
	var paramState = HASH['state'];
	if(isEmpty(paramState)){
		//默认加载已支付订单列表
		orderState.push(1);
		orderState.push(2);
	}else{
		if(paramState == 0){
			orderState.push(4);
			orderState.push(5);
			orderState.push(6);
			is_problem = 1;//问题件订单列表
			$("#wait").show();
			$("#over").show();
		}else if(paramState == 2){
			orderState.push(1);
			orderState.push(2);//已支付订单列表
		}else if(paramState == 3){
			orderState.push(4);
			orderState.push(5);
			orderState.push(6);//生产中订单列表
		}else if(paramState == 4){
			orderState.push(7);//已发货订单列表
		}else if(paramState == 5){
			signOrder(1);//已签收订单列表
			$(".tag").find("span:eq("+paramState+")").addClass('act').siblings('span').removeClass('act');
			return;
		}else if(paramState == 6){
			orderState.push(9);//已收货订单列表
		}else if(paramState == 7){
			orderState.push(7);
			is_after_sales = 1;//售后订单列表
			$("#wait").show();
			$("#over").show();
		}else if(paramState == 8){
			is_return_visit = 1;
			orderState.push(7);
			orderState.push(9);//已回访记录
		}else{
			//默认加载已支付订单列表
			orderState.push(1);
			orderState.push(2);
		}
		$(".tag").find("span:eq("+paramState+")").addClass('act').siblings('span').removeClass('act');
	}
	getMyOrder(1);
});
/**
 * 选择处理类型
 * @param type
 * @returns
 */
function selectSpan(type){
	orderState = new Array();
	if(is_after_sales > 0){
		orderState.push(7);
		is_after_sales = type;
	}else if(is_problem > 0){
		orderState.push(4);
		orderState.push(5);
		orderState.push(6);
		is_problem = type;
	}
	if(type == 1){
		$("#wait").css("color","#FFF");
		$("#wait").css("background-color","#e41212");
		$("#over").css("color","#2672d1");
		$("#over").css("background-color","#FFF");
	}else if(type == 2){
		$("#wait").css("color","#2672d1");
		$("#wait").css("background-color","#FFF");
		$("#over").css("color","#FFF");
		$("#over").css("background-color","#2672d1");
	}
	
	getMyOrder(1);
}


/**
 * 按订单状态查询订单列表（已支付、制作中、已发货、问题件）
 * @param pageNum
 * @returns
 */
function getMyOrder(pageNum) {
	
	var ajaxUrl = "/order/myOrderList.json";
	var type = "post";
	var param = {};
	param.pageNum = pageNum;
	param.pageSize = pageSize;
	param.array = orderState;
	param.is_problem = is_problem;
	param.is_after_sales = is_after_sales;
	param.is_return_visit = is_return_visit;
	layer.load();
	var callBack = function(res) {
		var res = {
			code: 1,
			count: null,
			id: null,
			list: null,
			msg: null,
			name: null,
			obj: [
				{
					actualAmountPaid: 65.8,
					address: {
						area: "丰台区",
						city: "北京市",
						consignee: "测试",
						createTime: 1582623374000,
						detailAddress: "北京市丰台区程庄小区",
						hasFirst: false,
						hasLast: true,
						hasNext: true,
						hasPre: false,
						id: 12377933,
						pageNow: 1,
						pageSize: 10,
						phone: "18612345678",
						province: "北京市",
						startPos: 0,
						state: null,
						totalCount: 0,
						totalPageCount: 0,
						userId: null
					},
					addressId: 12377933,
					after_sales_time: null,
					commission_price: 0,
					commission_type: null,
					consoleUser: null,
					consoleUserId: 10021,
					createId: 126497,
					createTime: 1582623374000,
					createUserName: "123",
					delay_times: 0,
					detailList: [
						{
							binding_group_ids: null,
							cost_price: null,
							customMultiple: null,
							fileName: null,
							fileSize: null,
							fileType: 1,
							fileUpTime: 1582623374000,
							fileUrl: null,
							finshNumber: 0,
							goodId: 91660,
							goodsUrl: "/images/product/cart/1420/cart.jpg",
							groupName: "简爱灰三件套8P",
							id: 25170,
							number: 1,
							orderId: 200225173610040,
							orderPrice: 49.9,
							productId: 1420,
							productNote: "",
							remarks: "",
							tasksNumber: 0,
							tasksTime: 0,
							venderCode: "海纳数码"
						},
						{
							binding_group_ids: null,
							cost_price: null,
							customMultiple: null,
							fileName: null,
							fileSize: null,
							fileType: 1,
							fileUpTime: 1582623374000,
							fileUrl: null,
							finshNumber: 0,
							goodId: 91672,
							goodsUrl: "/images/product/cart/1422/cart.jpg",
							groupName: "8寸印刷台历（13页）8寸（20.3X15.2cm）双面",
							id: 25171,
							number: 1,
							orderId: 200225173610040,
							orderPrice: 15.9,
							productId: 1422,
							productNote: "",
							remarks: "",
							tasksNumber: 0,
							tasksTime: 0,
							venderCode: "海纳数码"
						}
					],
					distributionPrice: 0,
					id: 200225173610040,
					is_after_sales: 0,
					is_problem: 0,
					is_return_visit: 0,
					is_sample: 0,
					is_urgent: 0,
					logistics: {id: null, name: null, code: null, createTime: 1582623374000},
					logisticsCode: null,
					logisticsId: null,
					logisticsType: 0,
					makingTime: 1582623374000,
					operationList: [],
					orderCode: "1582623370400",
					orderFile: null,
					orderFileType: 1,
					orderNumber: "1582623370400_91672",
					orderPrice: 65.8,
					orderType: 2,
					payTime: 1582623371000,
					payWay: 0,
					phone: "18612345678",
					priority: 0,
					problem_time: null,
					recruitmentTime: null,
					remainder_shipping_time: null,
					remark: null,
					returnVisitList: null,
					sampleState: null,
					settlement_price: null,
					singInTime: null,
					upGoodsTime: null,
					updateId: null,
					updateTime: null,
					urgent_time: null,
					userId: 126497,
					userLevel: 2,
					verderCode: "海纳数码",
				}
			],
			page: {
				asFirst: false,
				hasLast: false,
				hasNext: false,
				hasPre: false,
				pageNow: 1,
				pageSize: 10,
				startPos: 0,
				totalCount: 1,
				totalPageCount: 1,
			},
			price: null
		}
		$(".userMain").show();
		layer.closeAll();
		$(".m_o_tab").html("");
		
		var str = '<tr class="shopName">'+
		 '<th style="width:5%">订单号</th>'+
		 '<th style="width:5%">下单时间</th>'+
		 '<th style="width:5%">下单人</th>'+
		 '<th style="width:10%">商品</th>'+
		 '<th>数量</th>'+
		 '<th>价格</th>'+
		 '<th style="width:10%">制作文件</th>'+
		 '<th style="width:7%">收货人信息</th>'+
		 '<th style="width:10%">备注说明</th>'+
		 '<th style="width:5%">状态</th>'+
		 '<th style="width:10%">回访记录</th>'+
		 '<th style="width:15%" colspan="2">操作</th></tr>';
		
		if(res.code == 1){
			
			var page = res.page;
			if(pageNum == 1){
				//拉取第一页数据时，初始化分页
				$('.bodBox').createPage(
					   function(n){
						   if(n != pageNum){//不是点击当前页码
							   pageNum = n;
							   getMyOrder(n);
						   }
					   },
					   {
					   	pageCount:page.totalPageCount,//总页码,默认10 
					   	showPrev:false,//是否显示上一页按钮
					   	showNext:false,//是否显示下一页按钮
					   	showTurn:true,//是否显示跳转,默认可以
					   	showNear:4,//显示当前页码前多少页和后多少页，默认2
					   	showSumNum:false//是否显示总页码
					   },
					   {
						   "color":"#525252;",//字体颜色
						   "height":28,//页码总高度，默认20px
						   "pagesMargin":4,//每个页码或按钮之间的间隔
						   "borderColor":"#ececec",
						   "currentColor":"#FFF",//当前页码的字体颜色
					   }
				);
			}
			
			
			if(param.is_problem > 0 || param.is_after_sales > 0){
				//问题件列表特殊处理
				str = addQuestionItem(res);
			}else{
				$.each(res.obj,function(index,order){
					
					var rowSpanNum = order.detailList.length;
					
					var orderType = "未支付";
					var orderOperator = '';
					var returnVisitContent = '';
					
					var timeStr = new Date(order.createTime).Format("yyyy-MM-dd hh:mm");
					if(order.orderType == 1){
						orderType = "已支付";
						orderOperator = '<a  onclick="cancelOrder(' +order.id+')" >取消订单</a><br/><br/>'+
										'<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}else if(order.orderType == 2){
						orderType = "已支付待上传";
						orderOperator = '<a  onclick="cancelOrder(' +order.id+')" >取消订单</a><br/><br/>'+
						'<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}else if(order.orderType == 4){
						orderType = "等待制作";
						orderOperator = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}else if(order.orderType == 5){
						orderType = "制作中";
						orderOperator = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}else if(order.orderType == 6){
						orderType = "制作完成";
						orderOperator = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}else if(order.orderType == 7){
						str = str.replace("下单时间","发货时间");
						timeStr = new Date(order.upGoodsTime).Format("yyyy-MM-dd hh:mm");
						
						if(order.is_return_visit == 0){
							returnVisitContent = '<a  onclick="addReturnVisit(' +order.id+',4)" class="blue" style="margin-left:0.7em;">添加记录</a>';
						}else{
							$.each(order.returnVisitList,function(visitIndex,returnVisit){
								returnVisitContent += '<p title="操作时间：'+new Date(returnVisit.create_time).Format("yyyy-MM-dd hh:mm")+'">'+(visitIndex+1)+'). '+returnVisit.content+'</p> ';
							});
							returnVisitContent += '<a  onclick="addReturnVisit(' +order.id+',5)" class="blue" style="margin-left:0.7em;">添加记录</a>';
						}
						
						orderType = "已发货<br/>" + order.logistics.name +'<br/>' + order.logisticsCode+"<br/>"+
									'<a href="https://www.kuaidi100.com/chaxun?com='+order.logistics.name+'&nu='+order.logisticsCode+'"  target="_blank" style="color: blue;"><u>物流查询</u></a>';
						orderOperator = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>'+
								'<a  onclick="confirmOrder(' +order.id+',4)" title="订单自发货之后开始计时，快递7天（下线物流10天）之后自动转已收货" style="background: #3e7bcc;border-radius: 5%;color: white;padding: 0.2em 0.5em;margin-left:0.5em;">确认收货</a><br/><br/>'+
								(order.is_after_sales == 0?'<a  onclick="addAfterSales(' +order.id+',4)" class="blue">申请售后</a>':'');
						
						if(order.delay_times == 0){
							orderOperator+='<a  onclick="delayOrder(' +order.id+',4)" class="blue" title="延期一次推迟3天确认收货" style="margin-left:0.7em;">延迟收货</a>';
						}else{
							orderOperator += '<a disabled="disabled"  title="延期一次推迟3天确认收货" style="margin-left:0.7em;">已延迟</a>';
						}
								
					}else if(order.orderType == 9){
						if(order.is_return_visit == 0){
							returnVisitContent = '<a  onclick="addReturnVisit(' +order.id+',6)" class="blue" style="margin-left:0.7em;">添加回访记录</a>';
						}else{
							$.each(order.returnVisitList,function(visitIndex,returnVisit){
								returnVisitContent += '<p title="操作时间：'+new Date(returnVisit.create_time).Format("yyyy-MM-dd hh:mm")+'">'+(visitIndex+1)+'). '+returnVisit.content+'</p> ';
							});
							returnVisitContent += '<a  onclick="addReturnVisit(' +order.id+',5)" class="blue" style="margin-left:0.7em;">添加记录</a>';
						}
						orderType = "已收货<br/>" + order.logistics.name +'<br/>' + order.logisticsCode;
						orderOperator = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a>';
					}
					
					str += '<tr class="shopNr">'+
								'<td rowspan=' + rowSpanNum + '>'+(order.id > 1000000000?order.id:order.orderNumber)+'</td>'+
								'<td rowspan=' + rowSpanNum + '>'+timeStr+'</td>'+
								'<td rowspan=' + rowSpanNum + '>'+order.createUserName+'</td>';
						
					$.each(order.detailList,function(d_index,detail){
						
						var productNote = JSON.stringify(detail.productNote).replace(/"/g, '&quot;');
						
						console.log(order);
						
						if(d_index == 0){
							
							var fileContent="";
							if(order.verderCode == "荣祥车间"){
								fileContent = '<td name="fileUpPhoto">'+fileColumContent(detail,order)+'</td>';
							}else{
								fileContent = '<td name="fileUpPhoto" rowspan=' + rowSpanNum + '>'+fileColumContent(order.detailList,order)+'</td>';
							}
							
							str += 
							'<td>'+detail.groupName+ '<br>[<span style="color:#FF6633;cursor:pointer;" onclick="getInfo('+ productNote + ')">查看制作说明</span>]</td>'+
							'<td>'+detail.number+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+order.orderPrice.toFixed(2)+'</td>'+
							fileContent+
							'<td rowspan=' + rowSpanNum + '>'+order.address.consignee+'<br/>'+order.address.phone+'</td>'+
							'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+orderType+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+returnVisitContent+'</td>'+
							'<td><a onclick=addCart(' + detail.number + ',"' + detail.remarks+ '",' + detail.goodId + ') class="blue">再次购买</a></td>'+
							'<td rowspan=' + rowSpanNum + '>'+
								orderOperator+
							'</td>'
					    '</tr>';
						}else{
							var fileContent="";
							if(order.verderCode == "荣祥车间"){
								fileContent = '<td name="fileUpPhoto">'+fileColumContent(detail,order)+'</td>';
							}
							str += 	
							'<tr class="shopNr">'+
								'<td>'+detail.groupName+ '<br>[<span style="color:#FF6633;cursor:pointer;" onclick="getInfo('+ productNote + ')">查看制作说明</span>]</td>'+
								'<td>'+detail.number+'</td>'+
								fileContent+
								'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
								'<td><a onclick=addCart(' + detail.number + ',"' + detail.remarks+ '",' + detail.goodId + ') class="blue">再次购买</a></td>'+
						    '</tr>';
						}
					});
						
				});
			}
			if(uploading!=null){
				uploading.forEach(function(item, index, arr) {
					$("#cancel_"+item).hide();
					$("#upload_"+item).text("文件上传中...");
				});
			}
		}else{
			layer.msg(res.msg);
			$('.bodBox').html("");
		}
		$(".m_o_tab").html(str);
	};
	getDataFromService(ajaxUrl, type, JSON.stringify(param), callBack);

}
/**
 * 查询未支付订单列表
 * @param pageNum
 * @returns
 */
function noPayOrder(pageNum){
	
	var ajaxUrl = "/order/notPayedOrder";
	var type = "POST";
	var pageSize = 10;
	
	var param = {};
	param.pageNum = pageNum;
	param.pageSize = pageSize;
	
	layer.load();
	getDataFromService(ajaxUrl, type, JSON.stringify(param), function(res){
		layer.closeAll();
		
		$(".m_o_tab").html("");
		if (res.code == 1) {
			
			var str = "";
			str = str + '<tr class="shopName">';
			str = str + '<th>订单编号</th>';
			str = str + '<th>下单时间</th>';
			str = str + '<th>下单人</th>';
			str = str + '<th>商品</th>';
			str = str + '<th>订单总金额</th>';
			str = str + '<th>预存支付金额</th>';
			str = str + '<th style="width:20%">备注说明</th>';
			str = str + '<th colspan="2">操作</th>';
			
			var page = res.page;
			
			//拉取第一页数据时，初始化分页
			if(pageNum == 1){
				$('.bodBox').createPage(
					   function(n){
						   if(n != pageNum){//不是点击当前页码
							   pageNum = n;
							   noPayOrder(n);
						   }
					   },
					   {
					   	pageCount:page.totalPageCount,//总页码,默认10 
					   	showPrev:false,//是否显示上一页按钮
					   	showNext:false,//是否显示下一页按钮
					   	showTurn:true,//是否显示跳转,默认可以
					   	showNear:4,//显示当前页码前多少页和后多少页，默认2
					   	showSumNum:false//是否显示总页码
					   },
					   {
						   "color":"#525252;",//字体颜色
						   "height":28,//页码总高度，默认20px
						   "pagesMargin":4,//每个页码或按钮之间的间隔
						   "borderColor":"#ececec",
						   "currentColor":"#FFF",//当前页码的字体颜色
					   }
				);
			}
			
			var preObj = res.obj;
			
			for(var h = 0; h < preObj.length; h++){
				var list = preObj[h].orderList;
				
				var fg = 0;
				var numFg = 0;
				for(var j = 0; j < list.length; j++){
					numFg = numFg + list[j].detailList.length;
				}
				for (var j = 0; j < list.length; j++) {
					var data = list[j].detailList;
					for (var i = 0; i < data.length; i++) {
						str = str + '<tr class="shopNr">';
						var date = new Date(preObj[h].createTime)
								.Format("yyyy-MM-dd hh:mm");
						if (fg == 0) {
							str = str + '<td rowspan=' + numFg + '>' + preObj[h].outTradeNo
									+ '</td>';
							str = str + '<td rowspan=' + numFg + '>' + date
									+ '</td>';
							str = str + '<td rowspan=' + numFg + '>' + preObj[h].createUserName
							+ '</td>';
						}
						//商品
						var productNote = JSON.stringify(data[i].productNote).replace(
								/"/g, '&quot;');
						str = str
								+ '<td>'
								+ data[i].groupName
								+ '</td>';
						
						//订单总金额 预存支付金额
						if(fg == 0){
							var orderPrice =  preObj[h].orderSum
							str = str + '<td rowspan=' + numFg + '>' + orderPrice.toFixed(2) + '</td>';
							var prepayed =  preObj[h].prePayed
							str = str + '<td rowspan=' + numFg + '>' + prepayed.toFixed(2) + '</td>';
						}
						
						str = str + '</td>';
						var remarks = data[i].remarks == null ? "" : data[i].remarks;
						str = str + '<td>' + remarks + '</td>';
						
						if (fg == 0) {
							//var obj = JSON.stringify(preObj[h]).replace(/"/g, '&quot;')
							str = str + '<td rowspan=' + numFg + '>';
							str = str + '<label class="btnAnRed btnFile" style="width:50px;line-height:1.7rem;"><input onclick=rePay('+preObj[h].outTradeNo+','+preObj[h].orderSum+","+preObj[h].prePayed+')>去支付</label>';
							str = str + '</td>';
							fg++;
						}
						str = str + '</tr>';
					}
				}
			}
			$(".m_o_tab").html(str);
			
		}else{
			layer.msg(res.msg);
			$(".bodBox").hide();
		}
	});
	
}


function closeDiv(id){
	$("#"+id).hide();
	location.href = "/pages/user/myOrder.html";
}

/**
 * 未支付订单再支付
 * @param orderid
 * @returns
 */
function rePay(outTradeNo,orderSum,prePayed){
	currentOrderid = outTradeNo;
	//console.log("订单再支付：",order);
	var allTotalPrice = (orderSum - prePayed).toFixed(2);
	layer.load();

	//判断预存账户金额是否足够支付
	getDataFromService("https://www.yl123.cn/user/userInfo","GET","",function(res){
		layer.closeAll();
		if(res.code == 1){
			var user = res.obj;
			var preStore = user.preStore;
			
			if(allTotalPrice<=preStore.userPriceBalance){
				console.log("余额充足可以支付此订单");
				
				$("#prePrice2").text("￥"+preStore.userPriceBalance.toFixed(2));
				$("#payPrice2").text("￥"+(preStore.userPriceBalance - allTotalPrice).toFixed(2));
				$("#tsTan2").show();
				
			}else{
				console.log("余额不足");
				
				$("#prePrice1").text("￥"+preStore.userPriceBalance.toFixed(2));
				$("#payPrice1").text("￥"+( allTotalPrice - preStore.userPriceBalance).toFixed(2));
				$("#tsTan1").show();
			}
			
		}else{
			layer.msg(res.msg);
		}
	});
}
/**
 * 当前支付的订单号
 */
var currentOrderid;

var interval_index;

var currentPreOrder;
var wxCodeUrl,zfbCodeUrl;

var times=0;

/**
 * 更换在线支付方式
 * @param payType 0 微信支付  1  支付宝支付
 * @returns
 */
function changePayMent(payType){
	
	console.log(currentPreOrder);
	
	if(payType == 0 && !isEmpty(wxCodeUrl)){
		
		$("#zfName").text("微信支付");
		$("#zfName").css("background","#65d12a");
		$("#zfText").html('<img width="50px" src="/images/alipay.png" alt="支付" id="zfTagIMG" >支付宝支付');
		$("#zfType").attr("onclick","changePayMent(1)");
		$("#payCode").attr("src","/order/createPayCode?codeUrl="+wxCodeUrl);
		
	}else if(payType == 1 && !isEmpty(zfbCodeUrl)){
		$("#zfName").text("支付宝支付");
		$("#zfName").css("background","#00aaee");
		$("#zfText").html('<img width="50px" src="/images/wxpay.jpg" alt="支付" id="zfTagIMG" >微信支付');
		$("#zfType").attr("onclick","changePayMent(0)");
		$("#payCode").attr("src","/order/createPayCode?codeUrl="+zfbCodeUrl);
		
	}else{

		if(payType == 0 ){
			currentPreOrder.payedMethod = 1;
		}else if(payType == 1){
			currentPreOrder.payedMethod = 2;
		}
		
		layer.load();
		getDataFromService("/order/changePayMent","POST",JSON.stringify(currentPreOrder),function(res){
			layer.closeAll();
			
			if(res.code == 1){
				var preOrder = res.obj;
				
				if(payType == 0){
					$("#zfName").text("微信支付");
					$("#zfName").css("background","#65d12a");
					$("#zfText").html('<img width="50px" src="/images/alipay.png" alt="支付" id="zfTagIMG" >支付宝支付');
					$("#zfType").attr("onclick","changePayMent(1)");
					wxCodeUrl = preOrder.payCodeUrl;
				}else if(payType == 1){
					$("#zfName").text("支付宝支付");
					$("#zfName").css("background","#00aaee");
					$("#zfText").html('<img width="50px" src="/images/wxpay.jpg" alt="支付" id="zfTagIMG" >微信支付');
					$("#zfType").attr("onclick","changePayMent(0)");
					zfbCodeUrl = preOrder.payCodeUrl;
				}
				
				if(preOrder.state == 2){
					//全部使用预存支付，跳转到订单列表页面
					location.href = "/pages/user/myOrder.html";
				}else{
					
					$("#payCode").attr("src","/order/createPayCode?codeUrl="+preOrder.payCodeUrl);
					interval_index = setInterval(checkOrderPayStatus, 1000);
					times = 0;
				}
				
			}else{
				layer.msg(res.msg);
			}
		});
	}
	
}


/**
 * 生成扫码支付二维码
 * @returns
 */
function showScanCode(){
	
	var params={payType:1,out_trade_no:currentOrderid};
	
	layer.load();
	dataFromService("/order/orderRepayed","POST",params,function(res){
		layer.closeAll();
		//console.log(res);
		if(res.code == 1){
			currentPreOrder =  res.obj;
			if(currentPreOrder.state == 2){
				//全部使用预存支付，跳转到订单列表页面
				location.href = "/pages/user/myOrder.html";
			}else{
				
				$("#payCode").attr("src","/order/createPayCode?codeUrl="+currentPreOrder.payCodeUrl);
				
				$("#zfName").text("微信支付");
				$("#zfName").css("background","#65d12a");
				$("#zfText").html('<img width="50px" src="/images/alipay.png" alt="支付" id="zfTagIMG" >支付宝支付');
				$("#zfType").attr("onclick","changePayMent(1)");
				wxCodeUrl = currentPreOrder.payCodeUrl;
				
				$("#panTan").show();
				$("#tsTan1").hide();
				$("#tsTan2").hide();
				interval_index = setInterval(checkOrderPayStatus, 1000);
			}
			
		}else{
			layer.msg(res.msg);
		}
	});
}

/**
 * 监听扫码，判断是否支付成功
 * */
function checkOrderPayStatus(){
	
	var params = {};
	params.outTradeNo = currentPreOrder.outTradeNo;
	
	getDataFromService("/order/checkPreOrderPayState","POST",JSON.stringify(params),function(result){
		
		//console.log(result);
		if(result.code == 1){
			
			var preOrder = result.obj;
			//全部支付完毕
			if(preOrder.state == 2){
				clearInterval(interval_index);
				location.href = "/pages/user/myOrder.html";
			}else{
				times ++;
				if(times >= 120){
					clearInterval(interval_index);
				}
			}
		}else{
			times ++;
			if(times >= 120){
				clearInterval(interval_index);
			}
		}
		
	});
	
}

//查看制作说明
function getInfo(obj) {
	layer.open({
		title : "制作说明",
		area : [ "500px", "400px" ],
		content : obj
	});
}

function cancelOrder(orderId){
	var ajaxUrl = "/order/cancelOrder";
	var type = "post";
	var param = {};
	param.id = orderId;
	var callBack = function(res) {
		layer.closeAll();
		if(res.code == 1){
			layer.alert("取消订单成功");
			location.reload();
		}else{
			layer.alert(res.msg);
		}
	};
	layer.load();
	getDataFromService(ajaxUrl, type, JSON.stringify(param), callBack);
}

/**
 * 添加购物车 跳转至购物车页面
 */
function addCart(number, remark, groupId) {
	var group = {};
	group.groupId = groupId;
	group.count = number;
	group.remark = remark;
	layer.load();
	
	getDataFromService("/car/addItemsToCar", "POST", JSON.stringify(group),
		function(res) {
			layer.closeAll();
			
			if (res.code == 1) {
				location.href = "/pages/shopCart/shopCart.html";
			} else {
				layer.msg(res.msg);
			}
		});
}




/**
 * 确认收货
 * @param id
 * @returns
 */
function confirmOrder(id,type){
	
layer.confirm("确认收货订单款将直接打入商家账户，确认收货吗？",{title:'提示信息'},function(){
		
	  layer.load();
	  
	  var params = {};
	  params.id = id;
	  console.log(params);
	  
	  getDataFromService("/order/order_confirm","POST",JSON.stringify(params),function(res){
		  layer.closeAll();
		  console.log(res);
		  if(res.code == 1){
			  layer.alert("操作成功！",function(){
					location.href = "/pages/user/myOrder.html?state="+type;
			  });
		  }else{
			  layer.msg(res.msg);
		  }
	  });
		
	},function(){
		layer.closeAll();
	});
}
/**
 * 延迟收货
 * @param id
 * @returns
 */
function delayOrder(id,state){
	layer.confirm("每个订单只能延期一次，延期后收货时间推后3天，确认要延期吗？",{title:'提示信息'},function(){
		
		  layer.load();
		  
		  var params = {};
		  params.orderId = id;
		  console.log(params);
		  
		  getDataFromService("/order/delay_order","POST",JSON.stringify(params),function(res){
			  layer.closeAll();
			  console.log(res);
			  if(res.code == 1){
				  layer.alert("操作成功！",function(){
					  location.href = "/pages/user/myOrder.html?state="+state;
				  });
			  }else{
				  layer.msg(res.msg);
			  }
		  });
			
		},function(){
			layer.closeAll();
		});
}
/**
 * 添加回访记录
 * @param orderid
 * @returns
 */
function addReturnVisit(orderid,type){
	layer.prompt({
		  formType: 2,
		  value: '',
		  title: '请输入回访结果(注：必填项)',
		  maxlength:500,
		  closeBtn :0,
		  area: ['500px', '180px'], //自定义文本域宽高
		  yes:function(index,layero){
			  var value = layero.find(".layui-layer-input").val();
			  if(isEmpty(value)){
				  alert("原因不能为空")
				  return;
			  }
			  layer.close(index);
			  layer.load();
			  var params = {};
			  params.order_id = orderid;
			  params.content=value;
			  
			  getDataFromService("/order/addReturnVisit","POST",JSON.stringify(params),function(res){
				  layer.closeAll();
				  console.log(res);
				  if(res.code == 1){
					  layer.alert("操作成功！",function(){
						  location.href = "/pages/user/myOrder.html?state="+type;
					  });
				  }else{
					  layer.msg(res.msg);
				  }
			  });
		  }
		});
}

