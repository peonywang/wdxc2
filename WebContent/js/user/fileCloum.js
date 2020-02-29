
var isUploading = sessionStorage.getItem("uploading");

/**
 * 跳转订单上传页面
 * @param obj
 * @returns
 */
function uploadFile(obj,node) {
	if($(node).text() == "文件上传中..."){
		layer.confirm("此产品已经打开了一个上传页面，是否需要再打开一个上传页面？",{title:'提示信息'},function(){
			sessionStorage.setItem('uploadDetail', JSON.stringify(obj));
			var index = layer.alert("请务必保证文件尺寸、分辨率、P数等，与您购买的产品匹配，如文件不符合要求，沟通与修改会延长制作周期！",function(){
				window.open("order_upload.html?id="+obj.id);
				layer.close(index);
			});
		},function(){
			layer.closeAll();
		});
		return;
	}
	$("#cancel_"+obj.id).hide();
	$(node).text("文件上传中...");
	//console.log(obj);
	sessionStorage.setItem('uploadDetail', JSON.stringify(obj));
	var index = layer.alert("请务必保证文件尺寸、分辨率、P数等，与您购买的产品匹配，如文件不符合要求，沟通与修改会延长制作周期！",function(){
		window.open("order_upload.html?id="+obj.orderid);
		layer.close(index);
	});
}
/**
 *  **
	*0不需要上传 1 待上传  2 已上传  3 已下载
	*
 * @param item
 * @returns
 */
function fileColumContent(items,order){
	var urlState = 2;
	if(order.is_problem != 0){
		urlState = 0;
	}else if(order.is_after_sales != 0){
		urlState = 7;
	}else if(order.orderType ==1 ||order.orderType ==2){
		urlState = 2;
	}
	
	var orderInfo = {};
	var details = new Array();
	var fileName = '';
	var fileType = 0;
	var fileSize = 0;
	if(order.verderCode != "荣祥车间"){
		$.each(items,function(index,item){
			var detail = {};
			detail.groupName = item.groupName.replace(/"/g,"'").replace(/ /g,"'");
			detail.id = item.id;
			detail.note = JSON.stringify(item.productNote).replace(/"/g,"'").replace(/ /g,"'");
			//非荣祥车间只上传一个文件
			details.push(detail);
		});
		
		fileType = order.orderFileType;
		
		if(order.orderFile != null){
			fileName = order.orderFile.fileName==null?"":order.orderFile.fileName.replace(/"/g,"'").replace(/ /g,"'");;
			fileSize = order.orderFile.fileSize;
		}
	}else{
		var detail = {};
		detail.groupName = items.groupName.replace(/"/g,"'").replace(/ /g,"'");
		detail.id = items.id;
		detail.note = JSON.stringify(items.productNote).replace(/"/g,"'").replace(/ /g,"'");
		details.push(detail);
		
		fileType = items.fileType;
		fileName = items.fileName==null?"":items.fileName.replace(/"/g,"'").replace(/ /g,"'");;
		fileSize = items.fileSize;
	}
	orderInfo.details = details;
	orderInfo.fileType = fileType;
	orderInfo.fileName = fileName
	orderInfo.fileSize = fileSize;
	orderInfo.orderid = order.id;
	orderInfo.orderNumber = order.orderNumber;
	orderInfo.urlState = urlState;
	var detailObj = JSON.stringify(orderInfo);
	
	var fileUpdateOperatorItem = '';
	var fileSelectOperatorItem = '';
	//判断用户权限
	/*if(localUser != undefined){
		if(localUser.id == order.createId){*/
			fileUpdateOperatorItem ='<div  style="position: relative; display: inline-block; cursor: pointer;background: #ff6600;padding: 5px 25px; color: #fff;text-align: center; border-radius: 3px;overflow: hidden;"'
			+'onclick=uploadFile('+detailObj +',this)>替换</div>';
			fileSelectOperatorItem = '<div  style="position: relative; display: inline-block; cursor: pointer;background: #ff6600;padding: 5px 25px; color: #fff;text-align: center; border-radius: 3px;overflow: hidden;"'
			 + 'onclick=uploadFile('+  detailObj +',this)>选择文件</div>';
		/*}
	}*/
			
	if(fileType == 0){
		return '<div class="thelist"></div>不需要上传';
	}
	if(fileType == 1 && order.orderType != 7){
		return  '<div ></div>'
		 + '<div id="uploader" class="wu-example">'
		 + '<div class="thelist" class="uploader-list"></div>'
		 + '<div class="btns">'
		 + fileSelectOperatorItem
		 + '</div>'
		 + '</div>';
	}
	//未处理问题件允许替换、待上传订单允许替换
	if(order.is_problem == 1 ||(order.orderType <= 2 && fileType == 2)){
		return '<div ><img src="/images/user/RAR.png" alt="RAR">'
 		+ '<div>' + fileName + '</div></div>'
		+ '<div id="uploader" class="wu-example">'
		+ '<div class="thelist" class="uploader-list"></div>'
		+ '<div class="btns">'
		+ fileUpdateOperatorItem
		+ '</div>'
		+ '</div>';
	}
	//其他状态不允许替换
	return '<div ><img src="/images/user/RAR.png" alt="RAR">'
		+ '<div>' + fileName + '</div></div>'
		+ '<div id="uploader" class="wu-example">'
		+ '<div class="thelist" class="uploader-list"></div>'
		+ '<div class="btns">'
		+ '</div>'
		+ '</div>';
	
	
	
}