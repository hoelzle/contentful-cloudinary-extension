import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button, TextLink } from '@contentful/forma-36-react-components';
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
      settings: props.sdk.parameters.installation
    };
  }

  insertHandler = (data) => {
    this.props.sdk.field.setValue(data.assets[0]).then(data => {
      this.props.sdk.window.startAutoResizer()
      this.setState({ active: false })
    })
  }

  show = () => {
    this.setState({ active: true })
    this.mediaLibrary.show()
  }

  clear = () => {
    this.props.sdk.field.removeValue()
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );

    this.mediaLibrary = this.props.ml.createMediaLibrary(
      {
        ...this.state.settings,
        multiple: 'False',
        max_files: 1
      },
      { insertHandler: this.insertHandler }
    )
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
    let clearLink;
    if (this.state.value) {
      clearLink = <TextLink linkType='secondary' className='clear-link' onClick={ this.clear }>clear</TextLink>
    }

    return (
      <div className={`cloudinary-content ${this.state.active ? 'active' : ''}`}>
        <Button onClick={ this.show }>Choose from Cloudinary</Button>
        { clearLink }
        <Preview asset={ this.state.value } settings={ this.state.settings }/>
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
