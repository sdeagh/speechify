import React from 'react';
import './TextToSpeech.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import ReactAudioPlayer from 'react-audio-player';
import FontAwesome from 'react-fontawesome'

class TextToSpeech extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            singleSelect: null,
            selectOptions: [],
            audioSrc: "",
            textToSpeak: "",
            isLoading: false,
        };
    }

    componentDidMount() {
        fetch("http://localhost:3000/voices")
        .then(response => response.json(response))
        .then(voiceData => {
            let voiceArray = [];
            voiceData.voices.forEach(voice => {
                const voiceObj={value: voice.name, label: voice.description } // name + " - " + country}
                voiceArray.push(voiceObj)
            })
            this.setState( {selectOptions: voiceArray })
        })
        .catch(err => console.log(err))    
    }

    clearText = () => {
        this.setState({ textToSpeak: "" })
    }

    textChange = (event) => {
        this.setState({ textToSpeak: event.target.value })
    }

    getAudio = () => {
        console.log("getting audio")
        if (this.state.textToSpeak === "") {
            alert("Please enter some text to speak")
            return false
        }
        if (this.state.singleSelect === null) {
            alert("Please select a voice from the dropdown")
            return false
        }
        this.setState({ isLoading: true })
        let params = "?text=" + this.state.textToSpeak
        params = params + "&voice=" + this.state.singleSelect.value
        fetch('http://localhost:3000/play' + params)
        .then(response => {
            if (response.ok) {
                response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    this.setState({ audioSrc: url })
                    this.setState({ isLoading: false })
                }) 
            }
        })
        .catch(err => console.log(err))
    }

    stopAudio = (event) => {
        this.setState({ audioSrc: "" })
    }

    render() {
        return (
            <div>
                <div className="pageSetup container">
                    <div>
                        <h1 className='sectionTitle'>Text To Speech</h1>
                    </div>
                    <div className="textArea d-flex justify-content-center">
                        <FormGroup className='inputFormGroup'>
                            <div className='d-flex'>
                                <Label className='formlabel mr-auto' for="text">Enter text below</Label>
                                <i className='now-ui-icons ui-1_simple-remove' onClick={ this.clearText }></i>
                            </div>

                            <Input 
                                type="textarea" 
                                id='textInputArea'
                                name="text"
                                value={ this.state.textToSpeak }
                                onChange={ this.textChange } />         
                        </FormGroup>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Select
                            className="selection primary"
                            placeholder="Select voice"
                            name="singleSelect"
                            value={ this.state.singleSelect }
                            options={ this.state.selectOptions }
                            onChange={ (value) => this.setState({ singleSelect: value}) } />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="buttonGroup">
                            <Button 
                                onClick= { this.state.isLoading ? null : this.getAudio } 
                                color='primary' 
                                size='lg' 
                                className='btn-round' 
                                id='playbutton'>
                                { this.state.isLoading 
                                    ? <FontAwesome className='spinner' spin style={{ color: '#FFFFFF'}} name='spinner'></FontAwesome>
                                    : 'Speek' }
                            </Button>
                            <Button onClick={ this.stopAudio } color='primary' size='lg' className='btn-round' id='stopbutton'>Stop</Button>
                        </div>
                        <div className="audioParent">
                             <ReactAudioPlayer
                                src={ this.state.audioSrc }
                                autoPlay /> 
                        </div>
                    </div>  
                </div>
            </div>
        )
    }
}

export default TextToSpeech;