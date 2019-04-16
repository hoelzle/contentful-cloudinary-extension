import React from 'react';

export class Cloudinary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
    };
  }

  insertHandler(data) {
    data.assets.forEach(asset => {
      console.log(
        "Inserted asset:",
        JSON.stringify(asset, null, 2)
      );
    })
    this.props.sdk.field.setValue(data.assets);
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    this.state.mediaLibrary = this.props.cl.createMediaLibrary(
      {
        cloud_name: 'hoelzle',
        api_key: '181399756559722',
        button_caption: 'Select Cloudinary Asset',
        inline_container: '.cms-container',
      },
      { insertHandler: this.insertHandler },
      "#cloudinaryButton"
    )
  }

  render() {
    return (
      <div>
        <img src={this.state.preview_url} />
        <div className="cms-container"></div>
        <button id="cloudinaryButton" onClick={this.onClick}>Choose</button>
      </div>
    );
  }
}
