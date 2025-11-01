import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Profile from "./Components/Profile";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* If logged in → go to profile, else show login */}
        <Route path="/" element={token ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


