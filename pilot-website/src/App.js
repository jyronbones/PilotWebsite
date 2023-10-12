import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productivity from "./Components/Productivity/Productivity";
import Navbar from "./Components/navbar/Navbar";
import Links from "./Components/Links/Links";
import Login from "./Components/Login/Login";
import MonthlyCalendar from "./Components/MonthlyCalendar/MonthlyCalendar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Productivity" element={<Productivity />} />
        <Route path="/monthly-calendar" element={<MonthlyCalendar />} />
        <Route path="/links" element={<Links />} />
      </Routes>
    </Router>
  );
}

export default App;
