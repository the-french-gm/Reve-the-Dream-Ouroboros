$.i18n.debug = true;

$(document).ready( function( $ ) {
	/*
	 * Add the data-i18n tag to all the Characteristics
	 */
	$('.characteristic').each(function(){
		$(this).attr("data-i18n", $(this).text());
	});

	/*
	 * Change the language between English and French
	 */
	var language = 'en';

	$('.lang-btn').on('click', function() {
		if(language == 'en') {
			$(this).text("English");
			language = 'fr';

			$.i18n()
			.load('assets/js/chargen/lang/fr.json', 'fr')
			.done(function() {
				$.i18n().locale = 'fr';
				$('body').i18n();
			});
		} else {
			$(this).text("Français");
			language = 'en';
			$.i18n().locale = 'en';
			$('body').i18n();
		}
	});

});