var hotelQueryData = localGetItem("hotelQueryData");
var dataList = {};
if(!hotelQueryData) {
	mui.alert('参数有误，请重新查询', function() {
		mui.back();
	});
} else {
	hotelQueryData = JSON.parse(hotelQueryData);
	dataList = {
		page: 1,
		pageSize: 25,
		cityCode: hotelQueryData.cityCode,
		bgnDate: hotelQueryData.inday,
		endDate: hotelQueryData.outday,
		keyWord: hotelQueryData.keyWord,
		lPrice: hotelQueryData.priceMin,
		hPrice: hotelQueryData.priceMax,
		xingji: hotelQueryData.xingji,
		lat: '',
		lon: ''
	}
	init();
}

function init() {
	layer.open({
		type: 2,
		content: '正在定位中',
		shadeClose:false
	});
	setTimeout(function() {
		geolocation.getCurrentPosition();
	}, 600);
}

//初始化地图
var map = new AMap.Map('map', {
	resizeEnable: true
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
	var lnglatXY = [e.position.lng, e.position.lat];
	reverseGeocoder(lnglatXY);
}
//定位失败
function onError(e) {
	layer.closeAll();
	var xy = map.getCenter();
	layer.open({
		type: 2,
		content: '定位失败，正返回当前城市',
		shadeClose:false
	});
	var lnglatXY = [xy.lng, xy.lat];
	setTimeout(function() {
		reverseGeocoder(lnglatXY);
	}, 1000);

}

//根据经纬度返回城市名

function reverseGeocoder(lnglatXY, type) {

	var MGeocoder;
	//加载地理编码插件
	map.plugin(["AMap.Geocoder"], function() {
		MGeocoder = new AMap.Geocoder({
			radius: 1000,
			extensions: "all"
		});

		MGeocoder.getAddress(lnglatXY, function(status, result) {
			if(status === 'complete' && result.info === 'OK') {
				regeocoder_CallBack(result, lnglatXY);
			} else {
				backCityInfo();
			}
		});
	})
	
	map.remove(startMarker);
	startMarker = new AMap.Marker({ //加点
		map: map,
		position: lnglatXY
	});
	map.setFitView();
}

function regeocoder_CallBack(data, lnglatXY) {
	var city = data.regeocode.addressComponent.city;
	if(city) {
		getCityCode(city, lnglatXY);
	} else {
		mui.alert('城市解析失败，请重新查询', function() {
			mui.back();
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
			getCityCode(city, lnglatXY);
		} else {
			mui.alert('城市解析失败，请重新查询', function() {
				mui.back();
			});
		}
	});
}

//根据城市名返回三字码
function getCityCode(currentCity, lnglatXY) {
	if(currentCity.substring(currentCity.length - 1, currentCity.length) == "市" && currentCity.substring(currentCity.length - 2, currentCity.length - 1) != "市") {
		currentCity = currentCity.substring(0, currentCity.length - 1);
	}
	var currFlag = false;
	var iCityCode;
	for(var i = 0; i < myHotelData.length; i++) {
		if(myHotelData[i].cityName.indexOf(currentCity) > -1) {
			currFlag = true;
			iCityCode = myHotelData[i].cityCode
		}
	}
	
	layer.closeAll();
	layer.open({
		type: 2,
		content: '酒店查询中',
		shadeClose:false
	});
	if(currFlag) {
		dataList.cityCode = iCityCode;
		dataList.lat = lnglatXY[1];
		dataList.lon = lnglatXY[0];
		queryHotelsList();
	} else {
		dataList.cityCode = 'CAN';
		dataList.lat = lnglatXY[1];
		dataList.lon = lnglatXY[0];
		queryHotelsList();
	}
}

$(document).on("tap", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		localSetItem("hotelCode", id);
		mui.openWindow({
			url: 'hotel_details_content.html',
			id: 'hotel_details_content'
		})
	}
});

//pc端
$(document).on("click", ".bubble", function() {
	var id = $(this).data("id");
	if(id != null) {
		localSetItem("hotelCode", id);
		mui.openWindow({
			url: 'hotel_details_content.html',
			id: 'hotel_details_content'
		})
	}
});

//点击定位按钮
$(document).on("tap", ".amap-geolocation-con", function() {
	layer.open({
		content: '正在定位中',
		skin: 'msg',
		time: 8 //2秒后自动关闭
	});
});

map.on('click', function(e) {
	var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]; //已知点坐标
	map.setZoomAndCenter(10, lnglatXY);
	reverseGeocoder(lnglatXY);
});


var markers = [];
//添加覆盖物
function addMarker(obj) {
	for(var i = 0; i < obj.length; i++) {
		marker = new AMap.Marker({
			position: [obj[i].lon, obj[i].lat],
			map: map,
			content: '<div class="bubble" data-id="' + obj[i].hotelCode + '"><div class="arrow"></div><div class="title">' + obj[i].hotelName + '</div><div class="money">￥ ' + obj[i].minRate + '</div></div>'
		});

		markers.push(marker);
	}
	map.setFitView();
}

//查询酒店
function queryHotelsList() {
	console.log(dataList)
	mui.ajax({
		url: httpHost + 'hotelController.do?queryHotelListModular',
		data: dataList,
		type: "POST",
		dataType: "json",
		success: function(data) {
			console.log(data);
			layer.closeAll();
			if(data.success) {
				if(data.obj) {
					map.remove(markers);
					addMarker(data.obj);
				} else {
					mui.alert('酒店查无数据，请重新查询', function() {
						mui.back();
					});
				}

			} else {
				mui.toast('查询失败');
			}
		},
		error: function(err) {
			layer.closeAll();
			console.log(err);
			mui.alert('网络请求异常，请重新查询', function() {
				mui.back();
			});
		}
	});
}