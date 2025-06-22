import Auth from "./pages/Auth";
import Task from "./pages/Task";
import "./styles/App.css";
import "./styles/component.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/task"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const userId = window.localStorage.getItem("userId");
  const accessToken = window.localStorage.getItem("accessToken");

  return userId && accessToken ? <>{children}</> : <Navigate to="/" replace />;
};

export default App;
