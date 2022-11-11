import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OBSWebSocket from 'obs-websocket-js';
import {logDebug, logError, logInfo} from './utils/logger';

const dotenv = require('dotenv').config();

/* ---- OBS WEBSOCKET ---- */

const obs = new OBSWebSocket();

if (process.env.USE_OBS === 'true') {
	obs.connect()
		.then(() => logInfo('Connected to OBS websocket'))
		.catch(err => logError(err));
}

const sendOBSCaption = async (caption: string) => {
	try {
		await obs.call(
			'SendStreamCaption',
			{ captionText: caption }
		);
	} catch (err) {
		logError(`error sending OBS caption: ${err.message}`);
	}
};

/* ---- BACKEND SERVER ---- */

const app = express();
const port = 3000;

app.use(cors());

app.get('/translate', async (req, res) => {
	const {text, source, target} = req.query;
	const url = `https://script.google.com/macros/s/${process.env.GS_KEY}/exec?text=${text}&source=${source}&target=${target}`;
	logDebug(`requesting GScript url: ${url}`);
	try {
		const response = await axios.get(url);
		logDebug(`translation: ${response.data}`);
		if (process.env.USE_OBS === 'true') {
			await sendOBSCaption(response.data);
		}
		res.send(response.data);
	} catch (err) {
		logError(`Error getting translation: ${err.statusCode || 'no status'} - ${err.data || err.message}`);
	}
});

app.listen(port, () => {
	logInfo(`Backend server listening on port ${port}`);
});