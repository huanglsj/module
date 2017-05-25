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
appcan.ready(function() {
	appcan.button("#close", "btn-act", function() {
		appcan.window.close(1);
	});

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
});

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
	myMark('../../img/loading.gif', "正在定位中，请稍后");
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
	removeMyMark();
	var op = [e.position.lng, e.position.lat];
	regeocoder(op);
}
//定位失败
function onError(e) {
	removeMyMark();
	var xy = map.getCenter();
	myMark('../../img/loading.gif', "定位失败，正返回当前城市");
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
$(document).on("tap", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		myMark('../../img/loading.gif', "正在跳转，请稍后");
		appcan.locStorage.setVal("hotelCode", id);
		appcan.window.open("hotel_details", "hotel_details.html", 2);
		setTimeout(removeMyMark, 600)
	}
});

//pc端
$(document).on("click", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		myMark('../../img/loading.gif', "正在跳转，请稍后");
		appcan.locStorage.setVal("hotelCode", id);
		appcan.window.open("hotel_details", "hotel_details.html", 2);
		setTimeout(removeMyMark, 600)
	}
});

//点击定位按钮
$(document).on("tap", ".amap-geolocation-con", function() {
	myMark('../../img/loading.gif', "正在定位中，请稍后");
});

$(document).on("click", ".amap-geolocation-con", function() {
	myMark('../../img/loading.gif', "正在定位中，请稍后");
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
		dataList.lat = lnglatXY[1];
		dataList.lon = lnglatXY[0];
		dataList.cityCode = myCityCode;
		queryHotelsList();
	} else {
		appcan.window.confirm({
			title: '提示',
			content: '城市解析失败，返回当前城市查询',
			buttons: ['确定'],
			callback: function(err, data, dataType, optId) {
				appcan.window.close(1);
			}
		});
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
			appcan.window.confirm({
				title: '提示',
				content: '返回当前城市失败',
				buttons: ['确定'],
				callback: function(err, data, dataType, optId) {
					appcan.window.close(1);
				}
			});
		}
	});
}

//查询酒店
function queryHotelsList() {
	console.log(dataList)
	removeMyMark();
	myMark('../../img/loading.gif', "酒店查询中，请稍后");
	appcan.request.ajax({
		url: httpHost + 'hotelController.do?queryHotelsList',
		beforeSend: addHeader,
		data: dataList,
		type: "POST",
		dataType: "json",
		success: function(data) {
			console.log(data);
			removeMyMark();
			if(data.success) {
				map.remove(markers);
				addMarker(data.obj.t.roomStays);
			} else {
				if(data.msg == "用户未登录") {
					reLogin(queryHotelsList);
				} else {
					appcan.window.confirm({
						title: '提示',
						content: data.msg,
						buttons: ['确定'],
						callback: function(err, data, dataType, optId) {
							appcan.window.close(1);
						}
					});
				}
			}
		},
		error: function(err) {
			removeMyMark();
			appcan.window.openToast("网络请求异常，请检查网络是否正常。", 1000);
			appcan.window.close(1);
		}
	});
}