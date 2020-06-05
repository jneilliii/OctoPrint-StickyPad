# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class StickypadPlugin(octoprint.plugin.SettingsPlugin,
                      octoprint.plugin.AssetPlugin,
                      octoprint.plugin.TemplatePlugin):

	##~~ SettingsPlugin mixin

	def get_settings_defaults(self):
		return dict(
			note=""
		)

	##~~ AssetPlugin mixin

	def get_assets(self):
		return dict(
			js=["js/stickypad.js","js/quill.min.js"],
			css=["css/stickypad.css","css/quill.snow.css"]
		)

	##~~ TemplatePlugin mixin
	def get_template_configs(self):
		return [
			dict(type="general", custom_bindings=True),
			dict(type="navbar", custom_bindings=True, classes=["dropdown"])
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
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}

