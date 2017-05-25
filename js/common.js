//全局常量域名地址。"http://10.10.236.142:8080/";
//映射内网10.10.237.15服务器  
//外网ip:http://219.137.228.109:7070/
var httpHost;
if(appcan.locStorage.getVal("testUser")=="true"){
    httpHost = 'http://219.137.228.109:7071/';
}else{
    // httpHost = 'http://192.168.8.118:8081/';
    //httpHost = 'http://120.77.51.162:9082/';
    // httpHost = "http://219.137.228.109:7070/";
    // httpHost = "http://192.168.8.81:8081/";
    //httpHost = 'http://112.74.137.212/';
      httpHost = "http://192.168.8.124:8081/";
//    httpHost = "http://192.168.8.54:8081/";
}
var domainName = '';
var appId = '';
var mask;
var isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0) ? true : false;
var buttonTrue = true;
function checkSubmit (callback) {
  if(!buttonTrue){
      return;
  }else if (typeof callback === "function"){
      buttonTrue = false;
      callback();
      buttonTrue = true;
  }
}
//添加请求头，把sessionid通过头信息回传。
//在ajax加参数 beforeSend : addHeader,
function addHeader(xhr) {
    var sessionId = '';
    var storage = window.localStorage;
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, sdch');
    xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8');
    xhr.setRequestHeader('Connection', 'keep-alive');
    if (storage) sessionId = appcan.locStorage.getVal('sessionId');
    if (sessionId != "") {
        sessionId = "JSESSIONID=" + sessionId;
        xhr.setRequestHeader('Cookie', sessionId);
    }
    xhr.setRequestHeader('Upgrade-Insecure-Requests', '1');
    xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36');
}
//获取对象属性值 
function getPropKey(obj){    
    var names=[];
    var i=0;       
    for(var name in obj){       
       names[i] = name;
       i++;  
    }  
    return names;  
}
//获取对象属性值 
function getProp(obj){    
    var names=[];
    var i=0;       
    for(var name in obj){       
       names[i] = obj[name];
       i++;  
    }  
    return names;  
} 
//判断变量是否存在，不为空，不是未定义，不是null
function isDefine(para) {
    if ( typeof para == 'undefined' || $.trim(para) == "" || para == "[]" || para == null || para == undefined || para == 'undefined' || para == '[]'|| para == "null")
        return false;
    else
        return true;
}
//错误提示
function global_error(error) {
    appcan.window.openToast(error, 1500, 5);
}
//关闭窗口
function closewin() {
    appcan.window.close(-1);
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
    if(date !== null && typeof date === "object" && date.getDate){
        if (isDefine(flag)) {
            if (flag == 1) {
                return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
            }else if (flag == 2) {
                return ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "月" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())+"日";
            }else if (flag == 3) {
                return getDayInWeek(date);
            }else if (flag == 4) {
                return date.getFullYear();
            } else {
                return ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
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
    else if(typeof date === "string"){
      date = date.replace(/-/g,"/");
    }

    if(date){
      var da = new Date(date);
    }
    else{
      var da = new Date();
    }

    if (isDefine(flag) && da.getDate) {
        if (flag == 1) {
            return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
        }else if (flag == 2) {
            return ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate())+"日";
        }else if (flag == 3) {
            return getDayInWeek(da);
        }else if (flag == 4) {
            return da.getFullYear();
        } else {
            return ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
        }
    } 
    else {
        da = new Date();
        return da.getFullYear() + "年" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + "日";
    }
}
//加减天数
//date 传来的日期2016-12-12
//days 要加的天数
//type 0是加   1是减
var asDay = function(date,days,type){
    if(!date){
        date = new Date();
    }
    if(!days){
        days = 1;
    }
    var fd;
    if(type){
        fd = new Date(date.valueOf()-days*24*60*60*1000);
    }else{
        fd = new Date(date.valueOf()+days*24*60*60*1000);
    }
    return NYR(fd,1);
}
//获取格式化时间
//如 21:39
function HM(date) {
    if(typeof date === "object" && date !== null && date.getHours){
        var da = date;
    }
    else if(typeof date === "string" && date !== ""){
       date = date.replace(/-/g,"/");
       var da = new Date(date); 
    }
    else if(typeof date === "number"){
       var da = new Date(date);
    }
    else{
       var da = new Date(); 
    }
    var hour = da.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minutes = da.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hour + ":" + minutes;
}
//把日期和时间分开
function getStr(string,str){ 
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
function getPassedTime(date){
    var hour=0,minute=0,second=0;
    if(typeof date === "object" && date instanceof Date){
        if(date > new Date() || date === new Date()){
            return "刚刚";
        }
        else{
            if(new Date()-date > 86400000){
                return NYR(date,1);
            }
            else{
                hour = parseInt((new Date()-date)/1000/3600);
                minute = parseInt(((new Date()-date)/1000)%3600/60);
                second = parseInt((new Date()-date)/1000%3600%60);
                second = ((second === 0 || hour !== 0)?"" :(second+"秒"));
                hour = (hour === 0?"":(hour+"时"));
                minute = (minute === 0?"":(minute+"分"));
                return hour+minute+second+"前";
            }
        }
    }
    else if(typeof date === "string" || typeof date === "number"){
        date = new Date(date);
        if(date >= new Date()){
            return "刚刚";
        }
        else{
            if(new Date()-date > 86400000){
                return NYR(date,1);
            }
            else{
                hour = parseInt((new Date()-date)/1000/3600);
                minute = parseInt(((new Date()-date)/1000)%3600/60);
                second = parseInt((new Date()-date)/1000%3600%60);
                second = ((second === 0 || hour !== 0)?"" :(second+"秒"));
                hour = (hour === 0?"":(hour+"时"));
                minute = (minute === 0?"":(minute+"分"));
                return hour+minute+second+"前";
            }
        }
    }
    else{
        return "1970-01-01";
    }
}
//格式化两位数字
function formatNum(d) {
    if (Number(d) < 10) {
        return "0" + d;
    } else {
        return d;
    }
}
/**
 * 创建或打开数据库
 * @param {Object} cb   初始化DB
 */
function openDB(cb){
    uexDataBaseMgr.cbOpenDataBase = function(opId,type,data){
        if(type==2 && data==0){
            if(cb)  cb(opId);
        }
    }               
    uexDataBaseMgr.openDataBase(dbname,++dbId); 
}
/**
 * 关闭数据库
 * @param {Object} id   数据库id
 */
function closeDB(id){
    uexDataBaseMgr.cbCloseDataBase = function(opid, type, data){
        logs('closeDB()----->'+opid+','+type+','+data);
    }
    uexDataBaseMgr.closeDataBase(dbname, id);
}

/**
 * 查询操作
 * @param {Object} id
 * @param {Object} sql
 * @param {Object} cb
 */
function selSql(id,sql,cb){
    uexDataBaseMgr.cbSelectSql = function(opId,type,data){
        //logs('selSql: '+opId+','+type+','+data);
        if(type==1){
            if(cb && opId == id)    cb(data);
        }
    }
    uexDataBaseMgr.selectSql(dbname,id,sql);
}

/**
 * 增删改操作
 * @param {Object} id
 * @param {Object} sql
 * @param {Object} cb
 */
function exeSql(id,sql,cb){
    uexDataBaseMgr.cbExecuteSql = function(opId,type,data){
        //logs('exeSql: '+opId+','+type+','+data);
        if(type==2){
            if(cb && opId == id)    cb(data);
        }
    }
    uexDataBaseMgr.executeSql(dbname,id,sql);
}
function getDayInWeek(myDate){
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    var day = weekday[myDate.getDay()];
                    return day; 
}
function compareDate(a,b) {
    var flag=true;
    var arr = a.split("-");
    var starttime = new Date(arr[0], arr[1]-1, arr[2]);
    var starttimes = starttime.getTime();
    var arrs = b.split("-");
    var lktime = new Date(arrs[0], arrs[1]-1, arrs[2]);
    var lktimes = lktime.getTime();
    if (starttimes<= lktimes) {
        flag=false;
    }
    else
        falg=true;
   return flag;
}  
//设置日期为年月日 00：00：00
function setDate(year,month,day)
{
    var date =new Date(year +"-"+month+"-"+day);
    return date;
}
//日期加三天，传入date对象
function addDate(mydate)
{
    return  new Date(mydate.getTime() + 259200000);
}
function arrCombine(arr1,arr2){
    if(!arr1 instanceof Array && !arr1 instanceof String) return;
    if(!arr2 instanceof Array) return;
    if(arr1 instanceof Array && arr2 instanceof Array && arr1.length !== arr2.length) return;
    var arr = [];
    for(var i =0;i<arr2.length;i++){
        if(typeof arr1 === "string"){
            arr[i] = arr1 + arr2[i];
            continue;
        }
        arr[i] = arr1[i]+arr2[i];
    }
    return arr;
}
//上传
var uploadHttp=httpHost+"tmcExpenseController.do?upload";
function uploadFile(dirPath,cb){
    var num=appcan.getOptionId();//生成随机数
    uexUploaderMgr.onStatus = function(opCode,fileSize,percent,serverPath,status){
        switch (status) {
            case 0:
                //上传中
                appcan.window.openToast('图片上传中'+percent+'%',0,5);
                break;
            case 1:
                appcan.window.openToast('图片上传成功',3000,5);
                var serverUrl=eval('('+serverPath+')').obj;                                     
                cb(serverUrl);
                uexUploaderMgr.closeUploader(num);
                break;
            case 2:
                appcan.window.openToast('图片上传失败',3000,5);
                uexUploaderMgr.closeUploader(num);
                break;
        }
    }
    uexUploaderMgr.cbCreateUploader =function(opCode,dataType,data){
        if(data == 0){
          appcan.logs("创建上传对象成功,开始上传文件");
          //alert(dirPath);
          uexUploaderMgr.uploadFile(num, dirPath, "file", 3);
        }else{
          alert("创建失败");
        }
    }
   uexUploaderMgr.createUploader(num,uploadHttp);
    
}
/**
 *重新登录
 * 如果用户未保存密码则返回。 
 * @param {Object} callback
 */
function reLogin(callback)
{
    if(!isDefine(appcan.locStorage.getVal('upwd'))){
        appcan.window.openToast("自动登录失败，请重新登录。",2000,5);
        return;  
    }
    buttonTrue = false;
    appcan.request.ajax({
        url : httpHost + 'apploginController.do?applogin',
        type : 'POST',
        data : {
            userName:appcan.locStorage.getVal('userCode'),
            passWord:appcan.locStorage.getVal('upwd')
        },
        success : function(resp) {
            objson = eval('(' + resp + ')');
            appcan.window.closeToast();
            if(objson.success){
               appcan.locStorage.setVal("sessionId",objson.obj.sessionId);
               appcan.locStorage.setVal("userName",objson.obj.uname);
               appcan.locStorage.setVal("userCode",objson.obj.ucode);
               appcan.locStorage.setVal("userNum",objson.obj.userNum);
               if (typeof callback === "function"){
                        callback(); 
               }
               buttonTrue = true;
            }
            else
            {
             appcan.window.openToast(objson.msg,1500,5);  
            }
        },
        error : function(e, err) {
            appcan.window.openToast("网络请求异常，请检查网络是否正常。",1500,5);
        }
    });   
}     
function openActionSheet()
{
  var today =new Date();
  var end =$("#toDay").text().replace("年","-").replace("月","-").replace("日","").trim();
  var endDate=new Date(end);
  endDate.setDate(endDate.getDate()+1);
  if(today.getTime()>endDate.getTime())
  {
      appcan.window.openToast("当前日期已超过结束日期,无法进行预订",1500,5);
  }
  else
  {
    var x = 0;
    var y = 0;//没有用
    var width = 0;//如果传0,默认是屏幕宽度
    var height = 0;//没用的高度
    var data={
        actionSheet_style:{
            frameBgColor:"#ffffff",//背景色    
            frameBroundColor:"#ffffff",//边框颜色
            frameBgImg:"",//背景图
            btnSelectBgImg:"res://btn-act.png",//一般按钮被选中的背景图
            btnUnSelectBgImg:"res://btn.png",//一般按钮未被选中的背景图
            cancelBtnSelectBgImg:"res://btn-act.png",//取消按钮 被选中的背景图
            cancelBtnUnSelectBgImg:"res://btn.png",//取消按钮 未被选中的背景图                               
            textSize:"17",//文字字号
            textNColor:"#ffffff",//一般按钮,未被选中状态下的文字颜色
            textHColor:"#ffffff",//一般按钮,被选中状态下的文字颜色              
            cancelTextNColor:"#ffffff",
            cancelTextHColor:"#ffffff",
            actionSheetList:[//按钮数据数组
                {
                name:"机票"//item名称
                },
                {
                name:"酒店"//item名称
                },
                {
                name:"火车票"//item名称
                },
                {
                name:"租车"//item名称
                }  
            ]
        }
    } 
    var JsonData =JSON.stringify(data);   
    uexActionSheet.open(x,y,width,height,JsonData);
    uexActionSheet.onClickItem = function(data){
           if(data==0)
           {
             //appcan.window.publish("closeApplyResultWin","");
             appcan.window.open("plane_ticket_search","../flights/plane_ticket_search.html",0);  
             var arrData={
                 "expid":appcan.locStorage.getVal("apply_ysp_id"),
                 "begin":appcan.locStorage.getVal("apply_ysp_begin"),
                 "end":appcan.locStorage.getVal("apply_ysp_end"),
                 "from":appcan.locStorage.getVal("apply_ysp_from"),
                 "to": appcan.locStorage.getVal("apply_ysp_to"),
                 "reason":appcan.locStorage.getVal("apply_ysp_project")
             };
              appcan.locStorage.setVal("setExpDetails",arrData);  
           }
           else if(data==1)
           {
             //appcan.window.publish("closeApplyResultWin","");
             var arrData={
                 "expid":appcan.locStorage.getVal("apply_ysp_id"),
                 "begin":appcan.locStorage.getVal("apply_ysp_begin"),
                 "end":appcan.locStorage.getVal("apply_ysp_end"),
                 "from":appcan.locStorage.getVal("apply_ysp_from"),
                 "to": appcan.locStorage.getVal("apply_ysp_to"),
                 "reason":appcan.locStorage.getVal("apply_ysp_project")
             };
              appcan.locStorage.setVal("setExpDetails",arrData);  
             appcan.window.open("hotelsearch","../hotels/hotel_search.html",0);  
           }
           else if(data==2)
           {
              //appcan.window.publish("closeApplyResultWin","");
               var arrData={
                 "expid":appcan.locStorage.getVal("apply_ysp_id"),
                 "begin":appcan.locStorage.getVal("apply_ysp_begin"),
                 "end":appcan.locStorage.getVal("apply_ysp_end"),
                 "from":appcan.locStorage.getVal("apply_ysp_from"),
                 "to": appcan.locStorage.getVal("apply_ysp_to"),
                 "reason":appcan.locStorage.getVal("apply_ysp_project")
             };
              appcan.locStorage.setVal("setExpDetails",arrData);  
              appcan.window.open("trainsearch","../trains/train_ticket_search.html",0);   
           }
           else if(data==3)
           {
              appcan.window.openToast('暂未开放租车服务……', '2000');  
           }
  }   
  }
}  

function addMask(url,content) {
    var str = '';
    
    str += '<div class="bgset zhezhao">';
    str += '    <div class="loading-box ub ub-ver ub-ac">';
    str += '        <div class="loading-pic">';
    str += '            <img src="'+url+'">';
    str += '        </div>';
    str += '        <div class="loading-text">';
    str += '            <p>'+content+'</p>';
    str += '        </div>';
    str += '    </div>';
    str += '</div>';
    $("body").append(str);
    //mask = setTimeout('removeMask();appcan.window.openToast("请求超时，请重试",3000)',20000);
}
function hideMask() {
    if( $(".zhezhao").length > 0 ){
        $(".zhezhao").addClass("hide");
    }
}
function removeMask() {
    clearTimeout(mask);
    if( $(".zhezhao").length > 0 ){
        $(".zhezhao").remove();    
    }
}

function getCurrentCity(){
    var latitude=0,logitude=0,city;
    uexLocation.onChange = function(lat, log){
        uexLocation.getAddress(lat,log,1);
    }
    uexLocation.openLocation();
    uexLocation.cbGetAddress = function(opCode, dataType, dataStr){
        var data = eval("("+dataStr+")");
        //alert(data.addressComponent.city);
        city = data.addressComponent.city;
        appcan.locStorage.setVal("cityLocation",data.location);
        if(city.substring(city.length-1,city.length) == "市" && city.substring(city.length-2,city.length-1) != "市"){
            city = city.substring(0,city.length-1);
        }
        uexLocation.closeLocation();
        //$("#currentCity").text(city);
        appcan.locStorage.setVal("currentCity",city);
    }
}

function bindCityCode(){
  var city = appcan.locStorage.getVal("currentCity"),cityCode='';
  if((cityArr["type"] == "hotel") && cityArr["data"]){
    for(var i = 0;i<cityArr["data"].length;i++){
      if(cityArr["data"][i].cityName == city){
        cityCode = cityArr["data"][i].cityCode;
        break;
      }
    }
  }
  else if(cityArr["type"] == "flight"){
    for(var i in cityArr["data"]){
      for(var j = 0;j<cityArr["data"][i].length;j++){
        if(cityArr["data"][i][j].display == city){
          cityCode = cityArr["data"][i][j].data.split("|")[3];
          break;
        }
      }
    }
    if(cityCode.split(",")>-1){
      cityCode = cityCode.split(",")[1];
    }
  }
  else if (cityArr["type"] == "train"){
    for(var i =0;i<cityArr["data"].length;i++){
      if(cityArr["data"][i].name == city){
        cityCode = cityArr["data"][i].telecode;
        break;
      }
    }
  }
  $("#currentCity").text(city);
  $("#currentCity").attr("data-city",cityCode);
  bindButton();
}

function getHistoryCity(){
  var str = '<div class="ulev-app2">当前/历史</div><div class="ub umar-a"><div class="city uba bc-border ub-f1 uinn-d umar-2 ub ub-ac ub-pc min-w5 ulev-1" id="currentCity" style="color:red"></div>';
  if(!appcan.locStorage.getVal(cityArr["type"]+"historyCity")){
    appcan.locStorage.setVal(cityArr["type"]+"historyCity","[]");
  }
  else{
    var historyCity = eval('('+appcan.locStorage.getVal(cityArr["type"]+"historyCity")+')');
    for(var i =0;i<historyCity.length;i++){
      if(i==2){
        str+='<div class="ub umar-a"><div class="city uba bc-border ub-f1 uinn-d umar-2 ub ub-ac ub-pc min-w5 ulev-1" data-city='+historyCity[i].cityCode+'>'+historyCity[i].city+'</div>';
      }
      else if(i == 1 || i==4){
        str+='<div class="city uba bc-border ub-f1 uinn-d umar-2 ub ub-ac ub-pc min-w5 ulev-1" data-city='+historyCity[i].cityCode+'>'+historyCity[i].city+'</div></div>'
      }
      else{
        str+='<div class="city uba bc-border ub-f1 uinn-d umar-2 ub ub-ac ub-pc min-w5 ulev-1" data-city='+historyCity[i].cityCode+'>'+historyCity[i].city+'</div>';
      }
    }
  }
  $("#history").html(str);
  bindButton();
}
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
function ticketReason(title,subFunc){
  appcan.window.prompt({
    title:title,
    content:'输入您的理由',
    defaultValue:' ',
    buttons:['提交','取消预定'],
    callback:function(err,data,dataType,optId){
      if(data.num == 1){
        return;
      }
      else{
        if(data.value.length < 10 ){
          ticketReason("理由输入错误,不能少于10字",subFunc);
        }
        else{
          subFunc(data.value);
        }
      }
    }
  })
}

//appcan tab 头部交互样式修改
var tabRadius = function(index){
    var num = $(".tab_l > div").length-1;
    $(".focus").css("border-radius","0");
    if(num==2){
        switch(index) {
        	case 0:       	    
        		$(".focus").css("border-top-left-radius", "0.3em");
        		$(".focus").css("border-bottom-left-radius", "0.3em");
        		break;
        	case 1:
        		$(".focus").css("border-top-right-radius", "0.3em");
        		$(".focus").css("border-bottom-right-radius", "0.3em");
        		break;
        }
        return;
    }
    
    if(num==3){
        switch(index) {
			case 0:
				$(".focus").css("border-top-left-radius", "0.3em");
				$(".focus").css("border-bottom-left-radius", "0.3em");		
				break;
			case 1:
				$(".focus").css("border-radius","0");		
				break;
			case 2:
				$(".focus").css("border-top-right-radius", "0.3em");
				$(".focus").css("border-bottom-right-radius", "0.3em");
				break;
		}
        return;
    }
}
function ajaxRequest(obj,path){
    addMask(path,'loading......');
    if(typeof obj.complete == 'function'){
        obj.complete = function(){
            obj.complete();
            removeMask();
        }
    }
    else{
        obj.complete = removeMask;
    }
    appcan.request.ajax(obj);
}
function setFontSize(){
    (function (doc, win) {    
        var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientHeight = docEl.clientHeight;
            var screenHeight = win.screen.height;
            var browserHeight = window.outerHeight;
            if (!clientHeight) return;
            docEl.style.fontSize = 100 * (win.innerWidth / 1242) + 'px';
            $("body").css("visibility","visible");
        };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);    
        recalc();
    })(document, window);
}
