import React from "react";
import ImageContainer from "./ImageContainer";
import "../css/input-container.css";

const InputContainer = props => {
  return (
    <div className="column-images">
      <ImageContainer
        id="img-denoise"
        title="Image to denoise"
        image={props.img}
        handleChange={props.handleImgChange}
      />
      <ImageContainer
        id="img-label"
        title="Reference image (optional)"
        image={props.label}
        handleChange={props.handleLabelChange}
      />
    </div>
  );
};

export default InputContainer;
