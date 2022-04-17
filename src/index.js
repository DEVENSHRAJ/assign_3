import { React, StrictMode } from "react";
import ReactDOM from "react-dom";
import Compiler from "./compiler";
import App from "./App";

const rootElement = document.getElementById("root");
const comp= document.getElementById("compl");
const mail= document.getElementById("mail_ele");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
//taking dat from the Compiler
ReactDOM.render(
  <StrictMode>
    <Compiler />
  </StrictMode>,
  comp
);
