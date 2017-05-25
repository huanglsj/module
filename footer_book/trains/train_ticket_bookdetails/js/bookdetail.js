
            var lv_switch=appcan.listview({
                selector : "#listview_switch",
                type : "thinLine",
                hasIcon : false,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 1,
                hasControl : true
            }).set([{
                title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div class='uinn-a9 sc-text-active'>停车服务</div><div id='parkPrice' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥13</div></div>",
                "switchBtn":{
                    mini:true,
                    value:false
                }
            }]);  
            lv_switch.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
               var price=parseInt($("#parkPrice").text());
               var TotalPrice=price*count;
               var Ticketprice=parseInt($("#TicketPrice").text());  
               var Total =price+Ticketprice;
               $("#TicketPrice").text(Total);
                    appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'add('+TotalPrice+')'
                });
            }
            else
            {
                 var price=parseInt($("#parkPrice").text());
                 var Ticketprice=parseInt($("#TicketPrice").text());  
                 var TotalPrice=price*count;
                 var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'jian('+TotalPrice+')'
                });      
            }
            })
            var lv_switch1=appcan.listview({
                selector : "#listview_switch1",
                type : "thinLine",
                hasIcon : false,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 1,
                hasControl : true
                }).set([{
                title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div class='uinn-a9 sc-text-active'>航空组合险</div><div id='zuhexian' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥25</div></div>",
                "switchBtn":{
                    mini:true,
                    value:false
                }
            }]);
            lv_switch1.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
                var price=parseInt($("#zuhexian").text());
                var TotalPrice=price*count;
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =price+Ticketprice;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'add('+TotalPrice+')'
                });          
            }
            else
            {
                var price=parseInt($("#zuhexian").text());
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var TotalPrice=price*count;
                var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'jian('+TotalPrice+')'
                });          
            }
            });
            var lv_switch2=appcan.listview({
            selector : "#listview_switch2",
            type : "thinLine",
            hasIcon : false,
            hasAngle : true,
            hasSubTitle : false,
            multiLine : 1,
            hasControl : true
            }).set([{
            title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div  class='uinn-a9 sc-text-active'>无忧退票险</div><div id='tuipiaoxian' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥45</div></div>",
            "switchBtn":{
                mini:true,
                value:false
            }
            }]);
            lv_switch2.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
                var price=parseInt($("#tuipiaoxian").text());
                var TotalPrice=price*count;
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =price+Ticketprice;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'add('+TotalPrice+')'
                });
            }
            else
            {
                var price=parseInt($("#tuipiaoxian").text());
                var Ticketprice=parseInt($("#TicketPrice").text());
                var TotalPrice=price*count;  
                var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'jian('+TotalPrice+')'
                });      
            }
            }); 
            var lv_switch3=appcan.listview({
                selector : "#listview_switch3",
                type : "thinLine",
                hasIcon : false,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 1,
                hasControl : true
            }).set([{
                title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div class='uinn-a9 sc-text-active'>航空意外险</div><div id='yiwaixian' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥58</div></div>",
                "switchBtn":{
                mini:true,
                value:false
                }
            }]);
            lv_switch3.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
                var price=parseInt($("#yiwaixian").text());
                var TotalPrice=price*count; 
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =price+Ticketprice;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                name:'plane_ticket_bookdetails',
                scriptContent:'add('+TotalPrice+')'
                });
            }
            else
            {
                var price=parseInt($("#yiwaixian").text());
                var TotalPrice=price*count; 
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                    name:'plane_ticket_bookdetails',
                    scriptContent:'jian('+TotalPrice+')'
                });      
            }
            }); 
            var lv_switch4=appcan.listview({
                selector : "#listview_switch4",
                type : "thinLine",
                hasIcon : false,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 1,
                hasControl : true
            }).set([{
                title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div class='uinn-a9 sc-text-active'>延误取消险</div><div id='yanwuxian' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥60</div></div>",
                "switchBtn":{
                    mini:true,
                    value:false
                }
            }]);
            lv_switch4.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
                var price=parseInt($("#yanwuxian").text());
                var TotalPrice=price*count; 
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =price+Ticketprice;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                name:'plane_ticket_bookdetails',
                scriptContent:'add('+TotalPrice+')'
                });
            }
            else
            {
                var price=parseInt($("#yanwuxian").text());
                var TotalPrice=price*count; 
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                name:'plane_ticket_bookdetails',
                scriptContent:'jian('+TotalPrice+')'
                });      
            }
            }); 
            var lv_switch5=appcan.listview({
                selector : "#listview_switch5",
                type : "thinLine",
                hasIcon : false,
                hasAngle : true,
                hasSubTitle : false,
                multiLine : 1,
                hasControl : true
            }).set([{
                title : "<div class='ub ub-ac  bc-border  ' style='height:3em'><div class='uinn-a9 sc-text-active'>贵宾休息室</div><div id='xiuxishi' class='ub-f1 uinn-a9 tx-r umar-l3 tx-red'>￥34</div></div>",
                "switchBtn":{
                mini:true,
                value:false
                }
            }]);
            lv_switch5.on("switch:change",function(obj,data){
            if(data.switchBtn.value)
            {               
                var price=parseInt($("#xiuxishi").text());  
                var TotalPrice=price*count; 
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =price+Ticketprice;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                name:'plane_ticket_bookdetails',
                scriptContent:'add('+TotalPrice+')'
                });
            }
            else
            {
                var price=parseInt($("#xiuxishi").text());
                var TotalPrice=price*count;
                var Ticketprice=parseInt($("#TicketPrice").text());  
                var Total =Ticketprice-price;
                $("#TicketPrice").text(Total);
                appcan.window.evaluateScript({
                name:'plane_ticket_bookdetails',
                scriptContent:'jian('+TotalPrice+')'
                });      
            }
            }); 
            

            <div id="listview_switch"  class="sc-text-active"></div> 
            <div id="listview_switch1"  class="sc-text-active"></div>
            <div id="listview_switch2"  class="sc-text-active"></div> 
            <div id="listview_switch3"  class="sc-text-active"></div>
            <div id="listview_switch4"  class="sc-text-active"></div> 
            <div id="listview_switch5"  class="sc-text-active"></div>
      