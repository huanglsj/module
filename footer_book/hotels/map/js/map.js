var cityCode = "",
	bgnDate = "",
	endDate = "",
	keyWord = "",
	lPrice = "",
	hPrice = "",
	xingji = "",
	lat = "",
	lng = "";

var dataList = {
	page: 1,
	pageSize: 25,
	cityCode: cityCode,
	bgnDate: bgnDate,
	endDate: endDate,
	keyWord: keyWord,
	lPrice: lPrice,
	hPrice: hPrice,
	xingji: xingji,
	lat: lat,
	lon: lng
}
var hotelCity;
var cityLocation;
//appcan.ready(function() {
//	appcan.button("#close", "btn-act", function() {
//		appcan.window.close(1);
//	});

cityCode = appcan.locStorage.getVal("cityCode");
bgnDate = appcan.locStorage.getVal("inday");
endDate = appcan.locStorage.getVal("outday");
keyWord = appcan.locStorage.getVal("keyWord");
lPrice = appcan.locStorage.getVal("priceMin");
hPrice = appcan.locStorage.getVal("priceMax");
xingji = appcan.locStorage.getVal("xingji");
hotelCity = appcan.locStorage.getVal("hotelCity");
cityLocation = appcan.locStorage.getVal("cityLocation");
if(cityLocation) {
	cityLocation = JSON.parse(cityLocation);
}
dataList.cityCode = cityCode;
dataList.bgnDate = bgnDate;
dataList.endDate = endDate;
dataList.keyWord = keyWord;
dataList.lPrice = lPrice;
dataList.hPrice = hPrice;
dataList.xingji = xingji;

init();
//});

function myMark(url, content) {
	var str = '';
	str += '<div class="bgset zhezhao">';
	str += '    <div class="loading-box ub ub-ver ub-ac">';
	str += '        <div class="loading-pic">';
	str += '            <img src="' + url + '">';
	str += '        </div>';
	str += '        <div class="loading-text">';
	str += '            <p>' + content + '</p>';
	str += '        </div>';
	str += '    </div>';
	str += '</div>';
	$("body").append(str);
}

function removeMyMark() {
	$(".zhezhao").remove();
}

function init() {
	//	myMark('../../img/loading.gif', "正在定位中，请稍后");
	layer.open({
		type: 2,
		content: '正在定位中'
	});
	setTimeout(function() {
		geolocation.getCurrentPosition();
	}, 600);

}

//初始化地图
var map = new AMap.Map('map', {
	resizeEnable: true,
});

var startMarker = new AMap.Marker({ //添加自定义点标记
	position: map.getCenter(), //基点位置
});

startMarker.setMap(map);
var geolocation;
map.plugin(['AMap.ToolBar', 'AMap.Geolocation'], function() {
	map.addControl(new AMap.ToolBar());

	geolocation = new AMap.Geolocation({
		zoomToAccuracy: true,
	});
	map.addControl(geolocation);
	AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
	AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
});

//定位成功
function onComplete(e) {
	layer.closeAll();
	var op = [e.position.lng, e.position.lat];
	regeocoder(op);
}
//定位失败
function onError(e) {
	layer.closeAll();
	var xy = map.getCenter();
	//	myMark('../../img/loading.gif', "定位失败，正返回当前城市");
	layer.open({
		content: '定位失败，正返回当前城市',
		skin: 'msg',
		time: 2 //2秒后自动关闭
	});
	var lnglatXY = [xy.lng, xy.lat];
	if(cityLocation) {
		lnglatXY = [cityLocation.lng, cityLocation.lat];
	}
	setTimeout(function() {
		regeocoder(lnglatXY);
	}, 600);

}

var markers = [];
//添加覆盖物
function addMarker(obj) {
	for(var i = 0; i < obj.length; i++) {
		marker = new AMap.Marker({
			position: [obj[i].basicProperty.position.longitude, obj[i].basicProperty.position.latitude],
			map: map,
			content: '<div class="bubble" data-id="' + obj[i].basicProperty.hotelCode + '"><div class="arrow"></div><div class="title">' + obj[i].basicProperty.hotelName + '</div><div class="money">￥ ' + obj[i].basicProperty.minRate + '</div></div>'
		});

		markers.push(marker);
	}

	map.setFitView();

}

//移动端
//mui(".amap-marker-content").on("tap", ".bubble", function() {
//	var id = $(this).data("id");
//	if(id != null) {
//		mui.openWindow({
//			url: 'hotel_details_content.html',
//			id: 'hotel_details_content',
//			extras: {},
//			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
//			show: {
//				autoShow: true, //页面loaded事件发生后自动显示，默认为true
//				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
//				extras: {} //窗口动画是否使用图片加速
//			},
//			waiting: {
//				autoShow: true, //自动显示等待框，默认为true
//				title: '正在加载...', //等待对话框上显示的提示内容
//			}
//		})
//	}
//})

function hotelDetails(obj) {
	var id = $(obj).data("id");
	if(id != null) {
		mui.openWindow({
			url: 'hotel_details_content.html',
			id: 'hotel_details_content',
			extras: {},
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
			}
		})
	}
}
$(document).on("tap", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		appcan.locStorage.setVal("hotelCode", id);

		mui.openWindow({
			url: 'hotel_details_content.html',
			id: 'hotel_details_content',
			extras: {},
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
			}
		})
	}
});

//pc端
$(document).on("click", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		appcan.locStorage.setVal("hotelCode", id);
		mui.openWindow({
			url: 'hotel_details_content.html',
			id: 'hotel_details_content',
			extras: {},
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
			}
		})
	}
});

//点击定位按钮
$(document).on("tap", ".amap-geolocation-con", function() {
	//	myMark('../../img/loading.gif', "正在定位中，请稍后");
	layer.open({
		content: '正在定位中',
		skin: 'msg',
		time: 8 //2秒后自动关闭
	});
});

map.on('click', function(e) {
	var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]; //已知点坐标
	map.setZoomAndCenter(10, lnglatXY);
	regeocoder(lnglatXY);
});

//根据点击地图的经纬度获取城市名
function regeocoder(lnglatXY) {

	var MGeocoder;
	//加载地理编码插件
	map.plugin(["AMap.Geocoder"], function() {
		MGeocoder = new AMap.Geocoder({
			radius: 1000,
			extensions: "all"
		});

		MGeocoder.getAddress(lnglatXY, function(status, result) {
			if(status === 'complete' && result.info === 'OK') {
				geocoder_CallBack(result, lnglatXY);
			} else {
				backCityInfo();
			}
		});
	});
	map.remove(startMarker);
	startMarker = new AMap.Marker({ //加点
		map: map,
		position: lnglatXY
	});
	map.setFitView();
}

function geocoder_CallBack(data, lnglatXY) {
	var city;
	if(typeof data.regeocode === 'undefined' || !data.regeocode) {
		city = data;
	} else {
		var address = data.regeocode.formattedAddress; //返回地址描述
		city = data.regeocode.addressComponent.city;
	}

	if(city.substring(city.length - 1, city.length) == "市" && city.substring(city.length - 2, city.length - 1) != "市") {
		city = city.substring(0, city.length - 1);
	}

	var myCityCode = hotelCitys[city];
	if(myCityCode) {
		//		alert(99)
		dataList.lat = lnglatXY[1];
		dataList.lon = lnglatXY[0];
		dataList.cityCode = myCityCode;
		queryHotelsList();
	} else {
		//		appcan.window.confirm({
		//			title: '提示',
		//			content: '城市解析失败，返回当前城市查询',
		//			buttons: ['确定'],
		//			callback: function(err, data, dataType, optId) {
		//				appcan.window.close(1);
		//			}
		//		});
		mui.alert("城市解析失败，返回当前城市查询", "提示", "确定", function() {
			alert(1)
		})
	}

}

//定位不行或者解析城市失败，返回当前城市
function backCityInfo() {
	map.getCity(function(data) {
		if(data['province'] && typeof data['province'] === 'string') {
			var city = data['city'];
			var xy = map.getCenter();
			var lnglatXY = [xy.lng, xy.lat];
			geocoder_CallBack(city, lnglatXY);
		} else {
			//			appcan.window.confirm({
			//				title: '提示',
			//				content: '返回当前城市失败',
			//				buttons: ['确定'],
			//				callback: function(err, data, dataType, optId) {
			//					appcan.window.close(1);
			//				}
			//			});
			mui.alert("城市解析失败，返回当前城市查询", "提示", "确定", function() {
				alert(1)
			})
		}
	});
}

