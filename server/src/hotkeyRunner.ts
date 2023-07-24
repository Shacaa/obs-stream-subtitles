
// libobs.show_scene_item.ImageTest
// libobs.hide_scene_item.ImageTest
import {logDebug} from "./utils/logger";

const getHotkeyList = async (obs) => {
	logDebug('OBS GetHotkeyList');
	const response = await obs.call('GetHotkeyList');
	response.hotkeys.forEach((hk) => logDebug(hk));
}

const triggerHotkey = async (obs, hotkeyName: string) => {
	logDebug(`OBS TriggerHotkeyByName: ${hotkeyName}`);
	await obs.call(
		'TriggerHotkeyByName',
		{ hotkeyName }
	);
};

const hotkeyRunner = obs => {

};