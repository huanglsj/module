!(function(clr) {
	var head = document.getElementsByTagName('head')[0];
	var skincss = document.createElement('link');
	var skin = (!!clr ? clr:'blue');
	
	skincss.setAttribute('rel', 'stylesheet');
	skincss.setAttribute('type', 'text/css');
	skincss.setAttribute('id', 'skincss');
    skincss.setAttribute('href', '/module/css/skin/skin-' + skin + '.css');
    
    document.addEventListener('DOMContentLoaded', function(){
    	head.appendChild(skincss);
    }, false);
    
})('green');
