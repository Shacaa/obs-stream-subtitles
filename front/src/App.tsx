import React, {useEffect, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import axios from 'axios';
import './App.css';

const LANG_SRC = 'es-AR';
const LANG_TARGET = 'en';
const BACK_URL = 'http://localhost:8080/translate';

function App() {
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition({clearTranscriptOnListen: false});
    const [lastTranscript, setLastTranscript] = useState('');
    const [lastTranslation, setLastTranslation] = useState('');
    const [shouldListen, setShouldListen] = useState(false);

    const startListening = () => {
        SpeechRecognition.startListening({language: LANG_SRC})
            .catch(err => console.error(err.message));
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    useEffect(stopListening, []);

    const setCleanTimer = () => {
        setTimeout(() => {
            setLastTranscript('');
            setLastTranslation('');
        }, 5000);
    };

    const sendToTranslate = (value: string) => {
        axios.get(`${BACK_URL}?source=${LANG_SRC}&target=${LANG_TARGET}&text=${value}`)
            .then(response => setLastTranslation(response.data))
            .catch(err => console.error(err.message));
    }

    useEffect(() => {
        if (!listening && shouldListen) {
            if (transcript !== '') {
                setLastTranscript(transcript);
                sendToTranslate(transcript);
                setCleanTimer();
            }
            resetTranscript();
            startListening();
        }
    }, [listening]);

    const onClick = () => {
        setShouldListen(!listening);
        if (listening) {
            stopListening();
        } else {
            startListening()
        }
    };

    return (
        <div className={'app-container'}>
            <button
                className={`app-button ${shouldListen ? 'app-button-red' : 'app-button-green'}`}
                onClick={onClick}
            >
                {shouldListen ? 'Stop listening' : 'Start listening'}
            </button>
            <p className={'app-transcript'}>{lastTranscript}</p>
            <p className={'app-translation'}>{lastTranslation}</p>
        </div>
    );
}

export default App;
