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

		self.onStartupComplete = function(){
			self.quill = new Quill('#editor-container', {theme: 'snow'});
			self.quill.setContents(ko.toJS(self.note()));
		}
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: StickypadViewModel,
		dependencies: ['settingsViewModel','loginStateViewModel'],
		elements: ['#navbar_plugin_stickypad','#stickypadbuttonpanel']
	});
});
