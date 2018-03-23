import React from 'react';
import SpeechToText from 'watson-speech/speech-to-text';
import Select from 'react-select';


// The list of models changes rarely, so we're caching it in a JSON file for faster initial
// load time. Once we have a token, this component will automatically fetch the current list
// of models and update the UI if necessary.
import cachedModels from './models.json';


class ModelDropdown extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            models: [],
        }
    }

/*     propTypes: {
        model: PropTypes.string.isRequired,
        token: PropTypes.string,
        onChange: PropTypes.func,
    } */

    getInitialState() {
        // initialize with a (possibly outdated) cached JSON models file,
        // then update it once we have a token
        return { models: cachedModels };
    }

  componentDidMount() {
    if (this.props.token) {
      this.fetchModels(this.props.token);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token !== this.props.token) {
      this.fetchModels(nextProps.token);
    }
  }

  fetchModels(token) {
    SpeechToText.getModels({ token }).then(models => this.setState({ models }))
      .catch(err => console.log('error loading models', err));
  }

handleChange = (e) => {
    console.log(e.value)
    const model = e.value;
    if (model !== this.props.model && this.props.onChange) {
        this.props.onChange(e.value);
    }
}

    render() {
        const models = this.state.models.sort((a, b) => a.description > b.description);
        const optionsArray = models.map(m => ( {value: m.name, label: m.description} ))

    return (
        <div className="d-flex justify-content-center">
            <Select
                name="model"
                clearable={false}
                value={this.props.model}
                onChange={this.handleChange}
                className="primary selection"
                options={ optionsArray }>
            </Select>
      </div>
    );
  }
}

export default ModelDropdown;
