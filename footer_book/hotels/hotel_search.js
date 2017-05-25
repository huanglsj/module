function contentInit(){
    var sessionId = appcan.locStorage.getVal("sessionId"),
    upwd = appcan.locStorage.getVal("upwd"),
    userCode = appcan.locStorage.getVal("userCode"),
    userMobile = appcan.locStorage.getVal("userMobile"),
    userName = appcan.locStorage.getVal("userName"),
    userNum = appcan.locStorage.getVal("userNum");
    appcan.frame.evaluateScript({
        name:"hotelsearch",
        popName:"content",
        scriptContent:"init('"+sessionId+"','"+upwd+"','"+userCode+"','"+userMobile+"','"+userName+"','"+userNum+"',"+false+")"
    })
}
