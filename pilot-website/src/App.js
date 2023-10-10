import logo from "./logo.svg";
import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components
import Productivity from "./Components/Productivity/Productivity";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Productivity" element={<Productivity />} />
      </Routes>
    </Router>
  );
}

export default App;
