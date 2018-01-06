$.i18n.debug = true;

$(document).ready( function( $ ) {
	/*
	 * Add the data-i18n tag to all the Characteristics
	 */
	$('.characteristic').each(function(){
		$(this).attr("data-i18n", 'characteristic-'+$(this).text().toLowerCase().replace(' ', '-'));
	});

	/*
	 * Change the language between English and French
	 */
	$('.lang-btn').on('click', function() {
		if(settings['language'] == 'en') {
			$(this).text("English");
			settings['language'] = 'fr';

			$.i18n()
			.load('assets/js/chargen/lang/'+settings['language']+'-'+settings['genre']+'.json', 'fr'+'-'+settings['genre'])
			.done(function() {
				$.i18n().locale = 'fr'+'-'+settings['genre'];
				$('body').i18n();
			});
		} else {
			$(this).text("Français");
			settings['language'] = 'en';

			$.i18n()
			.load('assets/js/chargen/lang/'+settings['language']+'-'+settings['genre']+'.json', 'en'+'-'+settings['genre'])
			.done(function() {
				$.i18n().locale = 'en'+'-'+settings['genre'];
				$('body').i18n();
			});
		}
	});

});