var index =2;
appcan.ready(function() {
    getCurrentCity();
    appcan.window.disableBounce();
    var titHeight = $('#book_header').height();
    var titWidth = $("#footer").width();
    var Height = $("#newMainContent").offset().height;
    console.log(Height);
    // appcan.frame.open("newMainContent", "../footer_book/main_content.html", 0, titHeight);
    // appcan.frame.open({
        // id:"newMainContent",
        // url:[{
            // inPageName:"apply",
            // inUrl:"../footer_apply/apply_main.html"
        // },{
            // inPageName:"book",
            // inUrl:"../footer_book/main_content.html"
        // },{
            // inPageName:"travel",
            // inUrl:"../footer_travel/travel_plan_content_tab1.html"
        // },{
            // inPageName:"me",
            // inUrl:"../footer_me/me_main.html"
        // }],
        // left:0,
        // top:0,
        // index:1,
        // change:function(err,res){
        // }
    // })
    appcan.window.openPopover({
        name:"apply",
        url:"../footer_apply/apply_main.html",
        top:titHeight,
        left:-titWidth,
        width:titWidth, 
        height:Height,
    })
    appcan.window.openPopover({
        name:"book",
        url:"../footer_book/main_content.html",
        top:titHeight,
        left:0,
        width:titWidth,
        height:Height,
    })
    appcan.window.openPopover({
        name:"travel",
        url:"../footer_travel/mytravel.html",
        top:titHeight,
        left:titWidth,
        width:titWidth,
        height:Height,
    })
    appcan.window.openPopover({
        name:"me",
        url:"../footer_me/me_main.html",
        top:titHeight,
        left:2 * titWidth,
        width:titWidth,
        height:Height,
    })
    appcan.window.bringPopoverToFront("book");
    window.onorientationchange = window.onresize = function() {
        appcan.frame.resize("newMainContent", 0, titHeight);
    }
    //监听返回键
    uexWindow.onKeyPressed = function(keyCode) {
        if (keyCode == '0') {
            uexWidget.finishWidget('');
        }
    }
    uexWindow.setReportKey('0', '1');

    //点击信封跳转到消息界面
    appcan.button(".user-icon-mess","btn-act",function(){
        appcan.window.open("message","../footer_me/message_push.html",2);
    })
    
    //订阅将未读消息设置为已读
    appcan.window.subscribe("allMessage",function(msg){
        if(msg === "0"){
            $(".unread").css("visibility","hidden");
        }
        else{
            $(".unread").css("visibility","visible");
        }
    })
    /*
        从服务器获取推送消息列表
    */
    ajaxRequest({
        url : httpHost + "msgPushController.do?getPushMsgList",
        beforeSend:addHeader,
        type: "POST",
        success:function(data){
            
            //unreadMessage：所有未读消息,unreadMessage.applyIds:未读审批消息Id
            var dataJson = JSON.parse(data),unreadMessage = {count:0,applyIds:[],approveIds:[]};
            if(dataJson.success){
                console.log(dataJson);
                for(var i in dataJson.obj){
                    if(dataJson.obj[i].readStatus === 0){
                        if(dataJson.obj[i].msgType === 6){
                            unreadMessage.applyIds.push(dataJson.obj[i].id);
                            unreadMessage.count++;
                        }
                        else if(dataJson.obj[i].msgType === 7){
                            unreadMessage.approveIds.push(dataJson.obj[i].id);
                            unreadMessage.count++;
                        }
                        else{
                            unreadMessage.count++;
                        }
                    }
                }
                
                //向unreadMessage通道推送未读消息数量,向applyMessage通道推送未读审批信息数量(用不上)
                appcan.window.publish("allMessage",unreadMessage.count);
                appcan.window.publish("applyMessage",unreadMessage.applyIds.length);
                appcan.window.publish("approveMessage",unreadMessage.approveIds.length);

                if(unreadMessage.count>0){
                    $(".unread").css("visibility","visible");
                }
                else{
                    $(".unread").css("visibility","hidden");
                }
                appcan.locStorage.setVal("unreadMessage",unreadMessage);
            }
            else{
                appcan.locStorage.setVal("unreadMessage",{count:0,applyIds:[],approveIds:[]});
            }
        },
        error:function(err,errMsg,error){
            appcan.window.openToast(errMsg,2000);
        }
    },"../img/loading.gif");
    
    //tab
    appcan.button("#apply", "btn-act", function() {
        if($("#apply").hasClass("tx-blue")) return;
        appcan.window.resizePopover({
            name:"apply",
            top:titHeight,
            left:0,
            width:titWidth,
            height:Height,
        })
        appcan.window.bringPopoverToFront("apply");
        // index =0;
        $('.he').addClass("uhide");
        $('.ha').removeClass("tx-blue");
        $('#apply').addClass("tx-blue");
        $('#header').removeClass("uhide");
        // var titHeight = $('#header').offset().height;
        // // appcan.frame.open({
            // // id:"newMainContent",
            // // url:"../footer_apply/apply_main.html",
            // // left:0,
            // // top:titHeight,
        // // });
        // appcan.frame.selectMulti("newMainContent",0);
        // window.onorientationchange = window.onresize = function() {
            // appcan.frame.resize("newMainContent", 0, titHeight);
        // }
        //appcan.window.open("trval", "newmytravel.html", 0);
    })
    appcan.button("#book", "btn-act", function() {
        if($("#book").hasClass("tx-blue")) return;
        appcan.window.resizePopover({
            name:"book",
            top:titHeight,
            left:0,
            width:titWidth,
            height:Height,
        })
        appcan.window.bringPopoverToFront("book");
        // appcan.frame.evaluateScript({
            // name:'newMainContent',
            // scriptContent:'appcan.window.disableBounce()'
        // })
        // index =1;
        $('.he').addClass("uhide");//隐藏所有头部 
        $('.ha').removeClass("tx-blue");//所有标签显示为未点击状态
        $('#book').addClass("tx-blue");
        $('#book_header').removeClass("uhide");
        // var titHeight = $('#book_header').offset().height;
        // // appcan.frame.open("newMainContent", "../footer_book/main_content.html", 0, titHeight);
        // appcan.frame.selectMulti("newMainContent",1);
        // window.onorientationchange = window.onresize = function() {
            // appcan.frame.resize("newMainContent", 0, titHeight);
        // }
        //appcan.window.open("approval", "applys/approval.html", 0);
    })
    appcan.button("#travel", "btn-act", function() {
        if($("#travel").hasClass("tx-blue")) return;
        appcan.window.resizePopover({
            name:"travel",
            top:titHeight,
            left:0,
            width:titWidth,
            height:Height,
        })
        appcan.window.evaluatePopoverScript({
            name:"main",
            popName:"travel",
            scriptContent:"selectTab(-1)"
        })
        appcan.window.bringPopoverToFront("travel");
        
        $('.he').addClass("uhide");
        $('.ha').removeClass("tx-blue");
        $('#travel').addClass("tx-blue");
        $('#travel_header').removeClass("uhide");
        // var titHeight2 = $('#travel_header').offset().height;
        // appcan.locStorage.setVal("tarelHeight",titHeight2);
        $('#tabview').addClass("uhide");
        $('.tab-img').removeClass('blue');
        $('.user-ulev3').removeClass('tab-line');
        $('div[data-index="0"]').find('.tab-img').addClass('blue');
        $('div[data-index="0"]').addClass('tab-line');
        // appcan.frame.open("newMainContent", "../footer_travel/mytravel.html", 0, titHeight2);
        // appcan.frame.selectMulti("newMainContent",2);
        // appcan.frame.bringToFront("newMainContent");
        // window.onorientationchange = window.onresize = function() {
            // appcan.frame.resize("newMainContent", 0, titHeight2);
        // }
        /*appcan.button("div[data-index='0']", "btn-act", function() {
            $('.tab-img').removeClass('blue');
            $('.user-ulev3').removeClass('tab-line');
            $('div[data-index="0"]').find('.tab-img').addClass('blue');
            $('div[data-index="0"]').addClass('tab-line');
            appcan.frame.open("newMainContent", "../footer_travel/travel_plan_content_tab1.html", 0, titHeight);
            appcan.frame.bringToFront("newMainContent");
            window.onorientationchange = window.onresize = function() {
                appcan.frame.resize("newMainContent", 0, titHeight);
            }
        })
        appcan.button("div[data-index='1']", "btn-act", function() {
            $('.tab-img').removeClass('blue');
            $('.user-ulev3').removeClass('tab-line');
            $('div[data-index="1"]').find('.tab-img').addClass('blue');
            $('div[data-index="1"]').addClass('tab-line');
            appcan.frame.open("newMainContent", "../footer_travel/travel_plan_content_tab2.html", 0, titHeight);
            appcan.frame.bringToFront("newMainContent");
            window.onorientationchange = window.onresize = function() {
                appcan.frame.resize("newMainContent", 0, titHeight);
            }
        })
        appcan.button("div[data-index='2']", "btn-act", function() {
            $('.tab-img').removeClass('blue');
            $('.user-ulev3').removeClass('tab-line');
            $('div[data-index="2"]').find('.tab-img').addClass('blue');
            $('div[data-index="2"]').addClass('tab-line');
            appcan.frame.open("newMainContent", "../footer_travel/travel_plan_content_tab3.html", 0, titHeight);
            appcan.frame.bringToFront("newMainContent");
            window.onorientationchange = window.onresize = function() {
                appcan.frame.resize("newMainContent", 0, titHeight);
            }
        })*/
    })
    appcan.button("#me", "btn-act", function() {
        if($("#me").hasClass("tx-blue")) return;
        appcan.window.resizePopover({
            name:"me",
            top:titHeight,
            left:0,
            width:titWidth,
            height:Height,
        })
        appcan.window.bringPopoverToFront("me");
        // index =3;
        $('.he').addClass("uhide");
        $('.ha').removeClass("tx-blue");
        $('#me').addClass("tx-blue");
        $('#me_header').removeClass("uhide");
        // var titHeight = $('#me_header').offset().height;
        // appcan.frame.selectMulti("newMainContent",3);
        // // appcan.frame.open("newMainContent", "../footer_me/me_main.html", 0, titHeight);
        // appcan.frame.bringToFront("newMainContent");
        // window.onorientationchange = window.onresize = function() {
            // appcan.frame.resize("newMainContent", 0, titHeight);
        // }
    })
    /*appcan.button("#travel", "btn-act", function() {
        index =0;
        $('.he').addClass("uhide");
        $('.ha').removeClass("tx-blue");
        $('#travel').addClass("tx-blue");
        $('#travel_header').removeClass("uhide");
        var titHeight = $('#travel_header').offset().height;
        appcan.frame.open({
            id:"newMainContent", 
            url:"travel/mytravel.html", 
            left:0,
            top:titHeight,
            });
        window.onorientationchange = window.onresize = function() {
            appcan.frame.resize("newMainContent", 0, titHeight);
        }
        //appcan.window.open("trval", "newmytravel.html", 0);
    })*/
   
   //极光推送设置别名
    var data = {alias:appcan.locStorage.getVal("userCode")};
    uexJPush.setAlias(data,function(data,err){
        if(!error){
            alert(JSON.stringify(data));
        }else{
            alert(err);
        }
    });
});