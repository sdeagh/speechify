import React from 'react';
import TopNavbar from '../../components/topnavbar/TopNavbar';
import Footer from '../../components/footer/Footer';
import './TextToSpeech.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import ReactAudioPlayer from 'react-audio-player';


class TextToSpeech extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            singleSelect: null,
            selectOptions: [],
            audioSrc: "",
            textToSpeak: "",
        };
    }

    componentDidMount() {
        fetch("http://localhost:3000/voices")
        .then(response => response.json(response))
        .then(voiceData => {
            let voiceArray = [];
            voiceData.voices.forEach(voice => {
                const name = voice.description.substring(0, voice.description.indexOf(':'))
                const country = voice.language.substring(3,5)
                const voiceObj={value: voice.name, label: name + " - " + country}
                voiceArray.push(voiceObj)
            })
            this.setState( {selectOptions: voiceArray })
        })
        .catch(err => console.log(err))    
    }

    textChange = (event) => {
        this.setState({ textToSpeak: event.target.value })
    }

    getAudio = () => {
        if (this.state.textToSpeak === "") {
            alert("Please enter some text to speak")
            return false
        }
        if (this.state.singleSelect === null) {
            alert("Please select a voice from the dropdown")
            return false
        }
        let params = "?text=" + this.state.textToSpeak
        params = params + "&voice=" + this.state.singleSelect.value
        fetch('http://localhost:3000/play' + params)
        .then(response => {
            if (response.ok) {
                response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    this.setState({ audioSrc: url})
                }) 
            }
        })
    }

    render() {
        return (
            <div>
                <TopNavbar />
                <div className="pageSetup container">
                    <div>
                        <h1 className='sectionTitle'>Text To Speech</h1>
                    </div>
                    <div className="textArea d-flex justify-content-center">
                        <FormGroup className='inputFormGroup'>
                            <Label className='formlabel' for="text">Enter text below</Label>
                            <Input 
                                type="textarea" 
                                name="text"
                                onChange={ this.textChange } />         
                        </FormGroup>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Select
                            className="selection primary"
                            placeholder="Select voice"
                            name="singleSelect"
                            value={this.state.singleSelect}
                            options={this.state.selectOptions}
                            onChange={(value) => this.setState({ singleSelect: value})} />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="buttonGroup">
                            <Button onClick={ this.getAudio } color='primary' size='lg' className='btn-round' id='playbutton'>Speek</Button>
                            <Button color='primary' size='lg' className='btn-round' id='stopbutton'>Stop</Button>
                        </div>
                        <div className="audioParent">
                             <ReactAudioPlayer
                                src={ this.state.audioSrc }
                                autoPlay /> 
                        </div>
                    </div>  
                </div>
                <Footer />
            </div>
        )
    }
}

export default TextToSpeech;