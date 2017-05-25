//  总价
var app, count = 1,
	lineDetail = null,
	flightDetail = null,
	seatDetail = null,
	tax = 0,
	departHour = 0,
	departMinute = 0,
	arriveHour = 0,
	arriveMinute = 0,
	priceObj = null;
$(function() {
//	$("#vueEl").offset({
//		top: $("#header").height(),
//	})
	$("#depPlane").html(appcan.locStorage.getVal("flightFromCity"));
	$("#arrPlane").html(appcan.locStorage.getVal("flightToCity"));
	//vue初始化
	app = new Vue({
		el: "#vueEl",
		data: {
			passengers: [
//			{
//				"name": appcan.locStorage.getVal("userName"),
//				"id": appcan.locStorage.getVal("userNum"),
//				"code": appcan.locStorage.getVal("userCode"),
//				"mobile": appcan.locStorage.getVal("userMobile"),
//				"chose": true
//			}
			],
			chosedNum: 0,
			price: 0,
			tax: 0,
		},
		methods: {
			addPassenger: function() {
				for(var i = 0; i < app.passengers.length; i++) {
					if(app.passengers[i].name === event.target.getAttribute("data-name") && app.passengers[i].id === event.target.getAttribute("data-id")) {
						if(app.passengers[i].chose) {
							app.chosedNum--;
						} else {
							app.chosedNum++;
						}
						app.passengers[i].chose = !app.passengers[i].chose;
						break;
					}
				}
			},
			deletePassenger: function() {
				for(var i = 0; i < app.passengers.length; i++) {
					if(app.passengers[i].id === event.target.getAttribute("data-id") && app.passengers[i].name === event.target.getAttribute("data-name")) {
						app.passengers[i].chose = false;
						app.chosedNum--;
					}
				}
			}
		},
		created: function() {
			var pasList = appcan.locStorage.getVal('passengersList');
			this.passengers = pasList==null?[]:JSON.parse(pasList);
		}
	});

	//通讯录
	appcan.button("#selContact", "btn-act", function() {
//		uexContact.open();
	});

	//返回按钮
	appcan.button("#nav-left", "btn-act", function() {
		window.history.back();
	});

	//拨打电话
	appcan.button("#nav-right", "btn-act", function() {
	});

	//支付按钮点击事件
	appcan.button("#pay", "btn-act", function() {
		submitOrder('');
	})

	//获取同行人数据
	lineDetail = JSON.parse(appcan.locStorage.getVal("lineDetail")); //航线信息
	flightDetail = JSON.parse(appcan.locStorage.getVal("flightDetail")); //选择的航班信息
	seatDetail = JSON.parse(appcan.locStorage.getVal("seatDetail")); //选择的座位信息
	console.log(flightDetail, seatDetail);
	
	$(".airCode").text(flightDetail.carrier + flightDetail.flightNo); //航班号
	$("#flightLogo").attr("src", "img/logo/" + flightDetail.carrier + ".png"); //航空公司logo
	$("#shipping").text(seatDetail.shipping); //舱位
	$("#fromAirport").text(flightDetail.fromName + flightDetail.depAirport); //出发机场
	$("#arriveAirport").text(flightDetail.toName + flightDetail.arrAirport); //到达机场

	//时间
	departHour = Number(flightDetail.depDate.hours) < 10 ? "0" + flightDetail.depDate.hours : flightDetail.depDate.hours;
	departMinute = Number(flightDetail.depDate.minutes) < 10 ? "0" + flightDetail.depDate.minutes : flightDetail.depDate.minutes;
	arriveHour = Number(flightDetail.arrDate.hours) < 10 ? "0" + flightDetail.arrDate.hours : flightDetail.arrDate.hours;
	arriveMinute = Number(flightDetail.arrDate.minutes) < 10 ? "0" + flightDetail.arrDate.minutes : flightDetail.arrDate.minutes;
	$("#departTime").text(departHour + ":" + departMinute); //出发时间
	$("#arriveTime").text(arriveHour + ":" + arriveMinute); //到达时间
	appcan.locStorage.setVal("flightDetail", flightDetail);
	appcan.locStorage.setVal("seatDetail", seatDetail);
	
	//验价
	addMask('../../img/loading.gif', 'loading......');
	$.ajax({
		url: httpHost + "flightController.do?checkPriceWithoutPNRModular",
		data: {
			"carrier": flightDetail.carrier,
			"flightNo": flightDetail.flightNo,
			"classCode": seatDetail.code,
			"depart": flightDetail.depart,
			"arrival": flightDetail.arrival,
			"departDate": appcan.locStorage.getVal("airDate"),
			"F_price": Number(seatDetail.price),
			"T_price": Number(flightDetail.tax) + Number(flightDetail.yq),
			"A_price": Number(seatDetail.price) + Number(flightDetail.tax) + Number(flightDetail.yq),
		},
		//beforeSend: addHeader,
		type: "POST",
		success: function(data) {
			var dataJson = data;
			priceObj = dataJson.obj;
			console.log(dataJson);
			
			removeMask();
			if(!dataJson.success && dataJson.obj !== null) {
				for(var i = 0; i < dataJson.obj.items.length; i++) {
					console.log(dataJson.obj.items[i].type);
					switch(dataJson.obj.items[i].type) {
						case "F":
							seatDetail.price = Number(dataJson.obj.items[i].value);
							break;
						case "X":
							tax = Number(dataJson.obj.items[i].value);
							break;
						case "A":
							break;
						default:
							break;
					}
				}
			} else if(!dataJson.obj) {
				alert('该航班暂时无法预订，请选择其他航班。');
				window.history.back();
			}
			//价格
			$("#price").text(seatDetail.price);
			app.price = Number(seatDetail.price);
			$("#cprice").text("---"); //儿童票价
			$("#tax").text(Number(flightDetail.tax) + Number(flightDetail.yq));//税费
			app.tax = Number(flightDetail.tax) + Number(flightDetail.yq);
		},
		error: function(err, errMsg, error) {
			console.log(err, errMsg);
			removeMask();
		}
	});
	if(appcan.locStorage.getVal("applys") === "true") {
		getPassenger();
	}
}); //ready结束

