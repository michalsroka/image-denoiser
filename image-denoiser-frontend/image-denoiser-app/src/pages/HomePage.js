import React, { Component } from "react";
import Axios from "axios";
import InputContainer from "../components/InputContainer";
import ConvertButtonContainer from "../components/ConvertButtonContainer";
import ResultContainer from "../components/ResultContainer";
import ValueInput from "../components/ValueInput";

import "../css/home-page.css";
import "../css/main.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url: null,
      label_url: null,
      denoised_image: null,
      image: null,
      username: ""
    };
    // this.getArrayFromImage = this.getArrayFromImage.bind(this);
    this.updateUsernameValue = this.updateUsernameValue.bind(this);
  }

  updateUsernameValue(event) {
    this.setState({
      label_url: this.state.label_url,
      denoised_image: this.state.denoised_image,
      image: this.state.image,
      username: event.target.value
    });
  }

  handleImgChange(event) {
    this.state.image = new Image(48, 48);
    this.state.image.src = this.state.img_url;
    this.setState({
      img_url: URL.createObjectURL(event.target.files[0]),
      label_url: this.state.label_url,
      denoised_image: this.state.denoised_image,
      image: this.state.image,
      username: this.state.username
    });
    this.state.image.src = this.state.img_url;
  }

  handleLabelChange(event) {
    this.setState({
      img_url: this.state.img_url,
      label_url: URL.createObjectURL(event.target.files[0]),
      denoised_image: this.state.denoised_image,
      image: this.state.image,
      username: this.state.username
    });
  }

  handleConvertClick() {
    this.state.image.src = this.state.img_url;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    // const img = this.refs.image
    if (this.state.image !== null) {
      this.state.image.onload = () => {
        if (this.state.image !== null) {
          ctx.drawImage(this.state.image, 0, 0, 48, 48);
          let imgData = this.getArrayFromImage(
            ctx.getImageData(0, 0, 48, 48).data
          );
          // console.log(imgData);
          this.sendDenoiseRequest(imgData);
        }
      };
    }
  }

  sendDenoiseRequest(imgData) {
    let config = { headers: { "Content-Type": "application/json" } };
    let body = this.prepareData(imgData); // TODO: change
    console.log(body);
    this.drawDenoised(imgData);
    Axios.post("/predict", body, config)
      .then(results => {
        console.log("LALA");
        let response = JSON.stringify(imgData);

        this.props.history.push("/");
      })
      .catch(error => {
        if (error.response) {
          console.error("Prediction failed!");
        }
      });
  }

  drawDenoised(imgData) {
    let width = 48;
    let height = 48;
    let buffer = new Uint8ClampedArray(width * height * 4);

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pos = (y * width + x) * 4;
        buffer[pos] = imgData[y][x][0];
        buffer[pos + 1] = imgData[y][x][1];
        buffer[pos + 2] = imgData[y][x][2];
        buffer[pos + 3] = 255;
      }
    }
    const canvas = this.refs.canvasLabel;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    let idata = ctx.createImageData(width, height);
    idata.data.set(buffer);
    ctx.putImageData(idata, 0, 0);
  }

  prepareData(imgData) {
    let body = {};
    body.username = this.state.username;
    body.images = {};
    body.images.img = JSON.stringify(imgData);
    body.images.label = JSON.stringify(imgData);
    return body;
  }

  getArrayFromImage(imageData) {
    let data = this.create3DArray();
    let height = 48;
    let width = 48;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pos = (y * width + x) * 4;
        data[y][x][0] = imageData[pos];
        data[y][x][1] = imageData[pos + 1];
        data[y][x][2] = imageData[pos + 2];
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
          ctx.drawImage(this.state.image, 0, 0, 48, 48);
        }
      };
    }
  }

  render() {
    return (
      <div className="main">
        <ValueInput
          type="text"
          name="username"
          label="Provide your nick:"
          value={this.state.username}
          handler={this.updateUsernameValue}
        />
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
          <canvas ref="canvasLabel" />
          <ResultContainer />
        </div>
      </div>
    );
  }
}

export default HomePage;
