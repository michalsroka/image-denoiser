import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Axios from "axios";
import HomePage from "./pages/HomePage";

class App extends Component {
  prepareAxiosDefaults() {
    Axios.defaults.baseURL = "http://localhost:8080";
    Axios.defaults.headers.common["Content-Type"] =
      "application/json;charset=utf-8";
  }

  render() {
    return (
      <Router>
        <div className="container main">
          <Route exact path="/" component={HomePage} />
        </div>
      </Router>
    );
  }
}

export default App;
