$(function() {

	var data = [];
	for (var i = 0; i < 50; i++) {
		data.push(Math.floor(Math.random()*11));
	}

function getDemo(a, b, c, d, e) {

	var demo = "d3.select('svg').selectAll('circle')"
	+ ".data(data)"
	+ ".enter()"
	+ ".append('circle')"
	+ ".attr('cx', function(d, i) {"
	+ "return (i * " + a + ") + " + b + ";"
	+ "})"
	+ ".attr('cy', " + c + ")"
	+ ".attr('r', function(d) {"
	+ "return " + d + ";"
	+ "})"
	+ ".style('stroke', 'maroon')"
	+ ".style('stroke-width', " + e + ")"
	+ ".style('fill', 'tan');";

	return demo;
}

var a = 5, b = 10, c = 10, d = 5, e = 1;
function init() {

	var count = 0;
	var interval = setInterval(
		function() {
			b += 1;
			c += 1;
			$('svg').empty();
			var demo = getDemo(a, b, c, d, e);
			eval(demo);
			count++;
			if( count >= 200) clearInterval(interval);
		}, 0);
}

// init();

$( "#slider" ).slider({
	value: 100,
	min: 0,
	max: 200,
	slide: function(event, ui) {
		a += 1;
		b += 1;
		c += 1;
		$('svg').empty();
		var demo = getDemo(a, b, c, ui.value, e);
		eval(demo);
	}
});


});
