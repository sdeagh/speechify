import React, { Component } from 'react';
import './App.css';
import TitlePage from './components/titlepage/TitlePage';
import SpeechToText from './components/speechtotext/SpeechToText';
import TextToSpeech from './components/texttospeech/TextToSpeech';
import { Switch, Route  } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Switch>
					<Route path='/' exact component={ TitlePage } />
					<Route path='/stt' component={ SpeechToText } />
					<Route path='/tts' component={ TextToSpeech } />
				</Switch>
			</div>
		);
	}
}

export default App;