//通讯录选择回调
//uexContact.cbOpen = function(opCode, dataType, data) {
//	switch(dataType) {
//		case 0: //返回文字
//			appcan.window.openToast("错误文字", 2000);
//			break;
//		case 1: //返回JSON
//			var obj = JSON.parse(data);
//			$("#mobile").val(obj.num);
//			break;
//		case 2: //返回数字
//			appcan.window.openToast("错误数字", 2000);
//			break;
//		default:
//			appcan.window.openToast("error", 2000);
//	}
//}

//显示底部同行人选择列表
function add_associates() {
	document.getElementsByClassName('bg_men')[0].style.display = 'block';
	document.getElementsByClassName('associates_add')[0].style.display = 'block';
}

//显示添加新乘客div
function addpas_show() {
	$('.addpas').removeClass('moveOut');
}
//隐藏添加新乘客div
function addpas_hide() {
	$('.addpas').addClass('moveOut');
	setTimeout(addpas_clear, 301);
}
//清空表单项
function addpas_clear(){
	$('.addpas-ipt').val('');
	$('.addpas-slt').find('option:first').prop('selected', 'selected');
}
//验证并提交表单项
function addpas_add(){
	var thispas = {};
	thispas.name = $.trim($('#addpas-name').val());
	thispas.id = $.trim($('#addpas-id').val());
	thispas.mobile = $.trim($('#addpas-mobile').val());
	
	var regName = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/, //姓名
		regId = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, //身份证号
		regMobile = /^0?1[3|4|5|8][0-9]\d{8}$/; //手机
	
	if(!regName.test(thispas.name)){
		alert('请输入姓名，不少于2个汉字。');
		return false;
	}else if(!regId.test(thispas.id)){
		alert('请输入有效的18位身份证号。');
		return false;
	}else if(!regMobile.test(thispas.mobile)){
		alert('请输入有效的11位手机号。');
		return false;
	}else{
		var vuepas = app.passengers;
		if(vuepas){
			for(var i=0; i<vuepas.length; i++){
				if(thispas.id == vuepas[i].id){
					alert('该身份证号码对应的乘客已被添加。');
					return false;
				}
			}
		}
		app.passengers = vuepas.concat(thispas);
		appcan.locStorage.setVal('passengersList', JSON.stringify(app.passengers));
		
		addpas_hide();
	}
}

//隐藏底部同行人列表
function bg_men() {
	document.getElementsByClassName('bg_men')[0].style.display = 'none';
	document.getElementsByClassName('associates_add')[0].style.display = 'none';
}

// 点击弹出底部费用明细
function Payment_list() {
	if(document.getElementsByClassName('Payment_list')[0].style.display == 'none') {
		document.getElementsByClassName('upward_pic')[0].getElementsByTagName('img')[0].src = 'img/drop_down.png';
		document.getElementsByClassName('bg_men1')[0].style.display = 'block';
		document.getElementsByClassName('Payment_list')[0].style.display = 'block';
	} else {
		document.getElementsByClassName('upward_pic')[0].getElementsByTagName('img')[0].src = 'img/upward.png';
		document.getElementsByClassName('bg_men1')[0].style.display = 'none';
		document.getElementsByClassName('Payment_list')[0].style.display = 'none';
	}
}

//订单明细点击隐藏，修改箭头方向
function bg_men1() {
	document.getElementsByClassName('bg_men1')[0].style.display = 'none';
	document.getElementsByClassName('Payment_list')[0].style.display = 'none';
	document.getElementsByClassName('upward_pic')[0].getElementsByTagName('img')[0].src = 'img/upward.png';
}

