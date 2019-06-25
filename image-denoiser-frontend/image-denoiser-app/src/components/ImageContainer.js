import React from "react";
import "../css/image-container.css";

const ImageContainer = props => {
  const content = props.image ? (
    <img id={props.id} src={props.image} />
  ) : (
    <input type="file" onChange={props.handleChange} />
  );
  return (
    <div>
      {props.title}
      {content}
    </div>
  );
};

export default ImageContainer;
