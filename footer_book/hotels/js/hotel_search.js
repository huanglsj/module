var currentTime = new Date(),
	weekday = getDayInWeek(currentTime),
	selectedPlan, begin, end;
var options = "<li data-val='无' data-value='0' data-begin='0' data-end = '0'>无</li>";
var reasonPicker;
//appcan.ready(function() {
    appcan.window.evaluateScript({
        name:"hotelsearch",
        scriptContent:"contentInit()"
    })
	appcan.locStorage.setVal("hotelCity", "广州");
	appcan.locStorage.setVal("cityCode", "CAN");
	//初始化日期
	$("#startDate .date").text(NYR(currentTime, 2));
	$("#startDate .week").text(NYR(currentTime, 3));
	$("#endDate .date").text(NYR(addDate(currentTime), 2));
	$("#endDate .week").text(NYR(addDate(currentTime), 3));
	$("#startDateHidden").val(NYR(currentTime, 1));
	$("#endDateHidden").val(NYR(addDate(currentTime), 1));
	//记录上次点击的城市
	if(appcan.locStorage.getVal("hotelCity") != null) {
		$("#roomCity").text(appcan.locStorage.getVal("hotelCity"));
	} else {
		$("#roomCity").text("广州");
	}
	//入住城市绑定点击事件
	appcan.button('#roomCity', '', function() {
		appcan.setLocVal("fromcity", 'true');
		appcan.window.open("hotelCity", "hotelCity.html", 2);
	});

	//根据行程设置到达时间、离开时间等信息
	if(appcan.locStorage.getVal("setExpDetails") != null) {
		selectedPlan = JSON.parse(appcan.getLocVal("setExpDetails"));
		begin = new Date(selectedPlan.begin);
		end = addDate(begin);
		options = '<li data-val="' + selectedPlan.expReason + '" data-value="' + selectedPlan.expid + '" data-begin="' + selectedPlan.begin + '" data-end="' + selectedPlan.end + '">' + selectedPlan.reason + '</li>';
		$("#bgnDate").html('<span class="air_date">' + NYR(begin, 1) + '</span><span class="tx_red">' + getDayInWeek(begin) + '</span>');
		$("#endDate").html('<span class="air_date">' + NYR(end, 1) + '</span><span class="tx_red">' + getDayInWeek(end) + '</span>');
		$("#reason").html(options);
		$("#reason").mobiscroll().treelist({
			defaultValue: [0],
			onSelect: function(val, obj) {
				getSelect(val);
				$("#reason_dummy").val(val.replace(/\d+/g, ''));
			}
		});
		$("#reason_dummy").val("无");
		//$("#myText").text(selectedPlan.reason);
	}
	//设置未选择行程时的时间信息,获取行程信息
	else {
		queryForExp();
	}

	//选择日期
	$("#startDate").mobiscroll().calendar({
		min: new Date(),
		dateFormat: 'yy-mm-dd',
		defaultValue: new Date(),
		onSet: function(val, obj) {
			val = val.valueText;
			$("#startDate .date").text(NYR(val, 2));
			$("#startDate .week").text(NYR(val, 3));
			$("#startDateHidden").val(NYR(val, 1));
		}
	});
	$("#endDate").mobiscroll().calendar({
		min: new Date(),
		dateFormat: 'yy-mm-dd',
		defaultValue: new Date(),
		onSelect: function(val, obj) {
			val = val.valueText;
			$("#endDate .date").text(NYR(val, 2));
			$("#endDate .week").text(NYR(val, 3));
			$("#endDateHidden").val(NYR(val, 1));
		}
	});

	//         多选 
	$(".place_choose_options div").click(function() {
		var s = $(this).html();
		if(s == "不限") {
			$(this).addClass('place_choose_ok');
			for(var i = 1; i < 5; i++) {
				$('.place_choose_options div')[i].className = "place_choose_on";
			}
		} else {
			$('.place_choose_options div')[0].className = "place_choose_on";
			if($(this).attr('class') == "place_choose_on") {
				$(this).removeClass('place_choose_on');
				$(this).addClass('place_choose_ok');
			} else {
				$(this).removeClass('place_choose_ok');
				$(this).addClass('place_choose_on');
				if($('.place_choose_options .place_choose_ok').length == 0) {
					$('.place_choose_options div')[0].className = 'place_choose_ok';
				}
			}
		}
	})

//});

