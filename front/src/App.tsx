import React, {useEffect, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import './App.css';

function App() {
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition({clearTranscriptOnListen: false});
    const [lastTranscript, setLastTranscript] = useState('');

    const startListening = () => {
        SpeechRecognition.startListening({language: 'es-AR'})
            .catch(err => console.error(err.message));
    };

    useEffect(startListening, []);

    const setCleanTimer = () => {
        setTimeout(() => setLastTranscript(''), 5000);
    };

    useEffect(() => {
        if (!listening) {
            if (transcript !== '') {
                setLastTranscript(transcript);
                setCleanTimer();
            }
            resetTranscript();
            startListening();
        }
    }, [listening]);

    return (
        <div>
            {lastTranscript}
        </div>
    );
}

export default App;
