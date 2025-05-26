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
        self.filesViewModel = parameters[3];

        self.filesViewModel.showEditor = function(data) {
            console.log(data);
            self.editing_file(data["path"]);
            self.quill.setContents(self.quill.clipboard.convert({html: data["stickypad_note"]}));
            $('#navbar_plugin_stickypad').addClass('open');
            $('#stickypadbuttonpanel').slideDown('slow');
        };

        self.note = ko.observable();
        self.saving = ko.observable(false);
        self.editing_file = ko.observable(false);

        self.onBeforeBinding = function () {
            self.note(self.settingsViewModel.settings.plugins.stickypad.note);
            self.quill = new Quill('#editor-container', {theme: 'snow'});

            // file list button injection
            var regex = /<div class="btn-group action-buttons">([\s\S]*)<.div>/mi;
            var template = `<div class="btn btn-mini" data-bind="click: $root.showEditor" title="Edit Sticky Pad Note"><i class="icon icon-edit"></i></div>`;
            $("#files_template_machinecode").text(function () {
                return $(this).text().replace(regex, '<div class="btn-group action-buttons">$1	' + template + '></div>');
			});
        };

        self.showEditor = function (data) {
            self.editing_file(false);
            self.quill.setContents(ko.toJS(self.note()));
            $('#navbar_plugin_stickypad').addClass('open');
            $('#stickypadbuttonpanel').slideDown('slow');
        };

        self.closeEditor = function (data) {
            $('#stickypadbuttonpanel').slideUp('slow', function () {
                $('#navbar_plugin_stickypad').removeClass('open');
                self.quill.setContents(ko.toJS(self.note()));
            });
        };

        self.saveNote = function (data) {
            if (self.loginStateViewModel.hasPermission(self.accessViewModel.permissions.PLUGIN_STICKYPAD_NOTES)) {
                self.saving(true);

                if(self.editing_file()) {
                    OctoPrint.simpleApiCommand('stickypad', 'save_file_note', {file_path: self.editing_file(), note: self.quill.getSemanticHTML()})
                        .done(function (response) {
                            if (response.success) {
                                $('#stickypadbuttonpanel').slideUp('slow', function () {
                                    self.filesViewModel.requestData({force: true});
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
                }
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
        dependencies: ['settingsViewModel', 'loginStateViewModel', 'accessViewModel', 'filesViewModel'],
        elements: ['#navbar_plugin_stickypad', '#stickypadbuttonpanel']
    });
});

