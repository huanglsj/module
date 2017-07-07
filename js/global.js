var httpHost = 'http://120.77.4.10:8081/';
//var httpHost = 'http://192.168.8.54:8081/';
var uploadHttp = httpHost + 'tmcExpenseController.do?upload';
var changeSkin = localGetItem("changeSkin");
if(!changeSkin) {
	changeLink('blue');
} else {
	changeLink(changeSkin);
}

shouldHideNavBar(true);

//更改默认皮肤
function changeLink(skin) {
	var link = document.getElementsByTagName("link");
	for(var i = 0; i < link.length; i++) {
		var linkTitle = link[i].title;
		if(linkTitle) {
			if(skin == linkTitle) {
				link[i].removeAttribute("disabled");
			} else {
				link[i].setAttribute("disabled", "disabled");
			}
		}

	}
}

function addHeader(xhr) {
	var sessionId = '',
		nowTime = (new Date()).getTime(),
		ticket = '';
	xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
	xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, sdch');
	xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8');
	xhr.setRequestHeader('Connection', 'keep-alive');
	sessionId = localGetItem('sessionId');
	ticket = localGetItem('ticket');
	if(sessionId != "") {
		sessionId = "JSESSIONID=" + sessionId + ";ticket=" + ticket + ";type=app";
		sessionId = sessionId.replace(/\|[0-9]{10}\|/, '|' + parseInt(nowTime / 1000) + '|');
		xhr.setRequestHeader('Cookie', sessionId);
	}
	xhr.setRequestHeader('Upgrade-Insecure-Requests', '1');
	xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36');
}

//获取对象属性值 
function getPropKey(obj) {
	var names = [];
	var i = 0;
	for(var name in obj) {
		names[i] = name;
		i++;
	}
	return names;
}
//获取对象属性值 
function getProp(obj) {
	var names = [];
	var i = 0;
	for(var name in obj) {
		names[i] = obj[name];
		i++;
	}
	return names;
}

