$.i18n.debug = true;

/*
 *
 */
$(document).ready( function( $ ) {
	/*
	 * Add the data-i18n tag to all the Characteristics
	 */
	$('.characteristic').each(function(){
		$(this).attr("data-i18n", 'characteristic-'+$(this).text().toLowerCase().replace(' ', '-'));
	});

	/*
	 *
	 */
	function applyLanguage() {
		var settings = getSettings();
		
		$.i18n()
		.load('assets/js/chargen/lang/'+settings['language']+'-'+settings['genre']+'.json', settings['language']+'-'+settings['genre'])
		.done(function() {
			$.i18n().locale = settings['language']+'-'+settings['genre'];
			$('body').i18n();
		});
	}

	/*
	 *
	 */
	$('.genre-select').on("change keyup", function() {
		var settings = getSettings();
		settings['genre'] = $(".genre-select option:selected").val();
		applyLanguage();

		var name = $('#name');

		if(settings['genre'] == "contemporary") {
			var gender = $('#gender').text();
			name.text(generateContemporaryName(gender));
		}
		else {

		}
	});

	/*
	 * Change the language between English and French
	 */
	$('.lang-btn').on('click', function() {
		var settings = getSettings();

		if(settings['language'] == 'en') {
			$(this).text("English");
			settings['language'] = 'fr';
		} else {
			$(this).text("Français");
			settings['language'] = 'en';
		}

		applyLanguage();
	});

});