function ticketSearch(begin,end,airDate,flightSiteType,itineraryId,expId){
    appcan.locStorage.setVal("begin", begin);
    appcan.locStorage.setVal("end", end);
    appcan.locStorage.setVal("airDate", airDate);
    appcan.locStorage.setVal("flightSiteType", flightSiteType);
    appcan.locStorage.setVal("openFlightSearchResult", "true");
    appcan.locStorage.setVal("itineraryId", itineraryId);
    appcan.locStorage.setVal("expId", expId);
    appcan.frame.evaluateScript({
        name:"plane_ticket_search",
        popName:"content",
        scriptContent:"searchPlane()"
    })
}
function contentInit(){
    var sessionId = appcan.locStorage.getVal("sessionId"),
    upwd = appcan.locStorage.getVal("upwd"),
    userCode = appcan.locStorage.getVal("userCode"),
    userMobile = appcan.locStorage.getVal("userMobile"),
    userName = appcan.locStorage.getVal("userName"),
    userNum = appcan.locStorage.getVal("userNum");
    appcan.frame.evaluateScript({
        name:"plane_ticket_search",
        popName:"content",
        scriptContent:"init('"+sessionId+"','"+upwd+"','"+userCode+"','"+userMobile+"','"+userName+"','"+userNum+"',"+false+")"
    })
}