function init(sessionId,upwd,userCode,userMobile,userName,userNum,applys){
            appcan.locStorage.setVal("applys",applys);
            appcan.locStorage.setVal("sessionId",sessionId);
            appcan.locStorage.setVal("upwd",upwd);
            appcan.locStorage.setVal("userCode",userCode);
            appcan.locStorage.setVal("userMobile",userMobile);
            appcan.locStorage.setVal("userName",userName);
            appcan.locStorage.setVal("userNum",userNum);
            if(applys){
                $("#cost").removeClass("none");
                queryForExp();
            }
}

function queryForExp() {
	ajaxRequest({
		url: httpHost + 'travelApplyController.do?queryForExp',
		type: 'POST',
		beforeSend: addHeader,
		success: function(data) {
			var objson = JSON.parse(data);
			if(objson.success) {
				for(var i = 0; i < objson.obj.length; i++) {
					options += '<li data-val=' + objson.obj[i].reason + i + ' data-value=' + objson.obj[i].id + ' data-begin=' + objson.obj[i].begin + ' data-end=' + objson.obj[i].end + ' data-from=' + objson.obj[i].from + ' data-to=' + objson.obj[i].to + '>' + objson.obj[i].reason + '<span style="font-size:0.4rem;">(' + objson.obj[i].begin + '~' + objson.obj[i].end + ')</span>' + '</li>';
				}
				$("#reason").html(options);
				//$("#myText").text($("select[id=reason] option").not(function(){ return !this.selected }).text());
				$("#reason").mobiscroll().treelist({
					defaultValue: [0],
					onSet: function(val, obj) {
						val = val.valueText;
						getSelect(val);
						$("#reason_dummy").val(val.replace(/\d+/g, ''));
					}
				});
				$("#reason_dummy").val("无");
				//选择日期
				$("#startDate").mobiscroll().calendar({
					min: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: new Date(),
					onSet: function(val, obj) {
						val = val.valueText;
						$("#startDate .date").text(NYR(val, 2));
						$("#startDate .week").text(NYR(val, 3));
						$("#startDateHidden").val(NYR(val, 1));
					}
				});
				$("#endDate").mobiscroll().calendar({
					min: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: new Date(),
					onSet: function(val, obj) {
						val = val.valueText;
						$("#endDate .date").text(NYR(val, 2));
						$("#endDate .week").text(NYR(val, 3));
						$("#endDateHidden").val(NYR(val, 1));
					}
				});
			} else {
				if(objson.msg == "用户未登录") {
					reLogin(queryForExp);
				} else {
					$("#reason").html(options);
					$("#reason").mobiscroll().treelist({
						defaultValue: [0],
						onSelect: function(val, obj) {

							getSelect(val);
							$("#reason_dummy").val(val.replace(/\d+/g, ''));
						}
					});
					$("#reason_dummy").val("无");
					appcan.window.openToast(objson.msg, 2000);
				}

				//选择日期
				$("#startDate").mobiscroll().calendar({
					min: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: new Date(),
					onSet: function(val, obj) {
						val = val.valueText;
						$("#startDate .date").text(NYR(val, 2));
						$("#startDate .week").text(NYR(val, 3));
						$("#startDateHidden").val(NYR(val, 1));
					}
				});
				$("#endDate").mobiscroll().calendar({
					min: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: new Date(),
					onSet: function(val, obj) {
						val = val.valueText;
						$("#endDate .date").text(NYR(val, 2));
						$("#endDate .week").text(NYR(val, 3));
						$("#endDateHidden").val(NYR(val, 1));
					}
				});
			}
		},
		error: function(e, errMsg, error) {
			appcan.window.openToast(errMsg, 3000);
		}
	}, '../../img/loading.gif');
}
//设置入住城市
function setHotelCity(cityName) {
    console.log(cityName);
	var city = cityName.split(",")[0];
	var cityCode = cityName.split(",")[1];
	$("#roomCity").text(city);
	appcan.locStorage.setVal("hotelCity", city);
	appcan.locStorage.setVal("cityCode", cityCode);
}
//提交搜索
function submit() {
	var expId, xingji = "";
	var inday = new Date($("#startDateHidden").val());
	var outday = new Date($("#endDateHidden").val());
	if(inday.getTime() > outday.getTime()) {
		appcan.window.openToast('入住时间不能大于离店时间', 3000);
		return;
	}
	cost_query();
	appcan.setLocVal("inday", $("#startDateHidden").val());
	appcan.setLocVal("outday", $("#endDateHidden").val());
	if($("#reason_dummy").val() == "无") {
		expId = 'null';
		appcan.locStorage.setVal("expId", "undefined");
	} else {
		expId = $("#reason>option:checked").val();
	}
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
	appcan.setLocVal("xingji", xingji);
	appcan.setLocVal("keyWord", $("#keyword").val());
	appcan.window.open("hotellist", "hotel_list.html", 2);
}

