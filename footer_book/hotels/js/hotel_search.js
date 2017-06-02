$(function() {
	init();
})
var init = function() {
	var startDate = new Date();
	var endDate = new Date();
	$("#startDate .date").text(NYR(startDate, 1));
	$("#endDate .date").text(NYR(asDay(startDate, 3, 0), 1));
	$("#startDateHidden").val(NYR(startDate, 1));
	$("#endDateHidden").val(NYR(asDay(startDate, 3, 0), 1));

	$("#startDate").mobiscroll().calendar({
		min: startDate,
		onSet: function(val, obj) {
			val = val.valueText;
			$("#startDate .date").text(NYR(val, 1));
			$("#startDateHidden").val(NYR(val, 1));

			var myEndDate = new Date($("#endDateHidden").val()).getTime();
			var mystartDate = new Date(asDay(new Date(val), 3, 0)).getTime();
			if((mystartDate - myEndDate) > 0) {
				$("#endDate .date").text(NYR(asDay(new Date(val), 3, 0), 1));
				$("#endDateHidden").val(NYR(asDay(new Date(val), 3, 0), 1));
			}
			endDateMobiscroll(val);
		}
	});

	endDateMobiscroll();

	function endDateMobiscroll(date) {
		if(!date) {
			date = new Date();
		}
		$("#endDate").mobiscroll().calendar({
			min: new Date(date),
			defaultValue: new Date($("#endDateHidden").val()),
			onSet: function(val, obj) {
				val = val.valueText;
				$("#endDate .date").text(NYR(val, 1));
				$("#endDateHidden").val(NYR(val, 1));
			}
		});
	}

	//选择城市
	var roomCityBtn = document.getElementById("roomCity");
	roomCityBtn.addEventListener("tap", function() {
		mui.openWindow({
			url: 'hotel_city.html',
			id: 'hotel_city'
		})
	});

	var hotelChooseCode = localGetItem('hotelChooseCode');
	var hotelChooseName = localGetItem('hotelChooseName');
	if(hotelChooseCode) {
		$("#roomCity").attr("data-code", hotelChooseCode);
		$("#roomCity").attr("data-city", hotelChooseName);
		$("#roomCity").text(hotelChooseName);
	} else {
		$("#roomCity").attr("data-code", "CAN");
		$("#roomCity").attr("data-city", "广州");
		$("#roomCity").text("广州");
	}

	//价格范围
	var slider = document.getElementById('slider');
	noUiSlider.create(slider, {
		start: [15, 40],
		connect: true,
		range: {
			'min': 0,
			'max': 100
		}
	});
	var snapValues = [
		document.getElementById('rangeMin'),
		document.getElementById('rangeMax')
	];
	slider.noUiSlider.on('update', function(values, handle) {
		snapValues[handle].innerHTML = Math.round(values[handle]);
	});

	//选择星级
	$(".place_choose_options div").click(function() {
		var s = $(this).text();
		if(s == "不限") {
			$(this).addClass('shallow-bg');
			for(var i = 1; i < 5; i++) {
				$('.place_choose_options div')[i].className = "place_choose_on";
			}
		} else {
			
			$('.place_choose_options div')[0].className = "place_choose_on";
			if($(this).hasClass("place_choose_on")) {
				$(this).removeClass('place_choose_on');
				$(this).addClass('shallow-bg');
			} else {
				$(this).removeClass('shallow-bg');
				$(this).addClass('place_choose_on');
				if($('.place_choose_options .shallow-bg').length == 0) {
					$('.place_choose_options div')[0].className = 'shallow-bg';
				}
			}
		}
	});

	mui("#map").on('tap', '.ub', function() {
		var dataFlag = queryHotelData();
		if(dataFlag) {
			mui.openWindow({
				url: 'map.html',
				id: 'hotel_map'
			})
		}

	});

	mui("body").on("tap", "#order", function() {
		queryHotel();
	});
}

//价格
function cost_query() {
	var money_min = document.getElementById('rangeMin').innerHTML;
	var money_max = document.getElementById('rangeMax').innerHTML;
	var money_mins = "";
	var money_maxs = "";
	if(money_min < 15) {
		money_mins = "0";
	}
	if(money_min >= 15) {
		money_mins = "150";
	}
	if(money_min >= 29) {
		money_mins = "300";
	}
	if(money_min >= 40) {
		money_mins = "500";
	}
	if(money_min >= 53) {
		money_mins = "800";
	}
	if(money_min >= 67) {
		money_mins = "1000";
	}
	if(money_min >= 81) {
		money_mins = "2000";
	}

	if(money_max < 15) {
		money_maxs = "0";
	}
	if(money_max >= 15) {
		money_maxs = "150";
	}
	if(money_max >= 29) {
		money_maxs = "300";
	}
	if(money_max >= 40) {
		money_maxs = "500";
	}
	if(money_max >= 53) {
		money_maxs = "800";
	}
	if(money_max >= 67) {
		money_maxs = "1000";
	}
	if(money_max >= 81) {
		money_maxs = "2000";
	}
	if(money_max >= 89) {
		money_maxs = "1000000";
	}

	return {
		priceMin: money_mins,
		priceMax: money_maxs
	}
}

//查询酒店需要的参数
function queryHotelData() {
	var flag = false;
	var cityCode = $("#roomCity").data("code");
	var cityName = $("#roomCity").data("city");
	if(!cityCode) {
		flag = false;
		mui.toast('入住城市不能为空');
		return;
	}

	var inday = $("#startDateHidden").val();
	var outday = $("#endDateHidden").val();
	if(new Date(inday).getTime() > new Date(outday).getTime()) {
		flag = false;
		mui.toast('入住时间不能大于离店时间');
		return;
	}

	flag = true;

	var keyWord = $("#keyword").val();
	var priceMin = cost_query().priceMin;
	var priceMax = cost_query().priceMax;

	var xingji = '';
	if(($("#xingji>.place_choose_ok").length > 0) && ($("#xingji>.place_choose_ok")[0].innerHTML != "不限")) {
		var i = 1,
			j;
		$("#xingji>.place_choose_ok").each(function() {
			j = $(this).attr("data-id");
			if(i < $("#xingji>.place_choose_ok").length) {
				xingji += j + "|";
			} else {
				xingji += j;
			}
			i++;
		});
	}

	//查询酒店条件
	var hotelQueryData = {
		cityCode: cityCode,
		cityName: cityName,
		inday: inday,
		outday: outday,
		keyWord: keyWord,
		priceMin: priceMin,
		priceMax: priceMax,
		xingji: xingji
	}

	localSetItem("hotelQueryData", JSON.stringify(hotelQueryData));
	return flag;
}

//查询酒店
function queryHotel() {
	var dataFlag = queryHotelData();
	if(dataFlag) {
		mui.openWindow({
			url: 'hotel_list_content.html',
			id: 'hotel_list_content'
		})
	}
}