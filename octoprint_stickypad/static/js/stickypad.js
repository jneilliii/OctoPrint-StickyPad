/*
 * View model for OctoPrint-StickyPad
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function () {
    function StickypadViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.loginStateViewModel = parameters[1];
        self.accessViewModel = parameters[2];

        self.note = ko.observable();
        self.saving = ko.observable(false);

        self.onBeforeBinding = function () {
            self.note(self.settingsViewModel.settings.plugins.stickypad.note);
            self.quill = new Quill('#editor-container', {theme: 'snow'});
        };

        self.showEditor = function (data) {
            self.quill.setContents(self.quill.clipboard.convert({html: ko.toJS(self.note())}));
            $('#navbar_plugin_stickypad').addClass('open');
            $('#stickypadbuttonpanel').slideDown('slow');
        };

        self.closeEditor = function (data) {
            self.quill.setContents(ko.toJS(self.note()));
            $('#stickypadbuttonpanel').slideUp('slow', function () {
                $('#navbar_plugin_stickypad').removeClass('open');
            });
        };

        self.saveNote = function (data) {
            if (self.loginStateViewModel.hasPermission(self.accessViewModel.permissions.PLUGIN_STICKYPAD_NOTES)) {
                self.saving(true);

                OctoPrint.simpleApiCommand('stickypad', 'save_general_note', {note: self.quill.getSemanticHTML()})
                    .done(function (response) {
                        if (response.success) {
                            self.note(self.quill.getSemanticHTML());
                            $('#stickypadbuttonpanel').slideUp('slow', function () {
                                $('#navbar_plugin_stickypad').removeClass('open');
                                self.saving(false);
                            });
                        }
                    })
                    .fail(function (response) {
                        new PNotify({
                            title: 'StickPad Error',
                            text: 'There was an error saving.',
                            hide: true
                        });
                        self.saving(false);
                    });
            } else {
                new PNotify({
                    title: 'StickPad Error',
                    text: 'You do not have the permissions to save notes.',
                    hide: true
                });
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: StickypadViewModel,
        dependencies: ['settingsViewModel', 'loginStateViewModel', 'accessViewModel'],
        elements: ['#navbar_plugin_stickypad', '#stickypadbuttonpanel']
    });
});

