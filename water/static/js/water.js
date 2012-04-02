$(function() {

var gistId;

// populate html controls from server vars (github metadata)
$('#saveControls .username').html(username);
$('#saveControls .username').attr('href', github_url);
$('#saveControls .avatar img').attr('src', avatar);
$('#saveControls .avatar').attr('href', github_url);

// display github metadata depending on logged-in status
if (username.length > 0) {
	$('#saveControls .login').hide();
	$('#saveControls .username').show();
	$('#saveControls .avatar').show();
	$('#saveControls .new.button').show();
} else {
	$('#saveControls .login').show();
	$('#saveControls .username').hide();
	$('#saveControls .avatar').hide();
}
$('#saveControls').fadeIn();

// initially we were setting the svg dimensions on the html, as %,
// but retrieving those dimensions in firefox returns %, not pixels
// so we need to set the dimensions in pixels, based on the parent container
// which in this case is #display
function setSvgDimensions() {
	var padding = 0.02;
	$('svg').width($('#display').width() * (1 - padding));
	$('svg').height($('#display').height() * (1 - padding));
	$('svg').css('top', $('#display').height() * (padding/2));
	$('svg').css('left', $('#display').width() * (padding/2));
}
setSvgDimensions();

window.aceEditor = ace.edit("editor");

// set the theme
window.aceEditor.setTheme("ace/theme/twilight");

// set mode to javascript
var JavaScriptMode = require("ace/mode/javascript").Mode;
window.aceEditor.getSession().setMode(new JavaScriptMode());

function redrawSvg() {
	// clear the window
	$('svg').empty();

	try {
		// get the ide code
		var thisCode = window.aceEditor.getSession().getValue();

		// run it
		eval(thisCode);

		// save it in local storage
		setLocalStorageValue('code', thisCode);
	}
	catch (error) {}
	finally {};
}

// redraw svg when we update our code or resize the window
window.aceEditor.getSession().on('change', redrawSvg);
$(window).on('resize', function() {

	setSvgDimensions();
	redrawSvg();
});

// 'new?' handler
$('#saveControls .new.button').on('click', function(e) {
	e.preventDefault();

	// warn user that the editor is about to be wiped clean
	$('#message .newDocMessage').fadeIn();
	// 'new' will clear out editor and clear out gist id,
	// therefore giving user a completely blank slate
});

// 'new? yes please' handler
$('#message .newDocMessage .newYes').on('click', function(e) {
	e.preventDefault();

	gistId = null;
	$('#message .newDocMessage').fadeOut();
	$('#saveControls .gistUrl').fadeOut();
	$('#saveControls .gistUrl').attr('href', '');
	$('#saveControls .gistUrl').html('');

	window.aceEditor.getSession().setValue('');
});

// 'new? woops no' handler
$('#message .newDocMessage .newNo').on('click', function(e) {
	e.preventDefault();

	// do nothing
	$('#message .newDocMessage').fadeOut();
});

// 'save' handler
$('#saveControls .save.button').on('click', function(e) {
	e.preventDefault();

	// if user clicks on save button without being logged in,
	// show the github integration message
	// otherwise we assume we're on an existing gist,
	// so save to current gist
	if (username.length > 0) {
		var code = window.aceEditor.getSession().getValue();

		if (code.length > 0) {
			if (gistId) {
				$.post('/save/' + gistId, escape(code), function(data) {
					$('#saveControls .updateTimestamp').fadeIn().fadeTo(3000, 1).fadeOut(1000);
				});
			} else {
				createGist(code);
			}
		} else {
			// if code editor is empty, show warning
			$('#message .emptyDocMessage').fadeIn().fadeTo(3000, 1).fadeOut(1000);
		}
	} else {
		$('#message .gistIntegrationMessage').fadeIn();
	}
});

function createGist(code) {
	$.post('/create', escape(code), setGistId);
}

function setGistId(id) {

	gistId = id;
	var gistUrl = 'https://gist.github.com/' + gistId;
	var gistA = $('#saveControls .gistUrl');
	gistA.attr('href', gistUrl);
	gistA.html(gistUrl);
	gistA.fadeIn();
}

d3.text('../static/data/chord.txt', function(data) {

	// do we have stored code? if not, set the demo code
	var storedCode = getLocalStorageValue('code');
	if (!storedCode) {
		storedCode = data;
	}

	window.aceEditor.getSession().setValue(storedCode);

	// create contents if we just came back from github auth
	if (create.length > 0) {
		createGist(storedCode);
	}
});

// local storage getter/setter
function getLocalStorageValue(key) {
	var localStorageKey = 'gabrielflor.it/water1';
	return localStorage.getItem([localStorageKey, key].join('/'));
}
function setLocalStorageValue(key, value) {
	var localStorageKey = 'gabrielflor.it/water1';
	localStorage.setItem([localStorageKey, key].join('/'), value);
}

// if we click on a numeric constant, select the token and show the slider
var chosenRow, chosenColumn;
var onNumeric = false;
window.aceEditor.on("click", function(e) {

	var editor = e.editor;
	var pos = editor.getCursorPosition();
	var token = editor.session.getTokenAt(pos.row, pos.column);
	onNumeric = false;

	// did we click on a number?
	if (token && /\bconstant.numeric\b/.test(token.type)) {

		// set the slider params based on the token's numeric value
		// TODO: there has to be a better way of setting this up
		// TODO: feels pretty silly at the moment
		if (token.value == 0) {
			var sliderRange = [-100, 100];
		} else {
			var sliderRange = [-token.value * 3, token.value * 5];
		}
		slider.slider('option', 'max', d3.max(sliderRange));
		slider.slider('option', 'min', d3.min(sliderRange));

		// slider range needs to be evenly divisible by the step
		if ((d3.max(sliderRange) - d3.min(sliderRange)) > 20) {
			slider.slider('option', 'step', 1);
		} else {
			slider.slider('option', 'step', (d3.max(sliderRange) - d3.min(sliderRange))/200);
		}
		slider.slider('option', 'value', token.value);

		// position slider centered above the cursor
		var scrollerOffset = $('.ace_scroller').offset();
		var cursorOffset = editor.renderer.$cursorLayer.pixelPos;
		var sliderTop = scrollerOffset.top + cursorOffset.top - Number($('#editor').css('font-size').replace('px', ''))*0.8;
		var sliderLeft = scrollerOffset.left + cursorOffset.left - slider.width()/2;

		// sync the slider size with the editor size
		slider.css('font-size', $('#editor').css('font-size'));
		slider.css('font-size', '-=4');
		slider.offset({top: sliderTop, left: sliderLeft});

		// allow the slider to be shown
		onNumeric = true;

		// make this position globally scoped
		chosenRow = pos.row;
		chosenColumn = token.start;

		// prevent click event from bubbling up to body, which
		// would then trigger an event to hide the slider
		e.stopPropagation();
	}
});

// turn off horizontal scrollbar
window.aceEditor.renderer.setHScrollBarAlwaysVisible(false);

// turn off print margin visibility
window.aceEditor.setShowPrintMargin(false);

// load font-size from local storage
if (getLocalStorageValue('font-size')) {
	$('#editor').css('font-size', getLocalStorageValue('font-size'));
}

// increase/decrease font
$('.font-control').on('click', function(e) {
	e.preventDefault();

	if ($(this).attr('class').indexOf('decrease') != -1) {
		$('#editor').css('font-size', '-=1');
	} else {
		$('#editor').css('font-size', '+=1');
	}

	setLocalStorageValue('font-size', $('#editor').css('font-size'));
});

// from https://github.com/ajaxorg/ace/issues/305
// this replaces the current replace functionality
// replace just replaces the current selection with the replacement text,
// and highlights the replacement text
// it does not go to the next selection (which the default version does)
window.aceEditor.replace = function(replacement) {
	var range = this.getSelectionRange();
	if (range !== null) {
		this.$tryReplace(range, replacement);
		if (range !== null)
			this.selection.setSelectionRange(range);
	}
}

// create slider
var slider = $('#slider');
slider.slider({
	slide: function(event, ui) {

		// set the cursor to desired location
		var cursorPosition = window.aceEditor.getCursorPosition();
		if (!(cursorPosition.row == chosenRow && cursorPosition.column == chosenColumn)) {
			window.aceEditor.getSelection().moveCursorTo(chosenRow, chosenColumn);

			// clear selection
			window.aceEditor.clearSelection();
		}

		// get token
		var token = window.aceEditor.session.getTokenAt(chosenRow, chosenColumn + 1);

		// find and replace
		window.aceEditor.find(String(token.value));
		window.aceEditor.replace(String(ui.value));
	}
});

// use control key on linux, alt key everywhere else
var sliderKey = navigator && navigator.platform && navigator.platform.toLowerCase().indexOf('linux') != -1
	? 'ctrl' : 'alt';

// display slider key on page
$('#sliderKey').text(sliderKey);

// trigger slider on control
$('textarea').bind('keydown.' + sliderKey, function(e) {
	// are we on a token?
	if (onNumeric) {
		slider.css('visibility', 'visible');

		// stop pulsing numerics
		if (pulseNumerics) {
			window.clearInterval(pulse);
			pulseNumerics = false;

			// hide 'click a number' instructions
			$('#instructions').fadeOut('slow');
		}
	}
}).bind('keyup.' + sliderKey, function(e) {
	slider.css('visibility', 'hidden');
});

$('#slider').bind('keyup.' + sliderKey, function(e) {
	slider.css('visibility', 'hidden');
});

// we're not a numeric, by default
// if we are, the editor click will handle it
$('body').on('focus click', function(e) {
	onNumeric = false;
});

// pulse numeric constants (until user clicks on them)
var pulseNumerics = true;
var pulse = setInterval(function() {
	$('.ace_numeric').animate({opacity: 0.5}).animate({opacity: 1});
}, 1000);

});