function getSelect(val) {
	$('#reason li').each(function() {
		if($(this).data('val') == val) {
			if(val === "无") {
				$("#startDate>.date").text(NYR(new Date(), 2));
				$("#startDate>.week").text(NYR(new Date, 3));
				$("#endDate>.date").text(NYR(addDate(new Date()), 2));
				$("#endDate>.week").text(NYR(addDate(new Date()), 3));
				$("#startDateHidden").val(NYR(new Date(), 1));
				$("#endDateHidden").val(NYR(addDate(new Date()), 1));
				startDateMobiscroll = $("#startDate").mobiscroll().calendar({
					min: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: new Date(),
					onSet: function(val, obj) {
						val = val.valueText;
						$("#startDate>.date").text(NYR(val, 2));
						$("#startDate>.week").text(NYR(val, 3));
						$("#startDateHidden").val(val);
					}
				});

				endDateMobiscroll = $("#endDate").mobiscroll().calendar({
					minDate: new Date(),
					dateFormat: 'yy-mm-dd',
					defaultValue: addDate(new Date()),
					onSelect: function(val, obj) {
						val = val.valueText;
						$("#endDate>.date").text(NYR(val, 2));
						$("#endDate>.week").text(NYR(val, 3));
						$("#endDateHidden").val(val);
					}
				})
				appcan.locStorage.setVal("expId", "undefined");
				return;
			}
			var self = $(this);
			setStartTime(self);
			for(var key in hotelCitys) {
				if(key === self.data("to").replace(/市/g, "")) {
					$("#roomCity").text(self.data("to").replace(/市/g, ""));
					appcan.locStorage.setVal("hotelCity", key);
					appcan.locStorage.setVal("cityCode", hotelCitys[key]);
					break;
				}
			}
			appcan.locStorage.setVal("expId", $(this).data("value"));
			/* mySelect.begin = self.data('begin');
			 mySelect.end = self.data('end');
			 mySelect.id = self.data('id');
			 setStartTime(self);*/
		}
	});
}

function setStartTime(obj) {
	var str = obj.data("begin");
	appcan.locStorage.setVal("beginDate", str);
	var str1 = obj.data("end");
	if(str === 0 || str1 === 0) {
		var date = new Date(),
			date1 = addDate(new Date());
	} else {
		var date = new Date(str),
			date1 = new Date(str1);
	}
	if(date.getTime() < (new Date()).getTime()) {
		date = new Date();
	}
	if(str === str1) {
		date1 = new Date(asDay(date, 90, 0));
	}

	//结束日期是否大于3天
	if(date1.getTime() < (addDate(date)).getTime()) {
		$("#endDate>.date").text(NYR(date1, 2));
		$("#endDate>.week").text(NYR(date1, 3));
		$("#endDateHidden").val(NYR(date1, 1));
	} else {
		$("#endDate>.date").text(NYR(addDate(date), 2));
		$("#endDate>.week").text(NYR(addDate(date), 3));
		$("#endDateHidden").val(NYR(addDate(date), 1));
	}

	$("#startDate>.date").text(NYR(date, 2));
	$("#startDate>.week").text(NYR(date, 3));
	$("#startDateHidden").val(NYR(date, 1));
	startDateMobiscroll = $("#startDate").mobiscroll().calendar({
		min: date,
		max: date1,
		dateFormat: 'yy-mm-dd',
		defaultValue: date,
		onSet: function(val, obj) {
			val = val.valueText;
			$("#startDate>.date").text(NYR(val, 2));
			$("#startDate>.week").text(NYR(val, 3));
			$("#startDateHidden").val(val);
		}
	});

	endDateMobiscroll = $("#endDate").mobiscroll().calendar({
		min: date,
		max: date1,
		dateFormat: 'yy-mm-dd',
		defaultValue: addDate(date),
		onSet: function(val, obj) {
			val = val.valueText;
			$("#endDate>.date").text(NYR(val, 2));
			$("#endDate>.week").text(NYR(val, 3));
			$("#endDateHidden").val(val);
		}
	})
}