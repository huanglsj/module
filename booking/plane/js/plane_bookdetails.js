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
var flightSubmitFlag = true;

var flightFromCity = localGetItem("flightFromCity");
var flightToCity = localGetItem("flightToCity");

$("#depPlane").html(flightFromCity);
$("#arrPlane").html(flightToCity);

if(!localGetItem("flightDetail") || !localGetItem("seatDetail")) {
	mui.alert('参数有误，请重新查询', function() {
		mui.back();
	});
} else {

	//获取同行人数据
	lineDetail = JSON.parse(localGetItem("lineDetail")); //航线信息
	flightDetail = JSON.parse(localGetItem("flightDetail")); //选择的航班信息
	seatDetail = JSON.parse(localGetItem("seatDetail")); //选择的座位信息
	backFlightDetail = JSON.parse(localGetItem("backFlightDetail")); //选择的航班信息
	backSeatDetail = JSON.parse(localGetItem("backSeatDetail")); //选择的座位信息

	console.log(flightDetail, seatDetail, backFlightDetail, backSeatDetail);

	$(".airCode").text(flightDetail.carrier + flightDetail.flightNo); //航班号
	$("#flightLogo").attr("src", "../../img/logo/" + flightDetail.carrier + ".png"); //航空公司logo
	$("#shipping").text(seatDetail.shipping); //舱位
	$("#fromAirport").text(flightDetail.fromName + flightDetail.depAirport); //出发机场
	$("#arriveAirport").text(flightDetail.toName + flightDetail.arrAirport); //到达机场

	//时间
	departHour = Number(flightDetail.depDate.hours) < 10 ? "0" + flightDetail.depDate.hours : flightDetail.depDate.hours;
	departMinute = Number(flightDetail.depDate.minutes) < 10 ? "0" + flightDetail.depDate.minutes : flightDetail.depDate.minutes;
	arriveHour = Number(flightDetail.arrDate.hours) < 10 ? "0" + flightDetail.arrDate.hours : flightDetail.arrDate.hours;
	arriveMinute = Number(flightDetail.arrDate.minutes) < 10 ? "0" + flightDetail.arrDate.minutes : flightDetail.arrDate.minutes;
	$("#f0_Date").text(localGetItem("airDate"));
	$("#departTime").text(departHour + ":" + departMinute); //出发时间
	$("#arriveTime").text(arriveHour + ":" + arriveMinute); //到达时间
	localSetItem("flightDetail", JSON.stringify(flightDetail));
	localSetItem("seatDetail", JSON.stringify(seatDetail));

	$("#price").text(seatDetail.price);

	//vue初始化
	app = new Vue({
		el: "#vue",
		data: {
			passengers: [{
				name: '张轶',
				cardNo: '440106198212171816',
				telephone: '13922331217',
				psgType: "PT_Adult"
			}],
			seatDetail: seatDetail,
			flightDetail: [],
			backAirDate: '',
			backSeatDetail: {},
			chosedNum: 0,
			price: 0,
			tax: 0,
			contact: {
				name: '张轶',
				mobile: '13922331217'
			},
			totalPrice: 0
		},
		methods: {
			addPassenger: function() {
				var _this = this;
				if(_this.passengers.length > 9) {
					layer.open({
						content: '抱歉，乘客不能超过10个人',
						skin: 'msg',
						time: 2
					});
				} else {
					_this.passengers.push({
						name: '',
						cardNo: '',
						telephone: '',
						psgType: "PT_Adult",
						price: _this.seatDetail.priceObj,
					});
					_this.totalPrice = _this.price * _this.passengers.length;
				}
			},
			deletePassenger: function(index) {
				if(this.passengers.length <= 1) {
					layer.open({
						content: '抱歉，乘客至少要有一个',
						skin: 'msg',
						time: 2
					});
				} else {
					this.passengers.splice(index, 1);
					this.totalPrice = this.price * this.passengers.length;
				}
			},
			refund: function() { //显示退改签层
				if(seatDetail.cmt === "" && seatDetail.refund === "") {
					mui.alert("该航班没有退改规则");
				} else {
					mui.alert(seatDetail.cmt);
				}
			},
			submitOrder: function() {
				var _this = this;
				if(_this.passengers.length < 0) {
					layer.open({
						content: '请添加乘客',
						skin: 'msg',
						time: 2
					});

					return;
				}

				var passengersNameFlag = false;
				var passengersIdFlag = false;
				var passengersIdVerifyFlag = false;
				var passengersPhoneFlag = false;
				var passengersPhoneVerifyFlag = false;
				for(var i = 0; i < _this.passengers.length; i++) {
					if(!_this.passengers[i].name) {
						passengersNameFlag = false;
						break;
					} else {
						passengersNameFlag = true;
					}

					if(!_this.passengers[i].cardNo) {
						passengersIdFlag = false;
						break;
					} else {
						passengersIdFlag = true;
					}

					if(!isIDCard(_this.passengers[i].cardNo)) {
						passengersIdVerifyFlag = false;
						break;
					} else {
						passengersIdVerifyFlag = true;
					}

					if(!_this.passengers[i].telephone) {
						passengersPhoneFlag = false;
						break;
					} else {
						passengersPhoneFlag = true;
					}

					if(!isPhoneNumber(_this.passengers[i].telephone)) {
						passengersPhoneVerifyFlag = false;
						break;
					} else {
						passengersPhoneVerifyFlag = true;
					}
				}

				if(!passengersNameFlag) {
					layer.open({
						content: '请填写姓名',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!passengersIdFlag) {
					layer.open({
						content: '请填写身份证',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!passengersIdVerifyFlag) {
					layer.open({
						content: '填写的身份证不正确',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!passengersPhoneFlag) {
					layer.open({
						content: '请填写手机号码',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!passengersPhoneVerifyFlag) {
					layer.open({
						content: '填写的手机号码不正确',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!_this.contact.name) {
					layer.open({
						content: '请填写联系人',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!_this.contact.mobile) {
					layer.open({
						content: '请填写联系人手机号',
						skin: 'msg',
						time: 2
					});
					return;
				}

				if(!isPhoneNumber(_this.contact.mobile)) {
					layer.open({
						content: '填写的联系人手机号不正确',
						skin: 'msg',
						time: 2
					});
					return;
				}

				var airlines = [],
					prices = [];
				for(var n = 0; n < _this.flightDetail.length; n++) {
					airlines[n] = {
						carrier: _this.flightDetail[n].carrier,
						flightNo: _this.flightDetail[n].flightNo,
						classCode: n == 0 ? _this.seatDetail.code : _this.backSeatDetail.code,
						departDate: n == 0 ? localGetItem("airDate") : localGetItem("backAirDate"),
						departTime: _this.flightDetail[n].myDepDate,
						departCode: _this.flightDetail[n].depart,
						arrivalCode: _this.flightDetail[n].arrival,
						arriveDate: NYR(new Date(_this.flightDetail[n].arrDate.time), 1),
						arriveTime: _this.flightDetail[n].myArrDate + ":00",
					};
					if(n === 0) {
						prices.push(_this.seatDetail.priceObj);
					} else {
						prices.push(_this.backSeatDetail.priceObj);
					}
				}

				var subData = {
					telephone: _this.contact.mobile,
					name: _this.contact.name,
					fTotalPrice: _this.totalPrice,
					passengers: (JSON.stringify(_this.passengers)).replace(/\"/g, "'"),
					limitDate: "",
					limitTime: "",
					al: (JSON.stringify(airlines)).replace(/\"/g, "'")
				};
				console.log(subData);
				if(flightSubmitFlag) {
					flightSubmitFlag = false;
					layer.open({
						type: 2,
						content: '正在提交订单',
						shadeClose: false
					});
					var abort = mui.ajax({
						url: httpHost + 'flightController.do?planeBookModular',
						type: 'POST',
						data: subData,
						dataType: 'json',
						timeout:1000*30,
						success: function(data) {
							layer.closeAll();
							console.log(data);
							if(data.success) {
								localSetItem("orderList", JSON.stringify(data.obj));
								localSetItem("orderListType", 1);
								mui.openWindow({
									url: '../../booking/order/order_hint.html',
									id: 'order_hint'
								})
							} else {
								flightSubmitFlag = true;
								layer.open({
									content: '订单提交失败',
									skin: 'msg',
									time: 2
								});
							}
						},
						error: function(err, errMsg, error) {
							flightSubmitFlag = true;
							layer.closeAll();
							abort.abort();
							mui.confirm('网络请求异常，是否重新提交', '提示', ['是', '否'], function(e) {
								if(e.index == 0) {
									_this.submitOrder();
								}
							});
						}
					});
				} else {
					mui.alert("您已经提交订单了，请前往订单列表查看");
				}

			}
		}
	});

	app.price = getFlightPrice(app.seatDetail.priceObj.items);
	$("#cprice").text("---"); //儿童票价
	$("#tax").text(Number(flightDetail.tax) + Number(flightDetail.yq)); //税费
	app.tax = Number(flightDetail.tax) + Number(flightDetail.yq);

	app.flightDetail.push(flightDetail);

	app.totalPrice += getFlightPrice(app.seatDetail.priceObj.items);

	if(localGetItem("returnFlight") == 1) {
		app.flightDetail.push(backFlightDetail);
		app.backSeatDetail = backSeatDetail;
		app.backAirDate = localGetItem("backAirDate");
		app.totalPrice += getFlightPrice(app.backSeatDetail.priceObj.items);
		if(app.flightDetail[1]) {
			app.tax += Number(app.flightDetail[1].tax) + Number(app.flightDetail[1].yq);
			app.price += getFlightPrice(app.backSeatDetail.priceObj.items);
		}
	}
}

//获取航班总价
function getFlightPrice(arr) {
	if(arr && arr.length > 0) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].type && arr[i].type == 'A') {
				var price = arr[i].value;
				return price;
			}
		}
	}
}