import React from "react";
import { Button } from "react-bootstrap";

const ConvertButtonContainer = props => {
  return (
    <div>
      <Button variant="primary" onClick={props.onClick}>
        Remove the noise
      </Button>
    </div>
  );
};

export default ConvertButtonContainer;
