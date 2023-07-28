import * as process from 'process';

const logInfo = (value: string) => {
	console.log(value);
};

const logError = (value: string) => {
	console.error(value);
};

const logDebug = (value: string) => {
	if (process.env.DEBUG === 'true') {
		console.log(value);
	}
}

const logWarn = (value: string) => {
	console.warn(value);
};

export {logInfo, logError, logDebug, logWarn};