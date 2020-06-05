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
		self.loginStateViewModel = parameters[1];
		self.note = ko.observable();

		self.onBeforeBinding = function(){
			self.note(self.settingsViewModel.settings.plugins.stickypad.note);
		}

		self.showEditor = function(data){
			$('#navbar_plugin_stickypad').addClass('open');
			$('#stickypadbuttonpanel').slideDown('slow');
		}

		self.saveNote = function(data){
			OctoPrint.settings.savePluginSettings('stickypad', {'note': self.quill.getContents()});
			$('#stickypadbuttonpanel').slideUp('slow', function(){$('#navbar_plugin_stickypad').removeClass('open');});
		}

<<<<<<< HEAD
		self.onStartupComplete = function(){
			self.quill = new Quill('#editor-container', {theme: 'snow'});
			self.quill.setContents(ko.toJS(self.note()));
=======
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
		}
		
		self.onStartupComplete = function(){
			$('div.ui-pnotify.stickypad > div > div.ui-pnotify-text').height(function(){return parseInt($(this).parent().height() - 40) + 'px'});
			$('div.ui-pnotify.stickypad > div > div.ui-pnotify-text').width(function(){return parseInt($(this).parent().width()) + 'px'});
>>>>>>> cd55226c32c87eb2336cbb67cf2cfe70d4500ebb
		}
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: StickypadViewModel,
		dependencies: ['settingsViewModel','loginStateViewModel'],
		elements: ['#navbar_plugin_stickypad','#stickypadbuttonpanel']
	});
});
