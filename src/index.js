import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
    };
  }

  insertHandler = (data) => {
    this.props.sdk.field.setValue(data.assets[0]);
  }

  show = () => {
    this.mediaLibrary.show({ asset: this.state.value })
  }

  hide() {
    this.mediaLibrary.hide()
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

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
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    this.setState({ value });
  };

  onChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  render() {
    return (
      <div>
        <Button className='cloudinaryButton' buttonType='primary' onClick={ this.show }>Choose from Cloudinary</Button>
        <div className="cms-container"></div>
      </div>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} cloudinary={cloudinary} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
