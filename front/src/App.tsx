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

    const startListening = () => {
        SpeechRecognition.startListening({language: LANG_SRC})
            .catch(err => console.error(err.message));
    };

    useEffect(startListening, []);

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
        if (!listening) {
            if (transcript !== '') {
                setLastTranscript(transcript);
                sendToTranslate(transcript);
                setCleanTimer();
            }
            resetTranscript();
            startListening();
        }
    }, [listening]);

    return (
        <div>
            {lastTranscript}
            {lastTranslation}
        </div>
    );
}

export default App;
