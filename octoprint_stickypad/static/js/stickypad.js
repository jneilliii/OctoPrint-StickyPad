/*
 * View model for OctoPrint-StickyPad
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function() {
	function StickypadViewModel(parameters) {
		var self = this;

		self.settingsViewModel = parameters[0];

		self.onBeforeBinding = function(){
			var note = self.settingsViewModel.settings.plugins.stickypad.note();
			new PNotify({
				title: 'Sticky Pad',
				text: '<textarea class="stickypad_text">' + note + '</textarea>',
				hide: false,
				icon: 'icon icon-exclamation',
				addclass: 'stickypad',
				min_height: (window.innerHeight - 80) + 'px',
				confirm: {
					confirm: true,
					buttons: [{
							text: 'Save',
							addClass: 'btn',
							click: function(notice) {
										OctoPrint.settings.savePluginSettings('stickypad', {'note':$('div.ui-pnotify.stickypad > div > div.ui-pnotify-text > textarea.stickypad_text').val()});
									}
						},
						{
							text: 'Cancel',
							addClass: 'hidden',
							click: function(notice) {
										notice.remove();
									}
						},

						]
				},
				buttons: {
					closer: false,
					sticker: false
				},
				history: {
					history: false
				}
			});
			$('div.ui-pnotify.stickypad > div > div.ui-pnotify-text').height(function(){return parseInt($(this).parent().height() - 40) + 'px'});
			$('div.ui-pnotify.stickypad > div > div.ui-pnotify-text').width(function(){return parseInt($(this).parent().width()) + 'px'});
		}
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: StickypadViewModel,
		dependencies: ['settingsViewModel'],
		elements: []
	});
});
