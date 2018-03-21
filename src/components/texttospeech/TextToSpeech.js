import React from 'react';
import TopNavbar from '../../components/topnavbar/TopNavbar';
import Footer from '../../components/footer/Footer';
import './TextToSpeech.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
// react plugin used to create DropdownMenu for selecting items
import Select from 'react-select';


var selectOptions = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
    { value: 'four', label: 'Four' },
    { value: 'five', label: 'Five' },
    { value: 'six', label: 'Six' }
  ];

class TextToSpeech extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            singleSelect: null,
        };
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
                            <Input type="textarea" name="text" />
                        </FormGroup>
                    </div>
                    <div className="d-flex justify-content-center">

                        <Select
                            className="selection primary"
                            placeholder="Select voice"
                            name="singleSelect"
                            value={this.state.singleSelect}
                            options={selectOptions}
                            onChange={(value) => this.setState({ singleSelect: value})}
                        />

                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="buttonGroup">
                            <Button color="primary" size="lg" className="btn-round" id="playbutton">Speek</Button>
                            <Button color="primary" size="lg" className="btn-round" id="stopbutton">Stop</Button>
                        </div>
                        <div className="audioParent">
                            <audio className="audio" id="a_player">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>  
                </div>
                <Footer />
            </div>
        )
    }
}

export default TextToSpeech;