//查询酒店
function queryHotelsList() {
	console.log(dataList)
	//	removeMyMark();
	//	myMark('../../img/loading.gif', "酒店查询中，请稍后");
	layer.open({
		type: 2,
		content: '酒店查询中'
	});
//	layer.open({
//		content: '酒店查询中',
//		skin: 'msg',
//		time: 2 //2秒后自动关闭
//	});

	var data = [{
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州穗云宾馆",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO12885",
			"hotelEnglishName": "Guang Zhou Suyun Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "1 North Yunhe Street, Lane 30, Xianlie Zhong Road, Guangzhou",
			"opendate": "2008-07",
			"fitment": "2010-10",
			"tel": "020-38376304",
			"district": "越秀区",
			"fax": null,
			"maxRate": "192.00",
			"minRate": "150.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "9",
			"longDesc": "广州穗云宾馆坐落于广州火车站、天河体育中心和广州火车站东站的正中心位置，南面有繁华的天河商业圈，北边紧邻中国最大的汽车配件市场，东边1公里位置是广州最大的沙河顶服装批发市场。宾馆与广州动物园只有一墙之隔，乃繁华都市中辟出的一片幽静养生之地，空气清新，环境优雅。宾馆所有房间均配备有空调、数字电视、电话、宽带和独立卫生间，是宾客休闲度假、商务旅游的理想居所。\n　　宾馆开业时间2008年7月26日，新近装修时间2010年10月1日，主楼高8层，客房总数82间（套）。\n\n【温馨提示】宾馆没有停车场。",
			"shortDesc": "酒店开业时间2008年7月26日，新近装修时间2010年10月1日，主楼高8层，客房总数82间（套）。",
			"por": null,
			"images": null,
			"relativePositions": [{
				"shortDesc": "广州火车站",
				"distance": "3",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "环市东路附近",
				"distance": "2.22",
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": "28",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "北京路步行街",
				"distance": "2.5",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "环市东路附近",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "广州动物园",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "150.00",
			"maxRateS": "192.00",
			"businessarea": "环市东/淘金/区庄/小北",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.309308",
				"latitude": "23.146918",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区先烈中路云鹤北街30巷1号(广州动物园旁)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "32001281",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "109186",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州旺顺宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1120957",
			"hotelEnglishName": "Wangshun Hotel Guangzhou",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Xiaogang Road North on the 8th Street",
			"opendate": "2011-08",
			"fitment": "2015-05",
			"tel": "020-84419575",
			"district": "海珠区",
			"fax": null,
			"maxRate": "180.00",
			"minRate": "150.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "null",
			"longDesc": "旺顺宾馆位于海珠区基立北街，周边有市场、超市和大型的休闲会所，交通便利，环境优美。宾馆设施齐全，干净整洁，性价比高。是您出行、旅游的最佳选择。",
			"shortDesc": null,
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/B00001.jpg",
				"type": "B",
				"size": 22
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/M00001.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/W00001.jpg",
				"type": "W",
				"size": 53
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO1120957/L00001.jpg",
				"type": "L",
				"size": 86
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "150.00",
			"maxRateS": "180.00",
			"businessarea": "江南西/昌岗/市二宫婚纱街",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.28136",
				"latitude": "23.109977",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "小港路基立北街8号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "105034",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "布丁酒店连锁(广州江泰路地铁站店)",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO133442",
			"hotelEnglishName": "Pod Inn Guangzhou Jiangtai Road Subway Station",
			"brandCode": null,
			"brandName": null,
			"chainCode": "BDLS",
			"chainName": "布丁连锁",
			"cityName": null,
			"enAddress": "No. 132 Jiangyan Road, Haizhu District, Guangzhou, China",
			"opendate": "2013-11",
			"fitment": "2013-11",
			"tel": "020-34361376",
			"district": "海珠区",
			"fax": null,
			"maxRate": "159.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "17",
			"longDesc": "布丁酒店连锁（广州江泰路地铁站店）位于海珠区江燕路三楼，距地铁2号线江泰路站仅150米（江泰路地铁站D出口直行），无需换乘地铁直达琶洲、广州南站、广州火车站、白马服装城、步云天地鞋城、 广东省汽车站、广州市汽车站等；同时地铁通达北京路、上下九、长隆香江动物园等广州热门旅游景点。酒店地处海珠区繁华商业地段，毗邻江南大道和江燕路，与亚运场馆燕子岗体育场对街相望，紧邻海珠区甲级写字楼—达镖国际大厦和广州医学院附属第二医院（广医二院），500米范围内有广州美术学院、南泰批发市场、金海马家居、香江家居以及燕汇广场等。江南西商业街、广百新一城、摩登百货（海珠购物中心店）、信和广场、珠江医院、广东省口腔医院近在咫尺。周边饮食娱乐一应俱全，汇聚全国各地特色美食。\n　　酒店开业时间2013年11月，主楼高18层，客房总数65间（套）。\n \n【温馨提示】\n此酒店不能接待外宾。",
			"shortDesc": "布丁酒店连锁（广州江泰路地铁站店）位于海珠区江燕路三楼，距地铁2号线江泰路站仅150米（江泰路地铁站D出口直行），无需换乘地铁直达琶洲、广州南站、广州火车站、白马服装城、步云天地鞋城、 广东省汽车站、广州市汽车站等；同时地铁通达北京路、上下九、长隆香江动物园等广州热门旅游景点。酒店地处海珠区繁华商业地段，毗邻江南大道和江燕路，与亚运场馆燕子岗体育场对街相望，紧邻海珠区甲级写字楼—达镖国际大厦和广州医学院附属第二医院（广医二院），500米范围内有广州美术学院、南泰批发市场、金海马家居、香江家居以及燕汇广场等。江南西商业街、广百新一城、摩登百货（海珠购物中心店）、信和广场、珠江医院、广东省口腔医院近在咫尺。周边饮食娱乐一应俱全，汇聚全国各地特色美食。　　酒店开业时间2013年11月，主楼高18层，客房总数65间（套）。 【温馨提示】此酒店不能接待外宾。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/W00009.jpg",
				"type": "W",
				"size": 111
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/B00009.jpg",
				"type": "B",
				"size": 34
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/B00001.jpg",
				"type": "B",
				"size": 26
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/S00009.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/M00009.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 548,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/L00009.jpg",
				"type": "L",
				"size": 107
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/L00001.jpg",
				"type": "L",
				"size": 102
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/W00001.jpg",
				"type": "W",
				"size": 89
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/42/SOHOTO133442/T00009.jpg",
				"type": "T",
				"size": 2
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "159.00",
			"businessarea": "江南西/昌岗/市二宫婚纱街",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.284778",
				"latitude": "23.087566",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "海珠区江燕路132号三楼(临近地铁2号线江泰站D出口,燕汇广场隔壁)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "106509",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州广发商务宾馆",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO133421",
			"hotelEnglishName": "Guangfa Business Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No.6, Bapanwan road, Liwan district, Guangzhou, China",
			"opendate": "2012-04",
			"fitment": "2013-12",
			"tel": "020-81934381",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "231.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "4",
			"longDesc": "广州广发商务酒店位于中山八泮塘路，附近为儿童批发市场。步行约5分钟，可到达着名景点，西关大屋以及荔湾湖公园。在前往西关大屋的途中，您会经过一条古老的美食街，可以品尝当地的特色美食。步行约20分钟，可到达上下九，在热闹的商街中，寻找自己的“宝贝”。\n　　酒店开业时间2012年04月，主楼高2层，客房总数33间（套）。",
			"shortDesc": "　　广州广发商务酒店位于中山八泮塘路，附近为儿童批发市场。步行约5分钟，可到达著名景点，西关大屋以及荔湾湖公园。在前往西关大屋的途中，您会经过一条古老的美食街，可以品尝当地的特色美食。步行约20分钟，可到达上下九，在热闹的商街中，寻找自己的“宝贝”。　　酒店开业时间2012年04月，主楼高2层，客房总数33间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/S00001.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/B00001.jpg",
				"type": "B",
				"size": 24
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 509,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/L00001.jpg",
				"type": "L",
				"size": 63
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/21/SOHOTO133421/W00001.jpg",
				"type": "W",
				"size": 73
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "231.00",
			"businessarea": "上下九/华林玉器城/中山八童装批发",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.242567",
				"latitude": "23.129786",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "荔湾区中山八泮塘路新都里6号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "81192",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州银海宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO51233",
			"hotelEnglishName": "Guangzhou Yinhai Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 43-1 Shuiyin Road, Yuexiu District, Guangzhou, China",
			"opendate": "2012-11",
			"fitment": "2012-11",
			"tel": "18027279264",
			"district": "越秀区",
			"fax": null,
			"maxRate": "228.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "23",
			"longDesc": "银海宾馆位于越秀区水荫路43号（机动车检测站对面），宾馆周围有超市，银行，快餐店，药店，是你出行的首要选择。",
			"shortDesc": null,
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/B00001.jpg",
				"type": "B",
				"size": 17
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/M00001.jpg",
				"type": "M",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/S00001.jpg",
				"type": "S",
				"size": 3
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/L00001.jpg",
				"type": "L",
				"size": 68
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/T00001.jpg",
				"type": "T",
				"size": 1
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/33/SOHOTO51233/W00001.jpg",
				"type": "W",
				"size": 59
			}],
			"relativePositions": [{
				"shortDesc": "广州新白云国际机场",
				"distance": null,
				"transportation": null,
				"type": "CLP"
			}, {
				"shortDesc": "广州白云国际机场",
				"distance": "28",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "228.00",
			"businessarea": "广州东站/天河北/天平架",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.317376",
				"latitude": "23.143794",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区水荫路43号之一(黄花岗机动车检测站对面)距动物园站约537米",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "108279",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州好来都宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": "510400",
			"hotelCode": "SOHOTO49615",
			"hotelEnglishName": "Fangjie Haolaidu Hotel Guangzhou Railway Station",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 5 Guihua Road, Guihuagang, Jiefang North Road, Baiyun District, Guangzhou, China",
			"opendate": "200805",
			"fitment": null,
			"tel": "020-86232830",
			"district": "白云区",
			"fax": null,
			"maxRate": "170.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "2",
			"longDesc": "　　广州好来都宾馆位于解放北桂花岗桂花路5号（广州大学对面外国与学校大门直入），紧靠白云世界皮具城，金桂园小区，广州大学，位置优越。宾馆安静舒适，经济实惠，服务周到，是您出行的不错选择。　　宾馆开业时间2008年05月，主楼高9层，客房总数72间（套）。【温馨提示】宾馆不能接待外宾。",
			"shortDesc": "宾馆开业时间2008年05月，主楼高9层，客房总数72间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/T00010.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/T00002.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/M00002.jpg",
				"type": "M",
				"size": 9
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/L00001.jpg",
				"type": "L",
				"size": 135
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 698,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/L00002.jpg",
				"type": "L",
				"size": 123
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 608,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/L00010.jpg",
				"type": "L",
				"size": 61
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/W00001.jpg",
				"type": "W",
				"size": 104
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/W00010.jpg",
				"type": "W",
				"size": 63
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/B00010.jpg",
				"type": "B",
				"size": 22
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/B00001.jpg",
				"type": "B",
				"size": 29
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/B00002.jpg",
				"type": "B",
				"size": 45
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/S00010.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/S00002.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/W00002.jpg",
				"type": "W",
				"size": 120
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/M00010.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/15/SOHOTO49615/M00001.jpg",
				"type": "M",
				"size": 7
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "170.00",
			"businessarea": "火车站/省站/三元里/西村西场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.271841000",
				"latitude": "23.157916000",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "白云区解放北路桂花岗桂花路5号（广州大学对面外国与学校大门直入）",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "81255",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州白云盛豪宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1133551",
			"hotelEnglishName": "Guangzhou Baiyun Shenghao Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Baiyun District Sanyuanli Magazin 2 (Guotai Shoes City five - six floor)",
			"opendate": "2011-11",
			"fitment": "2012-11",
			"tel": "020-86399881",
			"district": "白云区",
			"fax": null,
			"maxRate": "199.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "null",
			"longDesc": "酒店房间设施齐全，干净卫生，宽敞明亮。地理位置优越，交通便利，欢迎入住！",
			"shortDesc": null,
			"por": null,
			"images": null,
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "199.00",
			"businessarea": "火车站/省站/三元里/西村西场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.262729",
				"latitude": "23.157738",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "白云区三元里走马岗2号(国太鞋城五-六楼)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "81439",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州通程宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO22267",
			"hotelEnglishName": "Guangzhou Tongcheng Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Huangsha Road Liwan District No. 7 (yellow sand subway station opposite the D export) is located in the sand fish market Shamian Island West City Du Hui commercial city",
			"opendate": "2007-10",
			"fitment": "2011-08",
			"tel": "020-81257396",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "218.00",
			"minRate": "151.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "5",
			"longDesc": "广州通程宾馆位于地铁一号线黄沙站D出口的马路正对面，华南地区最大的黄沙水产综合交易市场牌坊下，宾馆南面是目前广州保留最为完好的古欧陆风格的建筑群——沙面公园，是摄影留念、休闲漫步的好地方。距离闻名中外的上下九商业步行街步行也只需15分钟，馆对面就是历史最为悠久、规模最宏大的黄沙谊园文具玩具精品批发中心。周边的白鹅潭、广州医学附属第二医院、广州口腔医院、清平药材批发市场也都是步行即到，闹中带静，地理位置优越，交通十分便利。\n　　广州通程宾馆拥有客房48间（套）。装修简约现代，房间配有电视、空调、热水、宽带上网等基本设施，温馨舒适的住宿环境，简单周全的服务态度，让您得到良好的放松，周边生活配套设施完善，环境优雅，是您商务出差和旅游度假的理想选择之所。\n　　宾馆开业时间2007年10月，新近装修时间2011年8月，局部装修，主楼高13层，附楼高5层，客房总数48间（套）。",
			"shortDesc": "宾馆开业时间2007年10月，新近装修时间2011年8月，局部装修，主楼高13层，客房总数48间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/W00002.jpg",
				"type": "W",
				"size": 49
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/B00002.jpg",
				"type": "B",
				"size": 16
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/T00002.jpg",
				"type": "T",
				"size": 1
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/M00002.jpg",
				"type": "M",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 698,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/L00002.jpg",
				"type": "L",
				"size": 43
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/67/SOHOTO22267/S00002.jpg",
				"type": "S",
				"size": 2
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "151.00",
			"maxRateS": "218.00",
			"businessarea": "上下九/华林玉器城/中山八童装批发",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.245569",
				"latitude": "23.114199",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "荔湾区黄沙大道7号(黄沙地铁站D出口对面)位于黄沙水产市场 沙面岛 西城都荟商业城间",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "108611",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "布丁酒店（广州西华路彩虹桥店）",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": "      ",
			"hotelCode": "SOHOTO46948",
			"hotelEnglishName": "Pod Inn Guangzhou Li Wan Lu Cai Hong Qiao",
			"brandCode": "BD",
			"brandName": "布丁",
			"chainCode": "BDLS",
			"chainName": "布丁连锁",
			"cityName": null,
			"enAddress": "No. 38 Xihua Road, Liwan Disrict, Guangzhou, China",
			"opendate": "201303",
			"fitment": null,
			"tel": "020-81655330",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "208.00",
			"minRate": "152.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "8",
			"longDesc": "布丁酒店（广州西华路彩虹桥店）位于广州荔湾区西华路尾38号，与站前路、流花路首尾相接，距广州火车站、省长途汽车站约乘车十分钟左右，四周环绕各大批发市场：流花服装批发市场、站前路白马服装批发市场、中山八路童装批发市场、十三行服装批发城、西郊饰品批发城及华南小商品交易中心。羊城十景之一的陈家祠、流花湖公园、荔湾湖公园、中山纪念堂、光孝寺、上下九步行街等著名旅游景点就在周边，地理位置十分优越，交通出行便利。　　布丁酒店（广州西华路彩虹桥店）拥有客房72间，客房整洁舒适，房内基本上设施齐全，服务热情周到，住宿环境十分温馨，布丁酒店，简易而不失个性、低价而不失品位，是您旅游、商务出行的绝佳选择。　　酒店开业时间2013年03月，主楼高3层，客房总数72间（套）。【温馨提示】1、酒店无停车场；2、酒店房内不提供免费洗漱用品。",
			"shortDesc": "酒店开业时间2013年03月，主楼高3层，客房总数72间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/T00019.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/T00020.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/T00002.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/T00004.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 588,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/L00002.jpg",
				"type": "L",
				"size": 78
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 461,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/L00003.jpg",
				"type": "L",
				"size": 65
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 828,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/L00019.jpg",
				"type": "L",
				"size": 79
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/L00020.jpg",
				"type": "L",
				"size": 101
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 515,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/L00004.jpg",
				"type": "L",
				"size": 70
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/W00004.jpg",
				"type": "W",
				"size": 81
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/W00019.jpg",
				"type": "W",
				"size": 77
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/W00020.jpg",
				"type": "W",
				"size": 77
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/W00002.jpg",
				"type": "W",
				"size": 81
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/W00003.jpg",
				"type": "W",
				"size": 79
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/B00002.jpg",
				"type": "B",
				"size": 28
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/B00004.jpg",
				"type": "B",
				"size": 26
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/B00019.jpg",
				"type": "B",
				"size": 22
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/B00020.jpg",
				"type": "B",
				"size": 27
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/B00003.jpg",
				"type": "B",
				"size": 25
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/S00003.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/S00004.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/S00019.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/S00002.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/S00020.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/T00003.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/M00019.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/M00002.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/M00003.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/M00004.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/48/SOHOTO46948/M00020.jpg",
				"type": "M",
				"size": 7
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "152.00",
			"maxRateS": "208.00",
			"businessarea": "火车站/省站/三元里/西村西场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.249077000",
				"latitude": "23.140122000",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "荔湾区西华路38号（近流花湖公园）",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "02001532",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "65326",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州揽悦阁公寓(北京路店)",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1164546",
			"hotelEnglishName": "Guangzhou LanYueGe Apartment Beijing Road",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 6 Guangda Second Lane, Beijing Road, Yuexiu District, Guangzhou, China",
			"opendate": "2014-09",
			"fitment": "2014-08",
			"tel": "020-28123000",
			"district": "越秀区",
			"fax": null,
			"maxRate": "193.00",
			"minRate": "152.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "null",
			"longDesc": "广州市揽悦阁公寓位于繁华的北京路西侧，广州市中山五路与广卫路交汇处，地铁公园前站E出口——五月花广场后侧。公寓地理位置优越，交通便利，距离地铁站仅100米，广州火车站、长途汽车站五公里，距离北京路步行街、新大新百货仅一步之遥，步行十五分钟即到天字码头夜游珠江；紧靠广州市政府、广东省财政厅等政府机关单位，周边有中山纪念堂、西汉南越国宫署遗址、唐清海军楼遗址、南汉御花园、明大佛寺、明城隍庙、明清大南门遗址、清庐江书院、广州起义纪念馆等十多个朝代的具有较高历史文化价值的文物古迹，附近吃喝玩乐各种餐饮娱乐配套设施一应俱全。\n揽悦阁是一栋具有独特的中西结合、回廊式古建筑风格的建筑，拥有温馨舒适的花园、商务大床房、标准房及经济房，揽悦阁按三星级标准装修，每间客房均配备舒适的席梦思床具、宜家家私、独立空调、热水器及独立十兆光纤网络，为您营造优质、舒适、干净的住宿环境，是您商务、休闲、娱乐、旅游、购物的理想之选。",
			"shortDesc": null,
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/W00027.jpg",
				"type": "W",
				"size": 82
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/W00028.jpg",
				"type": "W",
				"size": 61
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/W00001.jpg",
				"type": "W",
				"size": 77
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/W00003.jpg",
				"type": "W",
				"size": 67
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/W00002.jpg",
				"type": "W",
				"size": 75
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/B00001.jpg",
				"type": "B",
				"size": 29
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/B00003.jpg",
				"type": "B",
				"size": 26
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/B00027.jpg",
				"type": "B",
				"size": 30
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/B00002.jpg",
				"type": "B",
				"size": 24
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/B00028.jpg",
				"type": "B",
				"size": 22
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/S00028.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/S00001.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/S00002.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/S00003.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/T00027.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/T00028.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/T00003.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/M00027.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/M00002.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/M00003.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/S00027.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/L00027.jpg",
				"type": "L",
				"size": 131
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/L00028.jpg",
				"type": "L",
				"size": 106
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/L00002.jpg",
				"type": "L",
				"size": 88
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/T00002.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/M00028.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/L00001.jpg",
				"type": "L",
				"size": 122
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/46/SOHOTO1164546/L00003.jpg",
				"type": "L",
				"size": 111
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "152.00",
			"maxRateS": "193.00",
			"businessarea": "北京路/海珠广场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.273556",
				"latitude": "23.133001",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区北京路口广大二巷六号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "90572806",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "67459",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州丰宁宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO138757",
			"hotelEnglishName": "Fengning Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No.86 Xinfeng Road.",
			"opendate": "2008-04",
			"fitment": "1900-01",
			"tel": "020-81843880",
			"district": "越秀区",
			"fax": null,
			"maxRate": "270.00",
			"minRate": "152.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "5",
			"longDesc": "　　宾馆开业时间2008年04月，主楼高3层，客房总数46间（套）。\n \n【温馨提示】\n1.宾馆不能接待外宾；",
			"shortDesc": "宾馆开业时间2008年04月，主楼高3层，客房总数46间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/W00001.jpg",
				"type": "W",
				"size": 85
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/B00001.jpg",
				"type": "B",
				"size": 31
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/57/SOHOTO138757/L00001.jpg",
				"type": "L",
				"size": 93
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "152.00",
			"maxRateS": "270.00",
			"businessarea": "北京路/海珠广场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.260021",
				"latitude": "23.126978",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区人民中路344号(人民中路和惠福西路的交叉口)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "108054",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州上九湾酒店",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1581",
			"hotelEnglishName": "Shangjiuwan Hotel - Guangzhou",
			"brandCode": "SJW",
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Shangjiu Road 46, Liwan District, Guangzhou.",
			"opendate": "2008-08",
			"fitment": "1900-01",
			"tel": "020-62756888",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "307.00",
			"minRate": "153.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "6",
			"longDesc": "广州上九湾酒店位于广州最繁华的商业旺地之一，毗邻文化公园、沙面岛、华林寺等旅游景点，步行可到最具广州饮食特色之淘淘居、广州酒家、莲香楼等着名餐饮企业，附近有荔湾广场、十三行服装批发市场，交通便利。酒店客房进行了精致装修及硬件配置。所有房间均配有宽带终端，冷暖鲜风空调，壁挂式液晶电视，IDD国内国际长途电话，二十四小时中央热水。\n　　酒店开业时间2008年8月8日，楼高11层，客房总数98间（套）。\n\n【温馨提示】酒店没有停车场。",
			"shortDesc": "酒店开业时间2008年8月8日，楼高11层，客房总数98间（套）。",
			"por": "|沙面岛、上下九步行街|",
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/W00023.jpg",
				"type": "W",
				"size": 64
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/W00001.jpg",
				"type": "W",
				"size": 65
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/W00002.jpg",
				"type": "W",
				"size": 79
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/W00003.jpg",
				"type": "W",
				"size": 83
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/B00023.jpg",
				"type": "B",
				"size": 25
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/B00001.jpg",
				"type": "B",
				"size": 21
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/B00003.jpg",
				"type": "B",
				"size": 27
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/B00002.jpg",
				"type": "B",
				"size": 27
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/S00002.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/S00023.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/S00003.jpg",
				"type": "S",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/T00002.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/T00003.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/T00023.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/M00001.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/M00003.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/M00023.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/M00002.jpg",
				"type": "M",
				"size": 8
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/L00001.jpg",
				"type": "L",
				"size": 86
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/L00002.jpg",
				"type": "L",
				"size": 97
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 655,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/L00023.jpg",
				"type": "L",
				"size": 66
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/81/SOHOTO1581/L00003.jpg",
				"type": "L",
				"size": 104
			}],
			"relativePositions": [{
				"shortDesc": "十三行",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州酒家",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "沙面岛、上下九步行街",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "沙面岛",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "荔湾广场",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "莲香楼",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "爱群码头",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广百大厦",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "沙面",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "越秀公园华林寺",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "上下九",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "陶陶居",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州火车东站",
				"distance": "15",
				"transportation": {
					"footInterval": null,
					"carInterval": "20/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "沙面、上下九步行街",
				"distance": null,
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "北京路",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": "40",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "陈家祠",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州火车站",
				"distance": "5",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "北京路步行街",
				"distance": "2",
				"transportation": {
					"footInterval": "30/分钟",
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "上下九步行街",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "十甫名都",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}, {
				"vendorCode": "SZJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "153.00",
			"maxRateS": "307.00",
			"businessarea": "上下九/华林玉器城/中山八童装批发",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.25852998",
				"latitude": "23.12206146",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "上九路46号(与光复中路交汇处)/荔湾广场/华林国际玉器城/地铁1号线长寿路站",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "16149",
			"value": "0"
		}, {
			"vendorCode": "SZJL",
			"vendorHotelCode": "2033",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州粤阳宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO176802",
			"hotelEnglishName": "Yueyang Hotel Guangzhou",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Haizhu District forward road Beaulieu East on the 1st",
			"opendate": "2010-04",
			"fitment": "2012-04",
			"tel": "020-34290918",
			"district": "海珠区",
			"fax": null,
			"maxRate": "153.00",
			"minRate": "153.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "7",
			"longDesc": "广州粤阳宾馆座落于繁盛的万国广场商圈。附近着名的景点有珠江夜游（广州八景之一）、大元帅府、晓港公园，着名的大学有仲恺农业学院、城市职业技术学院、广州美院。是你休闲、旅游的好去处。本酒店是一家小巧精致温暖的酒店，闹中取静。出繁盛而不吵闹，附近有多所出名的饭店如根据地、南园酒家、新兴饭店、如意坊等，购物有华润万家，位置十分优越。(酒店目前暂不接待外宾）",
			"shortDesc": null,
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/B00001.jpg",
				"type": "B",
				"size": 23
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/L00001.jpg",
				"type": "L",
				"size": 86
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/W00001.jpg",
				"type": "W",
				"size": 72
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/02/SOHOTO176802/T00001.jpg",
				"type": "T",
				"size": 2
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "153.00",
			"maxRateS": "153.00",
			"businessarea": "江南西/昌岗/市二宫婚纱街",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.288901",
				"latitude": "23.106346",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "海珠区前进路蟠龙东1号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "104880",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州诚岗商务酒店",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO132861",
			"hotelEnglishName": "Chenggang Traders Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No.11, Chengang road, Liwan district, Guangzhou, China",
			"opendate": "2013-11",
			"fitment": "1900-01",
			"tel": "020-66377636",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "154.00",
			"minRate": "154.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "4",
			"longDesc": "广州诚岗商务酒店诚岗商务酒店坐落于广州市陈岗路11号，\n    交通便利：毗邻广州火车站、省、市汽车站、地铁站、流花湖公园、越秀公园，步行至机场快线、港澳直通车仅需8分钟，交通非常便利；\n    酒店周围设施：邻近有各大服装城（白马、天马、红棉、地一大道）、皮具、饰品、化妆品及钟表批发市场;周边有各种不同口味的餐厅（粤系、湘系、川系），街边有各种特色小吃。所有客房内配备免费的洗簌用品，宽带网络、无线WIFI。选择诚岗，选择“回家”;选择你我，选择精彩！\n【温馨提示】酒店不能刷卡结账。",
			"shortDesc": "酒店开业时间2013年11月，主楼高8层，客房总数39间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/B00001.jpg",
				"type": "B",
				"size": 24
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 537,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/L00001.jpg",
				"type": "L",
				"size": 64
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO132861/W00001.jpg",
				"type": "W",
				"size": 71
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "154.00",
			"maxRateS": "154.00",
			"businessarea": "火车站/省站/三元里/西村西场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.257849",
				"latitude": "23.146073",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "荔湾区陈岗路11号(站前路批发商圈)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "81458",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州海大新宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1113959",
			"hotelEnglishName": "Daxin Hotel Guangzhou",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "3 / F 153 Xingang West Road Haizhu District Guangzhou City Guangdong Province",
			"opendate": "2011-11",
			"fitment": "2012-11",
			"tel": "020-89102610",
			"district": "海珠区",
			"fax": null,
			"maxRate": "362.00",
			"minRate": "155.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "null",
			"longDesc": "海大新宾馆酒店有商务客房近100间，配备分体式空调、卫星电视及每间房独立采用电信4G宽带网、高档中餐功能各异的宴会厅，华贵典雅，汇翠名师料理的中华潮、粤名肴。座落于广州市城市新中轴线地标建筑——广州新电视塔南侧，广州TIT创意园内，广州地铁二、三号线南北交汇于此。与CBD珠江新城一江之隔，南北相望。广州大桥、猎德大桥在两侧擦肩而过，遥相呼应。毗邻中大服装服饰圈、琶洲会展商圈，紧靠中山大学、广州美术学院、服装学院、珠江电影制片厂。　　酒店泊车空间充足，拥有500多个停车位，交通便利，距白云国际机场仅需三十分钟车程，至广州火车站、火车东站约十五分钟车程；距琶洲展馆仅五分钟车程。广州纺园酒店是阁下从事商务、会议、休闲、娱乐的最佳选择。将以“唯真至美，唯美至善”的服务宗旨，令阁下商旅之行称心如意。",
			"shortDesc": null,
			"por": null,
			"images": null,
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "155.00",
			"maxRateS": "362.00",
			"businessarea": "客村/中大布匹城",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.305531",
				"latitude": "23.097886",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "广东省广州市海珠区新港西路153号3层",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "90032785",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "107400",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州淘金宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO10001",
			"hotelEnglishName": "Taojin Hotel - Guangzhou",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "NO.186 Taojin Road, Yuexiu District, Guangzhou, China",
			"opendate": "2009-10",
			"fitment": "2011-06",
			"tel": "020-83579962",
			"district": "越秀区",
			"fax": null,
			"maxRate": "275.00",
			"minRate": "156.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "9",
			"longDesc": "广州市淘金宾馆是海南省人民政府驻广州办事处的下属国有单位，位于淘金路186号，淘金华庭对面小路进去100米，紧邻环市路淘金商圈，靠近花园酒店，白云宾馆，广州世界贸易大厦，中山大学眼科医院，广东省第二中医院，背靠环境优美的黄花岗公园，空气清新，环境幽静。宾馆拥有标准大床房、豪华双床房、高级家庭房、商务大床房、豪华套房等多种房型，性价比高，客房安静舒适，适合旅行，出差，学习等，有免费WiFi。\n　　酒店开业时间2011年装修，楼高8层，客房总数84间（套）。",
			"shortDesc": "酒店开业时间2009年10月1日，楼高8层，客房总数84间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/B00001.jpg",
				"type": "B",
				"size": 29
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/L00001.jpg",
				"type": "L",
				"size": 113
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/W00001.jpg",
				"type": "W",
				"size": 90
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/01/SOHOTO10001/T00001.jpg",
				"type": "T",
				"size": 2
			}],
			"relativePositions": [{
				"shortDesc": "环市东路附近",
				"distance": "1.28",
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "琶洲国际会展中心",
				"distance": "8",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "广州友谊商店",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州好又多",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "世贸大厦",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "白云宾馆",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "环市东路附近",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": "28",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "丽柏广场",
				"distance": "0.82",
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州火车东站",
				"distance": "8",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "花园酒店",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州火车站",
				"distance": "4",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "北京路步行街",
				"distance": "5",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "黄花岗公园",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州电视台",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "156.00",
			"maxRateS": "275.00",
			"businessarea": "环市东/淘金/区庄/小北",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.299881",
				"latitude": "23.14725",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "淘金路186号(地铁淘金站B出口/友谊商店往淘金东路方向/黄花岗公园北门/财经职业学校)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "32001242",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "81397",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州盈丰源宾馆",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO15261",
			"hotelEnglishName": "Guangzhou Yingfengyuan Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 7-19 Wanshou Road, Haizhu District, Guangzhou, China",
			"opendate": "2010-01",
			"fitment": "2012-06",
			"tel": "020-84258009",
			"district": "海珠区",
			"fax": null,
			"maxRate": "290.00",
			"minRate": "157.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "7",
			"longDesc": "广州盈丰源宾馆是一家集客房、棋牌、沐足为一体的综合型宾馆，宾馆风格简约，别致，格调清新典雅，干净、温馨的住宿环境，优质的宾客服务，是繁忙的商务客人及休闲旅游客人温暖舒适的理想家园。宾馆位于海印桥南万寿路，棋牌室有豪华、大、中、小房共32间，沐足房7间，中式、泰式按摩房4间。宾馆毗邻海印公园、晓港公园、黄金海岸水上乐园、中大码头、大元帅府等，周边有华润万家、好又多、家乐福、万国广场、广百百货、状元坊、金矿KTV、南园酒家、红树湾家具博览中心、广东省海印茶叶市场、广州图书市场等商家卖场，院校有仲恺农业学院、广东警官学院、省兽医防疫站、市旅游学校，医院有广州脊柱病医院、广州医学院第一附属医院，地铁2号线江南西站、市二宫站经过此区，交通十分便利。\n　　宾馆开业时间2010年01月，新近装修时间2012年06月，局部装修，主楼高9层，客房总数100间（套）。",
			"shortDesc": "宾馆开业时间2010年01月，新近装修时间2012年06月，局部装修，主楼高9层，客房总数100间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/W00001.jpg",
				"type": "W",
				"size": 71
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/B00001.jpg",
				"type": "B",
				"size": 29
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 633,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/61/SOHOTO15261/L00001.jpg",
				"type": "L",
				"size": 64
			}],
			"relativePositions": [{
				"shortDesc": "广州火车站",
				"distance": "5",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "广州白云国际机场",
				"distance": "20",
				"transportation": {
					"footInterval": null,
					"carInterval": "30/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "华润万家超市",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "大元帅府",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "珠江南（河南）",
				"distance": null,
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "珠江南（河南）地区",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "家乐福",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "晓港公园",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "珠江夜游",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "琶州会展中心",
				"distance": "10",
				"transportation": {
					"footInterval": null,
					"carInterval": "15/分钟"
				},
				"type": "TRA"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "157.00",
			"maxRateS": "290.00",
			"businessarea": "江南西/昌岗/市二宫婚纱街",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.286608",
				"latitude": "23.109047",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "海珠区万寿路7-19号(近地铁2号线江南西站和市二宫站海珠区万联购物中心对面)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "137561",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州椰城宾馆",
			"rank": "3A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO11027",
			"hotelEnglishName": "Yecheng Hotel - Guangzhou",
			"brandCode": "YC20",
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 558 Guangfu North Road, Liwan District, Guangzhou, China",
			"opendate": "2000-05",
			"fitment": "2010-12",
			"tel": "020-81849888",
			"district": "荔湾区",
			"fax": null,
			"maxRate": "167.00",
			"minRate": "158.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "80",
			"longDesc": "广州椰城宾馆位于荔湾区繁华地段。\n  交通便利：紧邻地铁1号线西门口站，邻近上下九步行街、北京路步行街、人民公园，周边公交发达，交通十分便利。\n  酒店设施：宾馆房间内24小时供应热水，免费宽带上网；一二三楼设有早茶、中茶、下午茶，包含广州特色风味小吃、地道湖南湘菜、川菜供宾客享用；四楼设有茶室，棋牌；是商务洽谈的理想地方；五至八楼是酒店豪华客房94间；九楼是海口市政府驻广州办事处办公楼，设有小型会议室一个，可以容纳30－－40个人会议；一楼大堂设有商务中心，便捷国内外商客的旅游出行。",
			"shortDesc": "宾馆开业时间2000年5月18日，新近装修时间2010年12月26日，楼高9层，客房总数94间（套）。",
			"por": "|沙面岛、上下九步行街|",
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/T00007.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/L00001.jpg",
				"type": "L",
				"size": 147
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 530,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/L00007.jpg",
				"type": "L",
				"size": 71
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 570,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/L00009.jpg",
				"type": "L",
				"size": 65
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 532,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/L00008.jpg",
				"type": "L",
				"size": 65
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/W00008.jpg",
				"type": "W",
				"size": 82
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/W00009.jpg",
				"type": "W",
				"size": 71
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/W00001.jpg",
				"type": "W",
				"size": 106
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/W00007.jpg",
				"type": "W",
				"size": 84
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/B00001.jpg",
				"type": "B",
				"size": 30
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/B00007.jpg",
				"type": "B",
				"size": 31
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/B00008.jpg",
				"type": "B",
				"size": 26
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 300,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/B00009.jpg",
				"type": "B",
				"size": 28
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/S00007.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/S00008.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/S00009.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/T00008.jpg",
				"type": "T",
				"size": 1
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/T00009.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/M00007.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/M00008.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/27/SOHOTO11027/M00009.jpg",
				"type": "M",
				"size": 7
			}],
			"relativePositions": [{
				"shortDesc": "沙面岛、上下九步行街",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "天河城",
				"distance": "5",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "北京路步行街",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": "38",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "天河体育中心",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "广州火车站",
				"distance": "15",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "广州火车东站",
				"distance": "15",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "沙面、上下九步行街",
				"distance": null,
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "天河体育中心",
				"distance": "0",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "ELONG"
			}, {
				"vendorCode": "LTJL"
			}, {
				"vendorCode": "SZJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "158.00",
			"maxRateS": "167.00",
			"businessarea": "上下九/华林玉器城/中山八童装批发",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.259323",
				"latitude": "23.129762",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "荔湾区光复北路558号(近地铁1号线西门口站A)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "ELONG",
			"vendorHotelCode": "32001346",
			"value": null
		}, {
			"vendorCode": "LTJL",
			"vendorHotelCode": "105711",
			"value": "0"
		}, {
			"vendorCode": "SZJL",
			"vendorHotelCode": "1454",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "7天连锁酒店(广州黄花岗地铁站店)",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO148141",
			"hotelEnglishName": "7 Days Inn Guangzhou Zoo Bus Station",
			"brandCode": "7T",
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 102 Xianlie Middle Road , Yuexiu District, Guangzhou, China",
			"opendate": "2007-01",
			"fitment": "1900-01",
			"tel": "020-37871688",
			"district": "越秀区",
			"fax": null,
			"maxRate": "216.00",
			"minRate": "158.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "7",
			"longDesc": "7天连锁酒店广州动物园总站店，分店位于广州动物园北门旁，距离黄花岗剧院、永福路汽车配件用品城步行仅3分钟，毗邻环市路商圈，步行15分钟到达区庄地铁，房价167元起，订房热线：13719217448黄小姐、18620923451吴小姐（工作时间：10：00-20：00不分节假日）。 \n本店周边集中汽配商贸商务中心、旅游景点、娱乐休闲会所。住客白天可以游览动物主题公园、海洋馆；晚上可以到黄花岗剧院、哈乐演艺厅欣赏演出；堂会KTV、钱柜KTV、红点量贩KTV等步行约10分钟；出门就有湘、川、粤等各地特色风味美食等着您品尝；离广州大型购物广场天河城、丽柏广场约15分钟车程。另有华南远近闻名的沙河服装批发市场、永福路汽车配件用品城、 中山大学附属肿瘤医院、中山医科大学眼科医院、黄花岗剧院、广东科学院、广东省地震局、哈乐演艺厅、白云山、星海音乐学院、广东工业大学等与之毗邻。 \n交通便利：位于动物园公交总站旁边，离地铁5号线区庄站步行约15分钟，内环路、环城高速公路的出入口附近。离天河城、体育中心、世贸中心、广州火车站、火车东站、天河客运站坐车约15分钟，距花园酒店（机场快线下客点）约10分钟车程。广州黄花岗剧院店是您出行、旅游、商务的优选之所。我们将以真挚、热情的服务欢迎您的到来！",
			"shortDesc": null,
			"por": null,
			"images": null,
			"relativePositions": [{
				"shortDesc": "沙面公园",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "黄花岗剧院",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "动物园",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "地铁站",
				"distance": "0.8",
				"transportation": {
					"footInterval": "15/分钟",
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "天字码头",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "158.00",
			"maxRateS": "216.00",
			"businessarea": "环市东/淘金/区庄/小北",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.307705",
				"latitude": "23.147699",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "广州市越秀区先烈中路102号(动物园公交总站旁,浙江大厦对面军区路口)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "109196",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州利洋宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO5168",
			"hotelEnglishName": "Liyang Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 28 Airport Road, Baiyun District, Guangdong, Guangzhou",
			"opendate": "200201",
			"fitment": "200801",
			"tel": "020-22355188",
			"district": "白云区",
			"fax": null,
			"maxRate": "189.00",
			"minRate": "160.00",
			"taxFeeInd": null,
			"floor": "9",
			"roomQuantity": "90",
			"longDesc": "　　广州利洋宾馆座落于广州市交通要道——机场路，南临广州火车站和中国出口商品交易会，北接花都新机场，距地铁2号线三元里站仅需五分钟路程，乘地铁可直达琶州会馆，交通十分便利。　广州利洋宾馆拥有装修考究、格调高雅，设施完善的各类房型，设有商务中心、商场等配套设施，所有房间均配有免费宽带上网、冰箱、提供24小时热水淋浴，有线电视和国内国际长途电话等设施和服务，适宜外籍及工厂人士长住或办公，是国内外企业办事的最理想的下榻之处。　　广州利洋宾馆秉承“诚招天下客，情暖宾客心”的服务理念，以专业和专注的职业精神，加上尽善尽美的优质服务，将为出差旅游的您营造一个温馨浪漫的“家外之家”。",
			"shortDesc": null,
			"por": "|白云区|",
			"images": null,
			"relativePositions": [{
				"shortDesc": "广州火车站",
				"distance": "15",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "同湘会",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "白云区",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "三元里服装、皮具、鞋业、化妆品批发市场附近",
				"distance": null,
				"transportation": null,
				"type": "HOT"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": "30",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "北京路步行街",
				"distance": "25",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "160.00",
			"maxRateS": "189.00",
			"businessarea": null,
			"hotelAmenities": null,
			"position": {
				"longitude": "113.25652",
				"latitude": "23.16045",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "广东 广州 白云区 机场路28号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "78108",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "7天连锁酒店(广州五羊新城华润万家店)",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO40745",
			"hotelEnglishName": "7 Days Inn(Guangzhou Wuyang New City CR Vanguard)",
			"brandCode": "7T",
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 8 Siyou Yima Road, Yuexiu District, Guangzhou, China",
			"opendate": "2012-10",
			"fitment": "2014-10",
			"tel": "020-87378777",
			"district": "越秀区",
			"fax": null,
			"maxRate": "303.00",
			"minRate": "160.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "7",
			"longDesc": "118届秋交会火热预定中…………会展期间提供免费豪华大巴往返接送，15分钟可抵达展馆，欢迎新老客户致电咨询：020-8737 8777；彭先生13622282595。本店位于繁华的五羊新城商圈距华润万家、珠江宾馆、长城酒店、长城宾馆、广州军区司令部、广州军区礼堂仅一步之遥。距珠江新城商圈的花城广场、西塔（广州国际金融中心）、广东省博物馆、广州大剧院、广州妇女儿童医疗，富力中心大厦等也仅3分钟车程；距离地铁5号线五羊邨站A出入口步行仅需8分钟，到琶洲展馆乘坐地铁仅6个站、15分钟车程；本店位于五羊新城食街，周边餐饮设施多样，各种口味应有尽有，着名的粤菜连锁－－－－肥婶餐厅近在咫尺；附近娱乐设施配套齐全：水汇国际休闲会所等丰富您的业余生活；工商银行等大型金融机构环绕四周；公交车珠江宾馆站距离本店100米，公交直达北京路步行街，到天河城、正佳广场、体育中心仅10分钟车程；坐拥广州最高端的商务资源，写字楼林立，人保大厦、南方报社、外商大酒店、华普广场、花城大道南天国际照明中心、星汇国际、双汇国际、名门大厦、远洋大厦、发展中心、广东省民主大楼、华景大厦、五羊新城广场、泰恒大厦、丰伟大厦，本店房间方正，外景窗户自然采光，通风良好，背靠安静小区，面朝小河流水，闹中带静，周边配套成熟完善，是您出差旅游、娱乐休闲、商务参展、探亲访友必备之选！畅游广州，五羊新城华润万家店是您的不二选择，广州五羊新城华润万家店全体员工竭诚为您服务。",
			"shortDesc": "酒店开业时间 年 月 日，新近装修时间 年 月 日，楼高 米，共有客房总数 间（套），标间面积 平米。",
			"por": null,
			"images": null,
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "160.00",
			"maxRateS": "303.00",
			"businessarea": "珠江新城/五羊新城",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.314232",
				"latitude": "23.124086",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区寺右一马路8号",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "108087",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州昌中宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO148349",
			"hotelEnglishName": "Changzhong Hotel in Guangzhou",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Haizhu District Changgang Road 120 (Metro Line 8 Baogang Avenue Station Exit C next to)",
			"opendate": "2013-08",
			"fitment": "2013-08",
			"tel": "020-89258276",
			"district": "海珠区",
			"fax": null,
			"maxRate": "190.00",
			"minRate": "160.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "3",
			"longDesc": "广州昌中宾馆位于广州市海珠区昌岗中路，地铁8号线宝岗大道站C出口，乘地铁到琶洲国际会展中心仅须10分钟。宾馆装修豪华、舒适，周边各种商业、娱乐、购物设施齐全，给您带您宾至如归的感觉。各客房独立洗手间、空调、彩电、电话等设施一俱全，为您提供舒适的环境和周到的服务。\n　　宾馆开业时间2013年08月，主楼高2层，客房总数27间（套）。\n \n【温馨提示】\n1.宾馆不能接待外宾；\n2.宾馆不能刷卡结账。",
			"shortDesc": "宾馆开业时间2013年08月，主楼高2层，客房总数27间（套）。",
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/B00001.jpg",
				"type": "B",
				"size": 21
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/B00004.jpg",
				"type": "B",
				"size": 24
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/B00005.jpg",
				"type": "B",
				"size": 20
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/S00005.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/M00001.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/M00004.jpg",
				"type": "M",
				"size": 7
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 830,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/L00001.jpg",
				"type": "L",
				"size": 78
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 830,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/L00004.jpg",
				"type": "L",
				"size": 81
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 830,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/L00005.jpg",
				"type": "L",
				"size": 59
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/W00001.jpg",
				"type": "W",
				"size": 59
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/W00004.jpg",
				"type": "W",
				"size": 69
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/W00005.jpg",
				"type": "W",
				"size": 60
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/S00004.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/T00004.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/T00005.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/49/SOHOTO148349/M00005.jpg",
				"type": "M",
				"size": 6
			}],
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "160.00",
			"maxRateS": "190.00",
			"businessarea": "江南西/昌岗/市二宫婚纱街",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.275261",
				"latitude": "23.091944",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "海珠区昌岗中路120号(地铁8号线宝岗大道站C出口旁边)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "105672",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州亮星酒店",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO51025",
			"hotelEnglishName": "StarryHotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "Beijing Road subway station A exit",
			"opendate": "2008-08",
			"fitment": "2014-02",
			"tel": "020-83366223",
			"district": "越秀区",
			"fax": null,
			"maxRate": "218.00",
			"minRate": "160.00",
			"taxFeeInd": null,
			"floor": "5",
			"roomQuantity": "21",
			"longDesc": "亮星酒店位于北京路地铁站A出口，新装修的酒店，聘请设计师设计室内艺术网格，酒店充满文艺气息，适合情侣出游及朋友出游。",
			"shortDesc": null,
			"por": null,
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/T00001.jpg",
				"type": "T",
				"size": 1
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/M00001.jpg",
				"type": "M",
				"size": 5
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/B00001.jpg",
				"type": "B",
				"size": 14
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/S00001.jpg",
				"type": "S",
				"size": 3
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/L00001.jpg",
				"type": "L",
				"size": 49
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/25/SOHOTO51025/W00001.jpg",
				"type": "W",
				"size": 47
			}],
			"relativePositions": [{
				"shortDesc": "广州新白云国际机场",
				"distance": "30",
				"transportation": {
					"footInterval": null,
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "广州新白云国际机场",
				"distance": null,
				"transportation": null,
				"type": "CLP"
			}],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "160.00",
			"maxRateS": "218.00",
			"businessarea": "北京路/海珠广场",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.276616",
				"latitude": "23.124606",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "北京路地铁站A出口",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "104719",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州柏力商务酒店",
			"rank": "2A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO13893",
			"hotelEnglishName": "Guangzhou Palace Hotel",
			"brandCode": "BL11",
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 171-173 Taisha Road, Haizhu District, Guangzhou, China",
			"opendate": "2010-10",
			"fitment": "2014-05",
			"tel": "020-84290788",
			"district": "海珠区",
			"fax": null,
			"maxRate": "190.00",
			"minRate": "161.00",
			"taxFeeInd": null,
			"floor": "3",
			"roomQuantity": "82",
			"longDesc": "酒店位于海珠区繁华地段。东邻东晓南路、中大布料市场，西依地铁站、燕子岗体育场。中山大学、中大布匹市场、美术学院、广医二院、联城医疗站等近在咫尺。酒店提供免费停车、免费宽带上网、交易会期间专车免费接送等服务。距离地铁2号线江泰路站5分钟路程，可达亚运各场馆及广州省站、东站、南站、机场、琶洲国际会展中心、北京路步行街、上下九步行街、海珠广场及天河城购物中心等。集休闲、娱乐、商务、医疗于一体。周边餐饮有如轩潮汕沙锅粥、重庆餐厅，石岗渔村等。 \n    酒店有经济房、大床房、商务大床房、家庭房等共82间，配有大型免费停车场。房间内部设有独立空调，宽带上网，24小时冷热水，大屏幕液晶卫星电视，四星级卧具及纯棉床上用品，免费提供洗漱用品，设施齐备，居住舒适，是商务、旅游、休闲人士的理想居停之选。 　　 \n    酒店开业时间2010年10月15日，楼高3层，客房总数82间（套）。\n温馨提示：2012年4月14日至5月4日交易会期间，提前退房须多扣一晚房费。",
			"shortDesc": "酒店开业时间2010年10月15日，楼高3层，客房总数82间（套）。",
			"por": "|珠江南（河南）地区|",
			"images": [{
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/T00001.jpg",
				"type": "T",
				"size": 2
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 70,
				"width": 70,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/T00002.jpg",
				"type": "T",
				"size": 1
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/M00001.jpg",
				"type": "M",
				"size": 6
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 135,
				"width": 180,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/M00002.jpg",
				"type": "M",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 890,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/L00001.jpg",
				"type": "L",
				"size": 78
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 698,
				"width": 640,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/L00002.jpg",
				"type": "L",
				"size": 57
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/B00001.jpg",
				"type": "B",
				"size": 20
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 350,
				"width": 350,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/B00002.jpg",
				"type": "B",
				"size": 19
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/S00001.jpg",
				"type": "S",
				"size": 4
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 120,
				"width": 120,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/S00002.jpg",
				"type": "S",
				"size": 3
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/W00002.jpg",
				"type": "W",
				"size": 55
			}, {
				"category": "WJ",
				"roomTypeCode": null,
				"height": 500,
				"width": 800,
				"url": "http://media.sohoto.com/thub/market/images/hotelimages/93/SOHOTO13893/W00001.jpg",
				"type": "W",
				"size": 62
			}],
			"relativePositions": [{
				"shortDesc": "广州火车站",
				"distance": "15",
				"transportation": {
					"footInterval": null,
					"carInterval": "20/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "地铁站",
				"distance": "0.5",
				"transportation": {
					"footInterval": "5/分钟",
					"carInterval": null
				},
				"type": "TRA"
			}, {
				"shortDesc": "白云机场",
				"distance": "25",
				"transportation": {
					"footInterval": null,
					"carInterval": "40/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "琶洲国际会展中心",
				"distance": null,
				"transportation": null,
				"type": "SGT"
			}, {
				"shortDesc": "长途汽车站",
				"distance": "2.5",
				"transportation": {
					"footInterval": null,
					"carInterval": "5/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "市中心",
				"distance": "1.5",
				"transportation": {
					"footInterval": null,
					"carInterval": "3/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "珠江南（河南）地区",
				"distance": null,
				"transportation": null,
				"type": "POR"
			}, {
				"shortDesc": "会展中心",
				"distance": "5",
				"transportation": {
					"footInterval": null,
					"carInterval": "10/分钟"
				},
				"type": "TRA"
			}, {
				"shortDesc": "江南西路",
				"distance": null,
				"transportation": null,
				"type": "HOT"
			}],
			"vendorMessages": [{
				"vendorCode": "HRS"
			}, {
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "161.00",
			"maxRateS": "190.00",
			"businessarea": "琶洲展馆",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.292651",
				"latitude": "23.087339",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "广州市海珠区泰沙路171-173号(穗宝变电站斜对面)",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "108026",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}, {
		"paymentStatus": null,
		"roomStayStatus": null,
		"basicProperty": {
			"hotelName": "广州杨城宾馆",
			"rank": "1A",
			"cityCode": "CAN",
			"postCode": null,
			"hotelCode": "SOHOTO1117507",
			"hotelEnglishName": "Guangzhou Yangcheng Hotel",
			"brandCode": null,
			"brandName": null,
			"chainCode": null,
			"chainName": null,
			"cityName": null,
			"enAddress": "No. 25 Zhongshan 1st Road, Yuexiu District, Guangzhou, China",
			"opendate": "2010-05",
			"fitment": "2014-08",
			"tel": "020-87359232",
			"district": "越秀区",
			"fax": null,
			"maxRate": "218.00",
			"minRate": "161.00",
			"taxFeeInd": null,
			"floor": null,
			"roomQuantity": "null",
			"longDesc": "本酒店位于广州市市中心越秀区中山一路25号毗邻珠江新城，天河城，体育中心，五羊新城，东山口，正佳广场，王府井百货，购物休闲随心所欲，解放军458医院步行5分钟，广东省人民医院，中山医科大学附属医院地铁一站距离，地理位置优越交通方便（广州地铁1号线5号线交汇杨箕地铁站B出口）去火车站，火车东站只要10分钟左右，去机场，火车南站30分钟 。 酒店于2014年8月份重新装修，所有客房布置完善细致，风格典雅温馨，环境舒适自由。均设有有线光纤上网，无线wifi，卫星闭路电视，热水器，国内电话直拨，电子门锁系统等。令起居倍感愉悦！",
			"shortDesc": null,
			"por": null,
			"images": null,
			"relativePositions": [],
			"vendorMessages": [{
				"vendorCode": "LTJL"
			}],
			"vendorRates": null,
			"flagT": false,
			"minRateT": null,
			"maxRateT": null,
			"flagS": true,
			"minRateS": "161.00",
			"maxRateS": "218.00",
			"businessarea": "珠江新城/五羊新城",
			"hotelAmenities": [],
			"position": {
				"longitude": "113.317333",
				"latitude": "23.134639",
				"longitudeFrom": null,
				"latitudeFrom": null,
				"longitudeTo": null,
				"latitudeTo": null
			},
			"currency": null,
			"address": "越秀区中山一路25号二楼",
			"location": null,
			"url": null
		},
		"timeSpan": {
			"startDate": "2017-05-26",
			"endDate": "2017-05-29",
			"end": null,
			"start": null
		},
		"arriveEarlyTime": null,
		"arriveLateTime": null,
		"paymentMode": null,
		"roomRates": null,
		"resOrderID": null,
		"comments": null,
		"guaranteeType": null,
		"guestCounts": null,
		"totalAmount": null,
		"agentAmount": null,
		"totalCommission": null,
		"confirmLevels": [{
			"vendorCode": "LTJL",
			"vendorHotelCode": "81523",
			"value": "0"
		}],
		"formatSpecialRequest": null,
		"specAuth": "N",
		"availabilityStatus": "avail",
		"specialRequest": null,
		"guaranteeStatus": null,
		"vendorComments": null,
		"totalFee": null,
		"guaranteeAmount": null,
		"paymentDeadLine": null,
		"guaranteeDeadLine": null,
		"cancelDeadLine": null,
		"currency": null
	}]
	addMarker(data);
	//	appcan.request.ajax({
	//		url: httpHost + 'hotelController.do?queryHotelsList',
	//		beforeSend: addHeader,
	//		data: dataList,
	//		type: "POST",
	//		dataType: "json",
	//		success: function(data) {
	//			console.log(data);
	//			layer.closeAll();
	//			if(data.success) {
	//				map.remove(markers);
	//				addMarker(data.obj.t.roomStays);
	//			} else {
	//				if(data.msg == "用户未登录") {
	//					reLogin(queryHotelsList);
	//				} else {
	//					appcan.window.confirm({
	//						title: '提示',
	//						content: data.msg,
	//						buttons: ['确定'],
	//						callback: function(err, data, dataType, optId) {
	//							appcan.window.close(1);
	//						}
	//					});
	//				}
	//			}
	//		},
	//		error: function(err) {
	//			layer.closeAll();
	//			appcan.window.openToast("网络请求异常，请检查网络是否正常。", 1000);
	//			appcan.window.close(1);
	//		}
	//	});
}