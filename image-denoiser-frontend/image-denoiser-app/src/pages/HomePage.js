import React, { Component } from "react";
import InputContainer from "../components/InputContainer";
import ConvertButtonContainer from "../components/ConvertButtonContainer";
import ResultContainer from "../components/ResultContainer";

import "../css/home-page.css";
import "../css/main.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url: null,
      label_url: null,
      denoised_image: null,
      image: null
    };
    // this.getArrayFromImage = this.getArrayFromImage.bind(this);
  }

  handleImgChange(event) {
    this.state.image = new Image(48, 48);
    this.state.image.src = this.state.img_url;
    this.setState({
      img_url: URL.createObjectURL(event.target.files[0]),
      label_url: this.state.label_url,
      denoised_image: this.state.denoised_image,
      image: this.state.image
    });
    this.state.image.src = this.state.img_url;
  }

  handleLabelChange(event) {
    this.setState({
      img_url: this.state.img_url,
      label_url: URL.createObjectURL(event.target.files[0]),
      denoised_image: this.state.denoised_image,
      image: this.state.image
    });
  }

  handleConvertClick() {
    this.state.image.src = this.state.img_url;
    console.log(this.state);
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    // const img = this.refs.image
    if (this.state.image !== null) {
      this.state.image.onload = () => {
        if (this.state.image !== null) {
          ctx.drawImage(this.state.image, 0, 0, 48, 48  );
          console.log("LALA");
          console.log(this.getArrayFromImage(ctx.getImageData(0, 0, 48, 48).data))
        }
      };
    }
  }

  getArrayFromImage(imageData) {
    let data = this.create3DArray();
    let height = 48;
    let width = 48;
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            let pos = (y * width + x) * 4;
            data[y][x][0] = imageData[pos];
            data[y][x][1] = imageData[pos+1] ;
            data[y][x][2] = imageData[pos+2];
            // buffer[pos+3] = 255; skip alpha channel
        }
    }
    return data;
  }

  getImageFromArray(array) {}

  create3DArray() {
    var array = new Array(48);
    for (let i = 0; i < 48; i++) {
      array[i] = new Array(48);
    }
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < 48; j++) {
        array[i][j] = new Array(3);
      }
    }
    return array;
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    // const img = this.refs.image
    if (this.state.image !== null) {
      this.state.image.onload = () => {
        if (this.state.image !== null) {
          ctx.drawImage(this.state.image, 0, 0, 48, 48  );
          console.log("LALA")
          console.log(ctx.getImageData(0, 0, 48, 48).data)
        }
      };
    }
  }

  render() {
    console.log(this.state);
    return (
      <div className="main">
        <div className="left-column">
          <InputContainer
            handleImgChange={event => this.handleImgChange(event)}
            handleLabelChange={event => this.handleLabelChange(event)}
            img={this.state.img_url}
            label={this.state.label_url}
          />
        </div>
        <div className="middle-column">
          <ConvertButtonContainer onClick={() => this.handleConvertClick()} />
          <canvas ref="canvas" width="48" height="48" />
        </div>
        <div className="right-column">
          <ResultContainer />
        </div>
      </div>
    );
  }
}

export default HomePage;
