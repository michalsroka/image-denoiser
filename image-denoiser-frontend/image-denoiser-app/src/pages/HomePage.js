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
      label_url: null
    };
  }

  handleImgChange(event) {
    this.setState({
      img_url: URL.createObjectURL(event.target.files[0]),
      label_url: this.state.label_url
    });
  }

  handleLabelChange(event) {
    this.setState({
      img_url: this.state.img_url,
      label_url: URL.createObjectURL(event.target.files[0])
    });
  }

  render() {
    console.log(this.state);
    return (
      <div class="main">
        <div className="left-column">
          <InputContainer
            handleImgChange={(event) => this.handleImgChange(event)}
            handleLabelChange={(event) => this.handleLabelChange(event)}
            img={this.state.img_url}
            label={this.state.label_url}
          />
        </div>
        <div className="middle-column">
          <ConvertButtonContainer />
        </div>
        <div className="right-column">
          <ResultContainer />
        </div>
      </div>
    );
  }
}

export default HomePage;
