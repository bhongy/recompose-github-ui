import React from "react";
import ReactDOM from "react-dom";
import { from } from "rxjs";
import { setObservableConfig } from "recompose";

// import Counter from './Counter';
import Search from "./Search";
import "./styles.css";

setObservableConfig({
  fromESObservable: from
});

const App = () => (
  <div>
    <Search />
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
