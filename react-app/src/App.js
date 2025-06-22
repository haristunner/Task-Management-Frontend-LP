import Auth from "./pages/Auth";
import "./styles/App.css";
import "./styles/component.css";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/task" />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
