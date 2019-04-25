import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import { Preview } from './preview';
import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  }

  detachExternalChangeHandler = null

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
      active: false,
    };
    this.settings = props.sdk.parameters.installation
  }

  insertHandler = (data) => {
    this.props.sdk.field.setValue(data.assets)
    this.setState({ value: data.assets, active: false })
  }

  show = () => {
    this.mediaLibrary.show()
    this.setState({ active: true })
  }

  assets() {
    if (!this.state.value || !Array.isArray(this.state.value)) return []

    return this.state.value
  }

  multiple() {
    'True'
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );

    this.mediaLibrary = this.props.ml.createMediaLibrary(
      {
        ...this.settings,
        multiple: this.multiple(),
        max_files: null
      },
      { insertHandler: this.insertHandler }
    )

    this.props.sdk.window.updateHeight()
  }

  componentDidUpdate() {
    this.props.sdk.window.updateHeight()
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler()
    }
  }

  onExternalChange = value => {
    this.setState({ value })
  };

  render() {
    const settings = this.settings;
    return (
      <div className={`cloudinary-content ${this.state.active ? 'active' : ''}`}>
        <main>
          { this.assets().map(a => <Preview asset={ a } settings={ settings }/>) }
        </main>
        <Button onClick={ this.show }>Choose from Cloudinary</Button>
      </div>
    )
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} ml={cloudinary} />, document.getElementById('root'))
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
