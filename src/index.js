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
      active: false
    };
  }

  insertHandler = (data) => {
    this.props.sdk.field.setValue(data.assets[0])
    this.props.sdk.window.updateHeight()
    this.setState({ active: false })
  }

  show = () => {
    this.setState({ active: true })
    this.mediaLibrary.show({ asset: this.state.value })
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );

    this.mediaLibrary = this.props.cloudinary.createMediaLibrary(
      {
        cloud_name: 'hoelzle',
        api_key: '181399756559722',
        button_caption: 'Select Cloudinary Asset',
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
    return (
      <div className={`cloudinary-content ${this.state.active ? 'active' : ''}`}>
        <Button className='cloudinaryButton' buttonType='primary' onClick={ this.show }>Choose from Cloudinary</Button>
        <Preview asset={ this.state.value } />
      </div>
    )
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} cloudinary={cloudinary} />, document.getElementById('root'))
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
