import logo from "./logo.svg";
import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components
import Productivity from "./Components/Productivity/Productivity";
import Navbar from "./Components/navbar/Navbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route path="/Productivity" element={<Productivity />} />
      </Routes>
    </Router>
  );
}

export default App;
