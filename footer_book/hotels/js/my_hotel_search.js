$(function(){
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
		}
	});

	$("#endDate").mobiscroll().calendar({
		min: startDate,
		defaultValue: new Date($("#endDateHidden").val()),
		onSet: function(val, obj) {
			val = val.valueText;
			$("#endDate .date").text(NYR(val, 1));
			$("#endDateHidden").val(NYR(val, 1));
		}
	});
	
	//选择星级
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
}