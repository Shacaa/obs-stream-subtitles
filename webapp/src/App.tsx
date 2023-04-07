import React, {useEffect, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import axios from 'axios';
import './App.css';

const LANG_ES = 'es-AR';
const LANG_EN = 'en';
const BACK_URL = 'http://localhost:8080/translate';

function App() {
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition({clearTranscriptOnListen: false});
    const [lastTranscript, setLastTranscript] = useState('');
    const [lastTranslation, setLastTranslation] = useState('');
    const [clearTranscriptTimeoutID, setClearTranscriptTimeoutID] = useState(0);
    const [shouldListen, setShouldListen] = useState(false);
    const [srcLang, setSrcLang] = useState(LANG_ES);
    const [targetLang, setTargetLang] = useState(LANG_EN);

    const startListening = () => {
        console.log('start listening src', srcLang);
        console.log('start listening target', targetLang);
        SpeechRecognition.startListening({language: srcLang})
            .catch(err => console.error(err.message));
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    useEffect(stopListening, []);

    const setClearTimer = () => {
        clearTimeout(clearTranscriptTimeoutID);
        const timeoutID = setTimeout(() => {
            setLastTranscript('');
            setLastTranslation('');
        }, 5000);
        // @ts-ignore
        setClearTranscriptTimeoutID(timeoutID);
    };

    const sendToTranslate = (value: string) => {
        axios.get(`${BACK_URL}?source=${srcLang}&target=${targetLang}&text=${value}`)
            .then(response => setLastTranslation(response.data))
            .catch(err => console.error(err.message));
    }

    useEffect(() => {
        if (!listening && shouldListen) {
            if (transcript !== '') {
                setLastTranscript(transcript);
                sendToTranslate(transcript);
                setClearTimer();
            }
            resetTranscript();
            startListening();
        }
    }, [listening]);

    const onSwitchRecording = () => {
        setShouldListen(!listening);
        if (listening) {
            stopListening();
        } else {
            startListening()
        }
    };

    const onSwitchLanguage = () => {
        const newSrc = srcLang === LANG_ES ? LANG_EN : LANG_ES;
        const newTarget = targetLang === LANG_ES ? LANG_EN : LANG_ES;
        setSrcLang(newSrc);
        setTargetLang(newTarget);
        startListening();
        setShouldListen(true);
    };

    return (
        <div className={'app-container'}>
            <div className={'app-container-main'}>
                <h1>
                    {`${srcLang} ---> ${targetLang}`}
                </h1>
                <div className={'app-buttons-container'}>
                    <button
                        className={`app-button ${shouldListen ? 'app-button-red' : 'app-button-green'}`}
                        onClick={onSwitchRecording}
                    >
                        {shouldListen ? 'Stop listening' : 'Start listening'}
                    </button>
                    <button
                        className={'app-button'}
                        onClick={onSwitchLanguage}
                    >
                        Switch language
                    </button>
                </div>
                <p className={'app-transcript'}>{lastTranscript}</p>
                <p className={'app-translation'}>{lastTranslation}</p>
            </div>
            <div className={'app-container-footer'}>
                <p className={'app-signature'}>By Shacaa</p>
            </div>
        </div>
    );
}

export default App;
