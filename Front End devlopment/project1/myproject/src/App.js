import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Register from "./Components/Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/profile" /> : <Login />} />
        <Route
          path="/register"
          element={token ? <Navigate to="/profile" /> : <Register />}
        />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


