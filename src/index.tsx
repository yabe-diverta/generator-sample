import * as React from "react";
import { render } from "react-dom";
import { getAll, responses } from "./generator";

import "./styles.css";

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [pages, setPages] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    getAll().then(() => {
      setPages(responses);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <h1>Generator Sample</h1>
      <h2>loading some data asynchronously inside below section.</h2>
      <div>
        {isLoading ? (
          <p>LOADING...</p>
        ) : (
          pages.map((p, i) => <p key={i}>{JSON.stringify(p)}</p>)
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
