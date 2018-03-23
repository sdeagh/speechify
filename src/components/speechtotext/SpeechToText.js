import React from 'react';
import './SpeechToText.css';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';
import Transcript from './Transcript';
import ModelDropdown from './model-dropdown';

const ERR_MIC_NARROWBAND = 'Microphone transcription cannot accommodate narrowband voice models, please select a broadband one.';

class SpeechToText extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            isRecording: false,
            token: "",
            model: "en-US_BroadbandModel",
            rawMessages: [],
            formattedMessages: [],
            audioSource: '',
        };
    }

    componentDidMount() {
        this.fetchToken();
    }

    fetchToken() {
        return fetch('http://localhost:3000/api/token').then((res) => {
          if (res.status !== 200) {
            throw new Error('Error retrieving auth token');
          }
          return res.text();
        })
          .then(token => this.setState({ token })).catch(this.handleError);
      }

    handleMicClick = () => {
        if (this.state.audioSource === 'mic') {
          this.stopTranscription();
          return;
        }
        this.setState({ isRecording: true })
        this.reset();
        this.setState({ audioSource: 'mic' });
        this.handleStream(recognizeMic(this.getRecognizeOptions()));
    }

    getRecognizeOptions(extra) {
        return Object.assign({
            token: this.state.token,
            smart_formatting: true,
            format: true, // adds capitals, periods, and a few other things (client-side)
            model: this.state.model,
            objectMode: true,
            interim_results: true,
            // note: in normal usage, you'd probably set this a bit higher
            word_alternatives_threshold: 1.0,
            timestamps: true,
            resultsBySpeaker: this.state.speakerLabels,
            // allow interim results through before the speaker has been determined
            speakerlessInterim: this.state.speakerLabels,
        }, extra);
    }

    handleStream = (stream) => {
        // cleanup old stream if appropriate
        if (this.stream) {
            this.stream.stop();
            this.stream.removeAllListeners();
            this.stream.recognizeStream.removeAllListeners();
        }
        this.stream = stream;
        this.captureSettings();
    
        // grab the formatted messages and also handle errors and such
        
        stream.on('data', (data) => {
            this.handleFormattedMessage(data)
        })
        stream.on('end', (end) => {
            this.handleTranscriptEnd(end)
        })
        stream.on('error', (error) => {
            this.handleError(error)
        })

        // when errors occur, the end event may not propagate through the helper streams.
        // However, the recognizeStream should always fire a end and close events
        stream.recognizeStream.on('end', () => {
            if (this.state.error) {
                this.handleTranscriptEnd();
            }
        });
    
        // grab raw messages from the debugging events for display on the JSON tab
        stream.recognizeStream
            .on('message', (frame, json) => this.handleRawMessage({ sent: false, frame, json }))
            .on('send-json', json => this.handleRawMessage({ sent: true, json }))
            .once('send-data', () => this.handleRawMessage({
                sent: true, binary: true, data: true, // discard the binary data to avoid waisting memory
            }))
              .on('close', (code, message) => this.handleRawMessage({ close: true, code, message }));    
    }

    handleTranscriptEnd = () => {
        this.setState({ audioSource: null });
    }

    handleRawMessage(msg) {
        this.setState({ rawMessages: this.state.rawMessages.concat(msg) });
    }

    handleFormattedMessage = (msg) => {
        this.setState({ formattedMessages: this.state.formattedMessages.concat(msg) });
    }

    handleError(err, extra) {
        console.error(err, extra);
        if (err.name === 'UNRECOGNIZED_FORMAT') {
            err = 'Unable to determine content type from file name or header; mp3, wav, flac, ogg, opus, and webm are supported. Please choose a different file.';
        } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
            err = 'This browser does not support microphone input.';
        } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
            err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
        } else if (err.message === 'Invalid constraint') {
          // iPod Touch does this on iOS 11 - there is a microphone, but Safari claims there isn't
            err = 'Unable to access microphone';
        }
        this.setState({ error: err.message || err });
    }

    captureSettings = () => {
        this.setState({
            settingsAtStreamStart: {
                model: this.state.model,
                speakerLabels: this.state.speakerLabels,
            },
        });
    }

    reset() {
        if (this.state.audioSource) {
            this.stopTranscription();
        }
        this.setState({ rawMessages: [], formattedMessages: [], error: null });
    }

    getFinalAndLatestInterimResult = () => {
        const final = this.getFinalResults();
        const interim = this.getCurrentInterimResult();
        if (interim) {
          final.push(interim);
        }
        return final;
    }

    getFinalResults = () => {
        return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
    }

    getCurrentInterimResult = () => {
        const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];    
        if (!r || !r.results || !r.results.length || r.results[0].final) {
            return null;
        }
        return r;
    }
    
    stopTranscription() {
        if (this.stream) {
            this.stream.stop();
        }
        this.setState({ audioSource: null });
    }

    stopRecording = () => {
        this.setState({ isRecording: false })
        this.stopTranscription();
    }

    handleModelChange = (model) => {
        this.setState({ isRecording: false })
        this.reset();
        this.setState({ model });
    
        // clear the microphone narrowband error if it's visible and a broadband model was just selected
        if (this.state.error === ERR_MIC_NARROWBAND && !this.isNarrowBand(model)) {
          this.setState({ error: null });
        }
    
        // clear the speaker_lables is not supported error - e.g.
        // speaker_labels is not a supported feature for model en-US_BroadbandModel
        if (this.state.error && this.state.error.indexOf('speaker_labels is not a supported feature for model') === 0) {
          this.setState({ error: null });
        }
      }
    
    render() {
        const messages = this.getFinalAndLatestInterimResult();
        return (
            <div>
                <div className="pageSetup container">
                    <div>
                        <h1 className='sectionTitle'>Speech To Text</h1>
                    </div>
                     <div className="d-flex justify-content-center">
                        <div className="buttonGroup">
                            <Button 
                                onClick={ this.handleMicClick } 
                                color='primary' 
                                size='lg' 
                                className='btn-round' 
                                id='recordbutton'>
                                 { this.state.isRecording 
                                    ? <FontAwesome className='microphone' pulse style={{ color: '#FFFFFF'}} name='microphone'></FontAwesome>
                                    : 'Record' }

                            </Button>
                            <Button 
                                onClick={ this.stopRecording } 
                                color='primary' 
                                size='lg' 
                                className='btn-round' 
                                id='stoprecording'>
                                Stop
                            </Button>
                        </div>
                    </div>  
                    <ModelDropdown
                        model={this.state.model}
                        token={this.state.token}
                        onChange={this.handleModelChange}
                    />
                    <div className="receivedText d-flex justify-content-center">
                        <div className='inputFormGroup'>
                            <Transcript messages={messages} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default SpeechToText;