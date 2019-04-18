import React from 'react';
import { HelpText } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';

export class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}

  url() {
    const { asset } = this.props;
    if (!asset) return ''
    const url = asset.secure_url
    const preview_url = url.replace(/(.*upload)\/(.*)\.(\w+)/, '$1/w_300,h_300,c_limit,q_auto,f_auto/$2')
    return preview_url
  }

  publicId() {
    if (!this.props.asset) return ''
    return this.props.asset.public_id
  }

  render() {
    return (
      <figure className="preview">
        <img src={ this.url() } />
        <HelpText>{ this.publicId() }</HelpText>
      </figure>
    );
  }
}
