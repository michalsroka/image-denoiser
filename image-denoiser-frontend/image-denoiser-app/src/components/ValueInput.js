import React from "react";
import { Form } from "react-bootstrap";

const ValueInput = props => {

  return (
    <div className="row">
      <div className="value-label">{props.label}</div>
      <Form.Control
        className="value-input"
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={e => props.handler(e)}
      />
    </div>
  );
};

export default ValueInput;