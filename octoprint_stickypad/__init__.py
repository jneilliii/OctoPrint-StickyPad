# coding=utf-8
from __future__ import absolute_import

import flask
import octoprint.plugin
from flask_babel import gettext
from octoprint.access.permissions import Permissions, ADMIN_GROUP


class StickypadPlugin(octoprint.plugin.SettingsPlugin,
                      octoprint.plugin.AssetPlugin,
                      octoprint.plugin.TemplatePlugin,
					  octoprint.plugin.SimpleApiPlugin):

	##~~ SettingsPlugin mixin

	def get_settings_defaults(self):
		return {'note': ""}

	##~~ AssetPlugin mixin

	def get_assets(self):
		return {'js': ["js/stickypad.js", "js/quill.js"], 'css': ["css/stickypad.css", "css/quill.snow.css"]}

	##~~ TemplatePlugin mixin
	def get_template_configs(self):
		return [
			{'type': "general", 'custom_bindings': True},
			{'type': "navbar", 'custom_bindings': True, 'classes': ["dropdown"]}
		]

	##~~ SimpleApiPlugin mixin

	def get_api_commands(self):
		return {'save_general_note': ["note"], 'save_file_note': ["file_path", "note"]}

	def on_api_get(self, request):
		self._logger.debug(request.args)
		if request.args.get("get_note"):
			response = {"note": self._settings.get(["note"])}
			return flask.jsonify(response)
		elif request.args.get("get_file_note"):
			response = {"file_note": self._settings.get(["note"])}
			return flask.jsonify(response)

	def on_api_command(self, command, data):
		if not Permissions.PLUGIN_STICKYPAD_NOTES.can():
			return flask.make_response("Insufficient rights", 403)

		if command == 'save_general_note':
			self._settings.set(["note"], data.get("note"))
			self._settings.save()
			return flask.jsonify({"success": True})
		elif command == 'save_file_note':
			self._file_manager.set_additional_metadata("local", data.get("file_path"), "stickypad_note", data.get("note"), overwrite=True)
			return flask.jsonify({"success": True})

	##~~ Access Permissions Hook

	def get_additional_permissions(self, *args, **kwargs):
		return [
			{'key': "NOTES", 'name': "Save Notes", 'description': gettext("Allows saving notes."), 'roles': ["admin"],
			 'dangerous': False, 'default_groups': [ADMIN_GROUP]}
		]

	##~~ Softwareupdate hook

	def get_update_information(self):
		return dict(
			stickypad=dict(
				displayName="Sticky Pad",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="jneilliii",
				repo="OctoPrint-StickyPad",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/jneilliii/OctoPrint-StickyPad/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "Sticky Pad"
__plugin_pythoncompat__ = ">=2.7,<4"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = StickypadPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
		"octoprint.access.permissions": __plugin_implementation__.get_additional_permissions
	}