//判断变量是否存在，不为空，不是未定义，不是null
function isDefine(para) {
	if(typeof para == 'undefined' || para == "[]" || para == null || para == undefined || para == 'undefined' || para == '[]' || para == "null")
		return false;
	else
		return true;
}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function delMarks(str) {
	return str.replace(/(\")/g, "\\\"");;
}
//获取或格式化日期
//flag 无值：返回2016年07月13日
//      1：返回2016-07-13
//      2：返回7月13日
//      3：返回星期三
//      4：返回2016
//      其他：返回 07-13
function NYR(date, flag) {

	//date是Date对象
	if(date !== null && typeof date === "object" && date.getDate) {
		if(isDefine(flag)) {
			if(flag == 1) {
				return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
			} else if(flag == 2) {
				return((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "日";
			} else if(flag == 3) {
				return getDayInWeek(date);
			} else if(flag == 4) {
				return date.getFullYear();
			} else {
				return((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
			}
		} else {
			return date.getFullYear() + "年" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "日";
		}
	}

	//date是非Date对象或布尔类型或undefined
	else if(typeof date === "object" || typeof date === "boolean" || typeof date === "undefined") {
		date = new Date();
		return date.getFullYear() + "年" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "日";
	}

	//处理日期字符串，适配IOS
	else if(typeof date === "string") {
		date = date.replace(/-/g, "/");
	}

	if(date) {
		var da = new Date(date);
	} else {
		var da = new Date();
	}

	if(isDefine(flag) && da.getDate) {
		if(flag == 1) {
			return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
		} else if(flag == 2) {
			return((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + "日";
		} else if(flag == 3) {
			return getDayInWeek(da);
		} else if(flag == 4) {
			return da.getFullYear();
		} else {
			return((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
		}
	} else {
		da = new Date();
		return da.getFullYear() + "年" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + "日";
	}
}

function getDayInWeek(myDate) {
	var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var day = weekday[myDate.getDay()];
	return day;
}
//加减天数
//date 传来的日期2016-12-12
//days 要加的天数
//type 0是加   1是减
var asDay = function(date, days, type) {
	if(!date) {
		date = new Date();
	}
	if(!days) {
		days = 1;
	}
	var fd;
	if(type) {
		fd = new Date(date.valueOf() - days * 24 * 60 * 60 * 1000);
	} else {
		fd = new Date(date.valueOf() + days * 24 * 60 * 60 * 1000);
	}
	return NYR(fd, 1);
}
//获取格式化时间
//如 21:39
function HM(date) {
	if(typeof date === "object" && date !== null && date.getHours) {
		var da = date;
	} else if(typeof date === "string" && date !== "") {
		date = date.replace(/-/g, "/");
		var da = new Date(date);
	} else if(typeof date === "number") {
		var da = new Date(date);
	} else {
		var da = new Date();
	}
	var hour = da.getHours();
	if(hour < 10) {
		hour = "0" + hour;
	}
	var minutes = da.getMinutes();
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	return hour + ":" + minutes;
}
//把日期和时间分开
function getStr(string, str) {
	if(!isDefine(string))
		return "";
	var newStrArray = string.split(str);
	return newStrArray;
}
//返回UTC时间格式 如：2015-02-06T19:28:14.815Z
function toUTC(str) {
	str = str.replace(/-/g, "/");
	var str = new Date(str);
	return str.getUTCFullYear() + "-" + formatNum(str.getUTCMonth() + 1) + '-' + formatNum(str.getUTCDate()) + 'T' + formatNum(str.getUTCHours()) + ":" + formatNum(str.getUTCMinutes()) + ":" + formatNum(str.getUTCSeconds()) + '.' + formatNum(str.getUTCMilliseconds()) + 'Z';
}

//计算现在离过去某个时间点过了多久(24小时内显示相差时间，否则显示时间点日期)
function getPassedTime(date) {
	var hour = 0,
		minute = 0,
		second = 0;
	if(typeof date === "object" && date instanceof Date) {
		if(date > new Date() || date === new Date()) {
			return "刚刚";
		} else {
			if(new Date() - date > 86400000) {
				return NYR(date, 1);
			} else {
				hour = parseInt((new Date() - date) / 1000 / 3600);
				minute = parseInt(((new Date() - date) / 1000) % 3600 / 60);
				second = parseInt((new Date() - date) / 1000 % 3600 % 60);
				second = ((second === 0 || hour !== 0) ? "" : (second + "秒"));
				hour = (hour === 0 ? "" : (hour + "时"));
				minute = (minute === 0 ? "" : (minute + "分"));
				return hour + minute + second + "前";
			}
		}
	} else if(typeof date === "string" || typeof date === "number") {
		date = new Date(date);
		if(date >= new Date()) {
			return "刚刚";
		} else {
			if(new Date() - date > 86400000) {
				return NYR(date, 1);
			} else {
				hour = parseInt((new Date() - date) / 1000 / 3600);
				minute = parseInt(((new Date() - date) / 1000) % 3600 / 60);
				second = parseInt((new Date() - date) / 1000 % 3600 % 60);
				second = ((second === 0 || hour !== 0) ? "" : (second + "秒"));
				hour = (hour === 0 ? "" : (hour + "时"));
				minute = (minute === 0 ? "" : (minute + "分"));
				return hour + minute + second + "前";
			}
		}
	} else {
		return "1970-01-01";
	}
}
//格式化两位数字
function formatNum(d) {
	if(Number(d) < 10) {
		return "0" + d;
	} else {
		return d;
	}
}

function localGetItem(name) {
	var localName = window.localStorage.getItem(name);
	return localName;
}

function localSetItem(key, val) {
	window.localStorage.setItem(key, val);
}

function localRemoveItem(key) {
	window.localStorage.removeItem(key);
}

function localRemoveAll() {
	window.localStorage.clear();
}

//验证身份证
function isIDCard(str) {
	//身份证正则表达式(15位)
	var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	//身份证正则表达式(18位)
	var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

	if(!isIDCard1.test(str) && !isIDCard2.test(str)) {
		return false;
	} else {
		return true;
	}
}

//验证手机
function isPhoneNumber(str) {
	var isPhoneNumber = /^0?1[3|4|5|7|8]\d{9}$/;
	if(!isPhoneNumber.test(str)) {
		return false;
	} else {
		return true;
	}
}

//验证邮箱
function isEmail(str) {
	var isEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	if(!isEmail.test(str)) {
		return false;
	} else {
		return true;
	}
}

//验证名字
function isName(str) {
	var isName = /^[a-z0-9_-]{3,16}$/;
	if(!isName.test(str)) {
		return false;
	} else {
		return true;
	}
}

//验证固定电话
function isFixedPhone(str) {
	var isFixedPhone = /^0[\d]{2,3}-[\d]{7,8}$/;
	if(!isFixedPhone.test(str)) {
		return false;
	} else {
		return true;
	}
}

//验证数字
function isNumber(str) {
	var isNumber = /^[0-9]+(.[0-9]{2})?$/;
	if(!isNumber.test(str)) {
		return false;
	} else {
		return true;
	}
}

//获取链接参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

//获取id
function getId(id) {
	return document.getElementById(id);
}

//订单状态
function statusText(status) {
	switch(status) {
		case 1:
			return '订单已提交';
			break;
		case 2:
			return '订单已确认';
			break;
		case 3:
			return '订单已完成';
			break;
		case 4:
			return '订单已取消';
			break;
		case 5:
			return '订单已退订';
			break;
		case 6:
			return '订单已作废';
			break;
		case 10:
			return '订单正等待商家确认';
			break;
		default:
			break;
	}
}

//类型
function bookType(type) {
	switch(type) {
		case 1: //飞机
			return type;
			break;
		case 2: //酒店
			return type;
			break;
		case 3: //火车
			return type;
			break;
		case 4:
			return type;
			break;
		case 5:
			return type;
			break;
		default:
			break;
	}
}

//行程计划类型
function typePlanText(type) {
	switch(type) {
		case 1:
			return "行程";
			break;
		case 2:
			return "住宿";
			break;
		case 3:
			return "会议";
			break;
		case 4:
			return "用餐";
			break;
		default:
			break;
	}
}

//页面跳转
function jump(obj, type) {
	var url = obj.getAttribute("data-href");
	var name = obj.getAttribute("data-name");
	if(type == 1 && url && name) {
		mui.openWindow({
			url: url,
			id: name
		});
	} else {
		mui.alert("该模块还没开放")
	}
}

function hasClass(elem, cls) {
	cls = cls || '';
	if(cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
	return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function addClass(ele, cls) {
	if(!hasClass(ele, cls)) {
		ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
	}
}

function removeClass(elem, cls) {
	if(hasClass(elem, cls)) {
		var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
		while(newClass.indexOf(' ' + cls + ' ') >= 0) {
			newClass = newClass.replace(' ' + cls + ' ', ' ');
		}
		elem.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}

function toggleClass(obj, cls) {
	hasClass(obj, cls) ? removeClass(obj, cls) : addClass(obj, cls);
}

//排序
//data 数组数据;
//key要排序的键名;
//type类型 1 时间  2 ID;
//dir 1 正序 2 倒叙;
function sortData(data, key, type, dir) {
	var temp;
	if(data.length > 0) {
		for(var i = 0; i < data.length - 1; i++) {
			for(var j = i + 1; j < data.length; j++) {

				if(type == 1) {
					var value1 = new Date(data[i][key]).getTime();
					var value2 = new Date(data[j][key]).getTime();
				} else if(type == 2) {
					var value1 = new Date(data[i][key])*1;
					var value2 = new Date(data[j][key])*1;
				}

				if(dir == 1) {
					if(value1 > value2) {
						temp = data[i];
						data[i] = data[j];
						data[j] = temp;
					}
				} else { 
					if(value1 < value2) {
						temp = data[i];
						data[i] = data[j];
						data[j] = temp;
					}
				}
			}
		}		
		return data;
	} else {
		return false;
	}
}