//点击退改签层隐藏
/*function bg_men2 () {
  document.getElementsByClassName('bg_men2')[0].style.display = 'none';
}*/

//显示退改签层
function refund() {
	// document.getElementsByClassName('bg_men2')[0].style.display = 'block';
	if(seatDetail.cmt === "" && seatDetail.refund === "") {
		alert("该航班没有退改规则");
	} else {
		alert(seatDetail.cmt);
	}

}

//获取同行人列表
function getPassenger() {
	appcan.request.ajax({
		url: httpHost + 'tmcGetOthersNameController.do?getOthersInTravel',
		type: "POST",
		data: {
			"expId": appcan.locStorage.getVal("expId")
		},
		beforeSend: addHeader,
		success: function(data) {
			var i = 0;
			objson = JSON.parse(data);
			console.log(objson);
			if(objson.success) {
				for(; i < objson.obj.length; i++) {
					app.passengers.push({
						"name": objson.obj[i].uname,
						"id": objson.obj[i].unum,
						"code": objson.obj[i].ucn,
						"mobile": objson.obj[i].mobile,
						"chose": false
					});
				}
			} else {
				if(objson.msg == "用户未登录") {
					reLogin(getPassenger);
				}
			}
		},
		error: function(e, err) {
			addDetails(appcan.locStorage.getVal("userName"), appcan.locStorage.getVal("userCode"), appcan.locStorage.getVal("userNum"));
		}
	});
}

