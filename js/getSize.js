function setMyFontSize(){
     document.documentElement.style.fontSize = document.documentElement.clientWidth / 12 + 'px';
     if(document.documentElement.clientWidth>767){
        document.documentElement.style.fontSize = 50 + 'px';
     }
}
 window.onload = function(){
     setMyFontSize()
 }
 
 var timer;
 window.addEventListener("resize", function() {
     clearTimeout(timer);
     timer = setTimeout(setMyFontSize, 300);
 }, false);