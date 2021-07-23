import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <>
      <h1>Nothing to see here</h1>
      <p>
        This repo exists for the tests. I used create-react-app to bootstrap the
        project because I didn't feel like setting up jest manually 😅
      </p>
      <p>
        Try one of these:
        <ul>
          <li>
            Run stopwatch tests <pre>yarn test stopwatch</pre>
          </li>
          <li>
            Run updated stopwatch tests <pre>yarn test lap</pre>
          </li>
          <li>
            Run dog tests <pre>yarn test dog</pre>
          </li>
          <li>
            Run victim tests <pre>yarn test victim</pre>
          </li>
        </ul>
      </p>
    </>
  );
}

export default App;
