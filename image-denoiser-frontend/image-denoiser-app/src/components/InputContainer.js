import React from "react";
import ImageContainer from "./ImageContainer";
import "../css/input-container.css";

const InputContainer = props => {
  return (
    <div className="column-images">
      <ImageContainer
        title="Image to denoise"
        image={props.img}
        handleChange={props.handleImgChange}
      />
      <ImageContainer
        title="Reference image (optional)"
        image={props.label}
        handleChange={props.handleLabelChange}
      />
    </div>
  );
};

export default InputContainer;
