import fs from 'fs';

import {logDebug, logError, logWarn} from "./utils/logger";


interface HotkeyConfig {
	start_hotkey_name?: string;
	end_hotkey_name?: string;
	start_hotkey_sequence?: object;
	end_hotkey_sequence?: object;
	repeat: number;
	duration?: number;
}

const getHotkeyList = async (obs) => {
	logDebug('OBS GetHotkeyList');
	const response = await obs.call('GetHotkeyList');
	response.hotkeys.forEach((hk) => logDebug(hk));
}

const triggerHotkeyByName = async (obs, hotkeyName: string) => {
	logDebug(`OBS TriggerHotkeyByName: ${hotkeyName}`);
	obs.call(
		'TriggerHotkeyByName',
		{ hotkeyName }
	)
		.then(() => logDebug('success trigger'))
		.catch(err => logError(`Error triggering hotkey: ${err.message}`));
};

const triggerHotkeyByKeySequence = async (obs, hotkeySequence: object) => {
	logDebug(`OBS TriggerHotkeyByKeySequence: ${hotkeySequence}`);
	obs.call(
		'TriggerHotkeyByKeySequence',
		hotkeySequence
	)
		.then(() => logDebug('success trigger'))
		.catch(err => logError(`Error triggering hotkey: ${err.message}`));
};

// TODO replace setTimeout with better solution
const hotkeyRunner = (obs, hotkeyConfig: HotkeyConfig) => {
	if (hotkeyConfig.end_hotkey_name && hotkeyConfig.repeat < hotkeyConfig.duration) {
		logWarn(`Invalid hotkey config: ${JSON.stringify(hotkeyConfig)}`);
		return;
	}
	logDebug(`Starting runner for hotkey config: ${JSON.stringify(hotkeyConfig)}`);
	setTimeout(() => {
		if (hotkeyConfig.start_hotkey_sequence) {
			triggerHotkeyByKeySequence(obs, hotkeyConfig.start_hotkey_sequence);
		} else {
			triggerHotkeyByName(obs, hotkeyConfig.start_hotkey_name);
		}
		if (hotkeyConfig.duration && (hotkeyConfig.end_hotkey_name || hotkeyConfig.end_hotkey_sequence)) {
			logDebug('Setting end hotkey');
			setTimeout(
				() => {
					if (hotkeyConfig.end_hotkey_sequence) {
						triggerHotkeyByKeySequence(obs, hotkeyConfig.end_hotkey_sequence);
					} else {
						triggerHotkeyByName(obs, hotkeyConfig.end_hotkey_name);
					}
				},
				hotkeyConfig.duration
			);
		}
		hotkeyRunner(obs, hotkeyConfig);
	}, hotkeyConfig.repeat);
};

const hotkeysRunner = obs => {
	fs.readFile('hotkeys.json', 'utf-8', (err, data) => {
		if (err) {
			logWarn(`Error loading hotkeys: ${err.message}`);
			return;
		}
		try {
			const hotkeys = JSON.parse(data);
			logDebug('Initializing hotkeys runners')
			hotkeys.forEach(hotkeyConfig => hotkeyRunner(obs, hotkeyConfig));
		} catch (error) {
			logError(`Invalid json format, check hotkeys.json.example. Error: ${error.message}`);
		}
	});
};

export {hotkeysRunner, triggerHotkeyByName, getHotkeyList, triggerHotkeyByKeySequence};
