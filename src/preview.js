import React from 'react';

export class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}

  url() {
    if (!this.props.asset) return ''
    return this.props.asset.secure_url
  }

  publicId() {
    if (!this.props.asset) return ''
    return this.props.asset.public_id
  }

  render() {
    return (
      <figure className="preview">
        <img src={ this.url() } />
        <figcaption>{ this.publicId() }</figcaption>
      </figure>
    );
  }
}