//提交订单
function submitOrder(reason) {

	//正则验证
	var regBox = {
		regEmail: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, //邮箱
		regName: /^[a-z0-9_-]{3,16}$/, //用户名
		regMobile: /^0?1[3|4|5|8][0-9]\d{8}$/, //手机
		regTel: /^0[\d]{2,3}-[\d]{7,8}$/, //固定电话
		regIdCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
	}

	//验证电话号码
	var mobile = $("#mobile").val(),
		contact = $('#contact').val();
	if(mobile === "") {
		alert('请输入联系人电话。');
		return false;
	} else if(!regBox.regMobile.test(mobile)) {
		alert('联系人电话有误。');
		return false;
	}

	//验证身份证号
	var idCheck = true;
	for(var i = 0; i < app.passengers.length; i++) {
		if(app.passengers[i].chose && !regBox.regIdCard.test(app.passengers[i].id)) {
			idCheck = false;
			alert('乘客'+app.passengers[i].name+'身份证号有误。');
			return false;
		}
	}
	if(!idCheck) return;

	//获取乘客信息
	var passengers = [],
		i = 0,
		airlines = [],
		prices = [];
		
	for(var j = 0; j < app.passengers.length; j++) {
		if(app.passengers[j].chose) {
			var priceObj = {};
			priceObj["toPrice"] = seatDetail.priceObj;
			if(app.backSeatDetail) {
				priceObj["bakcPrice"] = app.backSeatDetail.priceObj;
			}
			passengers.push({
				"id": app.passengers[j].code,
				"name": app.passengers[j].name,
				"cardNo": app.passengers[j].id,
				"telephone": app.passengers[j].mobile || mobile,
				"psgType": "PT_Adult",
				"price": seatDetail.priceObj,
			})
		}
	}
	
	if(passengers.length == 0){
		alert('请先选择乘客。');
		return false;
	}
	
	airlines[0] = {
		id: "123",
		carrier: flightDetail.carrier,
		flightNo: flightDetail.flightNo,
		classCode: seatDetail.code,
		departDate: appcan.locStorage.getVal("airDate"),
		departTime: flightDetail.myDepDate,
		departCode: flightDetail.depart,
		arrivalCode: flightDetail.arrival,
		arriveDate: NYR(new Date(flightDetail.arrDate.time), 1),
		arriveTime: flightDetail.myArrDate + ":00",
	};

	var subData = {
		telephone: mobile,
		name: contact,
		fTotalPrice: (parseFloat(app.price + app.tax) * app.chosedNum).toString(),
		passengers: (JSON.stringify(passengers)).replace(/\"/g, "'"),
		limitDate: "",
		limitTime: "",
		al: (JSON.stringify(airlines)).replace(/\"/g, "'")
	};
	
	//机票订单信息
	var flightFromCity = appcan.locStorage.getVal("flightFromCity");
	var flightToCity = appcan.locStorage.getVal("flightToCity");
//	var subData = {
//		itineraryId: appcan.locStorage.getVal("itineraryId"),
//		telephone: mobile,
//		fTotalPrice: parseFloat(app.price + app.tax) * app.chosedNum,
//		passengers: passengers,
//		limitDate: "",
//		limitTime: "",
//		fCityName: flightFromCity,
//		tCityName: flightToCity,
//		arrTime: NYR(new Date(flightDetail.arrDate.time), 1) + " " + HM(new Date(flightDetail.arrDate.time)) + ":00",
//		depAirportName: flightDetail.fromName,
//		arrAirportName: flightDetail.toName,
//		al: {
//			id: "",
//			carrier: flightDetail.carrier,
//			flightNo: flightDetail.flightNo,
//			classCode: seatDetail.code,
//			departDate: appcan.locStorage.getVal("airDate"),
//			departTime: departHour + ":" + departMinute,
//			departCode: flightDetail.depart,
//			arrivalCode: flightDetail.arrival,
//
//		},
//		form: {
//			params: {
//				isMinPrice: appcan.locStorage.getVal("isMinPrice") || (reason === undefined),
//				reason: reason,
//				stop: flightDetail.stop == 0 ? false : true,
//				date: NYR(appcan.locStorage.getVal("airDate"), 1),
//				isMinFlightTime: appcan.locStorage.getVal("isMinFlightTime"),
//				refund: seatDetail.ei ? false : true,
//				change: seatDetail.ei ? false : true
//			},
//		}
//	};
	console.log(subData);
	$.ajax({
		url: httpHost + 'flightController.do?planeBookModular',
		type: 'POST',
		data: subData,
		success: function(data) {
			var orderIds = "";
			var objson = data;
			console.log(data);
			
			if(objson.success) {
				var flightOrderDetail = {
					"price": (app.price + app.tax) * app.chosedNum,
					"passengers": passengers,
					"departStation": appcan.locStorage.getVal("flightFromCity"),
					"departTime": subData.al.departTime,
					"arriveStation": appcan.locStorage.getVal("flightToCity"),
					"arriveTime": flightDetail.arrDate.hours + ":" + flightDetail.arrDate.minutes,
					"date": subData.al.departDate,
					"flightNo": subData.al.flightNo,
					"phone": subData.telephone,
					"PNR": objson.obj.PNR,
				};
				appcan.locStorage.setVal("flightOrderDetail", flightOrderDetail);
				
				for(var j=0; j<data.obj.length; j++){
  				  	if(j===0){
  				  		orderIds = data.obj[0].orderId;
  				  	}
  				  	else{
  				  		orderIds = orderIds+","+data.obj[j].orderId;
  				  	}
	  			}
				appcan.locStorage.setVal('myOrderId', orderIds);
				
				//window.history.replaceState(null, null, '../../commonHtml/orderDetails_content.html');
				window.history.replaceState(null, null, 'order_success_content.html');
            	//location.reload();
            	
				/*appcan.window.confirm({
				  title:'提示',
				  content:'请选择确认出票或取消订单',
				  buttons:['确定','取消'],
				  callback:function(err,data,dataType,optId){
				    if(err){
				      return;
				    }
				    //data 按照按钮的索引返回值
				    if(data==0){
				      conformOrder({resID:objson.obj.resID});
				    }
				    else{
				      concelOrder({resID:objson.obj.resID});
				    }
				  }
				});*/
			} else if(objson.success == false && objson.isRuleCheckResult == "true") {
				ticketReason(objson.msg, subTicket);
			} else {
				alert(objson.msg);
			}
		},
		error: function(err, errMsg, error) {
			console.log('网络请求异常，请重新提交。');
		}
	});
}

//确认出票
function conformOrder(objData) {
	var unames = $(".uname");
	var ussrs = $(".ussr");
	var passengers = [];
	for(var i = 0; i < unames.length; i++) {
		passengers[i] = {
			uname: unames[i].innerText,
			ussr: ussrs[i].innerText
		};
	}
	appcan.setLocVal("passengers", passengers);
	appcan.setLocVal("price", $("#pprice").text());
	appcan.request.ajax({
		url: httpHost + 'flightController.do?conformFlight',
		type: 'POST',
//		beforeSend: addHeader,
		data: objData,
		success: function(data) {
			objson = eval('(' + data + ')');
			if(objson.success) {
				appcan.setLocVal("planeOrder", objson);
				window.history.replaceState(null, null, 'order_success_content.html');
            	location.reload();
			} else {
				alert(objson.errMsg + '如有疑问请联系客服人员！');
			}
		},
		error: function(e, err) {
			alert('出票请求提交失败！');
		}
	});
}

//取消订单
function concelOrder(objData) {
	appcan.request.ajax({
		url: httpHost + 'flightController.do?cancelFlight',
		type: 'POST',
//		beforeSend: addHeader,
		data: objData,
		success: function(data) {
			objson = JSON.parse(data);
			if(objson.success) {
				alert(objson.msg);
			} else {
				alert(objson.errMsg + '如有疑问请联系客服人员！');
			}
		},
		error: function(e, err) {
			alert('出票请求提交失败！');
		}
	});
}